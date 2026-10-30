import { describe, expect, it } from 'vitest';
import { COMPARE_TOPICS } from './compareTopics';
import { buildActionRegistry } from '../../knowledge/kb';
import { isSourceId } from '../../knowledge/sources';
import type { ReactorId } from '../../reactors/shared/types';

const reg = buildActionRegistry();

describe('karşılaştırma konuları', () => {
  it('istenen ilk altı konu var ve kimlikler benzersiz', () => {
    expect(COMPARE_TOPICS.map((t) => t.id)).toEqual(['steam-where', 'heat-path', 'loops', 'pressurizer', 'sg-layout', 'rods']);
  });
  it('her reaktör için açıklama, kaynak ve ana şemada gerçekten var olan vurgu kimlikleri', () => {
    for (const t of COMPARE_TOPICS) {
      for (const r of ['pwr', 'bwr', 'vver'] as ReactorId[]) {
        const side = t.sides[r];
        expect(side.text.length).toBeGreaterThan(20);
        expect(side.mini.length).toBeGreaterThan(0);
        side.sourceIds.forEach((s) => expect(isSourceId(s)).toBe(true));
        const bad = side.main.filter((id) => !reg.highlightIds[r].has(id));
        expect(bad, `${t.id}/${r}`).toEqual([]);
      }
    }
  });
  it('BWR’de basınçlandırıcı ve ayrı buhar üreteci vurgulanmaz', () => {
    for (const t of COMPARE_TOPICS) {
      expect(t.sides.bwr.mini).not.toContain('pzr');
      expect(t.sides.bwr.mini).not.toContain('sg');
    }
  });
});
