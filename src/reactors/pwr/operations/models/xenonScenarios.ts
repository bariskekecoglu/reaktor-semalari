/**
 * Ksenon laboratuvarı senaryoları ve grafik olayları.
 * Olaylar kararlı kimlik taşır; grafik, asistan ve tahmin dersi aynı tanımları kullanır.
 *
 * Olay türü (arayüzde ayrı biçimde gösterilir):
 * - 'figure': kaynaktaki şekilden okunan bir an (ör. Şekil 2-40 profilindeki rampa, Şekil 2-41 tepe zamanı).
 * - 'source': kaynak metninde/ekseninde doğrudan tanımlı an (ör. kapatma anı t = 0).
 * - 'model': temsili eğitim modelinden hesaplanan an (ör. modeldeki ksenon tepesi).
 */
import { FIG_2_40, FIG_2_41 } from '../data/figures';
import { demandAt } from './profile';
import { peakXenon, simulate, type Trajectory } from './xenon';

export type XenonLab = 'load' | 'shutdown';
export const SHUTDOWN_LEVELS = [25, 50, 75, 100] as const;
export type EventKind = 'figure' | 'source' | 'model';

export interface ChartEvent {
  /** Kararlı kimlik: `xenon:<senaryo>:<anahtar>`. */
  id: string;
  key: string;
  t: number;
  title: string;
  /** Kısa neden-sonuç açıklaması. */
  text: string;
  kind: EventKind;
  /** Kaynak kimlikleri (src/knowledge/sources.ts). */
  sourceIds: string[];
  /** İlgili PWR ekipmanı / konu kimlikleri. */
  related: string[];
}

export interface XenonScenario {
  id: string;
  lab: XenonLab;
  key: string;
  title: string;
  hours: number;
  tr: Trajectory;
  events: ChartEvent[];
  note?: string;
  priorPower?: number;
}

const f1 = (v: number) => v.toLocaleString('tr-TR', { maximumFractionDigits: 1, minimumFractionDigits: 1 });

/** Şekil 2-41 eğrisinde en negatif değerin (en büyük ksenon etkisi) okunduğu saat. */
export function figurePeakHour(level: (typeof SHUTDOWN_LEVELS)[number]): number {
  const pts = FIG_2_41[String(level) as '25'];
  let best = pts[0];
  for (const p of pts) if (p[1] < best[1]) best = p;
  return best[0];
}

export function scenarioId(lab: XenonLab, key: string): string {
  return lab === 'load' ? `load-${key}` : `shut-${key}`;
}

const cache = new Map<string, XenonScenario>();

export function buildScenario(lab: XenonLab, key: string): XenonScenario {
  const id = scenarioId(lab, key);
  const hit = cache.get(id);
  if (hit) return hit;
  const sc = lab === 'load' ? buildLoad(key) : buildShutdown(key);
  cache.set(sc.id, sc);
  return sc;
}

function buildLoad(key: string): XenonScenario {
  const p = FIG_2_40.find((x) => x.id === key) ?? FIG_2_40[0];
  const id = scenarioId('load', p.id);
  const tr = simulate({ hours: 24, demand: (t) => demandAt(p, t), initialPower: 100, lag: 0.25 });
  const events: ChartEvent[] = [];
  const pts = p.points;
  let n = 0;
  for (let i = 0; i < pts.length - 1; i++) {
    const [t0, v0] = pts[i];
    const [t1, v1] = pts[i + 1];
    if (v0 === v1) continue;
    n++;
    const down = v1 < v0;
    const common = { kind: 'figure' as const, sourceIds: ['fig-2-40', 'p-2-94'], related: ['rods', 'vessel'] };
    if (t0 === t1) {
      events.push({
        ...common,
        id: `xenon:${id}:step-${n}`,
        key: `step-${n}`,
        t: t0,
        title: `%${v0} → %${v1} (dikey geçiş)`,
        text: `Şekil 2-40’ta bu geçiş dikey çizilmiştir (idealize). ${down ? 'Güç düşünce ksenonun nötronla tüketimi azalır; iyottan gelen üretim sürdüğü için ksenon birkaç saat artar.' : 'Güç artınca ksenon nötronla daha hızlı tüketilir; ksenon önce azalır.'}`,
      });
    } else {
      events.push({
        ...common,
        id: `xenon:${id}:ramp-${n}-start`,
        key: `ramp-${n}-start`,
        t: t0,
        title: `${down ? 'Güç azaltma' : 'Güç artırma'} başlıyor (%${v0} → %${v1})`,
        text: down
          ? 'İstenen güç düşmeye başlar. Ksenonun tüketimi güçle azaldığı, iyot ise önceki güçte birikmiş olduğu için ksenon etkisi takip eden saatlerde büyür.'
          : 'İstenen güç artmaya başlar. Nötron akısı arttıkça ksenon daha hızlı tüketilir; ksenon etkisi önce azalır, sonra yeni dengeye yönelir.',
      });
      events.push({
        ...common,
        id: `xenon:${id}:ramp-${n}-end`,
        key: `ramp-${n}-end`,
        t: t1,
        title: `Rampa bitti: %${v1}`,
        text: 'İstenen güç yeni düzeyde sabitlenir; iyot ve ksenon bu güce ait dengeye saatler içinde yaklaşır (anında değil).',
      });
    }
  }
  const pk = peakXenon(tr);
  if (pk.t > 0.2 && pk.t < 23.8) {
    events.push({
      id: `xenon:${id}:peak-model`,
      key: 'peak-model',
      t: pk.t,
      title: `Modelde ksenon tepesi (${f1(pk.t)} sa)`,
      text: 'Temsili modelde ksenonun en yüksek olduğu an. Güç düşüşünden sonra iyottan gelen ksenon üretimi, tüketim ve bozunmayı geçtiği sürece ksenon artar; dengelendiği anda tepe oluşur.',
      kind: 'model',
      sourceIds: ['model-xenon', 'p-2-94'],
      related: ['vessel'],
    });
  }
  events.sort((a, b) => a.t - b.t);
  return { id, lab: 'load', key: p.id, title: p.label, hours: 24, tr, events, note: p.note };
}

