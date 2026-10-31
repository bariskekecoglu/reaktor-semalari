import { useRef } from 'react';
import { useRodMotion } from '../shared/equipment/animated';
import { CoreLegend, NeutronLayer, type Box } from '../shared/equipment/NeutronLayer';
import { MaterialDefs } from '../shared/equipment/materials';

const SIDE_TOP = 50;
const SIDE_BOTTOM = 300;
const SIDE_FUEL = [62, 102, 142, 196, 236];
const SIDE_RODS = [169];
const fuel: Box[] = SIDE_FUEL.map((x) => ({ x: x - 6, y: SIDE_TOP, w: 12, h: SIDE_BOTTOM - SIDE_TOP }));
const TRAVEL = SIDE_BOTTOM - SIDE_TOP;
const absorbers = (ins: number): Box[] => SIDE_RODS.map((x) => ({ x: x - 5, y: 30, w: 10, h: SIDE_TOP - 30 + ins * TRAVEL }));

/** Üstten görünüş: 7 × 7 grafit kolon; her kolonun ortasında bir kanal. Kontrol kanalı yerleri temsilidir. */
const N = 7;
const CELL = 30;
const isCtrl = (i: number, j: number) => (i % 3 === 1 && j % 3 === 1) || (i === 3 && j === 3);

/** RBMK çekirdek yakın planı: grafit içinde dikey kanallar (yan kesit) + grafit kolon kafesi (üstten). */
export function RbmkCoreDetail({ showFlow }: { showFlow: boolean }) {
  const rod = useRef<SVGGElement>(null);
  useRodMotion(rod, TRAVEL, 1);
  const x0 = 470 - (N * CELL) / 2;
  const y0 = 170 - (N * CELL) / 2;
  return (
    <svg viewBox="0 0 640 380" className="detail-svg" role="img" aria-label="RBMK çekirdek yakın planı: grafit yığını içinde dikey yakıt kanalları ve ayrı kontrol kanalları">
      <defs>
        <MaterialDefs prefix="rbmkc" />
      </defs>
      <rect x="36" y={SIDE_TOP} width="220" height={SIDE_BOTTOM - SIDE_TOP} fill="url(#rbmkc-graphite)" className="graphite-block" />
      {SIDE_FUEL.map((x) => (
        <g key={x}>
          <rect x={x - 7} y={SIDE_TOP} width={14} height={SIDE_BOTTOM - SIDE_TOP} rx={2} className="channel-tube" />
          <rect x={x - 3} y={SIDE_TOP + 6} width={6} height={SIDE_BOTTOM - SIDE_TOP - 12} className="fuel-assy" />
        </g>
      ))}
      {SIDE_RODS.map((x) => (
        <rect key={x} x={x - 7} y={SIDE_TOP} width={14} height={SIDE_BOTTOM - SIDE_TOP} rx={2} className="ctrl-channel" />
      ))}
      <g ref={rod}>
        {SIDE_RODS.map((x) => (
          <rect key={x} x={x - 4} y={SIDE_TOP - TRAVEL} width={8} height={TRAVEL} className="control-rod" />
        ))}
      </g>
      <rect x="36" y="0" width="220" height={SIDE_TOP} className="detail-mask" />
      <line x1="36" x2="256" y1={SIDE_TOP} y2={SIDE_TOP} className="detail-edge" />
      <text x="40" y="38" className="detail-caption">
        ↓ çubuk ayrı kanalda üstten girer
      </text>
      <NeutronLayer bounds={{ x: 36, y: SIDE_TOP, w: 220, h: SIDE_BOTTOM - SIDE_TOP }} fuel={fuel} absorbers={absorbers} showFlow={showFlow} />
      <text x="40" y="318" className="detail-caption small">
        yan kesit · grafit içinde kanallar
      </text>

      {Array.from({ length: N }, (_, i) =>
        Array.from({ length: N }, (_, j) => {
          const cx = x0 + i * CELL + CELL / 2;
          const cy = y0 + j * CELL + CELL / 2;
          const ctrl = isCtrl(i, j);
          return (
            <g key={`${i}-${j}`}>
              <rect x={cx - CELL / 2 + 1} y={cy - CELL / 2 + 1} width={CELL - 2} height={CELL - 2} fill="url(#rbmkc-graphite)" className="graphite-block" />
              <circle cx={cx} cy={cy} r={8} className={ctrl ? 'ctrl-channel' : 'channel-tube'} />
              {ctrl ? <circle cx={cx} cy={cy} r={3.6} className="control-rod" /> : <circle cx={cx} cy={cy} r={4.2} className="fuel-assy" />}
            </g>
          );
        }),
      )}
      <text x="470" y="290" textAnchor="middle" className="detail-caption small">
        Üstten: her grafit kolonunun ortasında bir kanal
      </text>
      <text x="470" y="307" textAnchor="middle" className="detail-caption small">
        sarı: yakıt · koyu/kesikli: kontrol kanalı (yerleri temsili)
      </text>
      <CoreLegend x={40} y={340} />
      <text x="40" y="372" className="detail-note">
        Nötronlar esas olarak grafitte yavaşlar. Hareketler temsili; fiziksel hesap değildir. Ölçeksiz.
      </text>
    </svg>
  );
}
