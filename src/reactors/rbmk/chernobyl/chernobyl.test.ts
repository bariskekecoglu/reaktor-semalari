import { describe, expect, it, vi } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { ChernobylView } from './ChernobylView';
import { appReducer, initialAppState, navSnapshot } from '../../../app/appState';
import { lessonHash, parseLessonHash } from '../../../progress/deepLink';
import { emptyProgress, parseProgress, recordChernobyl, recordTourStep } from '../../../progress/progressStore';
import { buildCatalog } from '../../../progress/useProgress';
import { buildActionRegistry, localKnowledge } from '../../../knowledge/kb';
import { isSourceId } from '../../../knowledge/sources';
import { localAnswer } from '../../../assistant/localGuide';
import { planAction } from '../../../assistant/execute';
import { validateAction } from '../../../assistant/actions';
import type { AssistantContext } from '../../../assistant/types';
import { AZ5_TIME, END_TIME, TEST_START, TIMELINE } from './timeline';
import { advanceTime, stateAt } from './curves';
import { STAGES } from './stages';

const cat = buildCatalog();
const ctx: AssistantContext = { reactor: 'pwr', view: 'scheme', pwrView: 'plant', opsSection: 'modes', selected: null, xenonScenario: null };
describe('Çernobil kaynak ve zaman tutarlılığı', () => {
  it('olaylar sıralı; bütün olay ve aşamalar geçerli kaynak ve konum taşır', () => {
    expect(TIMELINE.map(e => e.t)).toEqual(TIMELINE.map(e => e.t).sort((a, b) => a - b));
    expect(new Set(TIMELINE.map(e => e.id)).size).toBe(TIMELINE.length);
    for (const item of [...TIMELINE, ...STAGES]) {
      expect(item.sourceIds.length).toBeGreaterThan(0);
      expect(item.sourceIds.every(isSourceId)).toBe(true);
      expect(item.locator.length).toBeGreaterThan(8);
    }
    for (const e of TIMELINE.filter(e => e.level === 'uncertain')) expect(e.thermalMW).toBeUndefined();
  });
  it('sınırlar, olay eşikleri, nitel çizimlerin sonlandırılması ve aşama eşlemesi', () => {
    expect(stateAt(-1).t).toBe(TIMELINE[0].t);
    expect(stateAt(Infinity).t).toBe(TIMELINE[0].t);
    expect(stateAt(END_TIME + 100).t).toBe(END_TIME);
    expect(stateAt(TEST_START - 1).stage).toBe('conditions');
    expect(stateAt(TEST_START).stage).toBe('void');
    expect(stateAt(AZ5_TIME - .1).event.id).toBe('test');
    expect(stateAt(AZ5_TIME).event.id).toBe('az5');
    expect(stateAt(AZ5_TIME).stage).toBe('az5');
    expect(stateAt(TEST_START + 39).stage).toBe('seconds');
    expect(stateAt(TEST_START + 39).uncertain).toBe(true);
    expect(stateAt(TEST_START + 43).flowDrawing).toBeNull();
    expect(stateAt(TEST_START + 43).voidDrawing).toBeNull();
    expect(stateAt(TEST_START + 43).rodDrawing).toBeNull();
    expect(stateAt(END_TIME).stage).toBe('lessons');
    for (const e of TIMELINE) expect(stateAt(e.t).event.id).toBe(e.id);
  });
  it('oynatma zamanı ölçekleri, hız ve bitiş sınırı bağımsızdır', () => {
    expect(advanceTime(TEST_START, 4, .25, true)).toBe(TEST_START + 1);
    expect(advanceTime(TEST_START, 4, .5, true)).toBe(TEST_START + 2);
    expect(advanceTime(TEST_START, -4, 1, true)).toBe(TEST_START);
    expect(advanceTime(END_TIME - 1, 10, 1, true)).toBe(END_TIME);
    expect(advanceTime(TIMELINE[0].t, 1, 1, false)).toBe(TIMELINE[0].t + 3600);
  });
});
describe('RBMK kaza görünümünün izolasyonu', () => {
  it('işletim sistemi hareket azaltma tercihiyle oynatma kapanır; kaydırıcı ve olaylar kalır', () => {
    vi.stubGlobal('window', { matchMedia: () => ({ matches: true }) });
    try {
      const html = renderToStaticMarkup(createElement(ChernobylView, { stageId: 'seconds', onStage: () => {}, onCompare: () => {} }));
      expect(html).toMatch(/disabled="" aria-pressed="false">Oynat/);
      expect(html).toContain('aria-valuetext=');
      expect(html).toContain('Sonraki olay');
      expect(html).toContain('aria-live="polite"');
    } finally { vi.unstubAllGlobals(); }
  });
  it('diğer reaktörlerde açılmaz; reaktör değişiminde ve öğrenmede kapanır', () => {
    for (const reactor of ['pwr', 'bwr', 'vver', 'candu'] as const) {
      const s = { ...initialAppState, reactor };
      expect(appReducer(s, { type: 'setRbmkView', view: 'chernobyl' })).toBe(s);
      expect(appReducer(s, { type: 'setChernobylStage', stage: 'az5' })).toBe(s);
    }
    const open = appReducer({ ...initialAppState, reactor: 'rbmk' }, { type: 'setChernobylStage', stage: 'az5' });
    expect(open.rbmkView).toBe('chernobyl');
    expect(appReducer(open, { type: 'setReactor', reactor: 'bwr' }).rbmkView).toBe('plant');
    expect(appReducer(open, { type: 'setLearnMode', mode: 'tour' }).rbmkView).toBe('plant');
    expect(appReducer(open, { type: 'setView', view: 'compare' }).rbmkView).toBe('plant');
    expect(appReducer(open, { type: 'restoreNav', nav: navSnapshot(open) }).chernobylStage).toBe('az5');
  });
  it('asistan hedefi doğrulanır ve aynı reducer ile açılır', () => {
    const action = { type: 'openChernobylStage' as const, stage: 'az5' as const };
    expect(validateAction(action, buildActionRegistry()).ok).toBe(true);
    expect(validateAction({ ...action, stage: 'injected' }, buildActionRegistry()).ok).toBe(false);
    const plan = planAction(action, initialAppState, () => null);
    expect(plan.needsReactorChange).toBe('rbmk');
    expect(plan.dispatches.reduce(appReducer, initialAppState)).toMatchObject({ reactor: 'rbmk', rbmkView: 'chernobyl', chernobylStage: 'az5' });
  });
});
describe('aşama bağlantısı ve geriye uyumlu v1 ilerleme', () => {
  it('beş aşama bağlantısı gidip gelir; bilinmeyen aşama ilk aşamaya düşer', () => {
    for (const { id } of STAGES) {
      const link = { kind: 'chernobyl' as const, stage: id };
      expect(parseLessonHash(lessonHash(link, cat), cat)).toEqual(link);
    }
    expect(parseLessonHash('#ders=rbmk.chernobyl&adim=invalid', cat)).toEqual({ kind: 'chernobyl', stage: 'conditions' });
  });
  it('eski kayıt aynen okunur; yeni aşama, son konum ve tamamlanma saklanır', () => {
    const old = recordTourStep(emptyProgress(), 'rbmk', cat.tours.rbmk[1], cat.tours.rbmk);
    expect(parseProgress(JSON.parse(JSON.stringify(old)), cat)).toEqual(old);
    const current = recordChernobyl(old, 'az5');
    expect(parseProgress(current, cat)).toEqual(current);
    expect(current.version).toBe(old.version);
    expect(parseProgress(recordChernobyl(current, 'lessons'), cat).completed).toContain('rbmk.chernobyl');
    expect(parseProgress({ ...old, chernobyl: 'invalid' }, cat).chernobyl).toBeUndefined();
  });
});
describe('yerel rehber kaza soruları', () => {
  it.each([
    ["Çernobil'de ne oldu?", 'conditions'], ['Chernobyl kazası nasıl oldu', 'conditions'], ['Чорнобиль kazası', 'conditions'], ['Чорнобиль', 'conditions'],
    ['Pozitif boşluk katsayısı nedir?', 'void'], ['RBMK void coefficient nedir', 'void'],
    ['AZ-5 nedir', 'az5'], ['AZ5 neden ters etki yaptı', 'az5'], ['Çernobil tepe gücü kaçtı', 'seconds'],
    ['Bugünkü RBMK’ler farklı mı?', 'lessons'], ['PWR’de Çernobil kazası olabilir mi?', 'void'],
  ])('%s → %s', (q, stage) => {
    const r = localAnswer(localKnowledge, q, ctx);
    expect(r.actions).toContainEqual({ type: 'openChernobylStage', stage });
    expect(r.sourceIds).toContain('iaea-insag7');
  });
  it('mevcut reaktör sorularını gölgelemez', () => {
    expect(localAnswer(localKnowledge, 'PWR su nerede kaynar?', ctx).actions.some(a => a.type === 'openChernobylStage')).toBe(false);
    expect(localAnswer(localKnowledge, 'BWR su nerede kaynar?', ctx).guideId).toBe('compare:steam-where:bwr');
  });
});
