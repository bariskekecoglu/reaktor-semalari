import { useRef } from 'react';
import { useSimulation, useTick } from '../../hooks/useSimulation';
import { HISTORY_WINDOW, type HistorySample } from '../../simulation/educationalModel';

const W = 640;
const H = 220;
const L = 52;
const R = 112;
const T = 16;
const B = 36;
const PW = W - L - R;
const PH = H - T - B;

export function buildPath(samples: readonly HistorySample[], now: number, key: 'thermal' | 'electric'): string {
  let d = '';
  for (const s of samples) {
    const age = now - s.t;
    if (age > HISTORY_WINDOW) continue;
    const x = L + PW * (1 - age / HISTORY_WINDOW);
    const y = T + PH * (1 - Math.min(1.05, s[key]));
    d += `${d ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`;
  }
  return d;
}

/** Son 60 simülasyon saniyesinin göreli ısıl güç ve elektrik çıkışı. Veriler ortak modelden gelir. */
export function TimeChart() {
  const { model } = useSimulation();
  const thermalRef = useRef<SVGPathElement>(null);
  const elecRef = useRef<SVGPathElement>(null);
  const thLabel = useRef<SVGTextElement>(null);
  const elLabel = useRef<SVGTextElement>(null);
  const acc = useRef(1);

  useTick((dt) => {
    acc.current += dt;
    if (dt !== 0 && acc.current < 0.25) return;
    acc.current = 0;
    const hist = model.getHistory();
    const now = model.simTime;
    thermalRef.current?.setAttribute('d', buildPath(hist, now, 'thermal'));
    elecRef.current?.setAttribute('d', buildPath(hist, now, 'electric'));
    const st = model.state;
    thLabel.current?.setAttribute('y', String(T + PH * (1 - st.thermal) + 4));
    elLabel.current?.setAttribute('y', String(T + PH * (1 - st.electric) + 4));
  });

  const yTicks = [0, 0.25, 0.5, 0.75, 1];
  const xTicks = [60, 45, 30, 15, 0];
  return (
    <div className="timechart">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Son 60 simülasyon saniyesinde göreli ısıl güç ve elektrik çıkışı">
        {yTicks.map((v) => (
          <g key={v}>
            <line className="grid" x1={L} x2={L + PW} y1={T + PH * (1 - v)} y2={T + PH * (1 - v)} />
            <text className="tick" x={L - 6} y={T + PH * (1 - v) + 4} textAnchor="end">
              %{v * 100}
            </text>
          </g>
        ))}
        {xTicks.map((v) => (
          <text key={v} className="tick" x={L + PW * (1 - v / HISTORY_WINDOW)} y={T + PH + 16} textAnchor="middle">
            {v === 0 ? 'şimdi' : `−${v} s`}
          </text>
        ))}
        <line className="axis" x1={L} x2={L} y1={T} y2={T + PH} />
        <line className="axis" x1={L} x2={L + PW} y1={T + PH} y2={T + PH} />
        <text className="axis-title" x={14} y={T + PH / 2} transform={`rotate(-90 14 ${T + PH / 2})`} textAnchor="middle">
          nominal ısıl güce göre
        </text>
        <text className="axis-title" x={L + PW / 2} y={H - 2} textAnchor="middle">
          simülasyon zamanı (s)
        </text>
        <path ref={thermalRef} className="line-thermal" />
        <path ref={elecRef} className="line-electric" />
        <text ref={thLabel} className="line-label thermal" x={L + PW + 6} y={T}>
          ── ısıl güç
        </text>
        <text ref={elLabel} className="line-label electric" x={L + PW + 6} y={T + PH * 0.67}>
          - - elektrik
        </text>
      </svg>
      <p className="chart-note">Temsili eğitim modeli; doğrulanmış bir reaktör dinamiği modeli değildir. Duraklatınca grafik zamanı da durur; hız ayarı simülasyon zamanını hızlandırır.</p>
    </div>
  );
}
