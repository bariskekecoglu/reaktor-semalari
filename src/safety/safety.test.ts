import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { appReducer, initialAppState, navSnapshot } from '../app/appState';
import { actionReactor, validateAction } from '../assistant/actions';
import { planAction } from '../assistant/execute';
import { localAnswer } from '../assistant/localGuide';
import { suggestedQuestions } from '../assistant/suggestions';
import type { AssistantContext } from '../assistant/types';
import { buildActionRegistry, localKnowledge as kb } from '../knowledge/kb';
import { REACTOR_IDS } from '../reactors/meta';
import { reactors } from '../reactors/registry';
import { SAFETY_TOPICS, safetyEquipment } from './catalog';
import { SafetyPanel } from './SafetyPanel';

const ctx: AssistantContext = { reactor: 'pwr', view: 'scheme', pwrView: 'plant', opsSection: 'modes', selected: null, xenonScenario: null };

describe('güvenlik katmanı ve yerel rehber bütünleşmesi', () => {
  it.each(REACTOR_IDS)('%s: bütün konular kaynaklı cevap verir ve doğru katmanı açar', reactor => {
    for (const topic of SAFETY_TOPICS) {
      const reply = localAnswer(kb, `${reactor.toUpperCase()} ${topic.question}`, ctx);
      expect(reply.guideId).toBe(`entry:${reactor}.safety.${topic.id}`);
      expect(reply.sourceIds.length).toBeGreaterThan(0);
      const action = reply.actions[0];
      expect(validateAction(action, buildActionRegistry()).ok).toBe(true);
      expect(actionReactor(action)).toBe(reactor);
      const plan = planAction(action, initialAppState, () => null);
      const next = plan.dispatches.reduce(appReducer, initialAppState);
      expect(next).toMatchObject({ reactor, safetyTopic: topic.id, view: 'scheme', pwrView: 'plant', rbmkView: 'plant' });
      expect(plan.needsReactorChange).toBe(reactor === 'pwr' ? null : reactor);
    }
  });
  it.each(REACTOR_IDS)('%s: adsız soru açık reaktöre göre cevaplanır; öneriler karşılanır', reactor => {
    const context = { ...ctx, reactor };
    expect(localAnswer(kb, 'ECCS nedir?', context).guideId).toBe(`entry:${reactor}.safety.eccs`);
    for (const safetyTopic of [null, ...SAFETY_TOPICS.map(t => t.id)]) {
      for (const question of suggestedQuestions({ ...context, safetyTopic }, kb)) {
        const reply = localAnswer(kb, question, context);
        expect(reply.notCovered, question).not.toBe(true);
        expect(reply.clarify, question).toBeUndefined();
        expect(reply.actions[0] && actionReactor(reply.actions[0]), question).toBe(reactor);
      }
    }
  });
  it('güvenlik takip sorusunda konu korunur ve seçili ekipman bağlamı kullanılır', () => {
    const previous = localAnswer(kb, 'PWR ECCS nedir?', ctx);
    expect(localAnswer(kb, 'peki CANDUda?', ctx, { previous }).guideId).toBe('entry:candu.safety.eccs');
    expect(localAnswer(kb, 'Bu parça ne işe yarar?', { ...ctx, selected: 'sg' }).guideId).toBe('entry:pwr.sg');
    expect(localAnswer(kb, 'Bu parça ne işe yarar?', ctx).actions).toEqual([]);
  });
  it('geçersiz hedefleri reddeder; güç ve sahne saatini sıfırlamaz', () => {
    const reg = buildActionRegistry();
    expect(validateAction({ type: 'openSafetyTopic', reactor: 'pwr', topic: 'unknown' }, reg).ok).toBe(false);
    expect(validateAction({ type: 'openSafetyTopic', reactor: 'unknown', topic: 'eccs' }, reg).ok).toBe(false);
    const state = appReducer({ ...initialAppState, sceneEpoch: 7, pwrView: 'ops' }, { type: 'setSafetyTopic', topic: 'eccs' });
    expect(state.sceneEpoch).toBe(7);
    expect(state.pwrView).toBe('plant');
  });
  it('farklı görünümlerde katman kapanır ve önceki konuma dönülür', () => {
    const state = appReducer(initialAppState, { type: 'setSafetyTopic', topic: 'barriers' });
    const nav = navSnapshot(state);
    const ops = appReducer(state, { type: 'setOpsSection', section: 'modes' });
    expect(ops.safetyTopic).toBeNull();
    expect(appReducer(state, { type: 'setView', view: 'compare' }).safetyTopic).toBeNull();
    expect(appReducer(state, { type: 'setReactor', reactor: 'rbmk' }).safetyTopic).toBeNull();
    expect(appReducer(ops, { type: 'restoreNav', nav }).safetyTopic).toBe('barriers');
  });
  it.each(REACTOR_IDS)('%s: panel kapsamı gösterir; çizilmeyen ECCS ekipmanını taklit etmez', reactor => {
    expect(safetyEquipment(reactor, 'eccs')).toEqual([]);
    for (const topic of SAFETY_TOPICS) {
      for (const id of safetyEquipment(reactor, topic.id)) expect(reactors[reactor].config.components.some(c => c.id === id)).toBe(true);
    }
    const markup = renderToStaticMarkup(createElement(SafetyPanel, {
      config: reactors[reactor].config, topicId: 'eccs', onTopic: () => {}, onClose: () => {}, onAsk: () => {}, onInspect: () => {},
    }));
    expect(markup).toContain('Asistana sor');
    expect(markup).toContain('hesaplanmaz');
    expect(markup).not.toContain('Şemada ilişkili parçaları vurgula');
  });
  it.each(['PWR ECCS kaç saniyede devreye girer?', 'CANDU yedek jeneratörü kaç saat çalışır?', 'PWR BWR hangisi daha güvenli?'])('tasarıma özgü bilinmeyen sayıları ve güvenlik sıralamasını üretmez: %s', q => {
    expect(localAnswer(kb, q, ctx).notCovered).toBe(true);
  });
});
