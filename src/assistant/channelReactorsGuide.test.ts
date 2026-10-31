import { describe, expect, it } from 'vitest';
import { localKnowledge as kb, buildActionRegistry } from '../knowledge/kb';
import { validateAction, REACTOR_IDS } from './actions';
import { guideCatalog, localAnswer } from './localGuide';
import { reactorsIn } from './search';
import { planAction } from './execute';
import { initialAppState } from '../app/appState';
import type { AssistantContext } from './types';

const ctx: AssistantContext = { reactor: 'pwr', view: 'scheme', pwrView: 'plant', opsSection: 'modes', selected: null, xenonScenario: null };
const ask = (q: string, c: Partial<AssistantContext> = {}) => localAnswer(kb, q, { ...ctx, ...c });

describe('RBMK ve CANDU: reaktör adları ve Türkçe ekler', () => {
  it('ad, kısaltma ve bitişik ekler tanınır; rastgele önekler reddedilir', () => {
    expect(reactorsIn('RBMK’de buhar nerede?')).toEqual(['rbmk']);
    expect(reactorsIn('RBMKde ve CANDUya, CANDU’nun')).toEqual(['rbmk', 'candu']);
    expect(reactorsIn('RBMKlerde grafit')).toEqual(['rbmk']);
    expect(reactorsIn('PHWR ve LWGR')).toEqual(['rbmk', 'candu']);
    expect(reactorsIn('basınçlı ağır su reaktörü')).toEqual(['candu']);
    expect(reactorsIn('CANDUevil RBMKxyz')).toEqual([]);
  });
  it('asistan işlemleri beş reaktörü kabul eder, bilinmeyen hedefleri reddeder', () => {
    const reg = buildActionRegistry();
    expect(REACTOR_IDS).toEqual(['pwr', 'bwr', 'vver', 'rbmk', 'candu']);
    expect(validateAction({ type: 'selectEquipment', reactor: 'rbmk', equipmentId: 'drum' }, reg).ok).toBe(true);
    expect(validateAction({ type: 'openDetail', reactor: 'candu', detail: 'fuelling' }, reg).ok).toBe(true);
    expect(validateAction({ type: 'selectEquipment', reactor: 'rbmk', equipmentId: 'sg' }, reg).ok).toBe(false);
    expect(validateAction({ type: 'selectEquipment', reactor: 'candu', equipmentId: 'vessel' }, reg).ok).toBe(false);
    expect(validateAction({ type: 'openDetail', reactor: 'rbmk', detail: 'fuelling' }, reg).ok).toBe(false);
    expect(validateAction({ type: 'highlightFlow', reactor: 'candu', ids: ['f-riser-1'] }, reg).ok).toBe(false);
    expect(validateAction({ type: 'openReactor', reactor: 'agr' }, reg).ok).toBe(false);
  });
  it('başka reaktörden RBMK işlemi reaktör değişimi ister ve PWR işletme görünümünü açmaz', () => {
    const plan = planAction({ type: 'selectEquipment', reactor: 'rbmk', equipmentId: 'drum' }, initialAppState, () => null);
    expect(plan.needsReactorChange).toBe('rbmk');
    expect(plan.dispatches[0]).toEqual({ type: 'setReactor', reactor: 'rbmk' });
  });
});

