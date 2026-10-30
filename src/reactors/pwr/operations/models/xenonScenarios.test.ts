import { describe, expect, it } from 'vitest';
import { allScenarioKeys, buildScenario, figurePeakHour, findChartEvent } from './xenonScenarios';
import { isSourceId } from '../../../../knowledge/sources';
import { pwrConfig } from '../../pwrConfig';

describe('ksenon grafik olayları', () => {
  it('her olayın kararlı, benzersiz kimliği, geçerli zamanı, kaynağı ve ilgili ekipmanı var', () => {
    const ids = new Set<string>();
    const equipment = new Set(pwrConfig.components.map((c) => c.id));
    for (const { lab, key } of allScenarioKeys()) {
      const sc = buildScenario(lab, key);
      for (const e of sc.events) {
        expect(e.id).toBe(`xenon:${sc.id}:${e.key}`);
        expect(ids.has(e.id)).toBe(false);
        ids.add(e.id);
        expect(e.t).toBeGreaterThanOrEqual(0);
        expect(e.t).toBeLessThanOrEqual(sc.hours);
        expect(e.sourceIds.length).toBeGreaterThan(0);
        e.sourceIds.forEach((s) => expect(isSourceId(s)).toBe(true));
        e.related.forEach((r) => expect(equipment.has(r)).toBe(true));
      }
      // Olaylar zamana göre sıralı.
      expect(sc.events.map((e) => e.t)).toEqual([...sc.events.map((e) => e.t)].sort((a, b) => a - b));
    }
  });

  it('kaynakta işaretli ve modelden hesaplanan olaylar ayrı türdedir', () => {
    const sc = buildScenario('shutdown', '100');
    const kinds = Object.fromEntries(sc.events.map((e) => [e.key, e.kind]));
    expect(kinds).toMatchObject({ trip: 'source', 'peak-figure': 'figure', 'peak-model': 'model' });
    // Model olaylarının kaynakları modeli de içerir; şekil olayı yalnız şekle dayanır.
    expect(sc.events.find((e) => e.key === 'peak-model')!.sourceIds).toContain('model-xenon');
    expect(sc.events.find((e) => e.key === 'peak-figure')!.sourceIds).toEqual(['fig-2-41']);
  });

  it('şekilden okunan tepe ile model tepesi birkaç saat içinde (yön ve zaman uyumu)', () => {
    for (const l of [25, 50, 75, 100] as const) {
      const sc = buildScenario('shutdown', String(l));
      const model = sc.events.find((e) => e.key === 'peak-model')!.t;
      expect(Math.abs(model - figurePeakHour(l))).toBeLessThan(2.5);
    }
  });

  it('olay kimliği çözümleme: geçerli kimlik bulunur, uydurma kimlik reddedilir', () => {
    expect(findChartEvent('xenon:shut-75:peak-model')?.scenario.key).toBe('75');
    expect(findChartEvent('xenon:load-12-3-6-3:ramp-1-start')?.event.kind).toBe('figure');
    expect(findChartEvent('xenon:shut-60:peak-model')).toBeNull();
    expect(findChartEvent('xenon:shut-100:peak-model; DROP')).toBeNull();
    expect(findChartEvent('peak-model')).toBeNull();
  });
});
