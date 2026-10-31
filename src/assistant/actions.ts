/**
 * Asistanın önerebileceği uygulama işlemleri: kapalı, tiplenmiş bir küme.
 * Serbest JavaScript, DOM seçicisi veya URL yoktur. Model yanıtından gelen her işlem
 * `validateAction` ile çalışma zamanında doğrulanır; bilinmeyen kimlikler reddedilir.
 */
import type { ReactorId } from '../reactors/shared/types';
import { REACTOR_IDS } from '../reactors/meta';
import type { OpsSectionId } from '../reactors/pwr/operations/types';

export type AssistantAction =
  | { type: 'openReactor'; reactor: ReactorId }
  | { type: 'openLesson'; lessonId: string }
  | { type: 'openOperationsSection'; section: OpsSectionId }
  | { type: 'selectEquipment'; reactor: ReactorId; equipmentId: string }
  | { type: 'highlightFlow'; reactor: ReactorId; ids: string[]; label?: string }
  | { type: 'openDetail'; reactor: ReactorId; detail: string }
  | { type: 'focusChartEvent'; eventId: string }
  | { type: 'clearAssistantHighlight' };

export type ActionType = AssistantAction['type'];

export const ACTION_TYPES: readonly ActionType[] = [
  'openReactor',
  'openLesson',
  'openOperationsSection',
  'selectEquipment',
  'highlightFlow',
  'openDetail',
  'focusChartEvent',
  'clearAssistantHighlight',
];

export { REACTOR_IDS };
export const OPS_SECTIONS: readonly OpsSectionId[] = ['modes', 'heatup', 'boron', 'xenon', 'axial', 'controls'];

/** Doğrulamanın dayandığı gerçek uygulama kimlikleri (bilgi tabanından üretilir). */
export interface ActionRegistry {
  equipment: Record<ReactorId, ReadonlySet<string>>;
  highlightIds: Record<ReactorId, ReadonlySet<string>>;
  details: Record<ReactorId, ReadonlySet<string>>;
  lessons: ReadonlySet<string>;
  isChartEvent: (id: string) => boolean;
}

export const LIMITS = {
  maxActions: 4,
  maxHighlightIds: 24,
  maxLabel: 80,
  maxIdLength: 64,
} as const;

type Result<T> = { ok: true; value: T } | { ok: false; error: string };

const isObj = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);
const isId = (v: unknown): v is string => typeof v === 'string' && v.length > 0 && v.length <= LIMITS.maxIdLength && /^[\w.:-]+$/.test(v);
const isReactor = (v: unknown): v is ReactorId => typeof v === 'string' && (REACTOR_IDS as readonly string[]).includes(v);

/** Tek bir işlemi doğrular; yalnız bilinen alanları içeren temiz bir kopya döndürür. */
export function validateAction(raw: unknown, reg: ActionRegistry): Result<AssistantAction> {
  if (!isObj(raw)) return { ok: false, error: 'İşlem bir nesne değil' };
  const type = raw.type;
  switch (type) {
    case 'openReactor':
      return isReactor(raw.reactor) ? { ok: true, value: { type, reactor: raw.reactor } } : { ok: false, error: 'Bilinmeyen reaktör' };
    case 'openLesson':
      return isId(raw.lessonId) && reg.lessons.has(raw.lessonId) ? { ok: true, value: { type, lessonId: raw.lessonId } } : { ok: false, error: 'Bilinmeyen ders' };
    case 'openOperationsSection':
      return typeof raw.section === 'string' && (OPS_SECTIONS as readonly string[]).includes(raw.section)
        ? { ok: true, value: { type, section: raw.section as OpsSectionId } }
        : { ok: false, error: 'Bilinmeyen işletme bölümü' };
    case 'selectEquipment':
      if (!isReactor(raw.reactor) || !isId(raw.equipmentId) || !reg.equipment[raw.reactor].has(raw.equipmentId)) return { ok: false, error: 'Bilinmeyen ekipman' };
      return { ok: true, value: { type, reactor: raw.reactor, equipmentId: raw.equipmentId } };
    case 'highlightFlow': {
      if (!isReactor(raw.reactor) || !Array.isArray(raw.ids)) return { ok: false, error: 'Geçersiz vurgu' };
      const r = raw.reactor;
      if (raw.ids.length === 0 || raw.ids.length > LIMITS.maxHighlightIds) return { ok: false, error: 'Vurgu listesi boş ya da çok uzun' };
      if (!raw.ids.every((id) => isId(id) && reg.highlightIds[r].has(id))) return { ok: false, error: 'Bilinmeyen vurgu kimliği' };
      const label = typeof raw.label === 'string' ? raw.label.slice(0, LIMITS.maxLabel) : undefined;
      return { ok: true, value: { type, reactor: r, ids: [...new Set(raw.ids as string[])], ...(label ? { label } : {}) } };
    }
    case 'openDetail':
      if (!isReactor(raw.reactor) || !isId(raw.detail) || !reg.details[raw.reactor].has(raw.detail)) return { ok: false, error: 'Bilinmeyen yakın plan' };
      return { ok: true, value: { type, reactor: raw.reactor, detail: raw.detail } };
    case 'focusChartEvent':
      return isId(raw.eventId) && reg.isChartEvent(raw.eventId) ? { ok: true, value: { type, eventId: raw.eventId } } : { ok: false, error: 'Bilinmeyen grafik olayı' };
    case 'clearAssistantHighlight':
      return { ok: true, value: { type } };
    default:
      return { ok: false, error: 'Bilinmeyen işlem türü' };
  }
}

/** İşlem listesini doğrular: geçerli olanlar korunur, geçersizler ayrı raporlanır (çalıştırılmaz). */
export function validateActions(raw: unknown, reg: ActionRegistry): { actions: AssistantAction[]; rejected: string[] } {
  if (!Array.isArray(raw)) return { actions: [], rejected: raw === undefined ? [] : ['İşlem listesi dizi değil'] };
  const actions: AssistantAction[] = [];
  const rejected: string[] = [];
  for (const item of raw.slice(0, LIMITS.maxActions)) {
    const r = validateAction(item, reg);
    if (r.ok) actions.push(r.value);
    else rejected.push(r.error);
  }
  if (raw.length > LIMITS.maxActions) rejected.push('Fazla işlem önerildi; ilk dördü değerlendirildi');
  return { actions, rejected };
}

/** İşlemin hangi reaktöre ait olduğu (reaktör değişimi gerekiyorsa kullanıcı onayı istenir). */
export function actionReactor(a: AssistantAction): ReactorId | null {
  switch (a.type) {
    case 'openReactor':
    case 'selectEquipment':
    case 'highlightFlow':
    case 'openDetail':
      return a.reactor;
    case 'openLesson':
      return (REACTOR_IDS as readonly string[]).includes(a.lessonId.split('.')[0]) ? (a.lessonId.split('.')[0] as ReactorId) : null;
    case 'openOperationsSection':
    case 'focusChartEvent':
      return 'pwr';
    default:
      return null;
  }
}
