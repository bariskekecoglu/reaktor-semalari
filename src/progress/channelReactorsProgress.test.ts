import { describe, expect, it } from 'vitest';
import { emptyProgress, parseProgress, PROGRESS_VERSION, recordTourStep } from './progressStore';
import { buildCatalog } from './useProgress';
import { lessonHash, parseLessonHash } from './deepLink';
import { describeLast } from './ProgressPanel';
import { appReducer, initialAppState } from '../app/appState';

const cat = buildCatalog();

describe('RBMK ve CANDU öğrenme ilerlemesi', () => {
  it('katalog beş reaktörün anlatımını içerir', () => {
    expect(Object.keys(cat.tours).sort()).toEqual(['bwr', 'candu', 'pwr', 'rbmk', 'vver']);
    expect(cat.tours.rbmk[0]).toBe('rbmk.tour.graphite');
    expect(cat.tours.candu[0]).toBe('candu.tour.calandria');
  });

  it('eski (üç reaktörlü) kayıt değişmeden okunur; yeni reaktör kayıtları korunur', () => {
    const old = {
      version: PROGRESS_VERSION,
      completed: ['pwr.tour'],
      last: { lessonId: 'vver.tour', stepId: cat.tours.vver[2] },
      lastArea: 'tour',
      tourSteps: { pwr: cat.tours.pwr[1], vver: cat.tours.vver[2] },
      predictions: {},
    };
    const p = parseProgress(old, cat);
    expect(p.completed).toEqual(['pwr.tour']);
    expect(p.last).toEqual(old.last);
    expect(p.tourSteps).toEqual(old.tourSteps);

    let q = recordTourStep(p, 'rbmk', cat.tours.rbmk[3], cat.tours.rbmk);
    q = recordTourStep(q, 'candu', cat.tours.candu[cat.tours.candu.length - 1], cat.tours.candu);
    const again = parseProgress(JSON.parse(JSON.stringify(q)), cat);
    expect(again.tourSteps.rbmk).toBe(cat.tours.rbmk[3]);
    expect(again.completed).toContain('candu.tour');
    expect(describeLast(again)).toMatch(/^CANDU anlatımı · /);
  });

  it('bilinmeyen RBMK/CANDU adımları ilk adıma düşer, uydurma reaktör atılır', () => {
    const p = parseProgress(
      { version: PROGRESS_VERSION, completed: ['rbmk.tour', 'agr.tour'], last: { lessonId: 'candu.tour', stepId: 'candu.tour.eski' }, lastArea: 'tour', tourSteps: { rbmk: 'rbmk.tour.yok' }, predictions: {} },
      cat,
    );
    expect(p.completed).toEqual(['rbmk.tour']);
    expect(p.last).toEqual({ lessonId: 'candu.tour', stepId: cat.tours.candu[0] });
    expect(p.tourSteps).toEqual({});
    expect(emptyProgress().tourSteps).toEqual({});
  });

  it('doğrudan ders bağlantıları yeni reaktörlerde çalışır', () => {
    const t = parseLessonHash('#ders=candu.tour.sg', cat);
    expect(t).toEqual({ kind: 'tour', reactor: 'candu', step: cat.tours.candu.indexOf('candu.tour.sg') });
    expect(lessonHash(t!, cat)).toBe('#ders=candu.tour.sg');
    expect(parseLessonHash('#ders=rbmk.tour', cat)).toEqual({ kind: 'tour', reactor: 'rbmk', step: 0 });
    expect(parseLessonHash('#ders=rbmk.predict.xenon-shutdown', cat)).toBeNull();
  });
});

describe('reaktör geçişleri', () => {
  it('PWR’ye özgü işletme modülü ve tahmin dersi RBMK/CANDU’da açılmaz', () => {
    for (const r of ['rbmk', 'candu'] as const) {
      let s = appReducer({ ...initialAppState, pwrView: 'ops', learnMode: 'predict' }, { type: 'setReactor', reactor: r });
      expect(s.reactor).toBe(r);
      expect(s.pwrView).toBe('plant');
      expect(s.learnMode).toBe('tour');
      expect(appReducer(s, { type: 'setPwrView', view: 'ops' })).toBe(s);
      expect(appReducer(s, { type: 'setOpsSection', section: 'xenon' })).toBe(s);
      expect(appReducer(s, { type: 'setLearnMode', mode: 'predict' })).toBe(s);
      s = appReducer(s, { type: 'select', id: 'drum' });
      s = appReducer(s, { type: 'setReactor', reactor: 'pwr' });
      expect(s.selected).toBeNull();
    }
  });
  it('etiket ayrıntısı ve akış tercihleri geçişte korunur', () => {
    let s = appReducer(initialAppState, { type: 'setLabelDetail', detail: 'detailed' });
    s = appReducer(s, { type: 'toggleFlow' });
    for (const r of ['rbmk', 'candu', 'vver', 'bwr', 'pwr'] as const) s = appReducer(s, { type: 'setReactor', reactor: r });
    expect(s.labelDetail).toBe('detailed');
    expect(s.showFlow).toBe(false);
  });
});
