/**
 * Yapılandırılmış proje bilgi tabanı. Girdiler uygulamanın gerçek içeriğinden (reaktör yapılandırmaları,
 * dersler, işletme bölümleri, grafik olayları) üretilir; serbest metin uydurulmaz.
 * Erişim `KnowledgeSource` arayüzünün arkasındadır; ileride vektör araması gibi bir kaynak eklenebilir.
 */
import type { ReactorConfig, ReactorId, LessonStep } from '../reactors/shared/types';
import { pwrConfig } from '../reactors/pwr/pwrConfig';
import { bwrConfig } from '../reactors/bwr/bwrConfig';
import { vverConfig } from '../reactors/vver/vverConfig';
import { pwrLessons } from '../reactors/pwr/pwrLessons';
import { bwrLessons } from '../reactors/bwr/bwrLessons';
import { vverLessons } from '../reactors/vver/vverLessons';
import { OPS_SECTIONS } from '../reactors/pwr/operations/sections';
import { buildScenario, findChartEvent } from '../reactors/pwr/operations/models/xenonScenarios';
import { PREDICT_LESSONS } from '../lessons/predict/pwrXenonShutdown';
import type { ActionRegistry, AssistantAction } from '../assistant/actions';
import { isSourceId } from './sources';

export type EntryKind = 'reactor' | 'equipment' | 'focus' | 'topic' | 'lesson' | 'predict' | 'ops' | 'chartEvent';

export interface KnowledgeEntry {
  id: string;
  reactorId: ReactorId | null;
  kind: EntryKind;
  /** Türkçe ad. */
  name: string;
  /** Alternatif terimler (arama için). */
  aliases: string[];
  /** Kısa açıklama (kaynak içerikten). */
  summary: string;
  /** Ek ayrıntı (varsa). */
  body?: string;
  sourceIds: string[];
  /** İlgili ekipman / ders / konu kimlikleri. */
  related: string[];
  /** Uygulama içindeki hedef (gösterme işlemleri). */
  targets: AssistantAction[];
}

export interface KnowledgeSource {
  all(): readonly KnowledgeEntry[];
  get(id: string): KnowledgeEntry | undefined;
}

const CONFIGS: Record<ReactorId, ReactorConfig> = { pwr: pwrConfig, bwr: bwrConfig, vver: vverConfig };
const LESSONS: Record<ReactorId, LessonStep[]> = { pwr: pwrLessons, bwr: bwrLessons, vver: vverLessons };

/** Reaktöre göre dayanak kaynaklar (ekipman metinleri README’de bu kaynaklara dayandırılmıştır). */
const BASE_SOURCES: Record<ReactorId, string[]> = {
  pwr: ['nuce-ch2', 'nrc-unit3'],
  bwr: ['nuce-ch2', 'nrc-bwr'],
  vver: ['nuce-ch2', 'iaea-vver'],
};

/** Ekipman kimliklerine göre Türkçe/İngilizce alternatif terimler. */
const EQUIPMENT_ALIASES: Record<string, string[]> = {
  vessel: ['reaktör kabı', 'basınç kabı', 'kap', 'rpv'],
  rods: ['kontrol çubuğu', 'kontrol çubukları', 'çubuk'],
  pressurizer: ['basınçlandırıcı', 'pressurizer', 'basınç kontrolü'],
  sg: ['buhar üreteci', 'buhar jeneratörü', 'steam generator', 'u boru', 'dikey buhar üreteci'],
  hsg: ['buhar üreteci', 'yatay buhar üreteci', 'buhar jeneratörü', 'steam generator'],
  hotleg: ['sıcak kol', 'hot leg'],
  coldleg: ['soğuk kol', 'cold leg'],
  rcp: ['birincil pompa', 'soğutucu pompası', 'reaktör soğutucu pompası', 'pompa'],
  mcp: ['ana sirkülasyon pompası', 'birincil pompa', 'pompa'],
  steamline: ['ana buhar hattı', 'buhar hattı'],
  hp: ['yüksek basınç türbini', 'yb türbini', 'türbin'],
  lp: ['alçak basınç türbini', 'ab türbini', 'türbin'],
  gen: ['jeneratör', 'generatör', 'elektrik üretimi'],
  condenser: ['kondenser', 'yoğuşturucu', 'yoğuşma'],
  feedpump: ['besleme suyu pompası', 'besleme pompası'],
  heater: ['ön ısıtıcı', 'besleme suyu ısıtıcısı'],
  coolsource: ['soğutma suyu', 'soğutma kulesi'],
  containment: ['koruma yapısı', 'containment', 'koruma binası'],
  surge: ['dalgalanma hattı', 'surge hattı'],
  core: ['çekirdek', 'yakıt', 'kaynama'],
  separators: ['buhar ayırıcı', 'ayırıcı', 'siklon'],
  dryers: ['buhar kurutucu', 'kurutucu'],
  jetpumps: ['jet pompası', 'downcomer'],
  recirc: ['devridaim', 'resirkülasyon', 'devridaim pompası'],
  turbinebldg: ['türbin binası'],
  'collector-hot': ['sıcak kolektör', 'kolektör'],
  'collector-cold': ['soğuk kolektör', 'kolektör'],
};

