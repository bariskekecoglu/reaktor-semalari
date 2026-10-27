import { useState } from 'react';
import { FIG_2_42, FIG_2_43 } from '../data/figures';
import { KAPPA, LAMBDA_X } from '../models/xenon';
import { axialOffset, deltaI, splitPower, topShareOfProfile } from '../models/axial';
import { ChartFrame, LegendItem, ModelNote, SourceTags, WhyBox, fmt } from './common';

const HEIGHTS = [0.05, 0.15, 0.25, 0.35, 0.45, 0.55, 0.65, 0.75, 0.85, 0.95];
/** Serbest örnek için temel biçim: Şekil 2-42a (0 sa) güç profili. */
const BASE = FIG_2_42[0].power;

function tiltedProfile(share: number): number[] {
  // Doğrusal eğim: üst pay istenen değere yaklaşana kadar ikiye bölme ile eğim bulunur.
  let lo = -1.9;
  let hi = 1.9;
  const make = (k: number) => BASE.map((v, i) => Math.max(0.02, v * (1 + k * (HEIGHTS[i] - 0.5))));
  for (let it = 0; it < 40; it++) {
    const mid = (lo + hi) / 2;
    if (topShareOfProfile(make(mid)) < share) lo = mid;
    else hi = mid;
  }
  return make((lo + hi) / 2);
}

/** Verilen güç dağılımı için temsili DENGE ksenonu: X ∝ P/(λX + κP), normalize. */
function eqXenon(power: number[]): number[] {
  const mean = power.reduce((a, b) => a + b, 0) / power.length;
  return power.map((p) => {
    const r = p / mean;
    return ((LAMBDA_X + KAPPA) * r) / (LAMBDA_X + KAPPA * r);
  });
}

