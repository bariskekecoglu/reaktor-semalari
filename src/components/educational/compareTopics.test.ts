import { describe, expect, it } from 'vitest';
import { COMPARE_TOPICS, getCompareTopic } from './compareTopics';
import { buildActionRegistry } from '../../knowledge/kb';
import { isSourceId } from '../../knowledge/sources';
import { REACTOR_IDS } from '../../reactors/meta';

const reg = buildActionRegistry();

describe('karşılaştırma konuları', () => {
  it('ilk altı konu korunur, beş reaktör için istenen yeni başlıklar eklenir; kimlikler benzersiz', () => {
    const ids = COMPARE_TOPICS.map((t) => t.id);
    expect(ids.slice(0, 6)).toEqual(['steam-where', 'heat-path', 'loops', 'pressurizer', 'sg-layout', 'rods']);
    for (const id of ['moderator', 'coolant', 'boundary', 'channel-dir', 'sg-vs-drum', 'fuel']) expect(ids).toContain(id);
    expect(new Set(ids).size).toBe(ids.length);
  });
  it('her konu beş reaktörün hepsini kapsar; kaynaklar ve ana şema vurguları gerçek kimliklerdir', () => {
    for (const t of COMPARE_TOPICS) {
      expect(Object.keys(t.sides).sort()).toEqual([...REACTOR_IDS].sort());
      for (const r of REACTOR_IDS) {
        const side = t.sides[r];
        expect(side.text.length, `${t.id}/${r}`).toBeGreaterThan(20);
        expect(side.sourceIds.length, `${t.id}/${r}`).toBeGreaterThan(0);
        side.sourceIds.forEach((s) => expect(isSourceId(s), `${t.id}/${r}: ${s}`).toBe(true));
        if (side.absent) {
          // Uygulanmayan konu başka bir ekipmana yönlendirilmez.
          expect(side.mini, `${t.id}/${r}`).toEqual([]);
          expect(side.main, `${t.id}/${r}`).toEqual([]);
          expect(side.text).toMatch(/bulunmaz/);
        } else {
          expect(side.mini.length, `${t.id}/${r}`).toBeGreaterThan(0);
          expect(side.main.length, `${t.id}/${r}`).toBeGreaterThan(0);
        }
        const bad = side.main.filter((id) => !reg.highlightIds[r].has(id));
        expect(bad, `${t.id}/${r}`).toEqual([]);
      }
    }
  });
  it('BWR ve RBMK’de basınçlandırıcı ve ayrı buhar üreteci vurgulanmaz', () => {
    for (const t of COMPARE_TOPICS) {
      for (const r of ['bwr', 'rbmk'] as const) {
        expect(t.sides[r].mini).not.toContain('pzr');
        expect(t.sides[r].mini).not.toContain('sg');
      }
    }
    expect(getCompareTopic('pressurizer')!.sides.rbmk.absent).toBe(true);
    expect(getCompareTopic('sg-layout')!.sides.rbmk.absent).toBe(true);
  });
  it('kanal yönü yalnız basınç kanallı tasarımlarda uygulanır', () => {
    const t = getCompareTopic('channel-dir')!;
    for (const r of ['pwr', 'bwr', 'vver'] as const) expect(t.sides[r].absent).toBe(true);
    expect(t.sides.rbmk.text).toMatch(/Dikey/);
    expect(t.sides.candu.text).toMatch(/Yatay/);
  });
  it('CANDU’da türbin buharı buhar üretecinde; RBMK’de kanallarda oluşur', () => {
    const t = getCompareTopic('steam-where')!;
    expect(t.sides.candu.main).toContain('sg1');
    expect(t.sides.rbmk.main).toContain('channels');
    expect(t.sides.rbmk.main).not.toContain('sg');
  });
  it('CANDU’nun doğal uranyum yakıtı mutlak kural gibi sunulmaz', () => {
    const t = getCompareTopic('fuel')!;
    expect(t.sides.candu.text).toMatch(/tipik/);
    expect(t.sides.candu.text).toMatch(/başka yakıt/);
    expect(t.sides.candu.scope).toBe('drawn');
  });
});
