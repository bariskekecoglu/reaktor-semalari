import { describe, expect, it } from 'vitest';
import { emptyProgress, memoryBackend, parseProgress, PROGRESS_KEY, PROGRESS_VERSION, recordPredict, recordTourStep, storageBackend, type PredictRecord } from './progressStore';
import { buildCatalog } from './useProgress';
import { VIEW_PREF_KEY as VIEW_PREF_KEY_FOR_TEST } from '../app/viewPreference';

const cat = buildCatalog();
const pwrSteps = cat.tours.pwr;

class FakeStorage {
  map = new Map<string, string>();
  getItem(k: string) {
    return this.map.has(k) ? this.map.get(k)! : null;
  }
  setItem(k: string, v: string) {
    this.map.set(k, v);
  }
  removeItem(k: string) {
    this.map.delete(k);
  }
}

const rec = (over: Partial<PredictRecord> = {}): PredictRecord => ({
  step: 'experiment',
  prediction: 'rise',
  skipped: false,
  experimentDone: false,
  observation: null,
  assessment: null,
  completed: false,
  ...over,
});

describe('öğrenme ilerlemesi', () => {
  it('yazılan ilerleme okunduğunda aynen geri gelir (yeniden yükleme)', () => {
    const st = new FakeStorage();
    const b = storageBackend(() => st)!;
    let p = recordTourStep(emptyProgress(), 'pwr', pwrSteps[2], pwrSteps);
    p = recordPredict(p, 'pwr.predict.xenon-shutdown', rec());
    expect(b.write(p)).toBe(true);
    const again = parseProgress(storageBackend(() => st)!.read(), cat);
    expect(again).toEqual(p);
    expect(again.last).toEqual({ lessonId: 'pwr.predict.xenon-shutdown', stepId: 'experiment' });
  });

  it('son adıma ulaşan anlatım ve değerlendirmesi biten tahmin dersi tamamlandı sayılır', () => {
    let p = recordTourStep(emptyProgress(), 'bwr', cat.tours.bwr[cat.tours.bwr.length - 1], cat.tours.bwr);
    p = recordPredict(p, 'pwr.predict.xenon-shutdown', rec({ step: 'assess', assessment: 'xe', completed: true }));
    expect(p.completed).toEqual(['bwr.tour', 'pwr.predict.xenon-shutdown']);
  });

  it('bozuk JSON, yanlış tür ve bilinmeyen sürüm güvenli boş başlangıca döner', () => {
    const st = new FakeStorage();
    st.setItem(PROGRESS_KEY, '{bozuk');
    expect(parseProgress(storageBackend(() => st)!.read(), cat)).toEqual(emptyProgress());
    expect(parseProgress('metin', cat)).toEqual(emptyProgress());
    expect(parseProgress({ version: PROGRESS_VERSION + 1, completed: ['pwr.tour'] }, cat)).toEqual(emptyProgress());
    expect(parseProgress({ completed: ['pwr.tour'] }, cat)).toEqual(emptyProgress());
  });

  it('içerik değişince eski kimlikler uygulamayı bozmaz: bilinmeyen ders atılır, bilinmeyen adım ilk adıma düşer', () => {
    const p = parseProgress(
      {
        version: PROGRESS_VERSION,
        completed: ['pwr.tour', 'pwr.tour.kaldirildi', 'xyz'],
        last: { lessonId: 'pwr.tour', stepId: 'pwr.tour.eski-adim' },
        lastArea: 'tour',
        tourSteps: { pwr: 'pwr.tour.eski', vver: cat.tours.vver[1] },
        predictions: {
          'pwr.predict.xenon-shutdown': { step: 'eski', prediction: 'uydurma', skipped: 'evet', observation: 'hours', assessment: null, completed: true },
          'pwr.predict.silindi': { step: 'goal' },
        },
      },
      cat,
    );
    expect(p.completed).toEqual(['pwr.tour']);
    expect(p.last).toEqual({ lessonId: 'pwr.tour', stepId: pwrSteps[0] });
    expect(p.tourSteps).toEqual({ vver: cat.tours.vver[1] });
    expect(Object.keys(p.predictions)).toEqual(['pwr.predict.xenon-shutdown']);
    expect(p.predictions['pwr.predict.xenon-shutdown']).toMatchObject({ step: 'goal', prediction: null, skipped: false, observation: 'hours', completed: true });
  });

  it('depolama engelliyse bellek arka ucu kullanılır ve uygulama çalışmaya devam eder', () => {
    expect(
      storageBackend(() => {
        throw new Error('SecurityError');
      }),
    ).toBeNull();
    const quota = new FakeStorage();
    quota.setItem = () => {
      throw new Error('QuotaExceeded');
    };
    expect(storageBackend(() => quota)).toBeNull();
    const m = memoryBackend();
    expect(m.persistent).toBe(false);
    m.write(recordTourStep(emptyProgress(), 'pwr', pwrSteps[1], pwrSteps));
    expect(parseProgress(m.read(), cat).tourSteps.pwr).toBe(pwrSteps[1]);
  });

  it('sıfırlama yalnız öğrenme ilerlemesini siler; görünüm tercihi kalır', () => {
    const st = new FakeStorage();
    st.setItem(VIEW_PREF_KEY_FOR_TEST, 'mobile');
    const b = storageBackend(() => st)!;
    b.write(recordTourStep(emptyProgress(), 'pwr', pwrSteps[1], pwrSteps));
    b.clear();
    expect(st.getItem(PROGRESS_KEY)).toBeNull();
    expect(st.getItem(VIEW_PREF_KEY_FOR_TEST)).toBe('mobile');
  });

  it('serbest metin saklanmaz: tahmin kaydında yalnız seçenek kimlikleri kalır', () => {
    const p = parseProgress({ version: PROGRESS_VERSION, predictions: { 'pwr.predict.xenon-shutdown': { step: 'predict', prediction: 'Benim uzun cevabım…', note: 'gizli' } } }, cat);
    const r = p.predictions['pwr.predict.xenon-shutdown'];
    expect(r.prediction).toBeNull();
    expect(Object.keys(r)).not.toContain('note');
  });
});
