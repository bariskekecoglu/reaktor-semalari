/**
 * Doğrulanmış asistan işlemlerini mevcut uygulama reducer eylemlerine çevirir (ayrı bir gezinme sistemi yok).
 * Saf fonksiyondur; test edilebilir. Reaktör değişimi simülasyonu başa aldığı için yalnız kullanıcının
 * açık tıklamasıyla çalıştırılır (`needsReactorChange`).
 */
import type { AppAction, AppState } from '../app/appState';
import type { ReactorId } from '../reactors/shared/types';
import { actionReactor, type AssistantAction } from './actions';

export interface NavPlan {
  dispatches: AppAction[];
  needsReactorChange: ReactorId | null;
}

const NAME: Record<ReactorId, string> = { pwr: 'PWR', bwr: 'BWR', vver: 'VVER' };

export function planAction(a: AssistantAction, state: AppState, lessonIndex: (lessonId: string) => { reactor: ReactorId; step: number; count: number } | null): NavPlan {
  const target = actionReactor(a);
  const needsReactorChange = target && target !== state.reactor ? target : null;
  const d: AppAction[] = [];
  if (needsReactorChange) d.push({ type: 'setReactor', reactor: needsReactorChange });
  switch (a.type) {
    case 'openReactor':
      d.push({ type: 'setView', view: 'scheme' });
      break;
    case 'openLesson': {
      if (a.lessonId.includes('.predict.')) {
        d.push({ type: 'setLearnMode', mode: 'predict' });
      } else {
        const li = lessonIndex(a.lessonId);
        d.push({ type: 'setView', view: 'learn' }, { type: 'setLearnMode', mode: 'tour' });
        if (li) d.push({ type: 'lessonStep', step: li.step, count: li.count });
      }
      break;
    }
    case 'openOperationsSection':
      d.push({ type: 'setOpsSection', section: a.section });
      break;
    case 'selectEquipment':
      d.push({ type: 'setView', view: 'scheme' }, { type: 'setPwrView', view: 'plant' }, { type: 'select', id: a.equipmentId });
      break;
    case 'highlightFlow':
      d.push({ type: 'setView', view: 'scheme' }, { type: 'setPwrView', view: 'plant' }, { type: 'assistantHighlight', hl: { reactor: a.reactor, ids: a.ids, label: a.label ?? 'Asistan vurgusu' } });
      break;
    case 'openDetail':
      d.push({ type: 'setView', view: 'scheme' }, { type: 'setPwrView', view: 'plant' }, { type: 'openDetail', key: a.detail });
      break;
    case 'focusChartEvent':
      d.push({ type: 'focusChartEvent', eventId: a.eventId });
      break;
    case 'clearAssistantHighlight':
      d.push({ type: 'assistantHighlight', hl: null });
      break;
  }
  return { dispatches: d, needsReactorChange };
}

/** İşlem düğmesinin metni (Türkçe, ne olacağını açıkça söyler). */
export function actionLabel(a: AssistantAction, names: { equipment: (r: ReactorId, id: string) => string; detail: (r: ReactorId, key: string) => string; lesson: (id: string) => string; section: (id: string) => string; event: (id: string) => string }): string {
  switch (a.type) {
    case 'openReactor':
      return `${NAME[a.reactor]} şemasını aç`;
    case 'openLesson':
      return `Dersi aç: ${names.lesson(a.lessonId)}`;
    case 'openOperationsSection':
      return `İşletme bölümünü aç: ${names.section(a.section)}`;
    case 'selectEquipment':
      return `Şemada göster: ${names.equipment(a.reactor, a.equipmentId)}`;
    case 'highlightFlow':
      return `Şemada vurgula: ${a.label ?? 'ilgili hatlar'}`;
    case 'openDetail':
      return `Yakın planı aç: ${names.detail(a.reactor, a.detail)}`;
    case 'focusChartEvent':
      return `Grafikte göster: ${names.event(a.eventId)}`;
    case 'clearAssistantHighlight':
      return 'Asistan vurgusunu temizle';
  }
}

export const REACTOR_NAME = NAME;