const REACTOR_ALIASES: Record<ReactorId, string[]> = {
  pwr: ['pwr', 'basınçlı su reaktörü'],
  bwr: ['bwr', 'kaynar su reaktörü', 'kaynayan su reaktörü'],
  vver: ['vver', 'wwer', 'rus tasarımı'],
};

function build(): KnowledgeEntry[] {
  const out: KnowledgeEntry[] = [];
  for (const r of Object.keys(CONFIGS) as ReactorId[]) {
    const c = CONFIGS[r];
    out.push({
      id: r,
      reactorId: r,
      kind: 'reactor',
      name: c.fullName,
      aliases: REACTOR_ALIASES[r],
      summary: c.summary,
      sourceIds: BASE_SOURCES[r],
      related: [],
      targets: [{ type: 'openReactor', reactor: r }],
    });
    for (const comp of c.components) {
      const targets: AssistantAction[] = [{ type: 'selectEquipment', reactor: r, equipmentId: comp.id }];
      if (comp.detail) targets.push({ type: 'openDetail', reactor: r, detail: comp.detail });
      out.push({
        id: `${r}.${comp.id}`,
        reactorId: r,
        kind: 'equipment',
        name: comp.name,
        aliases: [comp.name, ...(EQUIPMENT_ALIASES[comp.id] ?? [])],
        summary: comp.role,
        body: comp.how,
        sourceIds: BASE_SOURCES[r],
        related: comp.related.filter((x) => !x.startsWith('f-')).map((x) => `${r}.${x}`),
        targets,
      });
    }
    for (const f of c.focusActions) {
      const targets: AssistantAction[] = [{ type: 'highlightFlow', reactor: r, ids: f.highlight, label: f.label }];
      if (f.detail) targets.push({ type: 'openDetail', reactor: r, detail: f.detail });
      out.push({
        id: `${r}.focus.${f.id}`,
        reactorId: r,
        kind: 'focus',
        name: f.label,
        aliases: [f.label],
        summary: f.text,
        sourceIds: BASE_SOURCES[r],
        related: f.highlight.filter((x) => !x.startsWith('f-')).map((x) => `${r}.${x}`),
        targets,
      });
    }
    for (const l of LESSONS[r]) {
      out.push({
        id: l.id,
        reactorId: r,
        kind: 'lesson',
        name: `${c.shortName} anlatımı · ${l.title}`,
        aliases: [l.title.replace(/^\d+\.\s*/, '')],
        summary: l.text,
        sourceIds: BASE_SOURCES[r],
        related: [],
        targets: [{ type: 'openLesson', lessonId: l.id }],
      });
    }
  }

  // Kaynaklı ek konular (kaynak metinde doğrudan geçen ayrımlar).
  out.push({
    id: 'bwr.topic.no-sg',
    reactorId: 'bwr',
    kind: 'topic',
    name: 'BWR’de buhar üreteci ve basınçlandırıcı yoktur',
    aliases: ['buhar üreteci', 'basınçlandırıcı', 'buhar nerede oluşuyor', 'buhar oluşumu'],
    summary: 'BWR’de reaktör suyu doğrudan çekirdekte kaynar; buhar kabın üst bölümündeki ayırıcı ve kurutuculardan geçip doğrudan türbine gider. Ayrı bir buhar üreteci ve basınçlandırıcı yoktur; tek çevrim vardır.',
    sourceIds: ['nuce-ch2', 'nrc-bwr'],
    related: ['bwr.core', 'bwr.separators', 'bwr.dryers', 'bwr.steamline'],
    targets: [{ type: 'highlightFlow', reactor: 'bwr', ids: ['core', 'separators', 'dryers', 'f-core-1', 'f-core-2', 'f-core-3', 'f-steam-1', 'f-steam-2', 'f-steam-3', 'f-steamline'], label: 'Kapta buhar oluşumu ve doğrudan türbine' }],
  });
  for (const r of ['pwr', 'vver'] as const) {
    const sg = r === 'pwr' ? 'sg' : 'hsg';
    out.push({
      id: `${r}.topic.steam-where`,
      reactorId: r,
      kind: 'topic',
      name: `${CONFIGS[r].shortName}’de buhar nerede oluşur?`,
      aliases: ['buhar nerede oluşuyor', 'buhar oluşumu', 'kaynama nerede', 'buhar nerede'],
      summary:
        r === 'pwr'
          ? 'Buhar, dikey U borulu buhar üretecinin ikincil (gövde) tarafında oluşur. Birincil su yüksek basınçta tutulduğu için normal çalışmada çekirdekte toplu kaynama olmaz; iki devre arasında yalnız ısı geçer.'
          : 'Buhar, yatay buhar üretecinin ikincil (gövde) tarafında, yatay U borularının dışında oluşur. Birincil su basınç altında sıvı kalır; iki devre arasında yalnız ısı geçer.',
      sourceIds: BASE_SOURCES[r],
      related: [`${r}.${sg}`],
      targets: [{ type: 'selectEquipment', reactor: r, equipmentId: sg }],
    });
  }

  for (const s of OPS_SECTIONS) {
    out.push({
      id: `pwr.ops.${s.id}`,
      reactorId: 'pwr',
      kind: 'ops',
      name: `İşletme ve davranış · ${s.label.replace(/^\d+\.\s*/, '')}`,
      aliases: s.aliases,
      summary: s.summary,
      sourceIds: s.sourceIds,
      related: [],
      targets: [{ type: 'openOperationsSection', section: s.id }],
    });
  }

  out.push({
    id: 'pwr.topic.xenon-shutdown',
    reactorId: 'pwr',
    kind: 'topic',
    name: 'Kapatmadan sonra ksenon neden artar?',
    aliases: ['ksenon', 'xenon', 'xe-135', 'iyot', 'kapatma', 'kapatmadan sonra', 'ksenon tepesi', 'ksenon zehirlenmesi'],
    summary: PREDICT_LESSONS[0].explain.text,
    sourceIds: PREDICT_LESSONS[0].explain.sourceIds,
    related: ['pwr.ops.xenon', PREDICT_LESSONS[0].id],
    targets: [{ type: 'focusChartEvent', eventId: 'xenon:shut-100:peak-model' }],
  });

  for (const l of PREDICT_LESSONS) {
    out.push({
      id: l.id,
      reactorId: l.reactorId,
      kind: 'predict',
      name: `Tahmin dersi · ${l.title}`,
      aliases: ['tahmin dersi', 'tahmin et', l.title],
      summary: l.goal,
      sourceIds: l.explain.sourceIds,
      related: ['pwr.topic.xenon-shutdown'],
      targets: [{ type: 'openLesson', lessonId: l.id }],
    });
  }

  // Varsayılan senaryoların grafik olayları (asistan bunları da açabilir).
  for (const sc of [buildScenario('shutdown', '100'), buildScenario('load', '12-3-6-3')]) {
    for (const e of sc.events) {
      out.push({
        id: e.id,
        reactorId: 'pwr',
        kind: 'chartEvent',
        name: `${sc.lab === 'load' ? `Yük takibi ${sc.title}` : sc.title} · ${e.title}`,
        aliases: e.key.startsWith('peak') ? ['tepe', 'zirve', 'pik', 'ksenon tepesi', 'en yüksek'] : e.key === 'trip' ? ['kapatma anı'] : ['rampa', 'güç değişimi'],
        summary: e.text,
        sourceIds: e.sourceIds,
        related: e.related.map((x) => `pwr.${x}`),
        targets: [{ type: 'focusChartEvent', eventId: e.id }],
      });
    }
  }
  return out;
}

