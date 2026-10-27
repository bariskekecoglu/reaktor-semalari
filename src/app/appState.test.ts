import { describe, expect, it } from 'vitest';
import { appReducer, initialAppState, type AppState } from './appState';
import { reactors } from '../reactors/registry';
import { buildLut, flowFactor, sampleLut, wrap } from '../reactors/shared/flow/flowMath';

describe('appReducer', () => {
  it('reaktör değişiminde seçim, vurgu, ders adımı ve yakın planlar taşınmaz', () => {
    let s: AppState = { ...initialAppState, selected: 'sg', focus: 'pzr', lessonStep: 3, detail: 'sg', coreOpen: true };
    s = appReducer(s, { type: 'setReactor', reactor: 'bwr' });
    expect(s.reactor).toBe('bwr');
    expect(s.selected).toBeNull();
    expect(s.focus).toBeNull();
    expect(s.lessonStep).toBe(0);
    expect(s.detail).toBeNull();
    expect(s.coreOpen).toBe(false);
    expect(s.sceneEpoch).toBe(initialAppState.sceneEpoch + 1);
  });

  it('ortak görünüm tercihleri (etiket/akış) reaktör değişiminde korunur', () => {
    let s = appReducer(initialAppState, { type: 'toggleLabels' });
    s = appReducer(s, { type: 'setReactor', reactor: 'vver' });
    expect(s.showLabels).toBe(false);
    expect(s.showFlow).toBe(true);
  });

  it('ders adımı sınırlar içinde kalır', () => {
    const count = reactors.pwr.lessons.length;
    let s = appReducer(initialAppState, { type: 'lessonStep', step: 99, count });
    expect(s.lessonStep).toBe(count - 1);
    s = appReducer(s, { type: 'lessonStep', step: -4, count });
    expect(s.lessonStep).toBe(0);
  });

  it('seçim ile odak birbirini temizler', () => {
    let s = appReducer(initialAppState, { type: 'focus', id: 'pzr' });
    s = appReducer(s, { type: 'select', id: 'sg' });
    expect(s.focus).toBeNull();
    s = appReducer(s, { type: 'focus', id: 'loops' });
    expect(s.selected).toBeNull();
  });

  it('sıfırlama seçimleri temizler ve sahneyi yeniden bağlar', () => {
    const s = appReducer({ ...initialAppState, selected: 'x', lessonStep: 2 }, { type: 'reset' });
    expect(s.selected).toBeNull();
    expect(s.lessonStep).toBe(0);
    expect(s.sceneEpoch).toBe(1);
  });
});

describe('PWR işletme alt görünümü', () => {
  it('yalnız PWR’de açılabilir; BWR/VVER’de istek yok sayılır', () => {
    let s = appReducer(initialAppState, { type: 'setPwrView', view: 'ops' });
    expect(s.pwrView).toBe('ops');
    for (const r of ['bwr', 'vver'] as const) {
      let t = appReducer(initialAppState, { type: 'setReactor', reactor: r });
      t = appReducer(t, { type: 'setPwrView', view: 'ops' });
      expect(t.pwrView).toBe('plant');
    }
    // PWR’de açıkken başka reaktöre geçince modül durumu taşınmaz; geri dönünce santral şeması açılır.
    s = appReducer(s, { type: 'setReactor', reactor: 'bwr' });
    expect(s.pwrView).toBe('plant');
    s = appReducer(s, { type: 'setReactor', reactor: 'pwr' });
    expect(s.pwrView).toBe('plant');
  });

  it('karşılaştırma veya öğrenme görünümüne geçince işletme modülü kapanır', () => {
    for (const v of ['compare', 'learn'] as const) {
      let s = appReducer(initialAppState, { type: 'setPwrView', view: 'ops' });
      s = appReducer(s, { type: 'setView', view: v });
      expect(s.pwrView).toBe('plant');
    }
  });
});

describe('reaktör yapılandırmaları', () => {
  const ids = ['pwr', 'bwr', 'vver'] as const;

  it('her reaktörün kendine özgü sahnesi, dersleri ve yakın planları var', () => {
    expect(new Set(ids.map((r) => reactors[r].Scene)).size).toBe(3);
    expect(new Set(ids.map((r) => reactors[r].CoreDetail)).size).toBe(3);
    expect(new Set(ids.map((r) => reactors[r].lessons)).size).toBe(3);
  });

  it('bileşen kimlikleri reaktör içinde benzersiz ve yakın plan anahtarları tanımlı', () => {
    for (const r of ids) {
      const { config } = reactors[r];
      const compIds = config.components.map((c) => c.id);
      expect(new Set(compIds).size).toBe(compIds.length);
      const detailKeys = new Set(config.details.map((d) => d.key));
      for (const c of config.components) if (c.detail) expect(detailKeys.has(c.detail)).toBe(true);
      for (const a of config.focusActions) if (a.detail) expect(detailKeys.has(a.detail)).toBe(true);
    }
  });

  it('BWR’de buhar üreteci ve basınçlandırıcı yok; PWR ve VVER’de var', () => {
    const has = (r: (typeof ids)[number], re: RegExp) => reactors[r].config.components.some((c) => re.test(c.name));
    expect(has('bwr', /buhar üreteci/i)).toBe(false);
    expect(has('bwr', /basınçlandırıcı/i)).toBe(false);
    expect(has('pwr', /buhar üreteci/i)).toBe(true);
    expect(has('vver', /yatay buhar üreteci/i)).toBe(true);
  });

  it('VVER notu çevrim sayısı ve yerleşim değişkenliğini belirtir', () => {
    expect(reactors.vver.config.notes.join(' ')).toMatch(/çevrim sayısı ve yerleşim modele göre değişir/);
  });
});

describe('akış yolu yardımcıları', () => {
  it('wrap negatif ve taşan değerleri yolun içine alır', () => {
    expect(wrap(-1, 10)).toBe(9);
    expect(wrap(25, 10)).toBe(5);
  });

  it('LUT noktaları yol üzerinde kalır (düz çizgi)', () => {
    const lut = buildLut(100, (s) => ({ x: s, y: 50 }));
    for (const s of [0, 13, 57, 99.9]) {
      const [x, y] = sampleLut(lut, s);
      expect(y).toBe(50);
      expect(Math.abs(x - s)).toBeLessThanOrEqual(1);
    }
  });

  it('sabit debili devrede akış katsayısı güçten bağımsız', () => {
    expect(flowFactor('constant', 0.2)).toBe(flowFactor('constant', 1));
    expect(flowFactor('power', 0.2)).toBeLessThan(flowFactor('power', 1));
  });
});
