import { beforeEach, describe, expect, it } from 'vitest';
import {
  VIEW_PREF_KEY,
  autoLayout,
  effectiveLayout,
  readPreference,
  resetMemoryPreference,
  writePreference,
  type PrefStorage,
} from './viewPreference';
import { appReducer, initialAppState } from './appState';

class MemStorage implements PrefStorage {
  data = new Map<string, string>();
  getItem(k: string) {
    return this.data.get(k) ?? null;
  }
  setItem(k: string, v: string) {
    this.data.set(k, v);
  }
}

const broken: PrefStorage = {
  getItem: () => {
    throw new Error('engellendi');
  },
  setItem: () => {
    throw new Error('engellendi');
  },
};

beforeEach(() => resetMemoryPreference());

describe('Otomatik yerleşim', () => {
  it('genişliğe göre dar / orta / geniş', () => {
    expect(autoLayout(320)).toBe('narrow');
    expect(autoLayout(767)).toBe('narrow');
    expect(autoLayout(768)).toBe('medium');
    expect(autoLayout(1199)).toBe('medium');
    expect(autoLayout(1200)).toBe('wide');
    expect(autoLayout(Number.NaN)).toBe('wide');
  });

  it('elle seçilen tercih genişlik değişince ezilmez', () => {
    for (const w of [320, 800, 1440]) {
      expect(effectiveLayout('mobile', w)).toBe('narrow');
      expect(effectiveLayout('desktop', w)).toBe('wide');
    }
    expect(effectiveLayout('auto', 390)).toBe('narrow');
    expect(effectiveLayout('auto', 1440)).toBe('wide');
  });
});

describe('Tercihin saklanması', () => {
  it('ilk ziyarette (boş depolama) Otomatik', () => {
    expect(readPreference(new MemStorage())).toBe('auto');
  });

  it('yalnız kullanıcının tercihi sürümlü anahtarda saklanır', () => {
    const st = new MemStorage();
    writePreference('mobile', st);
    expect(st.data.get(VIEW_PREF_KEY)).toBe('mobile');
    expect(readPreference(st)).toBe('mobile');
    expect([...st.data.values()]).not.toContain('narrow');
    writePreference('auto', st);
    expect(readPreference(st)).toBe('auto');
  });

  it('bozuk/eski değer Otomatik’e düşer', () => {
    const st = new MemStorage();
    st.setItem(VIEW_PREF_KEY, 'tablet');
    expect(readPreference(st)).toBe('auto');
    st.setItem(VIEW_PREF_KEY, '{"x":1}');
    expect(readPreference(st)).toBe('auto');
  });

  it('depolama erişimi engellenirse çökmez; tercih oturumda bellekte tutulur', () => {
    expect(readPreference(broken)).toBe('auto');
    expect(() => writePreference('desktop', broken)).not.toThrow();
    expect(readPreference(broken)).toBe('desktop');
    expect(readPreference(null)).toBe('desktop');
  });
});

describe('Görünüm tercihi uygulama durumundan bağımsız', () => {
  it('yerleşim değişimi reaktör, görünüm, ders adımı veya PWR alt görünümünü değiştiren bir eylem değildir', () => {
    // Tercih ayrı bir modülde tutulur; uygulama reducer’ında bir eylemi yoktur.
    let s = appReducer(initialAppState, { type: 'setPwrView', view: 'ops' });
    s = appReducer(s, { type: 'lessonStep', step: 2, count: 6 });
    const before = JSON.stringify(s);
    writePreference('mobile', new MemStorage());
    writePreference('desktop', new MemStorage());
    expect(JSON.stringify(s)).toBe(before);
  });
});
