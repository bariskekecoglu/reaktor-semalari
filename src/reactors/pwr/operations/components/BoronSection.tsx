import { useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';
import { FIG_2_39 } from '../data/figures';
import { ChartFrame, LegendItem, ModelNote, SourceTags, WhyBox, linePath } from './common';

const W = 720;
const H = 360;
const END = FIG_2_39[FIG_2_39.length - 1][0];

/** Şekilden okunan noktalar arasında doğrusal ara değer. */
function boronAt(b: number): number {
  const p = FIG_2_39;
  if (b <= p[0][0]) return p[0][1];
  for (let i = 1; i < p.length; i++) {
    if (b <= p[i][0]) {
      const f = (b - p[i - 1][0]) / (p[i][0] - p[i - 1][0]);
      return p[i - 1][1] + f * (p[i][1] - p[i - 1][1]);
    }
  }
  return p[p.length - 1][1];
}

interface Zone {
  from: number;
  to: number;
  title: string;
  text: string;
  kind: 'pdf' | 'interp';
}

const ZONES: Zone[] = [
  {
    from: 0,
    to: 400,
    title: 'Çevrim başı: ksenon birikimi',
    text: 'Kaynak 2-93: bordaki ilk keskin düşüş çevrim başında ksenon oluşmasından kaynaklanır. Ksenon negatif reaktivite ekler; dengeyi korumak için bor azaltılır.',
    kind: 'pdf',
  },
  {
    from: 400,
    to: 2000,
    title: 'Küçük toparlanma',
    text: 'Ksenon dengeye ulaştıktan sonra şekilde bor bir süre hafifçe artıyor. Kaynak yanabilir soğurucu tükenmesinin pozitif reaktivite eklediğini söyler; bu bölgede bu etkinin yakıt tüketiminin negatif etkisinden ağır basması olası bir yorumdur — kaynak bu toparlanmayı ayrıca açıklamaz.',
    kind: 'interp',
  },
  {
    from: 2000,
    to: END - 900,
    title: 'Yakıt tüketimi baskın',
    text: 'Kaynak 2-93: ksenon dengedeyken bor seyreltmesi yakıt ve yanabilir soğurucu tükenmesine göre ayarlanır. Yakıt tükenmesi negatif reaktivitedir; bunu karşılamak için bor sürekli azaltılır.',
    kind: 'pdf',
  },
  {
    from: END - 900,
    to: END + 1,
    title: 'Çevrim sonu',
    text: 'Kaynak 2-93: çevrim esasen bor sıfıra indiğinde biter; çevrim uzunluğu, bor sıfırda (ya da sıfıra 100 ppm yakınken) ulaşılan yanma miktarıdır.',
    kind: 'pdf',
  },
];

export function BoronSection() {
  const [b, setB] = useState(5000);
  const svgWrap = useRef<HTMLDivElement>(null);
  const ppm = boronAt(b);
  const zone = ZONES.find((z) => b >= z.from && b < z.to) ?? ZONES[ZONES.length - 1];

  const x = { min: 0, max: 24000, ticks: [0, 5000, 10000, 15000, 20000], label: 'Yakıt yanması, burn-up (MWD/MTU)', format: (v: number) => v.toLocaleString('tr-TR') };
  const y = { min: 0, max: 2500, ticks: [0, 500, 1000, 1500, 2000, 2500], label: 'Bor konsantrasyonu (ppm)' };

  const onPointer = (e: PointerEvent<HTMLDivElement>) => {
    if (e.type === 'pointermove' && e.buttons === 0 && e.pointerType !== 'mouse') return;
    const svg = svgWrap.current?.querySelector('svg');
    if (!svg) return;
    const r = svg.getBoundingClientRect();
    const vx = ((e.clientX - r.left) / r.width) * W;
    const v = ((vx - 62) / (W - 16 - 62)) * 24000;
    setB(Math.round(Math.min(END, Math.max(0, v)) / 50) * 50);
  };
  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const step = e.shiftKey ? 2000 : 250;
    if (e.key === 'ArrowRight') setB((v) => Math.min(END, v + step));
    else if (e.key === 'ArrowLeft') setB((v) => Math.max(0, v - step));
    else if (e.key === 'Home') setB(0);
    else if (e.key === 'End') setB(END);
    else return;
    e.preventDefault();
  };

  return (
    <div className="ops-section">
      <div className="ops-vis">
        <div
          ref={svgWrap}
          className="ops-chart-wrap interactive"
          tabIndex={0}
          role="slider"
          aria-label="Yakıt yanması (MWD/MTU)"
          aria-valuemin={0}
          aria-valuemax={END}
          aria-valuenow={b}
          aria-valuetext={`${b.toLocaleString('tr-TR')} MWD/MTU, yaklaşık ${Math.round(ppm)} ppm bor`}
          onKeyDown={onKey}
          onPointerDown={onPointer}
          onPointerMove={onPointer}
        >
          <ChartFrame width={W} height={H} x={x} y={y} title="Şekil 2-39’a göre bor seyreltme eğrisi (%100 güç)" desc="Şekilden yaklaşık okunmuş noktalar">
            {(s) => (
              <>
                {ZONES.map((z, i) => (
                  <rect
                    key={z.title}
                    className={`ops-zone z${i}${z === zone ? ' on' : ''}`}
                    x={s.x(z.from)}
                    y={s.top}
                    width={Math.max(0, s.x(Math.min(z.to, END)) - s.x(z.from))}
                    height={s.bottom - s.top}
                  />
                ))}
                <path className="ops-line boron" d={linePath(FIG_2_39, s)} />
                {FIG_2_39.map(([bx, by]) => (
                  <circle key={bx} className="ops-pt" cx={s.x(bx)} cy={s.y(by)} r={2} />
                ))}
                <line className="ops-cursor" x1={s.x(b)} x2={s.x(b)} y1={s.top} y2={s.bottom} />
                <circle className="ops-cursor-dot" cx={s.x(b)} cy={s.y(ppm)} r={6} />
                <text className="ops-cursor-label" x={Math.min(s.x(b) + 8, W - 190)} y={s.y(ppm) - 10}>
                  {b.toLocaleString('tr-TR')} MWD/MTU · ≈{Math.round(ppm)} ppm
                </text>
              </>
            )}
          </ChartFrame>
        </div>
        <ul className="ops-legend">
          <LegendItem cls="ops-line boron" label="Şekil 2-39’dan okunan eğri (noktalar: okunan değerler)" />
        </ul>
        <p className="ops-small">Eğri üzerinde gezinmek için tıklayın/sürükleyin ya da odaklanıp ←/→ (Shift ile büyük adım), Home/End tuşlarını kullanın.</p>
        <label className="ops-range">
          Yanma: {b.toLocaleString('tr-TR')} MWD/MTU
          <input type="range" min={0} max={END} step={50} value={b} onChange={(e) => setB(Number(e.target.value))} />
        </label>
      </div>
      <div className="ops-text">
        <h3>Bor ve yakıt çevrimi</h3>
        <p>
          Yatay eksen <strong>yakıt yanmasıdır</strong> (burn-up, MWD/MTU: metrik ton uranyum başına megavat-gün); zaman değildir. Dikey eksen soğutucudaki bor konsantrasyonudur (ppm). Bor
          nötron soğurur; çekirdeğin fazla reaktivitesini dengelemek için kullanılır.
        </p>
        <WhyBox>
          <strong>{zone.title}.</strong> {zone.text}
          {zone.kind === 'interp' && <span className="ops-tag-interp"> (yorum)</span>}
        </WhyBox>
        <p className="ops-small">
          Bor azalması her koşulda güç artışı demek değildir: bu eğri %100 güçte, çevrim boyunca reaktiviteyi dengelemek için gereken bor miktarını gösterir.
        </p>
        <ModelNote>
          Şekilden yaklaşık okunmuş: noktalar PDF’teki vektör çizimin koordinatlarından eksen ölçeğine çevrildi; kaynakta sayısal tablo yoktur. Ara değerler doğrusal ara değerlemedir.
          Ekrandaki ppm değerleri ölçüm veya hesap sonucu değildir.
        </ModelNote>
        <SourceTags
          sources={[
            { kind: 'figure', ref: 'Şekil 2-39, s. 2-94' },
            { kind: 'pdf', ref: 's. 2-93 (eğrinin açıklaması)' },
          ]}
        />
      </div>
    </div>
  );
}
