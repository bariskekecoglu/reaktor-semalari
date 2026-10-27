import type { MutableRefObject, ReactNode } from 'react';
import type { SourceRef } from '../types';
import { useViewLayout } from '../../../../hooks/useViewLayout';

/** Dar yerleşimde grafiklerin çizim genişliği (viewBox birimi). Yazılar okunaklı kalsın diye küçük tutulur. */
export const NARROW_CHART_WIDTH = 420;

/** Dar yerleşimde mi? (Bileşenler yalnız düzen için kullanır; durum değişmez.) */
export function useNarrow(): boolean {
  return useViewLayout().layout === 'narrow';
}

/** Dar yerleşimde eksen işaretlerini seyreltir (ilk ve son korunur). */
export function thinTicks(ticks: number[], narrow: boolean): number[] {
  if (!narrow || ticks.length <= 5) return ticks;
  const out = ticks.filter((_, i) => i % 2 === 0);
  if (out[out.length - 1] !== ticks[ticks.length - 1]) out.push(ticks[ticks.length - 1]);
  return out;
}

const KIND_LABEL: Record<SourceRef['kind'], string> = {
  pdf: 'PDF',
  figure: 'Şekilden yaklaşık okunmuş',
  model: 'Temsili eğitim modeli',
};

/** Bilginin kaynağını kategoriyle birlikte gösteren rozetler. */
export function SourceTags({ sources }: { sources: SourceRef[] }) {
  const narrow = useNarrow();
  const list = (
    <ul className="ops-sources" aria-label="Kaynaklar">
      {sources.map((s, i) => (
        <li key={i} className={`src-${s.kind}`}>
          <span className="src-kind">{KIND_LABEL[s.kind]}</span> {s.ref}
        </li>
      ))}
    </ul>
  );
  return narrow ? (
    <details className="ops-more">
      <summary>Kaynaklar ({sources.length})</summary>
      {list}
    </details>
  ) : (
    list
  );
}

/** “Ne değişti, neden?” kutusu. */
export function WhyBox({ children }: { children: ReactNode }) {
  return (
    <div className="ops-why" aria-live="polite">
      <h4>Ne değişti, neden?</h4>
      <div>{children}</div>
    </div>
  );
}

export function ModelNote({ children }: { children: ReactNode }) {
  const narrow = useNarrow();
  const note = <p className="ops-model-note">{children}</p>;
  // Dar ekranda uzun varsayım metinleri açılır bölümde; rozet başlığı her zaman görünür.
  return narrow ? (
    <details className="ops-more">
      <summary>Temsili eğitim modeli: varsayımlar</summary>
      {note}
    </details>
  ) : (
    note
  );
}

export interface AxisDef {
  min: number;
  max: number;
  ticks: number[];
  label: string;
  format?: (v: number) => string;
}

export interface ChartScales {
  x: (v: number) => number;
  y: (v: number) => number;
  left: number;
  right: number;
  top: number;
  bottom: number;
}

interface FrameProps {
  width: number;
  height: number;
  x: AxisDef;
  y: AxisDef;
  margin?: { l: number; r: number; t: number; b: number };
  title: string;
  /** Erişilebilir açıklama. */
  desc: string;
  children: (s: ChartScales) => ReactNode;
  /** Ölçekleri dışarı verir (ör. işaretçi konumunu veri değerine çevirmek için). */
  scalesRef?: MutableRefObject<ChartScales | null>;
  /** Dar yerleşimde bu grafik okunabilirlik için kendi alanında kaydırılacaksa en küçük genişlik (px). */
  narrowMinWidth?: number;
}

