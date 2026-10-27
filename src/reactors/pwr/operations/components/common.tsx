import type { ReactNode } from 'react';
import type { SourceRef } from '../types';

const KIND_LABEL: Record<SourceRef['kind'], string> = {
  pdf: 'PDF',
  figure: 'Şekilden yaklaşık okunmuş',
  model: 'Temsili eğitim modeli',
};

/** Bilginin kaynağını kategoriyle birlikte gösteren rozetler. */
export function SourceTags({ sources }: { sources: SourceRef[] }) {
  return (
    <ul className="ops-sources" aria-label="Kaynaklar">
      {sources.map((s, i) => (
        <li key={i} className={`src-${s.kind}`}>
          <span className="src-kind">{KIND_LABEL[s.kind]}</span> {s.ref}
        </li>
      ))}
    </ul>
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
  return <p className="ops-model-note">{children}</p>;
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
}

/** Eksenli, ızgaralı SVG grafik çerçevesi. Ölçek fonksiyonlarını çocuklara verir. */
export function ChartFrame({ width, height, x, y, margin = { l: 62, r: 16, t: 26, b: 46 }, title, desc, children }: FrameProps) {
  const left = margin.l;
  const right = width - margin.r;
  const top = margin.t;
  const bottom = height - margin.b;
  const sx = (v: number) => left + ((v - x.min) / (x.max - x.min)) * (right - left);
  const sy = (v: number) => bottom - ((v - y.min) / (y.max - y.min)) * (bottom - top);
  const fx = x.format ?? String;
  const fy = y.format ?? String;
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="ops-chart" role="img" aria-label={`${title}. ${desc}`}>
      <text className="ops-chart-title" x={left} y={16}>
        {title}
      </text>
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
      {children({ x: sx, y: sy, left, right, top, bottom })}
    </svg>
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
