import type { ReactorId } from '../reactors/shared/types';
import type { OpsSectionId } from '../reactors/pwr/operations/types';

export type ViewMode = 'scheme' | 'compare' | 'learn';
/** Yalnız PWR’de: santral şeması ya da “İşletme ve davranış” modülü. */
export type PwrSubView = 'plant' | 'ops';
/** Öğrenme görünümü: adım adım anlatım ya da “tahmin et → dene → açıkla” dersi. */
export type LearnMode = 'tour' | 'predict';

/** Asistanın şemada yaptığı vurgu; kullanıcı seçimi ya da odak açılınca temizlenir. */
export interface AssistantHighlight {
  reactor: ReactorId;
  ids: string[];
  label: string;
}

export interface AppState {
  reactor: ReactorId;
  view: ViewMode;
  selected: string | null;
  /** Reaktöre özgü hızlı etkileşimin kimliği. */
  focus: string | null;
  lessonStep: number;
  detail: string | null;
  coreOpen: boolean;
  showLabels: boolean;
  showFlow: boolean;
  /** Sahne değişiminde bileşenleri yeniden bağlamak için artan sayaç. */
  sceneEpoch: number;
  pwrView: PwrSubView;
  /** PWR işletme modülünde açık bölüm (asistan ve sekmeler aynı durumu kullanır). */
  opsSection: OpsSectionId;
  /** Grafikte seçilecek olay (asistan ya da gezinme). `nonce` aynı olayın tekrar açılmasını sağlar. */
  opsFocus: { eventId: string; nonce: number } | null;
  learnMode: LearnMode;
  assistantHL: AssistantHighlight | null;
  /** Karşılaştırma görünümünde seçili konu. */
  compareTopic: string | null;
  /** Şema etiketlerinin ayrıntı düzeyi (reaktör değişiminde korunur). */
  labelDetail: 'basic' | 'detailed';
}

export const initialAppState: AppState = {
  reactor: 'pwr',
  view: 'scheme',
  selected: null,
  focus: null,
  lessonStep: 0,
  detail: null,
  coreOpen: false,
  showLabels: true,
  showFlow: true,
  sceneEpoch: 0,
  pwrView: 'plant',
  opsSection: 'modes',
  opsFocus: null,
  learnMode: 'tour',
  assistantHL: null,
  compareTopic: null,
  labelDetail: 'basic',
};

/** Asistanın “önceki konuma dön” için sakladığı gezinme durumu. */
export type NavSnapshot = Pick<AppState, 'reactor' | 'view' | 'selected' | 'focus' | 'lessonStep' | 'detail' | 'pwrView' | 'opsSection' | 'learnMode' | 'compareTopic'>;

export function navSnapshot(s: AppState): NavSnapshot {
  const { reactor, view, selected, focus, lessonStep, detail, pwrView, opsSection, learnMode, compareTopic } = s;
  return { reactor, view, selected, focus, lessonStep, detail, pwrView, opsSection, learnMode, compareTopic };
}

export type AppAction =
  | { type: 'setReactor'; reactor: ReactorId }
  | { type: 'setView'; view: ViewMode }
  | { type: 'select'; id: string | null }
  | { type: 'focus'; id: string | null }
  | { type: 'lessonStep'; step: number; count: number }
  | { type: 'openDetail'; key: string }
  | { type: 'closeDetail' }
  | { type: 'toggleCore' }
  | { type: 'toggleLabels' }
  | { type: 'toggleFlow' }
  | { type: 'reset' }
  | { type: 'setPwrView'; view: PwrSubView }
  | { type: 'setOpsSection'; section: OpsSectionId }
  | { type: 'focusChartEvent'; eventId: string }
  | { type: 'setLearnMode'; mode: LearnMode }
  | { type: 'assistantHighlight'; hl: AssistantHighlight | null }
  | { type: 'setCompareTopic'; topic: string | null }
  | { type: 'restoreNav'; nav: NavSnapshot }
  | { type: 'setLabelDetail'; detail: 'basic' | 'detailed' };

export function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'setReactor':
      if (action.reactor === state.reactor) return state;
      // Önceki reaktöre ait seçim, vurgu, ders adımı ve yakın planlar taşınmaz.
      return {
        ...state,
        reactor: action.reactor,
        selected: null,
        focus: null,
        lessonStep: 0,
        detail: null,
        coreOpen: false,
        sceneEpoch: state.sceneEpoch + 1,
        // PWR işletme modülü ve tahmin dersi yalnız PWR’ye aittir; başka reaktöre taşınmaz.
        pwrView: 'plant',
        opsFocus: null,
        learnMode: action.reactor === 'pwr' ? state.learnMode : 'tour',
        assistantHL: state.assistantHL?.reactor === action.reactor ? state.assistantHL : null,
      };
    case 'setView':
      return {
        ...state,
        view: action.view,
        detail: null,
        focus: null,
        selected: action.view === 'learn' ? null : state.selected,
        pwrView: action.view === 'scheme' ? state.pwrView : 'plant',
      };
    case 'setPwrView':
      if (state.reactor !== 'pwr') return state;
      return { ...state, pwrView: action.view, view: 'scheme', detail: null, focus: null, selected: null };
    case 'select':
      return { ...state, selected: action.id, focus: null, assistantHL: null };
    case 'focus':
      return { ...state, focus: action.id, selected: null, assistantHL: null };
    case 'lessonStep': {
      const step = Math.max(0, Math.min(action.count - 1, action.step));
      return { ...state, lessonStep: step };
    }
    case 'openDetail':
      return { ...state, detail: action.key };
    case 'closeDetail':
      return { ...state, detail: null };
    case 'toggleCore':
      return { ...state, coreOpen: !state.coreOpen };
    case 'toggleLabels':
      return { ...state, showLabels: !state.showLabels };
    case 'toggleFlow':
      return { ...state, showFlow: !state.showFlow };
    case 'reset':
      return { ...state, selected: null, focus: null, lessonStep: 0, detail: null, sceneEpoch: state.sceneEpoch + 1, assistantHL: null };
    case 'setOpsSection':
      if (state.reactor !== 'pwr') return state;
      return { ...state, view: 'scheme', pwrView: 'ops', opsSection: action.section, opsFocus: action.section === 'xenon' ? state.opsFocus : null };
    case 'focusChartEvent':
      if (state.reactor !== 'pwr') return state;
      return { ...state, view: 'scheme', pwrView: 'ops', opsSection: 'xenon', opsFocus: { eventId: action.eventId, nonce: (state.opsFocus?.nonce ?? 0) + 1 } };
    case 'setLearnMode':
      if (action.mode === 'predict' && state.reactor !== 'pwr') return state;
      return { ...state, view: 'learn', learnMode: action.mode, selected: null, focus: null, detail: null, pwrView: 'plant' };
    case 'assistantHighlight':
      return { ...state, assistantHL: action.hl, ...(action.hl ? { selected: null, focus: null } : {}) };
    case 'setLabelDetail':
      return { ...state, labelDetail: action.detail };
    case 'setCompareTopic':
      return { ...state, compareTopic: action.topic };
    case 'restoreNav': {
      const n = action.nav;
      // Reaktör farklıysa önce reaktör değişimi (sahne yeniden bağlanır), sonra gezinme alanları.
      const base = n.reactor !== state.reactor ? appReducer(state, { type: 'setReactor', reactor: n.reactor }) : state;
      return { ...base, ...n, assistantHL: null, opsFocus: null };
    }
    default:
      return state;
  }
}
