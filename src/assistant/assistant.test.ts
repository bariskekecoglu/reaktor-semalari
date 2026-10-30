import { describe, expect, it } from 'vitest';
import { buildActionRegistry, knowledgeProblems, localKnowledge as kb } from '../knowledge/kb';
import { validateAction, validateActions } from './actions';
import { validateModelReply } from './modelReply';
import { candidateIds, localAnswer } from './localGuide';
import type { AssistantContext } from './types';

const reg = buildActionRegistry();
const ctx = (over: Partial<AssistantContext> = {}): AssistantContext => ({
  reactor: 'pwr',
  view: 'scheme',
  pwrView: 'plant',
  opsSection: 'modes',
  selected: null,
  xenonScenario: null,
  ...over,
});

describe('işlem doğrulama', () => {
  it('bilinen kimliklerle geçerli işlemleri kabul eder', () => {
    expect(validateAction({ type: 'selectEquipment', reactor: 'pwr', equipmentId: 'pressurizer' }, reg).ok).toBe(true);
    expect(validateAction({ type: 'selectEquipment', reactor: 'vver', equipmentId: 'hsg' }, reg).ok).toBe(true);
    expect(validateAction({ type: 'openDetail', reactor: 'vver', detail: 'hsg' }, reg).ok).toBe(true);
    expect(validateAction({ type: 'openOperationsSection', section: 'xenon' }, reg).ok).toBe(true);
    expect(validateAction({ type: 'openLesson', lessonId: 'pwr.tour.sg' }, reg).ok).toBe(true);
    expect(validateAction({ type: 'openLesson', lessonId: 'pwr.predict.xenon-shutdown' }, reg).ok).toBe(true);
    expect(validateAction({ type: 'focusChartEvent', eventId: 'xenon:shut-50:peak-model' }, reg).ok).toBe(true);
  });

  it('başka reaktörün ekipmanını reddeder (BWR’de basınçlandırıcı yok)', () => {
    expect(validateAction({ type: 'selectEquipment', reactor: 'bwr', equipmentId: 'pressurizer' }, reg).ok).toBe(false);
    expect(validateAction({ type: 'selectEquipment', reactor: 'pwr', equipmentId: 'hsg' }, reg).ok).toBe(false);
  });

  it('bilinmeyen tür, bölüm, ders, olay ve yakın planı reddeder', () => {
    expect(validateAction({ type: 'runScript', code: 'alert(1)' }, reg).ok).toBe(false);
    expect(validateAction({ type: 'openOperationsSection', section: 'secret' }, reg).ok).toBe(false);
    expect(validateAction({ type: 'openLesson', lessonId: 'pwr.tour.nope' }, reg).ok).toBe(false);
    expect(validateAction({ type: 'focusChartEvent', eventId: 'xenon:shut-33:peak-model' }, reg).ok).toBe(false);
    expect(validateAction({ type: 'focusChartEvent', eventId: 'xenon:shut-100:nope' }, reg).ok).toBe(false);
    expect(validateAction({ type: 'openDetail', reactor: 'bwr', detail: 'pressurizer' }, reg).ok).toBe(false);
  });

  it('seçici, URL veya boşluk içeren kimlikleri reddeder', () => {
    expect(validateAction({ type: 'selectEquipment', reactor: 'pwr', equipmentId: '#app > div' }, reg).ok).toBe(false);
    expect(validateAction({ type: 'highlightFlow', reactor: 'pwr', ids: ['javascript:alert(1)'] }, reg).ok).toBe(false);
    expect(validateAction({ type: 'highlightFlow', reactor: 'pwr', ids: [] }, reg).ok).toBe(false);
  });

  it('vurguda yalnız o reaktörün akış/ekipman kimliklerine izin verir ve fazla alanları atar', () => {
    const r = validateAction({ type: 'highlightFlow', reactor: 'pwr', ids: ['sg', 'f-hotleg', 'sg'], label: 'x', onClick: 'evil' }, reg);
    expect(r).toEqual({ ok: true, value: { type: 'highlightFlow', reactor: 'pwr', ids: ['sg', 'f-hotleg'], label: 'x' } });
    expect(validateAction({ type: 'highlightFlow', reactor: 'bwr', ids: ['f-hotleg'] }, reg).ok).toBe(false);
  });

  it('liste doğrulaması geçersizleri ayırır ve en fazla 4 işlem değerlendirir', () => {
    const many = Array.from({ length: 6 }, () => ({ type: 'clearAssistantHighlight' }));
    const r = validateActions([...many.slice(0, 2), { type: 'bad' }, ...many.slice(2)], reg);
    expect(r.actions).toHaveLength(3);
    expect(r.rejected.length).toBeGreaterThanOrEqual(2);
    expect(validateActions('not-an-array', reg).actions).toEqual([]);
  });
});

