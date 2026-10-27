import { useRef } from 'react';
import { useRodMotion } from '../shared/equipment/animated';
import { CoreLegend, NeutronLayer, type Box } from '../shared/equipment/NeutronLayer';

const TOP = 60;
const BOTTOM = 300;
const ROD_LEN = BOTTOM - TOP;
const fuelXs = [60, 140, 180, 260, 300, 380];
const rodXs = [100, 220, 340];
const fuel: Box[] = fuelXs.map((x) => ({ x: x - 9, y: TOP, w: 18, h: BOTTOM - TOP }));
const absorbers = (ins: number): Box[] => rodXs.map((x) => ({ x: x - 6, y: 20, w: 12, h: TOP - 20 + ins * ROD_LEN }));

/** PWR çekirdek yakın planı: yan kesit + kare adımlı demet üstten görünüşü. */
export function PwrCoreDetail({ showFlow }: { showFlow: boolean }) {
  const rodRef = useRef<SVGGElement>(null);
  useRodMotion(rodRef, ROD_LEN, 1);
  const lattice = [];
  for (let r = 0; r < 9; r++)
    for (let c = 0; c < 9; c++) {
      const guide = (r % 3 === 1 && c % 3 === 1) || (r === 4 && c === 4);
      lattice.push(<circle key={`${r}-${c}`} cx={455 + c * 19} cy={88 + r * 19} r={guide ? 7 : 6.5} className={guide ? 'guide-tube' : 'fuel-pin'} />);
    }
  return (
    <svg viewBox="0 0 640 380" className="detail-svg" role="img" aria-label="PWR çekirdek yakın planı: yakıt çubukları, üstten giren kontrol çubukları ve temsili nötronlar">
      <rect x="30" y="40" width="380" height="280" className="coolant-bg" />
      {fuelXs.map((x) => (
        <g key={x}>
          <rect x={x - 9} y={TOP} width={18} height={BOTTOM - TOP} rx={4} className="fuel-tube" />
          {Array.from({ length: 11 }, (_, i) => (
            <line key={i} x1={x - 7} x2={x + 7} y1={TOP + 20 + i * 20} y2={TOP + 20 + i * 20} className="pellet-line" />
          ))}
        </g>
      ))}
      {rodXs.map((x) => (
        <rect key={x} x={x - 7} y={TOP} width={14} height={BOTTOM - TOP} className="guide-tube-side" />
      ))}
      <g ref={rodRef}>
        {rodXs.map((x) => (
          <rect key={x} x={x - 5} y={TOP - ROD_LEN} width={10} height={ROD_LEN} className="control-rod" />
        ))}
      </g>
      <rect x="30" y="0" width="380" height="40" className="detail-mask" />
      <line x1="30" x2="410" y1="40" y2="40" className="detail-edge" />
      <text x="40" y="30" className="detail-caption">↓ kontrol çubukları üstten girer</text>
      <NeutronLayer bounds={{ x: 30, y: 40, w: 380, h: 280 }} fuel={fuel} absorbers={absorbers} showFlow={showFlow} />

      <rect x="440" y="72" width="182" height="182" className="assembly-can open" />
      {lattice}
      <text x="531" y="280" textAnchor="middle" className="detail-caption">
        Üstten: kare adımlı demet
      </text>
      <text x="531" y="298" textAnchor="middle" className="detail-caption small">
        koyu halka = kılavuz boru (temsili)
      </text>
      <CoreLegend x={36} y={342} />
      <text x="36" y="372" className="detail-note">
        Boyutlar ve hareketler ölçekli değildir. Su hem soğutucu hem yavaşlatıcıdır.
      </text>
    </svg>
  );
}
