import { useRef, useState, type ReactNode, type PointerEvent } from 'react';

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
}

/**
 * Şema alanı: yakınlaştırma düğmeleri ve kaydırma.
 * Kaydırma, kap içindeki kaydırma çubuğu/dokunma ile ya da fareyle sürükleyerek yapılır.
 * Sürükleme 6 pikseli geçmedikçe tıklama ekipman seçimi olarak kalır.
 */
export function SceneViewport({ children, notes, showLabels, showFlow, coreOpen, onToggleLabels, onToggleFlow, onToggleCore, onBackgroundClick }: Props) {
  const [zoomIdx, setZoomIdx] = useState(0);
  const [fit, setFit] = useState(false);
  const scroller = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; y: number; sl: number; st: number; moved: boolean; id: number } | null>(null);
  const suppressClick = useRef(false);

  const zoom = ZOOMS[zoomIdx];
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
      <div className="viewport-toolbar" role="toolbar" aria-label="Şema görünümü">
        <button type="button" onClick={() => setZoom(zoomIdx - 1)} disabled={!fit && zoomIdx === 0} aria-label="Uzaklaştır">
          −
        </button>
        <span className="zoom-readout" aria-live="polite">
          {fit ? 'Sığdırıldı' : `%${Math.round(zoom * 100)}`}
        </span>
        <button type="button" onClick={() => setZoom(fit ? 0 : zoomIdx + 1)} disabled={!fit && zoomIdx === ZOOMS.length - 1} aria-label="Yakınlaştır">
          +
        </button>
        <button
          type="button"
          onClick={() => {
            setFit(true);
            setZoomIdx(0);
            scroller.current?.scrollTo({ left: 0, top: 0 });
          }}
          aria-pressed={fit}
        >
          Sığdır
        </button>
        <span className="tb-sep" aria-hidden="true" />
        <button type="button" aria-pressed={showLabels} onClick={onToggleLabels}>
          Etiketler
        </button>
        <button type="button" aria-pressed={showFlow} onClick={onToggleFlow}>
          Akış işaretleri
        </button>
        <button type="button" aria-pressed={coreOpen} onClick={onToggleCore}>
          Çekirdek yakın planı
        </button>
      </div>
      <div
        ref={scroller}
        className={`scene-scroll ${fit ? 'fit' : ''}`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onClickCapture={(e) => {
          if (suppressClick.current) {
            suppressClick.current = false;
            e.stopPropagation();
            e.preventDefault();
          }
        }}
        onClick={onBackgroundClick}
      >
        <div className="scene-canvas" style={fit ? undefined : { width: `${zoom * 100}%` }}>
          {children}
        </div>
      </div>
      <div className="scene-notes">
        {notes.map((n) => (
          <p key={n}>{n}</p>
        ))}
        <p>Fareyle sürükleyerek veya kaydırarak gezinin · Ekipmanlara Tab ile odaklanıp Enter ile seçin.</p>
      </div>
    </div>
  );
}
