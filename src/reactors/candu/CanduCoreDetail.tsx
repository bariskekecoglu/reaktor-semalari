import { useRef } from 'react';
import { useRodMotion } from '../shared/equipment/animated';
import { CoreLegend, NeutronLayer, type Box } from '../shared/equipment/NeutronLayer';
import { MaterialDefs } from '../shared/equipment/materials';

const L = 36;
const R = 256;
const TOP = 50;
const BOTTOM = 300;
const CH = [86, 136, 186, 236, 280];
const fuel: Box[] = CH.map((y) => ({ x: L + 6, y: y - 6, w: R - L - 12, h: 12 }));
const ROD_X = 146;
const TRAVEL = BOTTOM - TOP;
const absorbers = (ins: number): Box[] => [{ x: ROD_X - 4, y: 30, w: 8, h: TOP - 30 + ins * TRAVEL }];

/** Yüz görünüşü: kare kafes; komşu kanallarda akış yönü ters (⊙ izleyiciye doğru, ⊗ uzağa). */
const N = 7;
const PITCH = 30;

/** CANDU çekirdek yakın planı: moderatör içinde yatay kanallar (yan) + kanal kafesi ve iki yönlü akış (yüz). */
export function CanduCoreDetail({ showFlow }: { showFlow: boolean }) {
  const rod = useRef<SVGGElement>(null);
  useRodMotion(rod, TRAVEL, 1);
  const x0 = 470 - ((N - 1) * PITCH) / 2;
  const y0 = 165 - ((N - 1) * PITCH) / 2;
  return (
    <svg viewBox="0 0 640 380" className="detail-svg" role="img" aria-label="CANDU çekirdek yakın planı: ağır su moderatörü içinde yatay kanallar ve komşu kanallarda ters akış">
      <defs>
        <MaterialDefs prefix="canduc" />
      </defs>
      <rect x={L} y={TOP} width={R - L} height={BOTTOM - TOP} fill="url(#canduc-d2o)" stroke="#3b3b40" />
      <rect className="ctrl-channel" x={ROD_X - 5} y={TOP} width={10} height={BOTTOM - TOP} />
      <g ref={rod}>
        <rect x={ROD_X - 3} y={TOP - TRAVEL} width={6} height={TRAVEL} className="control-rod" />
      </g>
      {CH.map((y, i) => (
        <g key={y}>
          <rect x={L} y={y - 9} width={R - L} height={18} className="calandria-tube" />
          <rect x={L} y={y - 6} width={R - L} height={12} className="pressure-tube thin" />
          {Array.from({ length: 8 }, (_, k) => (
            <rect key={k} x={L + 6 + k * 26.5} y={y - 3.5} width={24} height={7} rx={1.5} className="fuel-bundle" />
          ))}
          <text x={i % 2 ? L - 4 : R + 4} y={y + 5} textAnchor={i % 2 ? 'end' : 'start'} className="detail-caption small">
            {i % 2 ? '←' : '→'}
          </text>
        </g>
      ))}
      <rect x={L} y="0" width={R - L} height={TOP} className="detail-mask" />
      <line x1={L} x2={R} y1={TOP} y2={TOP} className="detail-edge" />
      <text x={L + 4} y="38" className="detail-caption">
        ↓ düzenek kanallar arasından
      </text>
      <NeutronLayer bounds={{ x: L, y: TOP, w: R - L, h: BOTTOM - TOP }} fuel={fuel} absorbers={absorbers} showFlow={showFlow} />
      <text x={L} y="318" className="detail-caption small">
        yan kesit · mor noktalı: D₂O moderatör
      </text>

      <rect x={x0 - PITCH / 2 - 6} y={y0 - PITCH / 2 - 6} width={N * PITCH + 12} height={N * PITCH + 12} fill="url(#canduc-d2o)" stroke="#3b3b40" rx={6} />
      {Array.from({ length: N }, (_, i) =>
        Array.from({ length: N }, (_, j) => {
          const cx = x0 + i * PITCH;
          const cy = y0 + j * PITCH;
          const toward = (i + j) % 2 === 0;
          return (
            <g key={`${i}-${j}`}>
              <circle cx={cx} cy={cy} r={10} className="calandria-tube" />
              <circle cx={cx} cy={cy} r={7} className="pressure-tube thin" />
              {toward ? (
                <circle cx={cx} cy={cy} r={2.2} fill="#26262a" />
              ) : (
                <path d={`M${cx - 3.5} ${cy - 3.5} L${cx + 3.5} ${cy + 3.5} M${cx + 3.5} ${cy - 3.5} L${cx - 3.5} ${cy + 3.5}`} stroke="#26262a" strokeWidth={1.6} />
              )}
            </g>
          );
        }),
      )}
      <rect x={x0 + PITCH / 2 - 3} y={y0 + PITCH / 2 - 3} width={6} height={6} className="control-rod" />
      <rect x={x0 + 3.5 * PITCH - 3} y={y0 + 3.5 * PITCH - 3} width={6} height={6} className="control-rod" />
      <text x="470" y="290" textAnchor="middle" className="detail-caption small">
        Yüz görünüşü: kare kafes · ⊙ bize doğru, ⊗ uzağa akış
      </text>
      <text x="470" y="307" textAnchor="middle" className="detail-caption small">
        komşu kanallarda yön ters · ■ düzenek (temsili)
      </text>
      <CoreLegend x={40} y={340} />
      <text x="40" y="372" className="detail-note">
        Nötronlar moderatörde yavaşlar. Hareketler temsili; fiziksel hesap değildir. Ölçeksiz.
      </text>
    </svg>
  );
}
