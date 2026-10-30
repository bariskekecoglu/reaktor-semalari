import { createContext, useContext, useLayoutEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';

export interface SceneContextValue {
  selected: string | null;
  /** Vurgulanan kimlikler; null ise vurgu yok (her şey normal). */
  highlight: ReadonlySet<string> | null;
  onSelect: (id: string) => void;
  nameOf: (id: string) => string;
}

export const SceneContext = createContext<SceneContextValue>({
  selected: null,
  highlight: null,
  onSelect: () => undefined,
  nameOf: (id) => id,
});

export const useScene = () => useContext(SceneContext);

export function hlClass(id: string, ctx: SceneContextValue, contains: string[] = []): string {
  if (ctx.selected === id) return 'is-selected';
  if (!ctx.highlight) return '';
  if (ctx.highlight.has(id)) return 'is-hl';
  // İçindeki bir akış vurgulanıyorsa grubu soluklaştırma; akış kendi vurgusunu taşır.
  return contains.some((c) => ctx.highlight!.has(c)) ? '' : 'is-dim';
}

interface HotspotProps {
  id: string;
  children: ReactNode;
  /** Çerçeve için ek boşluk. */
  pad?: number;
  /** false ise boş alan tıklamayı yakalamaz (büyük yapılar için). */
  hit?: boolean;
  /** Grubun içindeki akış kimlikleri (vurgu hesabı için). */
  contains?: string[];
}

/**
 * Tıklanabilir/klavyeyle seçilebilir ekipman grubu.
 * Odak, seçim ve vurgu yalnız renkle değil, kesikli çerçeveyle de gösterilir.
 */
export function Hotspot({ id, children, pad = 6, hit = true, contains }: HotspotProps) {
  const ctx = useScene();
  const inner = useRef<SVGGElement>(null);
  const [box, setBox] = useState<{ x: number; y: number; w: number; h: number } | null>(null);
  useLayoutEffect(() => {
    const el = inner.current;
    if (!el || typeof el.getBBox !== 'function') return;
    const b = el.getBBox();
    setBox({ x: b.x - pad, y: b.y - pad, w: b.width + pad * 2, h: b.height + pad * 2 });
  }, [pad]);
  const name = ctx.nameOf(id);
  const onKey = (e: KeyboardEvent<SVGGElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      ctx.onSelect(id);
    }
  };
  return (
    <g
      className={`hotspot ${hlClass(id, ctx, contains)}`}
      data-id={id}
      role="button"
      tabIndex={0}
      aria-label={name}
      aria-pressed={ctx.selected === id}
      onClick={(e) => {
        e.stopPropagation();
        ctx.onSelect(id);
      }}
      onKeyDown={onKey}
    >
      <title>{name}</title>
      {box && hit && <rect className="hs-hit" x={box.x} y={box.y} width={box.w} height={box.h} rx={6} />}
      <g ref={inner}>{children}</g>
      {box && <rect className="hs-frame" x={box.x} y={box.y} width={box.w} height={box.h} rx={6} />}
    </g>
  );
}

/** Etiket ayrıntı düzeyi: ana ekipman adları her zaman, alt bileşenler “Ayrıntılı” ya da yakınlaştırınca. */
export type LabelLevel = 'main' | 'detail';

interface LabelProps {
  /** İşaret edilen nokta. */
  x: number;
  y: number;
  /** Yazının konumu. */
  tx: number;
  ty: number;
  /** Uzun adlar “\n” ile anlamlı satırlara bölünebilir. */
  text: string;
  sub?: string;
  anchor?: 'start' | 'middle' | 'end';
  level?: LabelLevel;
  /** Etiketin ait olduğu ekipman: seçiliyse ayrıntı düzeyinden bağımsız görünür ve vurgulanır. */
  for?: string;
}

const LINE = 17;

/** Açıklama çizgili ekipman etiketi. Kılavuz çizgi ince ve kesiklidir; borulardan ayırt edilir. */
export function Label({ x, y, tx, ty, text, sub, anchor = 'start', level = 'main', for: forId }: LabelProps) {
  const ctx = useScene();
  const lines = text.split('\n');
  const lineEndY = ty - 5;
  const selected = !!forId && ctx.selected === forId;
  return (
    <g className={`label lvl-${level}${selected ? ' is-current' : ''}`} aria-hidden="true">
      <polyline className="leader" points={`${x},${y} ${tx},${lineEndY}`} />
      <circle className="leader-dot" cx={x} cy={y} r={2.2} />
      <text x={tx} y={ty + 10} textAnchor={anchor} className="label-text">
        {lines.map((l, i) => (
          <tspan key={i} x={tx} dy={i === 0 ? 0 : LINE}>
            {l}
          </tspan>
        ))}
      </text>
      {sub && (
        <text x={tx} y={ty + 26 + (lines.length - 1) * LINE} textAnchor={anchor} className="label-sub">
          {sub}
        </text>
      )}
    </g>
  );
}

/** Sahneye yerleştirilen kısa not kutusu. */
export function SceneNote({ x, y, w, lines }: { x: number; y: number; w: number; lines: string[] }) {
  const h = 14 + lines.length * 18;
  return (
    <g className="scene-note">
      <rect x={x} y={y} width={w} height={h} rx={4} />
      {lines.map((l, i) => (
        <text key={i} x={x + 10} y={y + 22 + i * 18}>
          {l}
        </text>
      ))}
    </g>
  );
}
