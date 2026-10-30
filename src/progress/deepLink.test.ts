import { describe, expect, it } from 'vitest';
import { lessonHash, parseLessonHash } from './deepLink';
import { buildCatalog } from './useProgress';

const cat = buildCatalog();

describe('doğrudan ders bağlantısı', () => {
  it('anlatım adımı ve tahmin dersi bağlantıları çözülür ve geri üretilir', () => {
    const t = parseLessonHash('#ders=pwr.tour.sg', cat);
    expect(t).toEqual({ kind: 'tour', reactor: 'pwr', step: cat.tours.pwr.indexOf('pwr.tour.sg') });
    expect(lessonHash(t!, cat)).toBe('#ders=pwr.tour.sg');
    const p = parseLessonHash('#ders=pwr.predict.xenon-shutdown&adim=experiment', cat);
    expect(p).toEqual({ kind: 'predict', lessonId: 'pwr.predict.xenon-shutdown', stepId: 'experiment' });
    expect(lessonHash(p!, cat)).toBe('#ders=pwr.predict.xenon-shutdown&adim=experiment');
  });
  it('bilinmeyen ders/adım uygulamayı bozmaz', () => {
    expect(parseLessonHash('#ders=bwr.predict.yok', cat)).toBeNull();
    expect(parseLessonHash('#ders=vver.tour.kaldirildi', cat)).toEqual({ kind: 'tour', reactor: 'vver', step: 0 });
    expect(parseLessonHash('#ders=pwr.predict.xenon-shutdown&adim=eski', cat)).toMatchObject({ stepId: null });
    expect(parseLessonHash('', cat)).toBeNull();
    expect(parseLessonHash('#baska=1', cat)).toBeNull();
  });
});
