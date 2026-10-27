import { useRef, type ReactNode, type RefObject } from 'react';
import { useSimulation, useTick } from '../../../hooks/useSimulation';

/**
 * Kontrol çubuğu grubunu modeldeki temsili sokulma oranına göre kaydırır.
 * dir = 1: üstten giriş (aşağı iner), dir = -1: alttan giriş (yukarı çıkar).
 */
export function useRodMotion(ref: RefObject<SVGGElement>, travel: number, dir: 1 | -1) {
  const { model } = useSimulation();
  useTick(() => {
    ref.current?.setAttribute('transform', `translate(0 ${(dir * model.state.rodInsertion * travel).toFixed(2)})`);
  });
}

export function RodGroup({ travel, dir, children }: { travel: number; dir: 1 | -1; children: ReactNode }) {
  const ref = useRef<SVGGElement>(null);
  useRodMotion(ref, travel, dir);
  return (
    <g ref={ref} className="rods">
      {children}
    </g>
  );
}

/** Isı aktarımını parçacık geçişi olmadan, yüzeyin nabız gibi parlamasıyla gösterir. */
export function HeatPulse({ children, rate = 2.2 }: { children: ReactNode; rate?: number }) {
  const { model } = useSimulation();
  const ref = useRef<SVGGElement>(null);
  useTick((_dt, t) => {
    const o = (0.25 + 0.55 * model.state.thermal) * (0.6 + 0.4 * Math.sin(t * rate));
    ref.current?.setAttribute('opacity', o.toFixed(3));
  });
  return (
    <g ref={ref} className="heat-pulse">
      {children}
    </g>
  );
}

interface BubblesProps {
  x: number;
  y: number;
  w: number;
  h: number;
  count?: number;
  showFlow: boolean;
  /** Kabarcık hızı (görsel). */
  speed?: number;
  /** Yükselirken kabarcık büyüsün mü. */
  grow?: boolean;
}

/**
 * Dikdörtgen bölge içinde yükselen kabarcıklar (kaynama). Bölge dışına çıkmazlar;
 * görünen kabarcık sayısı göreli güçle artar.
 */
export function Bubbles({ x, y, w, h, count = 14, showFlow, speed = 30, grow = true }: BubblesProps) {
  const { model } = useSimulation();
  const ref = useRef<SVGGElement>(null);
  const travel = useRef(0);
  useTick((dt, t) => {
    travel.current += dt * speed * (0.5 + 0.5 * model.state.thermal);
    const g = ref.current;
    if (!g) return;
    const visible = Math.round(count * (0.35 + 0.65 * model.state.thermal));
    const kids = g.children;
    for (let i = 0; i < kids.length; i++) {
      const c = kids[i] as SVGCircleElement;
      if (i >= visible) {
        c.setAttribute('visibility', 'hidden');
        continue;
      }
      c.setAttribute('visibility', 'visible');
      const p = ((travel.current + ((i * 0.618) % 1) * h) % h) / h;
      const r = grow ? 1.4 + 2.4 * p : 2.4;
      const bx = x + 4 + ((i * 0.381966 * w * 3) % (w - 8)) + Math.sin(t * 3 + i) * 1.5;
      c.setAttribute('cx', Math.min(x + w - r, Math.max(x + r, bx)).toFixed(1));
      c.setAttribute('cy', (y + h - r - p * (h - 2 * r)).toFixed(1));
      c.setAttribute('r', r.toFixed(2));
    }
  });
  return (
    <g ref={ref} className="bubbles" style={{ display: showFlow ? undefined : 'none' }}>
      {Array.from({ length: count }, (_, i) => (
        <circle key={i} className="p p-bubble" cx={x} cy={y + h} r={2} />
      ))}
    </g>
  );
}
