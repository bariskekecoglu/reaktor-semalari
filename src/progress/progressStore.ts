/**
 * Öğrenme ilerlemesi — yalnız bu cihaz/tarayıcıda, hesap gerektirmeden.
 *
 * - Sürümlü şema (`version`). Bozuk, eski ya da bilinmeyen sürümdeki veri güvenli boş başlangıca döner.
 * - Okurken her alan doğrulanır; içerik değişip bir ders/adım kimliği kalkarsa o kayıt atılır ya da ilk adıma düşer.
 * - Depolama engelliyse (gizli mod, kota, güvenlik ayarı) bellekte çalışmaya devam eder.
 * - Serbest metin ve sohbet saklanmaz; yalnız kimlikler ve seçenek kimlikleri.
 * - Görünüm tercihi ayrı bir anahtardadır; ilerlemeyi sıfırlamak onu silmez.
 * - Depolama `ProgressBackend` arayüzü arkasındadır; ileride hesap eşitlemesi ayrı bir arka uç olarak eklenebilir.
 */
import type { ReactorId } from '../reactors/shared/types';
import { REACTOR_IDS, tourReactor } from '../reactors/meta';

export const PROGRESS_KEY = 'reaktor-semalari:learning-progress';
export const PROGRESS_VERSION = 1;

export type LearningArea = 'tour' | 'predict';

export interface PredictRecord {
  step: string;
  prediction: string | null;
  skipped: boolean;
  experimentDone: boolean;
  observation: string | null;
  assessment: string | null;
  completed: boolean;
}

export interface Progress {
  version: typeof PROGRESS_VERSION;
  /** Tamamlanan ders kimlikleri (ör. 'pwr.tour', 'pwr.predict.xenon-shutdown'). */
  completed: string[];
  /** Son kalınan ders ve adım. */
  last: { lessonId: string; stepId: string } | null;
  /** Son kullanılan öğrenme bölümü. */
  lastArea: LearningArea | null;
  /** Anlatım derslerinde reaktör başına son adım. */
  tourSteps: Partial<Record<ReactorId, string>>;
  /** Tahmin dersi sonuçları (yalnız seçenek kimlikleri). */
  predictions: Record<string, PredictRecord>;
}

/** Doğrulamanın dayandığı geçerli içerik kimlikleri (ders içeriğinden üretilir). */
export interface ProgressCatalog {
  tours: Record<ReactorId, string[]>;
  predict: Record<string, { steps: string[]; choices: { predict: string[]; observe: string[]; assess: string[] } }>;
}

export const emptyProgress = (): Progress => ({ version: PROGRESS_VERSION, completed: [], last: null, lastArea: null, tourSteps: {}, predictions: {} });

const isObj = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);
const str = (v: unknown, max = 80): string | null => (typeof v === 'string' && v.length > 0 && v.length <= max ? v : null);

export function tourLessonId(r: ReactorId) {
  return `${r}.tour`;
}

/** Ders kimliği katalogda var mı? Anlatım dersleri `pwr.tour` biçimindedir. */
function lessonSteps(cat: ProgressCatalog, lessonId: string): string[] | null {
  const r = tourReactor(lessonId);
  if (r) return cat.tours[r] ?? null;
  return cat.predict[lessonId]?.steps ?? null;
}