function buildShutdown(key: string): XenonScenario {
  const level = (SHUTDOWN_LEVELS as readonly number[]).includes(Number(key)) ? (Number(key) as (typeof SHUTDOWN_LEVELS)[number]) : 100;
  const id = scenarioId('shutdown', String(level));
  const tr = simulate({ hours: 100, demand: (t) => (t <= 0 ? level : 0), initialPower: level, sample: 0.25 });
  const pk = peakXenon(tr);
  const figPk = figurePeakHour(level);
  const events: ChartEvent[] = [
    {
      id: `xenon:${id}:trip`,
      key: 'trip',
      t: 0,
      title: 'Kapatma (t = 0)',
      text: 'Fisyon gücü sıfıra iner; artık ısı sürer. Şekil 2-41’in yatay ekseni bu andan itibaren sayılır.',
      kind: 'source',
      sourceIds: ['fig-2-41', 'p-2-94'],
      related: ['rods', 'vessel'],
    },
    {
      id: `xenon:${id}:peak-figure`,
      key: 'peak-figure',
      t: figPk,
      title: `Kaynak eğrisinde tepe (~${f1(figPk)} sa)`,
      text: `Şekil 2-41’de %${level} güçten kapatma eğrisinin en negatif olduğu yaklaşık an (şekilden okunmuştur; ± okuma belirsizliği vardır).`,
      kind: 'figure',
      sourceIds: ['fig-2-41'],
      related: ['vessel'],
    },
    {
      id: `xenon:${id}:peak-model`,
      key: 'peak-model',
      t: pk.t,
      title: `Modelde ksenon tepesi (${f1(pk.t)} sa)`,
      text: 'Temsili modelde ksenonun en yüksek olduğu an. Kapatmadan sonra ksenon nötronla tüketilmez; önceki güçte birikmiş iyot bozunarak ksenon üretmeye devam eder. Üretim bozunmayı geçtiği sürece ksenon artar.',
      kind: 'model',
      sourceIds: ['model-xenon', 'p-2-94'],
      related: ['vessel'],
    },
    {
      id: `xenon:${id}:decay`,
      key: 'decay',
      t: Math.min(100, pk.t + 40),
      title: 'İyot tükendikçe ksenon azalıyor',
      text: 'İyot büyük ölçüde bozunduktan sonra ksenon üretimi kendi bozunmasının gerisinde kalır; ksenon ve negatif etkisi azalır.',
      kind: 'model',
      sourceIds: ['model-xenon', 'p-2-94'],
      related: ['vessel'],
    },
  ];
  events.sort((a, b) => a.t - b.t);
  return { id, lab: 'shutdown', key: String(level), title: `%${level} güçten kapatma`, hours: 100, tr, events, priorPower: level };
}

/** Tüm senaryoların anahtarları (asistan kimlik doğrulaması için). */
export function allScenarioKeys(): { lab: XenonLab; key: string }[] {
  return [...FIG_2_40.map((p) => ({ lab: 'load' as const, key: p.id })), ...SHUTDOWN_LEVELS.map((l) => ({ lab: 'shutdown' as const, key: String(l) }))];
}

/** Olay kimliğinden senaryo ve olay. Bilinmeyen kimlik için null. */
export function findChartEvent(eventId: string): { scenario: XenonScenario; event: ChartEvent } | null {
  const m = /^xenon:(load|shut)-([\w.-]+):([\w-]+)$/.exec(eventId);
  if (!m) return null;
  const lab: XenonLab = m[1] === 'load' ? 'load' : 'shutdown';
  if (!allScenarioKeys().some((s) => s.lab === lab && s.key === m[2])) return null;
  const scenario = buildScenario(lab, m[2]);
  const event = scenario.events.find((e) => e.id === eventId);
  return event ? { scenario, event } : null;
}
