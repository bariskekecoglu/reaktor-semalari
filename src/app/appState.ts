import type { ReactorId } from '../reactors/shared/types';

export type ViewMode = 'scheme' | 'compare' | 'learn';

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
  | { type: 'reset' };

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
      };
    case 'setView':
      return { ...state, view: action.view, detail: null, focus: null, selected: action.view === 'learn' ? null : state.selected };
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
