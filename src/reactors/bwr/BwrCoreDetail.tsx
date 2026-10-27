import { useRef } from 'react';
import { Bubbles, useRodMotion } from '../shared/equipment/animated';
import { CoreLegend, NeutronLayer, type Box } from '../shared/equipment/NeutronLayer';

const TOP = 40;
const BOTTOM = 300;
const TRAVEL = BOTTOM - TOP;
const FUEL_X = [78, 112, 146, 180, 260, 294, 328, 362];
const fuel: Box[] = FUEL_X.map((x) => ({ x: x - 8, y: TOP, w: 16, h: BOTTOM - TOP }));
const absorbers = (ins: number): Box[] => [{ x: 212, y: BOTTOM - ins * TRAVEL, w: 16, h: ins * TRAVEL + 30 }];

/** BWR çekirdek yakın planı: kanal kutuları, kaynama ve alttan giren haç kesitli çubuk. */
export function BwrCoreDetail({ showFlow }: { showFlow: boolean }) {
  const rod = useRef<SVGGElement>(null);
  useRodMotion(rod, TRAVEL, -1);
  const bundle = (ox: number, oy: number) => {
    const pins = [];
    for (let r = 0; r < 6; r++) for (let c = 0; c < 6; c++) pins.push(<circle key={`${r}${c}`} cx={ox + 10 + c * 11} cy={oy + 10 + r * 11} r={4.2} className="fuel-pin" />);
    return (
      <g key={`${ox}-${oy}`}>
        <rect x={ox} y={oy} width={75} height={75} className="assembly-can" />
        {pins}
      </g>
    );
  };
  return (
    <svg viewBox="0 0 640 380" className="detail-svg" role="img" aria-label="BWR çekirdek yakın planı: kanal kutuları içinde kaynama ve alttan giren haç kesitli kontrol çubuğu">
      <rect x="40" y={TOP} width="370" height={BOTTOM - TOP} className="coolant-bg" />
      {[56, 240].map((x) => (
        <rect key={x} x={x} y={TOP} width={150} height={BOTTOM - TOP} className="mix-zone" opacity={0.55} />
      ))}
      {FUEL_X.map((x) => (
        <g key={x}>
          <rect x={x - 8} y={TOP + 4} width={16} height={BOTTOM - TOP - 8} rx={4} className="fuel-tube" />
          {Array.from({ length: 12 }, (_, i) => (
            <line key={i} x1={x - 6} x2={x + 6} y1={TOP + 22 + i * 20} y2={TOP + 22 + i * 20} className="pellet-line" />
          ))}
        </g>
      ))}
      <Bubbles x={58} y={TOP + 4} w={146} h={BOTTOM - TOP - 8} count={18} showFlow={showFlow} speed={40} />
      <Bubbles x={242} y={TOP + 4} w={146} h={BOTTOM - TOP - 8} count={18} showFlow={showFlow} speed={40} />
      {[56, 240].map((x) => (
        <rect key={x} x={x} y={TOP} width={150} height={BOTTOM - TOP} className="channel-box" />
      ))}
      <defs>
        <clipPath id="bwr-core-clip">
          <rect x="40" y={TOP} width="370" height={BOTTOM - TOP} />
        </clipPath>
      </defs>
      <g clipPath="url(#bwr-core-clip)">
      <g ref={rod}>
        <rect x={213} y={BOTTOM} width={14} height={TRAVEL} className="control-rod" />
      </g>
      </g>
      <rect x="40" y={BOTTOM} width="370" height="40" className="detail-mask" />
      <line x1="40" x2="410" y1={BOTTOM} y2={BOTTOM} className="detail-edge" />
      <text x="50" y={BOTTOM + 26} className="detail-caption">
        ↑ haç kesitli kontrol çubuğu alttan girer
      </text>
      <text x="50" y={TOP - 10} className="detail-caption">
        kanal kutusu içinde yukarı akış — kabarcıklar yukarı doğru büyür
      </text>
      <NeutronLayer bounds={{ x: 40, y: TOP, w: 370, h: BOTTOM - TOP }} fuel={fuel} absorbers={absorbers} showFlow={showFlow} />

      {/* Üstten görünüş: 4 demet + haç */}
      {bundle(440, 60)}
      {bundle(525, 60)}
      {bundle(440, 145)}
      {bundle(525, 145)}
      <path d="M518 52 H522 V138 H608 V142 H522 V228 H518 V142 H432 V138 H518 Z" className="cruciform" />
      <text x="525" y="252" textAnchor="middle" className="detail-caption">
        Üstten: 4 demet + haç kesitli çubuk
      </text>
      <text x="525" y="270" textAnchor="middle" className="detail-caption small">
        her demet kendi kanal kutusunda
      </text>
      <CoreLegend x={46} y={348} />
      <text x="46" y="374" className="detail-note">
        Boyutlar ve hareketler ölçekli değildir. Kaynama boşluğu yavaşlatmayı ve dolayısıyla gücü etkiler.
      </text>
    </svg>
  );
}
