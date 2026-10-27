import { Flow } from '../shared/flow/Flow';
import { HeatPulse } from '../shared/equipment/animated';
import { hiddenSegment, particlePath, tubePath, type HsgLayout, type HsgLoop } from './hsgGeometry';

export interface HsgTubeLoop extends HsgLoop {
  /** Parçacık akışının kimliği (vurgu için). */
  id: string;
}

interface Props {
  layout: HsgLayout;
  loops: HsgTubeLoop[];
  showFlow: boolean;
  /** Boru dış genişliği. */
  tube?: number;
  r?: number;
}

/**
 * Yatay U boruları ve içlerindeki birincil akış. Boru ve parçacık yolu aynı döngü
 * tanımından üretilir. Kolektörlerden ÖNCE çizilmelidir; kolektörler borunun
 * kolektör içinde kalan uçlarını örter.
 */
export function HsgTubes({ layout, loops, showFlow, tube = 5, r = 2.1 }: Props) {
  return (
    <g className="hsg-tubes">
      <HeatPulse>
        {loops.map((l) => (
          <path key={l.id} className="u-tube-glow" d={tubePath(layout, l)} strokeWidth={tube + 4} />
        ))}
      </HeatPulse>
      {loops.map((l) => (
        <g key={l.id}>
          <path className="h-tube-wall" d={tubePath(layout, l)} strokeWidth={tube} />
          <path className="h-tube-bore" d={tubePath(layout, l)} strokeWidth={Math.max(1.5, tube - 2.2)} />
        </g>
      ))}
      {loops.map((l) => (
        <Flow key={l.id} id={l.id} d={particlePath(layout, l)} kind="grad" pipe={0} speed={45} spacing={16} scale="constant" showFlow={showFlow} r={r} />
      ))}
    </g>
  );
}

/** Kolektörlerin ÜZERİNE çizilir: borunun kolektör arkasından geçtiği bölümü kesikli gösterir. */
export function HsgHiddenSegments({ layout, loops, tube = 5 }: { layout: HsgLayout; loops: HsgLoop[]; tube?: number }) {
  return (
    <g className="hsg-hidden" aria-hidden="true">
      {loops.map((l, i) => (
        <path key={i} className="h-tube-hidden" d={hiddenSegment(layout, l)} strokeWidth={Math.max(1.2, tube - 3)} />
      ))}
    </g>
  );
}
