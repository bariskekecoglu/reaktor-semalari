import { afterEach, describe, expect, it } from 'vitest';
import { setLanguage, t, translateData } from './locale';
import { BWR_FLOW } from '../lessons/predict/bwrFlow';
afterEach(() => setLanguage('tr'));
describe('TR / EN', () => {
  it('switches reversibly and leaves untranslated text intact', () => {
    expect(t('Şema')).toBe('Şema');
    setLanguage('en');
    expect(t('Şema')).toBe('Diagram');
    expect(t('untranslated')).toBe('untranslated');
    setLanguage('tr');
    expect(t('Şema')).toBe('Şema');
  });
  it('translates the BWR lesson without changing identifiers or mutating the source', () => {
    setLanguage('en');
    const en = translateData(BWR_FLOW);
    expect(en.id).toBe(BWR_FLOW.id);
    expect(en.predict.choices.map(c => c.id)).toEqual(BWR_FLOW.predict.choices.map(c => c.id));
    expect(en.title).toContain('recirculation');
    expect(en.explain.text).toContain('negative void coefficient');
    expect(BWR_FLOW.title).toContain('Devridaim');
  });
});
