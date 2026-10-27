import { useRef } from 'react';
import { useTick } from '../../../hooks/useSimulation';

interface Props {
  x: number;
  y: number;
  r?: number;
  /** Üstte dikey motor çizilsin mi (ana soğutucu pompaları). */
  motor?: 'top' | 'side' | 'none';
  /** Çark dönüş hızı (tur/simülasyon saniyesi, görsel). */
  rps?: number;
}

/** Santrifüj pompa: gövde, dönen çark ve isteğe bağlı motor. */
export function Pump({ x, y, r = 22, motor = 'none', rps = 0.8 }: Props) {
  const imp = useRef<SVGGElement>(null);
  const a = useRef(0);
  useTick((dt) => {
    a.current = (a.current + dt * rps * 360) % 360;
    imp.current?.setAttribute('transform', `rotate(${a.current.toFixed(1)} ${x} ${y})`);
  });
  return (
    <g className="pump">
      {motor === 'top' && (
        <>
          <rect className="motor" x={x - r * 0.8} y={y - r - 56} width={r * 1.6} height={46} rx={4} />
          {Array.from({ length: 4 }, (_, i) => (
            <line key={i} className="fin" x1={x - r * 0.8} x2={x + r * 0.8} y1={y - r - 48 + i * 10} y2={y - r - 48 + i * 10} />
          ))}
          <rect className="pump-shaft" x={x - 3} y={y - r - 10} width={6} height={12} />
        </>
      )}
      {motor === 'side' && <rect className="motor" x={x + r + 2} y={y - r * 0.6} width={r * 1.6} height={r * 1.2} rx={3} />}
      <circle className="pump-casing" cx={x} cy={y} r={r} />
      <g ref={imp}>
        {[0, 120, 240].map((deg) => (
          <path key={deg} className="impeller" transform={`rotate(${deg} ${x} ${y})`} d={`M${x} ${y} q ${r * 0.35} ${-r * 0.2} ${r * 0.62} ${-r * 0.55}`} />
        ))}
        <circle className="hub" cx={x} cy={y} r={r * 0.18} />
      </g>
    </g>
  );
}

/** Jeneratör çıkışı: yükseltici transformatör ve şebeke hattı. */
export function GridLink({ x, y }: { x: number; y: number }) {
  return (
    <g className="grid-link" aria-hidden="true">
      <line className="cable" x1={x - 20} y1={y} x2={x + 10} y2={y} />
      <rect className="transformer" x={x + 10} y={y - 30} width={44} height={60} rx={4} />
      {Array.from({ length: 4 }, (_, i) => (
        <line key={i} className="fin" x1={x + 14} x2={x + 50} y1={y - 20 + i * 13} y2={y - 20 + i * 13} />
      ))}
      <path className="cable" d={`M${x + 54} ${y - 20} H${x + 78} V${y - 120}`} />
      <path className="tower" d={`M${x + 64} ${y + 40} L${x + 78} ${y - 130} L${x + 92} ${y + 40} M${x + 66} ${y - 100} H${x + 90} M${x + 70} ${y - 50} H${x + 86}`} />
      <text className="eq-text small" x={x + 78} y={y + 60} textAnchor="middle">
        şebekeye
      </text>
    </g>
  );
}
