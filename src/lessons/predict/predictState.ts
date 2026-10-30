import { PREDICT_STEPS, type PredictStepId } from './types';

/** Dersin kaydedilebilir durumu (serbest metin içermez). */
export interface PredictState {
  step: PredictStepId;
  prediction: string | null;
  skipped: boolean;
  experimentDone: boolean;
  observation: string | null;
  assessment: string | null;
  completed: boolean;
}

export const emptyPredictState = (): PredictState => ({
  step: 'goal',
  prediction: null,
  skipped: false,
  experimentDone: false,
  observation: null,
  assessment: null,
  completed: false,
});

/** Bir adıma geçilebilir mi? (Tahmin yapılmadan doğru cevap açılmaz; atlama ayrı bir seçimdir.) */
export function canEnter(s: PredictState, step: PredictStepId): boolean {
  switch (step) {
    case 'goal':
    case 'predict':
      return true;
    case 'experiment':
      return s.prediction !== null;
    case 'observe':
      return s.prediction !== null && s.experimentDone;
    case 'explain':
      return s.skipped || (s.prediction !== null && s.experimentDone && s.observation !== null);
    case 'assess':
      return canEnter(s, 'explain');
  }
}

/** Apply the same prerequisites to deep links and restored progress as to navigation. */
export function restorePredictState(s: PredictState, requestedStep: string = s.step): PredictState {
  if (PREDICT_STEPS.includes(requestedStep as PredictStepId) && canEnter(s, requestedStep as PredictStepId)) {
    return { ...s, step: requestedStep as PredictStepId };
  }
  // Open the first missing stage; skipping remains an explicit user choice.
  const step = s.prediction === null ? 'predict' : !s.experimentDone ? 'experiment' : 'observe';
  return { ...s, step };
}