/** Kaydedilmiş veriyi doğrular. Geçersiz alanlar atılır; tamamen geçersizse boş ilerleme döner. */
export function parseProgress(raw: unknown, cat: ProgressCatalog): Progress {
  if (!isObj(raw) || raw.version !== PROGRESS_VERSION) return emptyProgress();
  const out = emptyProgress();
  if (Array.isArray(raw.completed)) out.completed = [...new Set(raw.completed.filter((id): id is string => typeof id === 'string' && lessonSteps(cat, id) !== null))];
  if (isObj(raw.last)) {
    const lessonId = str(raw.last.lessonId);
    const steps = lessonId ? lessonSteps(cat, lessonId) : null;
    if (lessonId && steps && steps.length) {
      const stepId = str(raw.last.stepId);
      // İçerik değiştiyse eski adım kimliği ilk adıma düşer; uygulama bozulmaz.
      out.last = { lessonId, stepId: stepId && steps.includes(stepId) ? stepId : steps[0] };
    }
  }
  if (raw.lastArea === 'tour' || raw.lastArea === 'predict') out.lastArea = raw.lastArea;
  if (isObj(raw.tourSteps)) {
    for (const r of REACTOR_IDS) {
      const id = str(raw.tourSteps[r]);
      if (id && cat.tours[r]?.includes(id)) out.tourSteps[r] = id;
    }
  }
  if (isObj(raw.predictions)) {
    for (const [lessonId, rec] of Object.entries(raw.predictions)) {
      const def = cat.predict[lessonId];
      if (!def || !isObj(rec)) continue;
      const pick = (v: unknown, allowed: string[]) => (typeof v === 'string' && allowed.includes(v) ? v : null);
      out.predictions[lessonId] = {
        step: typeof rec.step === 'string' && def.steps.includes(rec.step) ? rec.step : def.steps[0],
        prediction: pick(rec.prediction, def.choices.predict),
        skipped: rec.skipped === true,
        experimentDone: rec.experimentDone === true,
        observation: pick(rec.observation, def.choices.observe),
        assessment: pick(rec.assessment, def.choices.assess),
        completed: rec.completed === true,
      };
    }
  }
  return out;
}

/** Depolama arka ucu: tarayıcı localStorage’ı ya da bellek (ileride hesap eşitlemesi). */
export interface ProgressBackend {
  readonly persistent: boolean;
  read(): unknown;
  write(p: Progress): boolean;
  clear(): void;
}

export function memoryBackend(): ProgressBackend {
  let data: unknown = null;
  return {
    persistent: false,
    read: () => data,
    write: (p) => {
      data = JSON.parse(JSON.stringify(p));
      return true;
    },
    clear: () => {
      data = null;
    },
  };
}

type StorageLike = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

/** localStorage arka ucu; erişim engelliyse null döner (çağıran bellek arka ucuna geçer). */
export function storageBackend(getStorage: () => StorageLike | null | undefined): ProgressBackend | null {
  let st: StorageLike | null | undefined;
  try {
    st = getStorage();
    if (!st) return null;
    const probe = `${PROGRESS_KEY}:probe`;
    st.setItem(probe, '1');
    st.removeItem(probe);
  } catch {
    return null;
  }
  const storage = st;
  return {
    persistent: true,
    read: () => {
      try {
        const s = storage.getItem(PROGRESS_KEY);
        return s ? JSON.parse(s) : null;
      } catch {
        return null; // bozuk JSON → güvenli başlangıç
      }
    },
    write: (p) => {
      try {
        storage.setItem(PROGRESS_KEY, JSON.stringify(p));
        return true;
      } catch {
        return false;
      }
    },
    clear: () => {
      try {
        storage.removeItem(PROGRESS_KEY);
      } catch {
        /* yok say */
      }
    },
  };
}

// ---------- Saf güncelleme yardımcıları ----------

export function recordTourStep(p: Progress, r: ReactorId, stepId: string, steps: string[]): Progress {
  const lessonId = tourLessonId(r);
  const done = steps.length > 0 && stepId === steps[steps.length - 1];
  return {
    ...p,
    last: { lessonId, stepId },
    lastArea: 'tour',
    tourSteps: { ...p.tourSteps, [r]: stepId },
    completed: done && !p.completed.includes(lessonId) ? [...p.completed, lessonId] : p.completed,
  };
}

export function recordPredict(p: Progress, lessonId: string, rec: PredictRecord): Progress {
  return {
    ...p,
    last: { lessonId, stepId: rec.step },
    lastArea: 'predict',
    predictions: { ...p.predictions, [lessonId]: rec },
    completed: rec.completed && !p.completed.includes(lessonId) ? [...p.completed, lessonId] : p.completed,
  };
}
