import { useLayoutEffect, useRef, useState } from 'react';
import { useSimulation, useTick } from '../../../hooks/useSimulation';
import type { FlowKind } from '../types';
import { hlClass, useScene } from '../SceneContext';
import { buildLut, flowFactor, sampleLut, wrap, type PathLut } from './flowMath';

interface FlowProps {
  id: string;
  d: string;
  kind: FlowKind;
  /** Nominal görsel hız (viewBox birimi / simülasyon saniyesi). Fiziksel hız değildir. */
  speed?: number;
  spacing?: number;
  /** Boru genişliği; 0 ise yalnız iç akış (kap içi yollar). */
  pipe?: number;
  /** Debinin güce bağlı mı sabit mi gösterileceği. */
  scale?: 'power' | 'constant';
  showFlow: boolean;
  /** Parçacık yarıçapı. */
  r?: number;
}

const PATTERN: Record<FlowKind, string | undefined> = {
  hot: undefined,
  cold: undefined,
  grad: undefined,
  mix: '3 5',
  steam: '10 7',
  feed: '2 5',
  cool: '14 5 3 5',
};

function particleClass(kind: FlowKind, progress: number): string {
  if (kind === 'grad') return progress < 0.4 ? 'p p-hot' : progress < 0.72 ? 'p p-warm' : 'p p-cold';
  if (kind === 'mix') return progress < 0.22 ? 'p p-hot' : 'p p-bubble';
  return `p p-${kind}`;
}

/**
 * Tanımlı SVG yolu üzerinde hareket eden akış işaretleri.
 * Konumlar React render'ı olmadan, ortak saat aboneliğiyle doğrudan DOM özniteliklerine yazılır.
 */
export function Flow({ id, d, kind, speed = 60, spacing = 26, pipe = 10, scale = 'power', showFlow, r = 3.2 }: FlowProps) {
  const { model, clock } = useSimulation();
  const ctx = useScene();
  const pathRef = useRef<SVGPathElement>(null);
  const groupRef = useRef<SVGGElement>(null);
  const lutRef = useRef<PathLut | null>(null);
  const travel = useRef(0);
  const [count, setCount] = useState(0);

  useLayoutEffect(() => {
    const p = pathRef.current;
    if (!p || typeof p.getTotalLength !== 'function') return;
    const L = p.getTotalLength();
    lutRef.current = buildLut(L, (s) => p.getPointAtLength(s));
    setCount(Math.max(2, Math.floor(L / spacing)));
  }, [d, spacing]);

  const draw = (dt: number, t: number) => {
    const lut = lutRef.current;
    const g = groupRef.current;
    if (!lut || !g) return;
    travel.current += dt * speed * flowFactor(scale, model.state.thermal);
    const nodes = g.children;
    const n = nodes.length;
    for (let i = 0; i < n; i++) {
      const s = wrap(travel.current + (i * lut.length) / n, lut.length);
      const [x, y, nx, ny] = sampleLut(lut, s);
      const progress = s / lut.length;
      let ox = 0;
      let oy = 0;
      let rad = r;
      if (kind === 'steam') {
        // Buhar: hafif dalgalanan, içi boş işaretler.
        const w = Math.sin(t * 7 + i * 1.7) * 1.6;
        ox = nx * w;
        oy = ny * w;
      } else if (kind === 'mix' && progress >= 0.22) {
        rad = r * (0.7 + 0.9 * Math.min(1, (progress - 0.22) / 0.6));
        const w = Math.sin(t * 5 + i * 2.3) * 2.4;
        ox = nx * w;
        oy = ny * w;
      }
      const c = nodes[i] as SVGCircleElement;
      c.setAttribute('cx', (x + ox).toFixed(1));
      c.setAttribute('cy', (y + oy).toFixed(1));
      if (kind === 'mix') c.setAttribute('r', rad.toFixed(2));
      const cls = particleClass(kind, progress);
      if (c.getAttribute('class') !== cls) c.setAttribute('class', cls);
    }
  };
  useTick(draw);
  // Parçacıklar oluşturulunca (duraklatılmış olsa bile) hemen yerleştir.
  useLayoutEffect(() => {
    draw(0, clock.simTime);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count]);

  const pattern = PATTERN[kind];
  return (
    <g className={`flow flow-${kind} ${hlClass(id, ctx)}`} data-flow={id}>
      {pipe > 0 && <path className="pipe-wall" d={d} strokeWidth={pipe + 5} />}
      {pipe > 0 && <path className={`pipe-fluid fluid-${kind}`} d={d} strokeWidth={pipe} />}
      <path ref={pathRef} className={`flow-guide ${pipe > 0 ? 'in-pipe' : 'in-vessel'}`} d={d} strokeDasharray={pattern} />
      <g ref={groupRef} className="particles" style={{ display: showFlow ? undefined : 'none' }}>
        {Array.from({ length: count }, (_, i) => (
          <circle key={i} r={r} className={particleClass(kind, 0)} />
        ))}
      </g>
    </g>
  );
}