let entries: KnowledgeEntry[] | null = null;
let index: Map<string, KnowledgeEntry> | null = null;

export const localKnowledge: KnowledgeSource = {
  all() {
    if (!entries) entries = build();
    return entries;
  },
  get(id) {
    if (!index) index = new Map(this.all().map((e) => [e.id, e]));
    return index.get(id);
  },
};

/** Doğrulama için gerçek uygulama kimlikleri. */
export function buildActionRegistry(): ActionRegistry {
  const equipment = {} as ActionRegistry['equipment'];
  const highlightIds = {} as ActionRegistry['highlightIds'];
  const details = {} as ActionRegistry['details'];
  const lessons = new Set<string>(PREDICT_LESSONS.map((l) => l.id));
  for (const r of Object.keys(CONFIGS) as ReactorId[]) {
    const c = CONFIGS[r];
    equipment[r] = new Set(c.components.map((x) => x.id));
    const hl = new Set<string>();
    for (const comp of c.components) {
      hl.add(comp.id);
      comp.related.forEach((x) => hl.add(x));
    }
    c.focusActions.forEach((f) => f.highlight.forEach((x) => hl.add(x)));
    LESSONS[r].forEach((l) => {
      lessons.add(l.id);
      l.highlight.forEach((x) => hl.add(x));
    });
    highlightIds[r] = hl;
    details[r] = new Set(c.details.map((d) => d.key));
  }
  return { equipment, highlightIds, details, lessons, isChartEvent: (id) => findChartEvent(id) !== null };
}

/** Bilgi tabanının kendi tutarlılığı: tüm kaynak kimlikleri ve hedefler geçerli mi? (Testlerde kullanılır.) */
export function knowledgeProblems(reg: ActionRegistry, validate: (a: unknown) => boolean): string[] {
  const problems: string[] = [];
  for (const e of localKnowledge.all()) {
    for (const s of e.sourceIds) if (!isSourceId(s)) problems.push(`${e.id}: bilinmeyen kaynak ${s}`);
    for (const t of e.targets) if (!validate(t)) problems.push(`${e.id}: geçersiz hedef ${JSON.stringify(t)}`);
  }
  void reg;
  return problems;
}