describe('bilgi tabanı', () => {
  it('tüm kaynak kimlikleri kayıtlı ve tüm hedefler geçerli işlem', () => {
    expect(knowledgeProblems(reg, (a) => validateAction(a, reg).ok)).toEqual([]);
  });
  it('girdi kimlikleri benzersiz', () => {
    const ids = kb.all().map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe('model yanıtı doğrulama', () => {
  const cands = ['pwr.pressurizer', 'pwr.surge'];
  const good = {
    answer: 'Basınçlandırıcı birincil devre basıncını kontrol eder.',
    sourceIds: ['nuce-ch2'],
    entryIds: ['pwr.pressurizer'],
    actions: [{ type: 'selectEquipment', reactor: 'pwr', equipmentId: 'pressurizer' }],
    clarifyingQuestion: null,
    coverage: 'covered',
  };

  it('geçerli yanıtı kabul eder', () => {
    const r = validateModelReply(good, cands, kb, reg);
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.reply.actions).toHaveLength(1);
      expect(r.reply.sourceIds).toEqual(['nuce-ch2']);
    }
  });

  it('JSON olmayan / eksik alanlı yanıtı reddeder', () => {
    expect(validateModelReply('metin', cands, kb, reg).ok).toBe(false);
    expect(validateModelReply({ ...good, answer: '' }, cands, kb, reg).ok).toBe(false);
    expect(validateModelReply({ ...good, coverage: 'maybe' }, cands, kb, reg).ok).toBe(false);
    expect(validateModelReply({ ...good, answer: 'x'.repeat(5000) }, cands, kb, reg).ok).toBe(false);
  });

  it('uydurma ya da adaylarla ilgisiz kaynakları atar; hiç geçerli kaynak kalmazsa reddeder', () => {
    const r = validateModelReply({ ...good, sourceIds: ['nuce-ch2', 'wikipedia', 'fig-2-41'] }, cands, kb, reg);
    expect(r.ok && r.reply.sourceIds).toEqual(['nuce-ch2']);
    expect(r.ok && r.reply.rejected?.length).toBe(2);
    expect(validateModelReply({ ...good, sourceIds: ['made-up'] }, cands, kb, reg).ok).toBe(false);
  });

  it('geçersiz işlemleri çalıştırılabilir listeden çıkarır', () => {
    const r = validateModelReply({ ...good, actions: [{ type: 'eval', code: '1' }, { type: 'openDetail', reactor: 'pwr', detail: 'pressurizer' }] }, cands, kb, reg);
    expect(r.ok && r.reply.actions).toEqual([{ type: 'openDetail', reactor: 'pwr', detail: 'pressurizer' }]);
  });

  it('aday dışı içerik kimliklerini atar; “kapsanmıyor” yanıtı kaynaksız olabilir', () => {
    const r = validateModelReply({ ...good, entryIds: ['pwr.pressurizer', 'bwr.core'] }, cands, kb, reg);
    expect(r.ok && r.reply.entryIds).toEqual(['pwr.pressurizer']);
    const nc = validateModelReply({ ...good, sourceIds: [], actions: [], coverage: 'not_covered' }, cands, kb, reg);
    expect(nc.ok && nc.reply.notCovered).toBe(true);
  });
});

describe('yerel rehber', () => {
  it('“PWR’de basınçlandırıcı ne işe yarar?” → basınçlandırıcı, kaynaklı, seçme işlemiyle', () => {
    const r = localAnswer(kb, 'PWR’de basınçlandırıcı ne işe yarar?', ctx({ reactor: 'bwr' }));
    expect(r.mode).toBe('local');
    expect(r.entryIds[0]).toBe('pwr.pressurizer');
    expect(r.sourceIds.length).toBeGreaterThan(0);
    expect(r.actions).toContainEqual({ type: 'selectEquipment', reactor: 'pwr', equipmentId: 'pressurizer' });
  });

  it('“BWR’de buhar nerede oluşuyor?” → BWR içeriği', () => {
    const r = localAnswer(kb, 'BWR’de buhar nerede oluşuyor?', ctx());
    expect(r.entryIds[0].startsWith('bwr.')).toBe(true);
    expect(r.text.toLowerCase()).toContain('kaynar');
  });

  it('“VVER’in buhar üretecini göster.” → yatay buhar üreteci', () => {
    const r = localAnswer(kb, 'VVER’in buhar üretecini göster.', ctx());
    expect(r.entryIds[0]).toBe('vver.hsg');
    expect(r.actions[0]).toEqual({ type: 'selectEquipment', reactor: 'vver', equipmentId: 'hsg' });
  });

  it('“Ksenon neden kapatmadan sonra artabiliyor?” → kaynaklı ksenon konusu', () => {
    const r = localAnswer(kb, 'Ksenon neden kapatmadan sonra artabiliyor?', ctx());
    expect(r.entryIds[0]).toBe('pwr.topic.xenon-shutdown');
    expect(r.sourceIds).toContain('p-2-94');
    expect(r.actions[0]).toEqual({ type: 'focusChartEvent', eventId: 'xenon:shut-100:peak-model' });
  });

  it('“Bu grafikteki tepeyi açıkla” bağlamsız → tek açıklayıcı soru; ksenon grafiği açıkken → olay', () => {
    const a = localAnswer(kb, 'Bu grafikteki tepeyi açıkla', ctx());
    expect(a.clarify?.options.length).toBeGreaterThan(0);
    expect(a.actions).toEqual([]);
    const b = localAnswer(kb, 'Bu grafikteki tepeyi açıkla', ctx({ pwrView: 'ops', opsSection: 'xenon', xenonScenario: 'shut-75' }));
    expect(b.actions).toEqual([{ type: 'focusChartEvent', eventId: 'xenon:shut-75:peak-model' }]);
    expect(b.clarify).toBeUndefined();
  });

  it('BWR bağlamında reaktörsüz “buhar üreteci” → BWR’de olmadığını söyler', () => {
    const r = localAnswer(kb, 'buhar üreteci ne işe yarar', ctx({ reactor: 'bwr' }));
    expect(r.entryIds[0]).toBe('bwr.topic.no-sg');
  });

  it('kapsam dışı soruda açıkça kapsanmadığını söyler ve işlem önermez', () => {
    const r = localAnswer(kb, 'Füzyon reaktörlerinde tokamak nasıl çalışır?', ctx());
    expect(r.notCovered).toBe(true);
    expect(r.actions).toEqual([]);
  });

  it('aday kimlikler yalnız gerçek girdilerden oluşur', () => {
    const ids = candidateIds(kb, 'basınçlandırıcı', ctx());
    expect(ids.length).toBeGreaterThan(0);
    for (const id of ids) expect(kb.get(id)).toBeDefined();
  });
});

describe('sunucu bilgi tabanı kopyası', () => {
  it('server/knowledge.json güncel (değiştiyse: npm run kb:export)', async () => {
    const { knowledgeSnapshot } = await import('../knowledge/snapshot');
    const disk = (await import('../../server/knowledge.json')).default;
    expect(disk).toEqual(JSON.parse(JSON.stringify(knowledgeSnapshot())));
  });
});
