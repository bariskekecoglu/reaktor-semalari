/** “Tahmin et → dene → açıkla” dersleri. Doğru cevap ve temel açıklama doğrulanmış içerikte tanımlıdır. */
import type { ReactorId } from '../../reactors/shared/types';

export interface Choice {
  id: string;
  text: string;
  correct: boolean;
  /** Bu seçenek neden makul görünebilir / neden doğru ya da eksik. */
  why: string;
}

export interface ChoiceQuestion {
  question: string;
  choices: Choice[];
}

export type PredictStepId = 'goal' | 'predict' | 'experiment' | 'observe' | 'explain' | 'assess';
export const PREDICT_STEPS: readonly PredictStepId[] = ['goal', 'predict', 'experiment', 'observe', 'explain', 'assess'];

export const STEP_LABEL: Record<PredictStepId, string> = {
  goal: 'Hedef',
  predict: 'Tahmin',
  experiment: 'Dene',
  observe: 'Gözlem',
  explain: 'Açıklama',
  assess: 'Değerlendirme',
};

export interface PredictLesson {
  id: string;
  reactorId: ReactorId;
  title: string;
  goal: string;
  initialState: string;
  predict: ChoiceQuestion;
  experiment: {
    /** Değiştirilen değişken; deney sırasında görünür kalır. */
    variable: string;
    from: string;
    to: string;
    /** Kullanılan ksenon senaryosu (mevcut temsili model). */
    scenario: { lab: 'shutdown'; key: '25' | '50' | '75' | '100' };
    /** Canlandırılan süre (senaryo saati). */
    hours: number;
    /** Modelin neyi gösterip neyi göstermediği. */
    note: string;
  };
  observe: ChoiceQuestion;
  explain: { text: string; sourceIds: string[] };
  assess: ChoiceQuestion;
  /** Yapay zekâ olmadan da verilebilen ipuçları. */
  hints: string[];
}