export function AxialSection() {
  const [mode, setMode] = useState<'stops' | 'free'>('stops');
  const [stop, setStop] = useState(0);
  const [total, setTotal] = useState(100);
  const [share, setShare] = useState(0.5);

  const st = FIG_2_42[stop];
  const isStops = mode === 'stops';
  const powerProfile = isStops ? st.power : tiltedProfile(share);
  const xenonProfile = isStops ? st.xenon : eqXenon(powerProfile);
  // Toplam güç duraklardan bağımsız seçilir: Şekil 2-42 yalnız dağılımın biçimini verir; Şekil 2-40 ile
  // zaman başlangıçlarının eşleştiği kaynakta belirtilmediği için toplam güç o profilden türetilmez.
  const P = total;
  const topShare = topShareOfProfile(powerProfile);
  const halves = splitPower(P, topShare);
  const dI = deltaI(halves);
  const ao = axialOffset(halves);
  const target = FIG_2_43.targetAt(P);
  const inBand = Math.abs(dI - target) <= FIG_2_43.bandHalfWidth;

  // Çekirdek kesiti ölçüleri
  const top = 40;
  const bot = 340;
  const yAt = (h: number) => bot - h * (bot - top);
  // Biçim farkları okunabilsin diye eksen 0,2’den başlar (sıfır bastırılmış eksen; etiketlendi).
  const MIN_V = 0.2;
  const MAX_V = 1.3;
  const xAt = (v: number) => 250 + ((Math.min(MAX_V, Math.max(MIN_V, v)) - MIN_V) / (MAX_V - MIN_V)) * 230;
  const path = (vals: number[]) => vals.map((v, i) => `${i ? 'L' : 'M'}${xAt(v).toFixed(1)} ${yAt(HEIGHTS[i]).toFixed(1)}`).join(' ');

  return (
    <div className="ops-section">
      <div className="ops-vis">
        <div className="ops-pick" role="group" aria-label="Görünüm">
          <button type="button" aria-pressed={isStops} onClick={() => setMode('stops')}>
            Şekil 2-42 durakları (12-3-6-3)
          </button>
          <button type="button" aria-pressed={!isStops} onClick={() => setMode('free')}>
            Aynı toplam güçte farklı dağılım
          </button>
        </div>
        {isStops && (
          <div className="ops-pick small" role="group" aria-label="Zaman durağı">
            {FIG_2_42.map((s, i) => (
              <button key={s.hour} type="button" aria-pressed={i === stop} onClick={() => setStop(i)}>
                {s.hour} sa
              </button>
            ))}
          </div>
        )}
        <div className="ops-sliders">
          <label className="ops-range">
            <span>
              Toplam güç: <strong>%{total}</strong>
              {isStops && <span className="ops-small"> (duraktan bağımsız seçim)</span>}
            </span>
            <input type="range" min={0} max={100} step={5} value={total} onChange={(e) => setTotal(Number(e.target.value))} />
          </label>
          {!isStops && (
            <label className="ops-range">
              Üst yarının payı: <strong>%{Math.round(share * 100)}</strong>
              <input type="range" min={35} max={65} step={1} value={Math.round(share * 100)} onChange={(e) => setShare(Number(e.target.value) / 100)} />
            </label>
          )}
        </div>
        <div className="ops-axial-grid">
          <svg viewBox="0 0 500 380" className="ops-core" role="img" aria-label={`Dikey çekirdek kesiti: güç ve ksenon profilleri, ΔI ${fmt(dI)}`}>
            {/* Çekirdek */}
            <rect className="core-box" x="90" y={top} width="110" height={bot - top} />
            <rect className="core-top" x="90" y={top} width="110" height={(bot - top) / 2} />
            <line className="ops-mid" x1="70" x2="490" y1={yAt(0.5)} y2={yAt(0.5)} />
            <text className="ops-tick" x="488" y={yAt(0.5) - 6} textAnchor="end">
              orta düzlem
            </text>
            {[105, 125, 145, 165, 185].map((x) => (
              <line key={x} className="core-fuel" x1={x} x2={x} y1={top + 4} y2={bot - 4} />
            ))}
            {/* Çubuklar üstten girer; sokulma derinlikleri kaynakta verilmediği için yalnız giriş yönü gösterilir. */}
            {[115, 155, 175].map((x) => (
              <rect key={x} className="rod-unknown" x={x - 2.5} y={top - 26} width="5" height="26" />
            ))}
            <text className="ops-tick" x="206" y={top - 12}>
              çubuklar üstten girer · konum kaynakta yok
            </text>
            {/* Soğuk su alttan */}
            <path className="core-inlet" d={`M145 ${bot + 30} V${bot + 4}`} markerEnd="url(#ax-arrow)" />
            <defs>
              <marker id="ax-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M0 0 L10 5 L0 10 z" className="core-inlet-head" />
              </marker>
            </defs>
            <text className="ops-tick" x="150" y={bot + 28}>
              daha soğuk su alttan girer
            </text>
            {/* Dedektörler */}
            <rect className="det" x="40" y={yAt(0.75) - 30} width="18" height="60" />
            <rect className="det" x="40" y={yAt(0.25) - 30} width="18" height="60" />
            <rect className="det-sig" x="62" y={yAt(0.75) - 30 + 60 * (1 - Math.min(1, halves.top / 60))} width="10" height={60 * Math.min(1, halves.top / 60)} />
            <rect className="det-sig" x="62" y={yAt(0.25) - 30 + 60 * (1 - Math.min(1, halves.bottom / 60))} width="10" height={60 * Math.min(1, halves.bottom / 60)} />
            <text className="ops-tick" x="4" y={yAt(0.75) - 36}>
              üst dedektör
            </text>
            <text className="ops-tick" x="4" y={yAt(0.25) + 46}>
              alt dedektör
            </text>
            {/* Profiller: aynı yükseklik ekseni */}
            <line className="ops-axis" x1="250" x2="250" y1={top} y2={bot} />
            <text className="ops-tick" x="250" y={top - 8}>
              göreli genlik (eksen 0,2’den başlar) →
            </text>
            <path className="ops-line power" d={path(powerProfile)} />
            <path className="ops-line xenon" d={path(xenonProfile)} />
            <text className="ops-tick" x="250" y={bot + 16} textAnchor="middle">
              0,2
            </text>
            <text className="ops-tick" x={xAt(0.6)} y={bot + 16} textAnchor="middle">
              0,6
            </text>
            <text className="ops-tick" x={xAt(1)} y={bot + 16} textAnchor="middle">
              1
            </text>
            <text className="ops-axis-label" x="230" y={top + 4} textAnchor="end">
              üst
            </text>
            <text className="ops-axis-label" x="230" y={bot} textAnchor="end">
              alt
            </text>
          </svg>
          <ChartFrame
            width={420}
            height={380}
            x={{ min: -40, max: 40, ticks: [-40, -20, 0, 20, 40], label: 'Eksenel akı farkı ΔI (% tam güç)' }}
            y={{ min: 0, max: 100, ticks: [0, 25, 50, 75, 100], label: 'Güç (%)' }}
            title="Şekil 2-43’e göre güç–ΔI düzlemi"
            desc="Temsili eğitim bandı ve geçerli nokta"
            margin={{ l: 52, r: 12, t: 26, b: 46 }}
          >
            {(s) => (
              <>
                <polygon
                  className="ops-band"
                  points={[0, 100]
                    .map((p) => `${s.x(FIG_2_43.targetAt(p) - FIG_2_43.bandHalfWidth)},${s.y(p)}`)
                    .concat([100, 0].map((p) => `${s.x(FIG_2_43.targetAt(p) + FIG_2_43.bandHalfWidth)},${s.y(p)}`))
                    .join(' ')}
                />
                <line className="ops-target" x1={s.x(FIG_2_43.targetAt(0))} y1={s.y(0)} x2={s.x(FIG_2_43.targetAt(100))} y2={s.y(100)} />
                <polyline className="ops-envelope" points={FIG_2_43.outerEnvelope.map(([a, b]) => `${s.x(a)},${s.y(b)}`).join(' ')} />
                <circle className={`ops-point${inBand ? '' : ' out'}`} cx={s.x(Math.max(-40, Math.min(40, dI)))} cy={s.y(P)} r={7} />
              </>
            )}
          </ChartFrame>
        </div>
        <ul className="ops-legend">
          <LegendItem cls="ops-line power" label="Güç profili" />
          <LegendItem cls="ops-line xenon" label={isStops ? 'Ksenon profili' : 'Temsili denge ksenonu'} />
          <LegendItem cls="ops-band-line" label="Temsili eğitim bandı (hedef ±6)" />
          <LegendItem cls="ops-target" label="Hedef ΔI (Typical Target Value)" />
          <LegendItem cls="ops-envelope" label="Şekildeki dış kesik-noktalı çizgi (kaynakta adı verilmemiş)" />
        </ul>
        <dl className="ops-readouts">
          <div>
            <dt>Toplam güç</dt>
            <dd>%{fmt(P, 0)}</dd>
          </div>
          <div>
            <dt>Üst yarı</dt>
            <dd>%{fmt(halves.top)}</dd>
          </div>
          <div>
            <dt>Alt yarı</dt>
            <dd>%{fmt(halves.bottom)}</dd>
          </div>
          <div>
            <dt>ΔI = üst − alt</dt>
            <dd>
              {dI > 0 ? '+' : ''}
              {fmt(dI)} (% tam güç)
            </dd>
          </div>
          <div>
            <dt>AO = (üst − alt)/(üst + alt)</dt>
            <dd>{P > 0 ? fmt(ao, 3) : '— (güç sıfır)'}</dd>
          </div>
          <div>
            <dt>Temsili eğitim bandı</dt>
            <dd>{P > 0 ? (inBand ? 'içinde' : 'dışında') : '—'}</dd>
          </div>
        </dl>
      </div>
      <div className="ops-text">
        <h3>{isStops ? `Eksenel güç dağılımı: ${st.label}` : 'Aynı toplam güçte farklı eksenel dağılım'}</h3>
        <WhyBox>
          {isStops
            ? st.why
            : `Toplam güç %${total} sabitken üst yarının payını değiştirmek ΔI’yı değiştirir: üst pay arttıkça ΔI pozitife, azaldıkça negatife gider. Toplam güç aynı kalsa da dağılım farklı olabilir; bu yüzden ΔI ayrıca izlenir.`}
        </WhyBox>
        <p>
          Kaynak 2-96 – 2-97: tek geçişli akışta çekirdeğin altı daha soğuk ve yoğun sudur; daha fazla nötron yavaşlar ve alt bölgede güç artar. Çubuklar üstten girdiğinde üstteki nötronları
          azaltır ve gücü aşağı iter. Aşağıda artan güç zamanla orada daha fazla ksenon üretir; bu ksenon sonradan alt akıyı düşürüp gücü yukarı kaydırabilir.
        </p>
        <p>
          <strong>ΔI</strong>: üst dedektör çıkışından alt dedektör çıkışı çıkarılır ve tam gücün yüzdesi olarak gösterilir (2-98). Pozitif ΔI → üst yarı fazla; negatif ΔI → alt yarı fazla.{' '}
          <strong>AO</strong> ise farkı o anki toplam güce böler; ΔI ile aynı şey değildir.
        </p>
        <ModelNote>
          Temsili eğitim modeli. Profiller Şekil 2-42’den yaklaşık okunmuştur (genlik birimsiz, yalnız biçim). Dedektör sinyallerinin yarı çekirdek gücüyle orantılı olduğu varsayıldı. Toplam güç duraklardan
          bağımsız seçilir: kaynak, Şekil 2-42’nin saatlerinin Şekil 2-40’taki 12-3-6-3 profiliyle aynı başlangıçtan sayıldığını belirtmez. Kontrol çubuklarının bu saatlerdeki konumu
          kaynakta verilmez; şema yalnız üstten giriş yönünü gösterir. Bant, Şekil 2-43’ten yaklaşık okunmuştur; bandın içinde olmak gerçek bir santral için güvenlik onayı anlamına gelmez.
        </ModelNote>
        {isStops && (
          <p className="ops-small">
            Şekil 2-42’de bu panelin yanında “D” ve “C” etiketli koyu çubuklar var (göreli uzunluk: D {st.barD === null ? 'yok' : `≈%${Math.round(st.barD * 100)}`} · C{' '}
            {st.barC === null ? 'yok' : `≈%${Math.round(st.barC * 100)}`}). Anlamları kaynakta açıklanmadığı için çubuk konumuna çevrilmedi.
          </p>
        )}
        <SourceTags
          sources={[
            { kind: 'figure', ref: 'Şekil 2-42, s. 2-100' },
            { kind: 'figure', ref: 'Şekil 2-43, s. 2-101' },
            { kind: 'pdf', ref: 's. 2-96 – 2-98' },
            { kind: 'model', ref: 'ΔI/AO hesabı ve denge ksenonu (temsili)' },
          ]}
        />
      </div>
    </div>
  );
}
