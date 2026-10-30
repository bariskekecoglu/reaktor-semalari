import { describe, expect, it } from 'vitest';
import { appReducer, initialAppState, navSnapshot, type AppState } from '../app/appState';
import { reactors } from '../reactors/registry';
import type { ReactorId } from '../reactors/shared/types';
import { planAction } from './execute';
import type { AssistantAction } from './actions';

const lessonIndex = (id: string) => {
  for (const r of Object.keys(reactors) as ReactorId[]) {
    const i = reactors[r].lessons.findIndex((l) => l.id === id);
    if (i >= 0) return { reactor: r, step: i, count: reactors[r].lessons.length };
  }
  return null;
};
const run = (s: AppState, a: AssistantAction) => {
  const plan = planAction(a, s, lessonIndex);
  return { plan, state: plan.dispatches.reduce(appReducer, s) };
};

describe('asistan gezinmesi (mevcut reducer üzerinden)', () => {
  it('aynı reaktörde ekipman seçimi sahneyi yeniden bağlamaz ve reaktör değişimi istemez', () => {
    const { plan, state } = run(initialAppState, { type: 'selectEquipment', reactor: 'pwr', equipmentId: 'pressurizer' });
    expect(plan.needsReactorChange).toBeNull();
    expect(state.selected).toBe('pressurizer');
    expect(state.sceneEpoch).toBe(initialAppState.sceneEpoch);
  });

  it('başka reaktör gerektiren işlem açıkça işaretlenir', () => {
    const { plan, state } = run(initialAppState, { type: 'selectEquipment', reactor: 'vver', equipmentId: 'hsg' });
    expect(plan.needsReactorChange).toBe('vver');
    expect(state.reactor).toBe('vver');
    expect(state.selected).toBe('hsg');
  });

  it('grafik olayı işletme modülünün ksenon bölümünü açar ve olayı taşır', () => {
    const { state } = run(initialAppState, { type: 'focusChartEvent', eventId: 'xenon:shut-100:peak-model' });
    expect(state.pwrView).toBe('ops');
    expect(state.opsSection).toBe('xenon');
    expect(state.opsFocus?.eventId).toBe('xenon:shut-100:peak-model');
  });

  it('ders açma: anlatım adımı ve tahmin dersi', () => {
    expect(run(initialAppState, { type: 'openLesson', lessonId: 'pwr.tour.sg' }).state).toMatchObject({ view: 'learn', learnMode: 'tour', lessonStep: 2 });
    expect(run(initialAppState, { type: 'openLesson', lessonId: 'pwr.predict.xenon-shutdown' }).state).toMatchObject({ view: 'learn', learnMode: 'predict' });
  });

  it('vurgu kullanıcı seçimiyle temizlenir; önceki konuma dönülebilir', () => {
    const before = { ...initialAppState, selected: 'sg' };
    const snap = navSnapshot(before);
    let s = run(before, { type: 'highlightFlow', reactor: 'pwr', ids: ['f-hotleg'], label: 'Sıcak kol' }).state;
    expect(s.assistantHL?.ids).toEqual(['f-hotleg']);
    s = appReducer(s, { type: 'select', id: 'rcp' });
    expect(s.assistantHL).toBeNull();
    s = appReducer(s, { type: 'restoreNav', nav: snap });
    expect(s.selected).toBe('sg');
  });

  it('görünüm/öğrenme geçişleri güç ve oynatma alanlarına dokunmaz; ders adımı korunur', () => {
    let s = appReducer(initialAppState, { type: 'setView', view: 'learn' });
    s = appReducer(s, { type: 'lessonStep', step: 3, count: 6 });
    s = appReducer(s, { type: 'setLearnMode', mode: 'predict' });
    s = appReducer(s, { type: 'setLearnMode', mode: 'tour' });
    expect(s.lessonStep).toBe(3);
    expect(s.sceneEpoch).toBe(initialAppState.sceneEpoch);
  });

  it('tahmin dersi PWR dışında açılmaz', () => {
    const bwr = appReducer(initialAppState, { type: 'setReactor', reactor: 'bwr' });
    expect(appReducer(bwr, { type: 'setLearnMode', mode: 'predict' })).toBe(bwr);
  });
});
