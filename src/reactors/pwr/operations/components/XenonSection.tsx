import { useMemo, useRef, useState } from 'react';
import { useSimulation, useTick } from '../../../../hooks/useSimulation';
import { FIG_2_40, FIG_2_41 } from '../data/figures';
import { demandAt, profileEvents } from '../models/profile';
import { decayHeatFraction, indexAt, peakXenon, simulate, type Trajectory } from '../models/xenon';
import { advance, createPlayback, resetPlayback, seek, togglePlay, type Playback } from '../models/playback';
import { ChartFrame, LegendItem, ModelNote, SourceTags, WhyBox, fmt, type AxisDef, type ChartScales } from './common';

type Lab = 'load' | 'shutdown';
const SHUTDOWN_LEVELS = [25, 50, 75, 100] as const;
const W = 720;
const H = 230;

interface Scenario {
  id: string;
  lab: Lab;
  title: string;
  hours: number;
  tr: Trajectory;
  events: { t: number; text: string }[];
  note?: string;
  priorPower?: number;
}

function buildScenario(lab: Lab, key: string): Scenario {
  if (lab === 'load') {
    const p = FIG_2_40.find((x) => x.id === key) ?? FIG_2_40[0];
    const tr = simulate({ hours: 24, demand: (t) => demandAt(p, t), initialPower: 100, lag: 0.25 });
    const pk = peakXenon(tr);
    const events = [...profileEvents(p)];
    if (pk.t > 0.2 && pk.t < 23.8) events.push({ t: pk.t, text: `Modelde ksenon tepesi (${fmt(pk.t)} sa)` });
    events.sort((a, b) => a.t - b.t);
    return { id: `load-${p.id}`, lab, title: p.label, hours: 24, tr, events, note: p.note };
  }
  const p0 = Number(key);
  const tr = simulate({ hours: 100, demand: (t) => (t <= 0 ? p0 : 0), initialPower: p0, sample: 0.25 });
  const pk = peakXenon(tr);
  return {
    id: `shut-${p0}`,
    lab,
    title: `%${p0} güçten kapatma`,
    hours: 100,
    tr,
    priorPower: p0,
    events: [
      { t: 0, text: 'Kapatma: fisyon gücü sıfıra iner; artık ısı sürer' },
      { t: pk.t, text: `Modelde ksenon tepesi (${fmt(pk.t)} sa)` },
      { t: Math.min(100, pk.t + 40), text: 'İyot tükendikçe ksenon bozunarak azalıyor' },
    ],
  };
}

function seriesPath(tr: Trajectory, values: Float64Array, s: ChartScales, upTo?: number): string {
  let d = '';
  const n = upTo === undefined ? values.length : Math.min(values.length, upTo + 1);
  for (let i = 0; i < n; i++) d += `${i ? 'L' : 'M'}${s.x(tr.t[i]).toFixed(1)} ${s.y(values[i]).toFixed(1)}`;
  return d;
}

