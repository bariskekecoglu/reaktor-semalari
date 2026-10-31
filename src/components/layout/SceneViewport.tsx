import { useRef, useState, type ReactNode, type PointerEvent } from 'react';
import { exportScene } from '../../export/sceneExport';
import { t } from '../../i18n/locale';

const ZOOMS = [1, 1.25, 1.5, 2, 2.5];

interface Props {
  children: ReactNode;
  notes: string[];
  showLabels: boolean;
  showFlow: boolean;
  coreOpen: boolean;
  onToggleLabels: () => void;
  onToggleFlow: () => void;
  onToggleCore: () => void;
  onBackgroundClick: () => void;
  /** Etiket ayrıntı düzeyi. “Temel”de alt bileşen etiketleri %150 ve üstü yakınlaştırmada kendiliğinden açılır. */
  labelDetail: 'basic' | 'detailed';
  onLabelDetail: (d: 'basic' | 'detailed') => void;
  /** Seçili ekipmanın adı (her zaman görünür). */
  selectedName?: string;
}

/**
 * Şema alanı: yakınlaştırma düğmeleri ve kaydırma.
 * Kaydırma, kap içindeki kaydırma çubuğu/dokunma ile ya da fareyle sürükleyerek yapılır.
 * Sürükleme 6 pikseli geçmedikçe tıklama ekipman seçimi olarak kalır.
 */
export function SceneViewport({ children, notes, showLabels, showFlow, coreOpen, onToggleLabels, onToggleFlow, onToggleCore, onBackgroundClick, labelDetail, onLabelDetail, selectedName }: Props) {
  const [zoomIdx, setZoomIdx] = useState(0);
  const [fit, setFit] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState('');
  const scroller = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; y: number; sl: number; st: number; moved: boolean; id: number } | null>(null);
  const suppressClick = useRef(false);

  const zoom = ZOOMS[zoomIdx];
  const save = async (format: 'svg' | 'png') => {
    const scene = scroller.current?.querySelector<SVGSVGElement>('svg.scene-svg');
    if (!scene || exporting) return;
    setExporting(true); setExportStatus('Dışa aktarılıyor…');
    try {
      await exportScene(scene, format, `reactor-${scene.getAttribute('aria-label')?.split(' ')[0].toLowerCase() ?? 'diagram'}-${document.documentElement.lang}`);
      setExportStatus('Şema indirildi.');
    } catch { setExportStatus('Şema dışa aktarılamadı. Lütfen yeniden deneyin.'); }
    finally { setExporting(false); }
  };
  const setZoom = (i: number) => {
    setFit(false);
    setZoomIdx(Math.max(0, Math.min(ZOOMS.length - 1, i)));
  };

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse' || e.button !== 0 || !scroller.current) return;
    drag.current = { x: e.clientX, y: e.clientY, sl: scroller.current.scrollLeft, st: scroller.current.scrollTop, moved: false, id: e.pointerId };
  };
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    const el = scroller.current;
    if (!d || !el) return;
    // Düğme alan dışında bırakıldıysa sürükleme takılı kalmasın.
    if (e.buttons === 0) {
      drag.current = null;
      return;
    }
    const dx = e.clientX - d.x;
    const dy = e.clientY - d.y;
    if (!d.moved && Math.hypot(dx, dy) < 6) return;
    if (!d.moved) {
      d.moved = true;
      el.setPointerCapture(d.id);
    }
    el.scrollLeft = d.sl - dx;
    el.scrollTop = d.st - dy;
  };
  const onPointerUp = () => {
    if (drag.current?.moved) suppressClick.current = true;
    drag.current = null;
  };

  return (
    <div className="viewport">
      <div className="viewport-toolbar" role="toolbar" aria-label={t("Şema görünümü")}>
        <div className="tb-group export-controls">
          <button type="button" disabled={exporting} onClick={() => save('svg')}>{t('SVG indir')}</button>
          <button type="button" disabled={exporting} onClick={() => save('png')}>{t('PNG indir')}</button>
        </div>
        <div className="tb-group">
          <div className="zoom-cluster">
            <button type="button" onClick={() => setZoom(zoomIdx - 1)} disabled={fit || zoomIdx === 0} aria-label={t("Uzaklaştır")}>
              −
            </button>
            <span className="zoom-readout" aria-live="polite">
              {t(fit ? 'Sığdırıldı' : `%${Math.round(zoom * 100)}`)}
            </span>
            <button type="button" onClick={() => setZoom(fit ? 0 : zoomIdx + 1)} disabled={!fit && zoomIdx === ZOOMS.length - 1} aria-label={t("Yakınlaştır")}>
              +
            </button>
          </div>
          <button
            type="button"
            onClick={() => {
              setFit(true);
              setZoomIdx(0);
              scroller.current?.scrollTo({ left: 0, top: 0 });
            }}
            aria-pressed={fit}
          >{t("Sığdır")}</button>
          <button
            type="button"
            onClick={() => {
              setFit(false);
              setZoomIdx(0);
              scroller.current?.scrollTo({ left: 0, top: 0 });
            }}
          >{t("Görünümü sıfırla")}</button>
        </div>
        <span className="tb-sep" aria-hidden="true" />
        <div className="tb-group">
          <button type="button" aria-pressed={showLabels} onClick={onToggleLabels}>{t("Etiketler")}</button>
          <span className="lod-seg" role="group" aria-label={t("Etiket ayrıntısı")}>
            <button type="button" aria-pressed={labelDetail === 'basic'} disabled={!showLabels} onClick={() => onLabelDetail('basic')}>{t("Temel")}</button>
            <button type="button" aria-pressed={labelDetail === 'detailed'} disabled={!showLabels} onClick={() => onLabelDetail('detailed')}>{t("Ayrıntılı")}</button>
          </span>
          <button type="button" aria-pressed={showFlow} onClick={onToggleFlow}>{t("Akış işaretleri")}</button>
          <button type="button" aria-pressed={coreOpen} onClick={onToggleCore}>{t("Çekirdek yakın planı")}</button>
        </div>
      </div>
      {exportStatus && <p className="export-status" role="status">{t(exportStatus)}</p>}
      {selectedName && (
        <p className="scene-selected" role="status">
          <span>{t("Seçili:")}</span> <strong>{t(selectedName)}</strong>
        </p>
      )}
      <div
        ref={scroller}
        className={`scene-scroll ${fit ? 'fit' : ''}`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onLostPointerCapture={onPointerUp}
        onClickCapture={(e) => {
          if (suppressClick.current) {
            suppressClick.current = false;
            e.stopPropagation();
            e.preventDefault();
          }
        }}
        onClick={onBackgroundClick}
      >
        <div
          className="scene-canvas"
          data-lod={labelDetail}
          data-zoomed={!fit && zoom >= 1.5 ? '1' : undefined}
          style={fit ? undefined : { width: `max(${1040 * zoom}px, ${zoom * 100}%)` }}
        >
          {t(children)}
        </div>
      </div>
      <div className="scene-notes">
        {notes.map((n) => (
          <p key={n}>{t(n)}</p>
        ))}
        <p className="scene-help">{t("+ ile büyütün (%150 ve üstünde alt bileşen etiketleri açılır) · Kaydırarak veya fareyle sürükleyerek gezinin · Ekipman seçmek için dokunun ya da Tab ve Enter kullanın.")}</p>
      </div>
    </div>
  );
}