/** Eksenli, ızgaralı SVG grafik çerçevesi. Ölçek fonksiyonlarını çocuklara verir. */
export function ChartFrame({ width: wideWidth, height: heightIn, x: xIn, y, margin: marginIn = { l: 62, r: 16, t: 26, b: 46 }, title, desc, children, scalesRef, narrowMinWidth }: FrameProps) {
  const narrow = useNarrow();
  // Başlık artık SVG dışında (figcaption); çizim yüksekliği başlık payı kadar azaltılır.
  const height = heightIn - 16;
  const width = narrow ? Math.min(wideWidth, NARROW_CHART_WIDTH) : wideWidth;
  const margin = narrow ? { ...marginIn, l: Math.min(marginIn.l, 50), t: 10 } : { ...marginIn, t: 10 };
  const x = { ...xIn, ticks: thinTicks(xIn.ticks, narrow) };
  const left = margin.l;
  const right = width - margin.r;
  const top = margin.t;
  const bottom = height - margin.b;
  const sx = (v: number) => left + ((v - x.min) / (x.max - x.min)) * (right - left);
  const sy = (v: number) => bottom - ((v - y.min) / (y.max - y.min)) * (bottom - top);
  const fx = x.format ?? String;
  const fy = y.format ?? String;
  const scales: ChartScales = { x: sx, y: sy, left, right, top, bottom };
  if (scalesRef) scalesRef.current = scales;
  const scroll = narrow && narrowMinWidth;
  const svg = (
    <svg viewBox={`0 0 ${width} ${height}`} className="ops-chart" role="img" aria-label={`${title}. ${desc}`}>
      {y.ticks.map((v) => (
        <g key={`y${v}`}>
          <line className="ops-grid" x1={left} x2={right} y1={sy(v)} y2={sy(v)} />
          <text className="ops-tick" x={left - 6} y={sy(v) + 4} textAnchor="end">
            {fy(v)}
          </text>
        </g>
      ))}
      {x.ticks.map((v) => (
        <g key={`x${v}`}>
          <line className="ops-grid light" x1={sx(v)} x2={sx(v)} y1={top} y2={bottom} />
          <text className="ops-tick" x={sx(v)} y={bottom + 16} textAnchor="middle">
            {fx(v)}
          </text>
        </g>
      ))}
      <line className="ops-axis" x1={left} x2={left} y1={top} y2={bottom} />
      <line className="ops-axis" x1={left} x2={right} y1={bottom} y2={bottom} />
      <text className="ops-axis-label" x={(left + right) / 2} y={height - 6} textAnchor="middle">
        {x.label}
      </text>
      <text className="ops-axis-label" x={14} y={(top + bottom) / 2} transform={`rotate(-90 14 ${(top + bottom) / 2})`} textAnchor="middle">
        {y.label}
      </text>
      {children(scales)}
    </svg>
  );
  return (
    <figure className="ops-figure">
      <figcaption>{title}</figcaption>
      {scroll ? (
        <>
          <div className="ops-scroll wide" tabIndex={0} role="region" aria-label={`${title} — yatay kaydırılabilir`} style={{ ['--ops-min' as string]: `${narrowMinWidth}px` }}>
            {svg}
          </div>
          <p className="scroll-hint">↔ Grafik kendi alanında yana kaydırılabilir.</p>
        </>
      ) : (
        svg
      )}
    </figure>
  );
}

/** [x, y] dizisinden SVG yolu. */
export function linePath(points: [number, number][], s: ChartScales): string {
  return points.map(([a, b], i) => `${i ? 'L' : 'M'}${s.x(a).toFixed(1)} ${s.y(b).toFixed(1)}`).join(' ');
}

/** Lejant satırı: renk + çizgi biçimi + metin. */
export function LegendItem({ cls, label }: { cls: string; label: string }) {
  return (
    <li>
      <svg width="40" height="12" aria-hidden="true">
        <line x1="2" x2="38" y1="6" y2="6" className={cls} />
      </svg>
      {label}
    </li>
  );
}

/** Yerelleştirilmiş sayı (Türkçe ondalık virgül). */
export const fmt = (v: number, digits = 1) =>
  Number.isFinite(v) ? v.toLocaleString('tr-TR', { minimumFractionDigits: digits, maximumFractionDigits: digits }) : '—';
