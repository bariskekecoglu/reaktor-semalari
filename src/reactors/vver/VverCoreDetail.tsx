import { useRef } from 'react';
import { useRodMotion } from '../shared/equipment/animated';
import { CoreLegend, NeutronLayer, type Box } from '../shared/equipment/NeutronLayer';

const S3 = Math.sqrt(3);
const HEX_R = 44;
const PITCH = 9.6;

function hexPoints(cx: number, cy: number, r: number) {
  return Array.from({ length: 6 }, (_, k) => {
    const a = (Math.PI / 3) * k;
    return `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`;
  }).join(' ');
}

/** Üçgen adımlı çubuk konumları (altıgen mesafesi ≤ 3 → 37 konum). */
const PIN_OFFSETS: { x: number; y: number; ring: number; corner: boolean }[] = [];
for (let i = -3; i <= 3; i++)
  for (let j = -3; j <= 3; j++) {
    const k = -i - j;
    const ring = Math.max(Math.abs(i), Math.abs(j), Math.abs(k));
    if (ring > 3) continue;
    const corner = ring === 2 && (i === 0 || j === 0 || k === 0);
    PIN_OFFSETS.push({ x: PITCH * (i + j / 2), y: PITCH * ((S3 / 2) * j), ring, corner });
  }

function Assembly({ cx, cy, rodded }: { cx: number; cy: number; rodded: boolean }) {
  return (
    <g>
      <polygon points={hexPoints(cx, cy, HEX_R)} className="hex" />
      {PIN_OFFSETS.map((p, i) =>
        p.corner || p.ring === 0 ? (
          <circle key={i} cx={cx + p.x} cy={cy + p.y} r={3.9} className={`guide-tube ${rodded && p.corner ? 'rodded' : ''}`} />
        ) : (
          <circle key={i} cx={cx + p.x} cy={cy + p.y} r={3.5} className="fuel-pin" />
        ),
      )}
    </g>
  );
}

const SIDE_TOP = 50;
const SIDE_BOTTOM = 300;
const SIDE_FUEL = [56, 76, 96, 136, 156, 176, 216, 236];
const SIDE_RODS = [116, 196];
const fuel: Box[] = SIDE_FUEL.map((x) => ({ x: x - 7, y: SIDE_TOP, w: 14, h: SIDE_BOTTOM - SIDE_TOP }));
const TRAVEL = SIDE_BOTTOM - SIDE_TOP;
const absorbers = (ins: number): Box[] => SIDE_RODS.map((x) => ({ x: x - 5, y: 30, w: 10, h: SIDE_TOP - 30 + ins * TRAVEL }));

/** VVER çekirdek yakın planı: altıgen demetler (üstten) + yan kesitte üstten giren çubuklar. */
export function VverCoreDetail({ showFlow }: { showFlow: boolean }) {
  const rod = useRef<SVGGElement>(null);
  useRodMotion(rod, TRAVEL, 1);
  const cx = 470;
  const cy = 170;
  const d = S3 * HEX_R;
  const centers = [{ x: cx, y: cy }, ...Array.from({ length: 6 }, (_, k) => ({ x: cx + d * Math.cos(Math.PI / 6 + (Math.PI / 3) * k), y: cy + d * Math.sin(Math.PI / 6 + (Math.PI / 3) * k) }))];
  return (
    <svg viewBox="0 0 640 380" className="detail-svg" role="img" aria-label="VVER çekirdek yakın planı: altıgen yakıt demetleri, üçgen adımlı çubuklar ve üstten giren kontrol çubukları">
      <rect x="36" y={SIDE_TOP} width="220" height={SIDE_BOTTOM - SIDE_TOP} className="coolant-bg" />
      {SIDE_FUEL.map((x) => (
        <g key={x}>
          <rect x={x - 7} y={SIDE_TOP} width={14} height={SIDE_BOTTOM - SIDE_TOP} rx={3} className="fuel-tube" />
          {Array.from({ length: 11 }, (_, i) => (
            <line key={i} x1={x - 5} x2={x + 5} y1={SIDE_TOP + 20 + i * 21} y2={SIDE_TOP + 20 + i * 21} className="pellet-line" />
          ))}
        </g>
      ))}
      {SIDE_RODS.map((x) => (
        <rect key={x} x={x - 6} y={SIDE_TOP} width={12} height={SIDE_BOTTOM - SIDE_TOP} className="guide-tube-side" />
      ))}
      <g ref={rod}>
        {SIDE_RODS.map((x) => (
          <rect key={x} x={x - 4} y={SIDE_TOP - TRAVEL} width={8} height={TRAVEL} className="control-rod" />
        ))}
      </g>
      <rect x="36" y="0" width="220" height={SIDE_TOP} className="detail-mask" />
      <line x1="36" x2="256" y1={SIDE_TOP} y2={SIDE_TOP} className="detail-edge" />
      <text x="40" y="38" className="detail-caption">
        ↓ çubuk kümesi üstten girer
      </text>
      <NeutronLayer bounds={{ x: 36, y: SIDE_TOP, w: 220, h: SIDE_BOTTOM - SIDE_TOP }} fuel={fuel} absorbers={absorbers} showFlow={showFlow} />

      {centers.map((c, i) => (
        <Assembly key={i} cx={c.x} cy={c.y} rodded={i === 0 || i % 2 === 1} />
      ))}
      <text x={cx} y="318" textAnchor="middle" className="detail-caption">
        Üstten: altıgen demetler, üçgen adımlı çubuklar
      </text>
      <text x={cx} y="336" textAnchor="middle" className="detail-caption small">
        koyu = çubuk kümesi olan kılavuz boru (temsili)
      </text>
      <CoreLegend x={40} y={356} />
      <text x="40" y="376" className="detail-note">
        Boyutlar ve hareketler ölçekli değildir. Demet içi dizilim sadeleştirildi.
      </text>
    </svg>
  );
}
