import { useCallback, useMemo, useState } from 'react';
import { reactors } from '../reactors/registry';
import type { ReactorId } from '../reactors/shared/types';
import { PREDICT_LESSONS } from '../lessons/predict/pwrXenonShutdown';
import { PREDICT_STEPS } from '../lessons/predict/types';
import { emptyProgress, memoryBackend, parseProgress, recordPredict, recordTourStep, storageBackend, type Progress, type ProgressBackend, type ProgressCatalog, type PredictRecord } from './progressStore';

/** Geçerli içerik kimlikleri (ders içeriği değişince kayıtlar buna göre doğrulanır). */
export function buildCatalog(): ProgressCatalog {
  const tours = {} as ProgressCatalog['tours'];
  for (const r of Object.keys(reactors) as ReactorId[]) tours[r] = reactors[r].lessons.map((l) => l.id);
  const predict: ProgressCatalog['predict'] = {};
  for (const l of PREDICT_LESSONS) {
    predict[l.id] = {
      steps: [...PREDICT_STEPS],
      choices: { predict: l.predict.choices.map((c) => c.id), observe: l.observe.choices.map((c) => c.id), assess: l.assess.choices.map((c) => c.id) },
    };
  }
  return { tours, predict };
}

export interface ProgressApi {
  progress: Progress;
  /** Depolama kalıcı mı (localStorage) yoksa yalnız bu oturumda mı? */
  persistent: boolean;
  recordTour: (r: ReactorId, stepIndex: number) => void;
  recordPredict: (lessonId: string, rec: PredictRecord) => void;
  reset: () => void;
}

export function useProgress(): ProgressApi {
  const catalog = useMemo(buildCatalog, []);
  const [backend] = useState<ProgressBackend>(() => storageBackend(() => (typeof window === 'undefined' ? null : window.localStorage)) ?? memoryBackend());
  const [progress, setProgress] = useState<Progress>(() => parseProgress(backend.read(), catalog));

  const commit = useCallback(
    (fn: (p: Progress) => Progress) =>
      setProgress((p) => {
        const next = fn(p);
        if (next !== p) backend.write(next);
        return next;
      }),
    [backend],
  );

  return {
    progress,
    persistent: backend.persistent,
    recordTour: useCallback(
      (r, i) => {
        const steps = catalog.tours[r];
        const id = steps[i];
        if (id) commit((p) => (p.last?.lessonId === `${r}.tour` && p.last.stepId === id ? p : recordTourStep(p, r, id, steps)));
      },
      [catalog, commit],
    ),
    recordPredict: useCallback((lessonId, rec) => commit((p) => recordPredict(p, lessonId, rec)), [commit]),
    reset: useCallback(() => {
      backend.clear();
      setProgress(emptyProgress());
    }, [backend]),
  };
}
