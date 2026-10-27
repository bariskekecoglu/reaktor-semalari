import { useRef } from 'react';
import { useTick } from '../../../hooks/useSimulation';
import { Hotspot } from '../SceneContext';
import { Flow } from '../flow/Flow';

/**
 * Türbin-jeneratör grubu: YB türbini, AB (çift akışlı) türbin ve jeneratör aynı mil üzerinde.
 * Mil, şebekeye senkron olduğu için güçten bağımsız sabit hızda döner (temsili, yavaşlatılmış).
 */
const SHAFT_VISUAL_RPS = 0.6;

interface Props {
  x: number;
  y: number;
  ids: { hp: string; lp: string; gen: string; crossover: string };
  showFlow: boolean;
}

export function TurbineGenerator({ x, y, ids, showFlow }: Props) {
  const bladesRef = useRef<SVGGElement>(null);
  const lpBladesRef = useRef<SVGGElement>(null);
  const markRef = useRef<SVGLineElement>(null);
  const angle = useRef(0);

  useTick((dt) => {
    angle.current = (angle.current + dt * SHAFT_VISUAL_RPS * 360) % 360;
    const off = ((angle.current / 360) * 20).toFixed(2);
    for (const g of [bladesRef.current, lpBladesRef.current]) {
      if (g) for (const el of Array.from(g.children)) (el as SVGElement).setAttribute('stroke-dashoffset', off);
    }
    markRef.current?.setAttribute('transform', `rotate(${angle.current.toFixed(1)} ${x + 492} ${y})`);
  });

  const hpBlades = [];
  for (let i = 0; i < 10; i++) {
    const bx = x + 12 + i * 9.5;
    const half = 22 + (i / 9) * 14;
    hpBlades.push(<line key={`h${i}`} x1={bx} x2={bx} y1={y - half + 4} y2={y + half - 4} />);
  }
  const lpBlades = [];
  for (let i = 0; i < 8; i++) {
    const half = 30 + i * 4.5;
    const left = x + 205 - 10 - i * 9;
    const right = x + 225 + 10 + i * 9;
    lpBlades.push(<line key={`l${i}`} x1={left} x2={left} y1={y - half + 5} y2={y + half - 5} />);
    lpBlades.push(<line key={`r${i}`} x1={right} x2={right} y1={y - half + 5} y2={y + half - 5} />);
  }

  return (
    <g className="turbine-group">
      {/* Mil */}
      <rect className="shaft" x={x - 14} y={y - 4} width={512} height={8} rx={2} />
      <Hotspot id={ids.hp}>
        <path className="casing" d={`M${x} ${y - 27} L${x + 108} ${y - 42} L${x + 108} ${y + 42} L${x} ${y + 27} Z`} />
        <g ref={bladesRef} className="blades">
          {hpBlades}
        </g>
        <line className="rotor" x1={x + 4} x2={x + 104} y1={y} y2={y} />
      </Hotspot>
      <Hotspot id={ids.lp}>
        <path className="casing-outline" d={`M${x + 130} ${y - 66} L${x + 300} ${y - 66} L${x + 300} ${y + 66} L${x + 130} ${y + 66} Z`} />
        {/* Çift akışlı kanat profili: ortadan giriş, iki yöne genişleme */}
        <path
          className="lp-profile"
          d={`M${x + 136} ${y - 62} L${x + 205} ${y - 30} L${x + 225} ${y - 30} L${x + 294} ${y - 62} M${x + 136} ${y + 62} L${x + 205} ${y + 30} L${x + 225} ${y + 30} L${x + 294} ${y + 62}`}
        />
        <g ref={lpBladesRef} className="blades">
          {lpBlades}
        </g>
        <line className="rotor" x1={x + 134} x2={x + 296} y1={y} y2={y} />
        <rect className="exhaust" x={x + 180} y={y + 66} width={70} height={10} />
      </Hotspot>
      {/* YB → AB geçiş borusu */}
      <Flow id={ids.crossover} d={`M${x + 100} ${y - 40} C${x + 110} ${y - 95} ${x + 215} ${y - 105} ${x + 215} ${y - 66}`} kind="steam" pipe={9} speed={70} spacing={22} showFlow={showFlow} />
      <Hotspot id={ids.gen}>
        <rect className="generator" x={x + 340} y={y - 46} width={130} height={92} rx={6} />
        {Array.from({ length: 7 }, (_, i) => (
          <rect key={i} className="stator" x={x + 352 + i * 16} y={y - 38} width={10} height={76} />
        ))}
        <rect className="gen-rotor" x={x + 350} y={y - 14} width={110} height={28} rx={3} />
        <ellipse className="shaft-end" cx={x + 492} cy={y} rx={9} ry={20} />
        <line ref={markRef} className="shaft-mark" x1={x + 492} y1={y} x2={x + 492} y2={y - 17} />
      </Hotspot>
      {/* Kaplinler */}
      <rect className="coupling" x={x + 112} y={y - 9} width={10} height={18} />
      <rect className="coupling" x={x + 308} y={y - 9} width={10} height={18} />
    </g>
  );
}
