import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { PredictLessonView } from './PredictLessonView';
import { PWR_XENON_SHUTDOWN } from './pwrXenonShutdown';
import { canEnter, emptyPredictState, restorePredictState } from './predictState';
import { parseLessonHash } from '../../progress/deepLink';
import { buildCatalog } from '../../progress/useProgress';

describe('tahmin dersinin açılış ön koşulları', () => {
  it.each(['experiment', 'observe', 'explain', 'assess'])('yeni kullanıcı %s bağlantısıyla tahmini atlayamaz', (step) => {
    const link = parseLessonHash(`#ders=pwr.predict.xenon-shutdown&adim=${step}`, buildCatalog());
    if (link?.kind !== 'predict' || !link.stepId) throw new Error('Bağlantı çözülemedi');
    const restored = restorePredictState(emptyPredictState(), link.stepId);
    expect(restored.step).toBe('predict');
    expect(restored.skipped).toBe(false);
  });

  it('kayıtlı tahminle deney, tamamlanan deneyle gözlem açılır', () => {
    const predicted = { ...emptyPredictState(), prediction: 'rise' };
    expect(restorePredictState(predicted, 'explain').step).toBe('experiment');
    expect(restorePredictState({ ...predicted, experimentDone: true }, 'explain').step).toBe('observe');
  });

  it('açıklama ve değerlendirme için deney ve gözlem gerekir', () => {
    const observed = { ...emptyPredictState(), prediction: 'rise', observation: 'hours' };
    expect(canEnter(observed, 'explain')).toBe(false);
    expect(canEnter(observed, 'assess')).toBe(false);
    const done = { ...observed, experimentDone: true };
    expect(restorePredictState(done, 'explain').step).toBe('explain');
    expect(restorePredictState(done, 'assess').step).toBe('assess');
  });

  it('açık atlama seçimini ve geçerli kayıtlı adımı korur', () => {
    const skipped = { ...emptyPredictState(), skipped: true, step: 'explain' as const };
    expect(restorePredictState(skipped)).toEqual(skipped);
    expect(restorePredictState(skipped, 'assess').step).toBe('assess');
    expect(restorePredictState(emptyPredictState()).step).toBe('goal');
  });

  it('tutarsız kayıtlı adım açıklamayı göstermez', () => {
    const initial = { ...emptyPredictState(), step: 'explain' as const };
    expect(restorePredictState(initial).step).toBe('predict');
    const html = renderToStaticMarkup(createElement(PredictLessonView, {
      lesson: PWR_XENON_SHUTDOWN, initial, onChange: () => {}, onExit: () => {},
    }));
    expect(html).toContain(PWR_XENON_SHUTDOWN.predict.question);
    expect(html).toContain('Atla ve açıklamayı gör');
    expect(html).not.toContain(PWR_XENON_SHUTDOWN.explain.text);
  });
});