describe('RBMK ve CANDU: hazır cevaplar', () => {
  it.each([
    ['Grafit ne yapar?', 'entry:rbmk.focus.graphite-role'],
    ['RBMK’de grafit ne yapar?', 'entry:rbmk.focus.graphite-role'],
    ['RBMK buhar nerede oluşur?', 'compare:steam-where:rbmk'],
    ['RBMKde buhar nerede oluşuyor', 'compare:steam-where:rbmk'],
    ['Ayırıcı tambur neyi ayırır?', 'entry:rbmk.focus.drum-role'],
    ['RBMK ayırıcı tambur ne işe yarar?', 'confusion:rbmk-drum'],
    ['RBMK buhar üreteci var mı?', 'compare:sg-vs-drum:rbmk'],
    ['RBMK’nin BWR’den temel farkı nedir?', 'confusion:rbmk-vs-bwr'],
    ['RBMK ile BWR neden aynı reaktör değildir?', 'confusion:rbmk-vs-bwr'],
    ['RBMK ve BWR aynı mı', 'confusion:rbmk-vs-bwr'],
    ['RBMK’de grafit ve suyun görevleri nedir?', 'confusion:rbmk-graphite-water'],
    ['RBMK basınçlandırıcı var mı', 'compare:pressurizer:rbmk'],
    ['CANDU’da iki ağır su sistemi neden ayrıdır?', 'entry:candu.focus.two-d2o'],
    ['CANDU moderatör ve soğutucu karışır mı', 'confusion:candu-two-d2o'],
    ['Calandria ile basınç tüpü arasındaki fark nedir?', 'confusion:candu-calandria'],
    ['Calandria neden basınç kabı değildir?', 'confusion:candu-calandria'],
    ['CANDU basınç kabı var mı?', 'confusion:candu-calandria'],
    ['Türbine hangi devrenin buharı gider?', 'entry:candu.focus.turbine-steam'],
    ['Yatay kanallarda yakıt nasıl konumlanır?', 'entry:candu.focus.fuel-horizontal'],
    ['CANDUda yakıt nasıl değiştirilir?', 'compare:fuel:candu'],
    ['RBMK ile CANDU’nun kanal yapıları nasıl farklıdır?', 'confusion:rbmk-candu-channels'],
    ['calandria nedir', 'entry:candu.calandria'],
    ['basınçlı ağır su reaktörü nedir', 'entry:candu'],
    ['PWR ve CANDU farkı', 'families:pwr-candu'],
    ['PWR BWR VVER RBMK CANDU karşılaştır', 'families:pwr-bwr-vver-rbmk-candu'],
    ['CANDU kontrol çubukları nereden girer', 'compare:rods:candu'],
    ['RBMK pompası elektrik üretir mi?', 'concept:rbmk:pump-generator'],
  ])('%s', (q, id) => {
    const r = ask(q);
    expect(r.guideId).toBe(id);
    expect(r.sourceIds.length).toBeGreaterThan(0);
  });
  it('uygulanmayan karşılaştırma başka ekipmanı vurgulamaz', () => {
    const r = ask('RBMK basınçlandırıcı var mı');
    expect(r.text).toMatch(/^Bu tasarımda bulunmaz/);
    expect(r.actions).toEqual([]);
  });
  it('takip sorusu karşılaştırmayı yeni reaktöre taşır', () => {
    const previous = ask('RBMK buhar nerede oluşur?');
    // Önceki konu yoksa yalnız reaktör adı o reaktörün tanıtımını açar.
    expect(ask('peki CANDUda?').guideId).toBe('entry:candu');
    expect(localAnswer(kb, 'peki CANDUda?', ctx, { previous }).guideId).toBe('compare:steam-where:candu');
  });
  it.each(['RBMK hisse fiyatı ne?', 'CANDU nereden satın alınır?', 'RBMK çernobil kaç kişi öldü', 'CANDUevil nedir', 'CANDU reaktörünü nasıl çalıştırırım adım adım prosedür', 'RBMK için reaktivite hesabı yap'])(
    'kapsam dışına cevap uydurmaz: %s',
    (q) => {
      const r = ask(q);
      expect(r.notCovered).toBe(true);
      expect(r.actions).toEqual([]);
    },
  );
  it('CANDU birincil kaynamasını türbin buharından ayırır ve kaynağını gösterir', () => {
    for (const q of ['CANDU buhar nerede oluşur?', 'CANDU soğutucu nedir?', 'RBMK ve CANDU kanalları nasıl farklıdır?']) {
      const r = ask(q);
      expect(r.notCovered).not.toBe(true);
      expect(r.text).toMatch(/sınırlı kaynama/);
      expect(r.text).not.toMatch(/kaynamaz/);
      expect(r.sourceIds).toContain('canteach-thermal');
    }
  });
  it('katalogda RBMK ve CANDU kategorileri ve ekipman cevapları bulunur', () => {
    const cards = guideCatalog(kb);
    expect(cards.filter((c) => c.category === 'RBMK').length).toBeGreaterThan(20);
    expect(cards.filter((c) => c.category === 'CANDU').length).toBeGreaterThan(20);
    expect(cards.some((c) => c.id === 'entry:rbmk.drum')).toBe(true);
    expect(cards.some((c) => c.id === 'entry:candu.modsys')).toBe(true);
  });
});
