/**
 * Kanal tipi reaktörler için malzeme desenleri ve metin etiketleri.
 * Malzeme yalnız renkle değil desen + metinle de ayırt edilir (grafit tuğla dokusu, ağır su noktaları).
 * Desen kimlikleri SVG başına önekli olmalıdır; aynı sayfada birden çok çizim bulunur.
 */
import type { Pt } from '../geometry/route';

export function MaterialDefs({ prefix }: { prefix: string }) {
  return (
    <>
      <pattern id={`${prefix}-graphite`} width="14" height="14" patternUnits="userSpaceOnUse">
        <rect width="14" height="14" className="graphite-block" strokeWidth={0} />
        <g className="graphite-tex">
          <line x1="0" y1="7" x2="14" y2="7" />
          <line x1="7" y1="0" x2="7" y2="7" />
          <line x1="0" y1="7" x2="0" y2="14" />
        </g>
      </pattern>
      <pattern id={`${prefix}-d2o`} width="12" height="12" patternUnits="userSpaceOnUse">
        <rect width="12" height="12" className="d2o-zone" />
        <g className="d2o-dots">
          <circle cx="3" cy="3" r="1.1" />
          <circle cx="9" cy="9" r="1.1" />
        </g>
      </pattern>
    </>
  );
}

/** Akışkan/malzeme adı: renge ek olarak çizim üzerinde metin. */
export function FluidTag({ x, y, text, kind = 'plain' }: { x: number; y: number; text: string; kind?: 'plain' | 'mod' | 'graphite' }) {
  const w = 10 + text.length * 6.6;
  return (
    <g className={`fluid-tag ${kind}`} aria-hidden="true" pointerEvents="none">
      <rect x={x - w / 2} y={y - 9} width={w} height={17} rx={8} />
      <text x={x} y={y + 4} textAnchor="middle">
        {text}
      </text>
    </g>
  );
}

/**
 * Kesişme köprüsü: üstten geçen borunun altına çizilen boşluk.
 * Böylece iki hattın birleşmediği (farklı derinlikte geçtiği) görülür; gerçek birleşmeler `Junction` ile işaretlenir.
 */
export function PipeBridge({ at, orient, len = 18, pipe }: { at: Pt; orient: 'h' | 'v'; len?: number; pipe: number }) {
  const [x, y] = at;
  const d = orient === 'h' ? `M${x - len / 2} ${y} H${x + len / 2}` : `M${x} ${y - len / 2} V${y + len / 2}`;
  return <path className="pipe-bridge" d={d} strokeWidth={pipe + 9} aria-hidden="true" />;
}
