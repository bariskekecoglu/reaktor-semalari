import { useRef } from 'react';
import { useSimulation, useTick } from '../../../hooks/useSimulation';
import { Hotspot } from '../SceneContext';
import { Flow } from '../flow/Flow';

interface Props {
  x: number;
  y: number;
  w: number;
  h: number;
  id: string;
  coolId: string;
  /** Soğutma suyu kaynağının sol kenarı (x). */
  coolTo: number;
  showFlow: boolean;
}

const DROPS = 16;

/**
 * Kondenser: türbinden çıkan buhar, soğutma suyu borularının üzerinde yoğuşur.
 * Soğutma suyu boruların içinde kalır; buhar/su ile karışmaz.
 */
export function Condenser({ x, y, w, h, id, coolId, coolTo, showFlow }: Props) {
  const { model } = useSimulation();
  const dropsRef = useRef<SVGGElement>(null);
  const travel = useRef(0);
  const hotwellTop = y + h - 26;
  const fall = hotwellTop - (y + 8);

  useTick((dt) => {
    travel.current += dt * (16 + 26 * model.state.steam);
    const g = dropsRef.current;
    if (!g) return;
    const kids = g.children;
    for (let i = 0; i < kids.length; i++) {
      const c = kids[i] as SVGCircleElement;
      const p = ((travel.current + (i * fall * 0.618 * 7) % fall) % fall) / fall;
      c.setAttribute('cy', (y + 8 + p * fall).toFixed(1));
      // Üst bölgede buhar (boş), boru demetinden sonra su damlası (dolu).
      const cls = p < 0.55 ? 'drop-steam' : 'drop-water';
      if (c.getAttribute('class') !== cls) c.setAttribute('class', cls);
      c.setAttribute('r', p < 0.55 ? '3' : '2.2');
    }
  });

  const rowA = y + h * 0.42;
  const rowB = y + h * 0.62;
  const coolPath = `M${coolTo} ${rowB} H${x + 14} Q${x + 2} ${rowB} ${x + 2} ${rowB - 10} V${rowA + 10} Q${x + 2} ${rowA} ${x + 14} ${rowA} H${coolTo}`;

  return (
    <g className="condenser">
      <Hotspot id={id}>
        <rect className="shell" x={x} y={y} width={w} height={h} rx={8} />
        {/* Boru demeti (yan görünüş) */}
        {Array.from({ length: 5 }, (_, i) => (
          <line key={i} className="tube-line" x1={x + 12} x2={x + w - 6} y1={rowA - 6 + i * ((rowB - rowA + 12) / 4)} y2={rowA - 6 + i * ((rowB - rowA + 12) / 4)} />
        ))}
        <rect className="hotwell" x={x + 3} y={hotwellTop} width={w - 6} height={23} rx={5} />
        <g ref={dropsRef} style={{ display: showFlow ? undefined : 'none' }}>
          {Array.from({ length: DROPS }, (_, i) => (
            <circle key={i} cx={x + 18 + ((i * 37) % (w - 36))} cy={y + 10} r={3} className="drop-steam" />
          ))}
        </g>
      </Hotspot>
      <Flow id={coolId} d={coolPath} kind="cool" pipe={7} speed={55} spacing={24} scale="constant" showFlow={showFlow} r={2.6} />
    </g>
  );
}

export function CoolingSource({ x, y, id }: { x: number; y: number; id: string }) {
  return (
    <Hotspot id={id}>
      <rect className="cool-source" x={x} y={y} width={110} height={110} rx={6} />
      {Array.from({ length: 4 }, (_, i) => (
        <path key={i} className="wave" d={`M${x + 12} ${y + 64 + i * 11} q 11 -7 22 0 t 22 0 t 22 0 t 22 0`} />
      ))}
      <text className="eq-text" x={x + 55} y={y + 22} textAnchor="middle">
        Soğutma suyu
      </text>
      <text className="eq-text small" x={x + 55} y={y + 40} textAnchor="middle">
        deniz / nehir /
      </text>
      <text className="eq-text small" x={x + 55} y={y + 54} textAnchor="middle">
        soğutma kulesi
      </text>
    </Hotspot>
  );
}
