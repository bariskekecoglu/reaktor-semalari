import { describe, expect, it } from 'vitest';
import { BWR_FLOW, flowIllustration } from './bwrFlow';
import { buildCatalog } from '../../progress/useProgress';
import { lessonHash, parseLessonHash } from '../../progress/deepLink';
import { emptyProgress, parseProgress, recordPredict } from '../../progress/progressStore';
import { emptyPredictState } from './predictState';
import { getSource } from '../../knowledge/sources';

describe('BWR prediction lesson', () => {
  it('stages flow, initial void reduction, then power with partial void recovery', () => {
    expect(flowIllustration(-1)).toEqual({ flow: 1, voids: 1, power: 1 });
    expect(flowIllustration(0.2).flow).toBeGreaterThan(1);
    expect(flowIllustration(0.2).power).toBe(1);
    expect(flowIllustration(0.5).voids).toBeLessThan(1);
    expect(flowIllustration(0.5).power).toBe(1);
    expect(flowIllustration(1).power).toBeGreaterThan(1);
    expect(flowIllustration(1).voids).toBeGreaterThan(flowIllustration(0.5).voids);
    expect(flowIllustration(2)).toEqual(flowIllustration(1));
  });
  it('keeps the two lesson records independent across persistence and links', () => {
    const cat = buildCatalog();
    const pwr = 'pwr.predict.xenon-shutdown';
    const saved = recordPredict(recordPredict(emptyProgress(), pwr, { ...emptyPredictState(), prediction: 'rise' }), BWR_FLOW.id, { ...emptyPredictState(), prediction: 'flat' });
    const restored = parseProgress(JSON.parse(JSON.stringify(saved)), cat);
    expect(restored.predictions[pwr].prediction).toBe('rise');
    expect(restored.predictions[BWR_FLOW.id].prediction).toBe('flat');
    const link = { kind: 'predict' as const, lessonId: BWR_FLOW.id, stepId: 'experiment' };
    expect(parseLessonHash(lessonHash(link, cat), cat)).toEqual(link);
  });
  it('has one correct answer per question and a resolvable institutional source', () => {
    for (const q of [BWR_FLOW.predict, BWR_FLOW.observe, BWR_FLOW.assess]) expect(q.choices.filter(c => c.correct)).toHaveLength(1);
    for (const id of BWR_FLOW.explain.sourceIds) expect(getSource(id)?.url).toMatch(/^https:\/\/www.nrc.gov\//);
  });
});