export function XenonSection() {
  const { clock } = useSimulation();
  const [lab, setLab] = useState<Lab>('load');
  const [key, setKey] = useState('12-3-6-3');
  const sc = useMemo(() => buildScenario(lab, key), [lab, key]);
  const [pb, setPb] = useState<Playback>(() => createPlayback(24));
  const pbRef = useRef(pb);
  pbRef.current = pb;

  // Ortak saatten beslenir; yalnız oynatılırken durum güncellenir (paralel rAF döngüsü yok).
  const sinceRender = useRef(0);
  useTick((dt) => {
    if (!pbRef.current.playing || dt <= 0) return;
    const next = advance(pbRef.current, dt);
    pbRef.current = next;
    // Ekran güncellemesi ~15 Hz ile sınırlı; senaryo saati her karede doğru ilerler.
    sinceRender.current += dt;
    if (sinceRender.current >= 1 / 15 || !next.playing) {
      sinceRender.current = 0;
      setPb(next);
    }
  });

  const choose = (nextLab: Lab, nextKey: string) => {
    setLab(nextLab);
    setKey(nextKey);
    // Senaryo değişince saat, seçim ve grafik başa döner.
    const fresh = createPlayback(nextLab === 'load' ? 24 : 100, nextLab === 'load' ? 1 : 4);
    pbRef.current = fresh;
    setPb(fresh);
  };

  const play = () => {
    if (!clock.playing) clock.play();
    setPb((p) => togglePlay(p));
  };

  const rates = lab === 'load' ? [0.5, 1, 2, 4] : [2, 4, 8, 16];
  const i = indexAt(sc.tr, pb.t);
  const tr = sc.tr;
  const xAxis: AxisDef =
    lab === 'load'
      ? { min: 0, max: 24, ticks: [0, 3, 6, 9, 12, 15, 18, 21, 24], label: 'Senaryo saati (sa)' }
      : { min: 0, max: 100, ticks: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100], label: 'Kapatmadan sonra geçen süre (sa)' };
  const decayNow = lab === 'shutdown' ? decayHeatFraction(Math.max(pb.t, 1 / 3600)) * (sc.priorPower ?? 100) : 0;

  const cursor = (s: ChartScales) => <line className="ops-cursor" x1={s.x(pb.t)} x2={s.x(pb.t)} y1={s.top} y2={s.bottom} />;
  const eventMarks = (s: ChartScales) =>
    sc.events.map((e, k) => <line key={k} className="ops-event" x1={s.x(e.t)} x2={s.x(e.t)} y1={s.top} y2={s.bottom} />);

  // Kapatma senaryosunda artık ısı eğrisi (güç grafiğinde ayrı çizgi).
  const decaySeries = useMemo(() => {
    if (lab !== 'shutdown') return null;
    const arr = new Float64Array(tr.t.length);
    for (let k = 0; k < arr.length; k++) arr[k] = decayHeatFraction(Math.max(tr.t[k], 1 / 3600)) * (sc.priorPower ?? 100);
    return arr;
  }, [lab, tr, sc.priorPower]);

  const maxX = Math.max(1.6, ...Array.from(tr.xenon)) * 1.05;
  const yX: AxisDef = { min: 0, max: Math.ceil(maxX * 5) / 5, ticks: [0, 0.5, 1, 1.5, 2].filter((v) => v <= Math.ceil(maxX * 5) / 5), label: 'normalize (%100 denge = 1)', format: (v) => fmt(v) };
  const yW: AxisDef = { min: -yX.max, max: 0, ticks: [0, -0.5, -1, -1.5, -2].filter((v) => v >= -yX.max), label: 'göreli ksenon etkisi', format: (v) => fmt(v) };

  return (
    <div className="ops-section xenon">
      <div className="ops-vis">
        <div className="ops-pick" role="group" aria-label="Senaryo türü">
          <button type="button" aria-pressed={lab === 'load'} onClick={() => choose('load', '12-3-6-3')}>
            Yük takibi (24 sa)
          </button>
          <button type="button" aria-pressed={lab === 'shutdown'} onClick={() => choose('shutdown', '100')}>
            Kapatma sonrası (100 sa)
          </button>
        </div>
        <div className="ops-pick small" role="group" aria-label="Senaryo seçimi">
          {lab === 'load'
            ? FIG_2_40.map((p) => (
                <button key={p.id} type="button" aria-pressed={key === p.id} onClick={() => choose('load', p.id)}>
                  {p.label}
                </button>
              ))
            : SHUTDOWN_LEVELS.map((l) => (
                <button key={l} type="button" aria-pressed={key === String(l)} onClick={() => choose('shutdown', String(l))}>
                  Önceki güç %{l}
                </button>
              ))}
        </div>

        <div className="ops-transport" role="group" aria-label="Zaman kontrolleri">
          <button type="button" className="primary" aria-pressed={pb.playing} onClick={play}>
            {pb.playing ? '❚❚ Duraklat' : '▶ Oynat'}
          </button>
          <button type="button" onClick={() => setPb((p) => resetPlayback(p))}>
            ↺ Sıfırla
          </button>
          <button type="button" onClick={() => setPb((p) => seek(p, p.t - (lab === 'load' ? 0.5 : 2)))} aria-label="Geri">
            ◀
          </button>
          <button type="button" onClick={() => setPb((p) => seek(p, p.t + (lab === 'load' ? 0.5 : 2)))} aria-label="İleri">
            ▶▏
          </button>
          <label className="ops-range grow">
            <span>
              Senaryo saati: <strong>{fmt(pb.t)} sa</strong>
            </span>
            <input
              type="range"
              min={0}
              max={sc.hours}
              step={lab === 'load' ? 0.1 : 0.25}
              value={pb.t}
              onChange={(e) => setPb((p) => seek({ ...p, playing: false }, Number(e.target.value)))}
              aria-valuetext={`${fmt(pb.t)} saat`}
            />
          </label>
          <label className="ops-select">
            Gösterim hızı
            <select value={pb.rate} onChange={(e) => setPb((p) => ({ ...p, rate: Number(e.target.value) }))}>
              {rates.map((r) => (
                <option key={r} value={r}>
                  {fmt(r, r < 1 ? 1 : 0)} sa / sim. saniye
                </option>
              ))}
            </select>
          </label>
        </div>
        <p className="ops-small">
          Üç ayrı zaman: <strong>senaryo saati</strong> fiziksel olayların saati; <strong>gösterim hızı</strong> bir simülasyon saniyesinde ilerleyen senaryo saati; animasyonu uygulamanın
          ortak simülasyon saati sürer (sayfadaki 60 saniyelik grafikten bağımsızdır).
        </p>

        <ChartFrame
          width={W}
          height={H}
          x={xAxis}
          y={{ min: 0, max: 110, ticks: [0, 25, 50, 75, 100], label: 'güç (% nominal)' }}
          title={lab === 'load' ? 'A. İstenen güç ve temsili gerçekleşen güç' : 'A. Fisyon gücü ve artık ısı'}
          desc="Güç zaman grafiği"
        >
          {(s) => (
            <>
              {eventMarks(s)}
              {lab === 'load' && <path className="ops-line demand" d={seriesPath(tr, tr.demand, s)} />}
              <path className="ops-line power" d={seriesPath(tr, tr.power, s)} />
              {decaySeries && <path className="ops-line decay" d={seriesPath(tr, decaySeries, s)} />}
              {cursor(s)}
            </>
          )}
        </ChartFrame>
        <ul className="ops-legend">
          {lab === 'load' && <LegendItem cls="ops-line demand" label="İstenen güç (Şekil 2-40’tan okunan profil)" />}
          <LegendItem cls="ops-line power" label={lab === 'load' ? 'Temsili gerçekleşen fisyon gücü (τ = 0,25 sa gecikmeli izleme)' : 'Fisyon gücü'} />
          {lab === 'shutdown' && <LegendItem cls="ops-line decay" label="Artık ısı (genel yaklaşık bağıntı; fisyondan ayrı)" />}
        </ul>

        <ChartFrame width={W} height={H} x={xAxis} y={yX} title="B. Normalize iyot-135 ve ksenon-135 (temsili model)" desc="İyot ve ksenon zaman grafiği">
          {(s) => (
            <>
              {eventMarks(s)}
              <path className="ops-line iodine" d={seriesPath(tr, tr.iodine, s)} />
              <path className="ops-line xenon" d={seriesPath(tr, tr.xenon, s)} />
              {cursor(s)}
            </>
          )}
        </ChartFrame>
        <ul className="ops-legend">
          <LegendItem cls="ops-line iodine" label="I-135 (kendi %100 dengesine göre)" />
          <LegendItem cls="ops-line xenon" label="Xe-135 (%100 denge = 1)" />
        </ul>

        <ChartFrame width={W} height={H} x={xAxis} y={yW} title="C. Ksenonun reaktivite etkisi (temsili: −Xe)" desc="Ksenon etkisi zaman grafiği; aşağı doğru daha negatif">
          {(s) => (
            <>
              {eventMarks(s)}
              <path className="ops-line worth" d={seriesPath(tr, tr.worth, s)} />
              {cursor(s)}
            </>
          )}
        </ChartFrame>
        <ul className="ops-legend">
          <LegendItem cls="ops-line worth" label="Göreli ksenon etkisi: aşağı = daha büyük negatif reaktivite (birimsiz; %100 denge = −1)" />
        </ul>

        {lab === 'shutdown' && (
          <>
            <ChartFrame
              width={W}
              height={260}
              x={xAxis}
              y={{ min: -5000, max: 0, ticks: [0, -1000, -2000, -3000, -4000, -5000], label: 'Worth (birim kaynakta yok)', format: (v) => v.toLocaleString('tr-TR') }}
              title="Kaynak: Şekil 2-41 “Xe Worth after Shutdown” (şekilden yaklaşık okunmuş)"
              desc="Dört önceki güç düzeyi için kaynak eğrileri"
            >
              {(s) => (
                <>
                  {SHUTDOWN_LEVELS.map((l) => (
                    <path
                      key={l}
                      className={`ops-line src src${l}${String(l) === key ? ' on' : ''}`}
                      d={FIG_2_41[String(l) as '25'].map(([t, v], k) => `${k ? 'L' : 'M'}${s.x(t).toFixed(1)} ${s.y(v).toFixed(1)}`).join(' ')}
                    />
                  ))}
                  {cursor(s)}
                </>
              )}
            </ChartFrame>
            <ul className="ops-legend">
              {SHUTDOWN_LEVELS.map((l) => (
                <LegendItem key={l} cls={`ops-line src src${l} on`} label={`%${l} güç${String(l) === key ? ' (seçili)' : ''}`} />
              ))}
            </ul>
          </>
        )}
      </div>

      <div className="ops-text">
        <h3>{lab === 'load' ? `Yük takibi: ${sc.title}` : sc.title}</h3>
        <dl className="ops-facts compact">
          <dt>Senaryo saati</dt>
          <dd>{fmt(pb.t)} sa</dd>
          <dt>{lab === 'load' ? 'İstenen / gerçekleşen güç' : 'Fisyon gücü / artık ısı'}</dt>
          <dd>{lab === 'load' ? `%${fmt(tr.demand[i], 0)} / %${fmt(tr.power[i], 0)}` : `%0 / ~%${fmt(decayNow, decayNow < 1 ? 2 : 1)} (önceki güce göre)`}</dd>
          <dt>Ksenon (normalize)</dt>
          <dd>{fmt(tr.xenon[i], 2)}</dd>
          <dt>Ksenon etkisi (göreli)</dt>
          <dd>{fmt(tr.worth[i], 2)}</dd>
        </dl>
        <h4>Olay işaretleri</h4>
        <ul className="ops-events">
          {sc.events.map((e, k) => (
            <li key={k}>
              <button type="button" onClick={() => setPb((p) => seek({ ...p, playing: false }, e.t))}>
                {fmt(e.t)} sa
              </button>{' '}
              {e.text}
            </li>
          ))}
        </ul>
        <WhyBox>
          Güç düştüğünde veya fisyon durduğunda ksenon etkisi hemen kaybolmaz. Ksenonun büyük kısmı iyot-135’in bozunmasıyla oluşur; iyot önceki güç düzeyinde birikmiştir. Düşük güçte
          nötronla ksenon tüketimi azalır. Bu yüzden ksenon önce artar (negatif reaktivite büyür), saatler sonra tepe yapar ve iyot tükendikçe azalır (kaynak 2-94). Yük takibinde bu ek negatif
          reaktivite bor seyreltmesiyle dengelenmelidir.
        </WhyBox>
        {sc.note && <p className="ops-warn">Profil notu: {sc.note}</p>}
        <ModelNote>
          Temsili eğitim modeli: dI/dt = a·P − λI·I; dX/dt = b·P + λI·I − λX·X − κ·P·X (saat, normalize). λI ve λX, I-135 (6,57 sa) ve Xe-135 (9,14 sa) yarı ömürlerinden alınan genel
          nükleer verilerdir (kaynakta yok). κ = 3·λX, Şekil 2-41’in tepe zamanlarına yaklaşık uyacak şekilde seçilmiş temsili bir katsayıdır; gerçek reaktör değeri değildir. Ksenon etkisi −Xe
          ile orantılı alınmıştır. Yük takibi günü %100 dengeden başlar. Şekil 2-41’in birimi kaynakta belirtilmediği için model eğrisi kaynak ölçeğine çevrilmedi.
        </ModelNote>
        <SourceTags
          sources={[
            { kind: 'figure', ref: 'Şekil 2-40, s. 2-95 (profiller)' },
            { kind: 'figure', ref: 'Şekil 2-41, s. 2-96 (Xe worth)' },
            { kind: 'pdf', ref: 's. 2-94 (yük takibi ve ksenon)' },
            { kind: 'model', ref: 'İyot/ksenon eğitim modeli' },
          ]}
        />
      </div>
    </div>
  );
}
