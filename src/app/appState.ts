import type { ReactorId } from '../reactors/shared/types';

export type ViewMode = 'scheme' | 'compare' | 'learn';
/** Yalnız PWR’de: santral şeması ya da “İşletme ve davranış” modülü. */
export type PwrSubView = 'plant' | 'ops';

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
};

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
  | { type: 'setPwrView'; view: PwrSubView };

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
        // PWR işletme modülü yalnız PWR’ye aittir; başka reaktöre taşınmaz.
        pwrView: 'plant',
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
      return { ...state, selected: action.id, focus: null };
    case 'focus':
      return { ...state, focus: action.id, selected: null };
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
      return { ...state, selected: null, focus: null, lessonStep: 0, detail: null, sceneEpoch: state.sceneEpoch + 1 };
    default:
      return state;
  }
}
