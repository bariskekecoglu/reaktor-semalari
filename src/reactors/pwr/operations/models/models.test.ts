import { describe, expect, it } from 'vitest';
import { FIG_2_39, FIG_2_40, FIG_2_42, FIG_2_43 } from '../data/figures';
import { MODES, fToC } from '../data/modes';
import { HEATUP } from '../data/heatup';
import { demandAt, profileDuration, profileEvents, ramps } from './profile';
import { decayHeatFraction, decayHeatPercents, equilibrium, indexAt, peakXenon, simulate, type Trajectory } from './xenon';
import { axialOffset, deltaI, splitPower, topShareOfProfile } from './axial';
import { advance, createPlayback, resetPlayback, seek, togglePlay } from './playback';

const finiteAll = (tr: Trajectory) =>
  [tr.demand, tr.power, tr.iodine, tr.xenon, tr.worth].every((a) => Array.from(a).every((v) => Number.isFinite(v)));

describe('Şekil 2-40 yük takibi profilleri', () => {
  const byId = Object.fromEntries(FIG_2_40.map((p) => [p.id, p]));

  it('tüm profillerin toplam süresi 24 saat', () => {
    for (const p of FIG_2_40) expect(profileDuration(p)).toBe(24);
  });

  it('saat noktaları azalmayan sırada ve güç %50–100 aralığında', () => {
    for (const p of FIG_2_40) {
      for (let i = 1; i < p.points.length; i++) expect(p.points[i][0]).toBeGreaterThanOrEqual(p.points[i - 1][0]);
      for (const [, v] of p.points) expect(v === 50 || v === 100).toBe(true);
    }
  });

  it('12-3-6-3: 6 sa tam güç, 3 sa rampa, 6 sa %50, 3 sa rampa (şekille ölçüldü)', () => {
    const p = byId['12-3-6-3'];
    expect(ramps(p)).toEqual([
      [6, 9, 100, 50],
      [15, 18, 50, 100],
    ]);
    expect(demandAt(p, 7.5)).toBeCloseTo(75, 6);
    expect(demandAt(p, 12)).toBe(50);
    expect(demandAt(p, 20)).toBe(100);
  });

  it('rampalı profiller basamak değil: rampa ortasında ara değer var', () => {
    for (const id of ['16-1-6-1', '14-2-6-2', '12-3-6-3', '10-4-6-4']) {
      const [[t0, t1]] = ramps(byId[id]);
      const mid = demandAt(byId[id], (t0 + t1) / 2);
      expect(mid).toBeGreaterThan(50);
      expect(mid).toBeLessThan(100);
    }
  });

  it('18-6 şekildeki dikey geçişlerle çizilir ve olay listesinde “idealize” olarak işaretlenir', () => {
    const p = byId['18-6'];
    expect(ramps(p)).toEqual([]);
    expect(demandAt(p, 10.99)).toBe(100);
    expect(demandAt(p, 11)).toBe(50);
    expect(demandAt(p, 13)).toBe(100);
    expect(profileEvents(p).every((e) => e.text.includes('idealize'))).toBe(true);
  });

  it('tam güç süreleri şekilden ölçülen değerlerle uyumlu', () => {
    const fullHours = (id: string) => {
      let h = 0;
      for (let t = 0; t < 24; t += 0.01) if (demandAt(byId[id], t + 0.005) === 100) h += 0.01;
      return h;
    };
    expect(fullHours('16-1-6-1')).toBeCloseTo(16, 1);
    expect(fullHours('14-2-6-2')).toBeCloseTo(14, 1);
    expect(fullHours('12-3-6-3')).toBeCloseTo(12, 1);
    expect(fullHours('10-4-6-4')).toBeCloseTo(10, 1);
  });
});

describe('İyot/ksenon eğitim modeli', () => {
  const loadFollow = (id: string) => {
    const p = FIG_2_40.find((x) => x.id === id)!;
    return simulate({ hours: 24, demand: (t) => demandAt(p, t), initialPower: 100, lag: 0.25 });
  };
  const shutdown = (p0: number) => simulate({ hours: 100, demand: (t) => (t <= 0 ? p0 : 0), initialPower: p0 });

  it('sabit güçte denge korunur', () => {
    const tr = loadFollow('base');
    for (let i = 0; i < tr.xenon.length; i += 20) expect(tr.xenon[i]).toBeCloseTo(1, 6);
  });

  it('aynı senaryo ve zaman aynı sonucu verir (deterministik)', () => {
    const a = loadFollow('12-3-6-3');
    const b = loadFollow('12-3-6-3');
    for (const t of [0, 3.3, 9, 14.7, 24]) expect(a.xenon[indexAt(a, t)]).toBe(b.xenon[indexAt(b, t)]);
  });

  it('konsantrasyonlar negatif değil ve NaN/Infinity yok', () => {
    for (const tr of [...FIG_2_40.map((p) => loadFollow(p.id)), shutdown(25), shutdown(100)]) {
      expect(finiteAll(tr)).toBe(true);
      expect(Math.min(...tr.xenon)).toBeGreaterThanOrEqual(0);
      expect(Math.min(...tr.iodine)).toBeGreaterThanOrEqual(0);
    }
    expect(Number.isFinite(decayHeatFraction(0))).toBe(true);
    expect(decayHeatFraction(1e9)).toBeGreaterThanOrEqual(0);
  });

  it('ksenon güç değişimine anlık ve birebir eşlenmez', () => {
    const tr = loadFollow('18-6');
    const before = tr.xenon[indexAt(tr, 10.9)];
    const just = tr.xenon[indexAt(tr, 11.2)];
    // Güç %100 → %50 düştü; ksenon hemen düşmez, aksine kısa süre artar.
    expect(just).toBeGreaterThanOrEqual(before - 1e-6);
    // Güç ile ksenon oranı sabit değil.
    const r1 = tr.xenon[indexAt(tr, 10)] / tr.power[indexAt(tr, 10)];
    const r2 = tr.xenon[indexAt(tr, 12.5)] / tr.power[indexAt(tr, 12.5)];
    expect(Math.abs(r1 - r2)).toBeGreaterThan(0.002);
  });

  it('kapatmada fisyon sıfırlanır, ksenon önce yükselip saatler sonra tepe yapar, sonra azalır', () => {
    for (const p0 of [25, 50, 75, 100]) {
      const tr = shutdown(p0);
      expect(tr.power[indexAt(tr, 1)]).toBe(0);
      const pk = peakXenon(tr);
      expect(pk.t).toBeGreaterThan(2);
      expect(pk.t).toBeLessThan(12);
      expect(pk.x).toBeGreaterThan(tr.xenon[0]);
      expect(tr.xenon[indexAt(tr, 100)]).toBeLessThan(tr.xenon[0] * 0.2);
    }
  });

  it('daha yüksek önceki güç daha yüksek ve daha geç ksenon tepesi verir (Şekil 2-41 ile aynı eğilim)', () => {
    const pk = [25, 50, 75, 100].map((p) => peakXenon(shutdown(p)));
    for (let i = 1; i < pk.length; i++) {
      expect(pk[i].x).toBeGreaterThan(pk[i - 1].x);
      expect(pk[i].t).toBeGreaterThanOrEqual(pk[i - 1].t);
    }
  });

  it('başlangıç koşulu seçilen önceki güçteki dengeden alınır', () => {
    const tr = shutdown(50);
    expect(tr.xenon[0]).toBeCloseTo(equilibrium(0.5).X, 12);
    expect(tr.xenon[0]).toBeLessThan(1);
  });

  it('artık ısı fisyon gücünden ayrı: fisyon 0 iken artık ısı pozitif ve zamanla azalır', () => {
    const tr = shutdown(100);
    expect(tr.power[indexAt(tr, 5)]).toBe(0);
    expect(decayHeatFraction(1)).toBeGreaterThan(0);
    expect(decayHeatFraction(1)).toBeGreaterThan(decayHeatFraction(24));
    expect(decayHeatFraction(24)).toBeGreaterThan(decayHeatFraction(24 * 30));
  });
});

describe('Artık ısı yüzdeleri', () => {
  it('önceki güce ve nominal güce göre değerler ayrı: %25 güçten 1 sa sonra ≈ %1,01 ve ≈ %0,253', () => {
    const d = decayHeatPercents(1, 25);
    expect(d.ofPrior).toBeCloseTo(1.01, 2);
    expect(d.ofNominal).toBeCloseTo(0.253, 3);
    expect(d.ofNominal).toBeCloseTo((d.ofPrior * 25) / 100, 12);
  });

  it('%100 güçten kapatmada iki referans aynı; geçersiz girdide NaN yok', () => {
    const d = decayHeatPercents(5, 100);
    expect(d.ofNominal).toBeCloseTo(d.ofPrior, 12);
    const bad = decayHeatPercents(Number.NaN, Number.NaN);
    expect(Number.isFinite(bad.ofPrior) && Number.isFinite(bad.ofNominal)).toBe(true);
  });
});

describe('Senaryo oynatma', () => {
  it('duraklatılmışken zaman ilerlemez', () => {
    const pb = createPlayback(24);
    expect(advance(pb, 5).t).toBe(0);
  });

  it('oynarken gösterim hızıyla ilerler ve sonda durur', () => {
    let pb = togglePlay(createPlayback(24, 2));
    pb = advance(pb, 3);
    expect(pb.t).toBe(6);
    pb = advance(pb, 100);
    expect(pb.t).toBe(24);
    expect(pb.playing).toBe(false);
  });

  it('sıfırlama ilk duruma döndürür; ileri/geri gezinme sınırlar içinde kalır', () => {
    let pb = advance(togglePlay(createPlayback(100)), 7);
    pb = resetPlayback(pb);
    expect(pb).toEqual({ ...createPlayback(100), rate: pb.rate });
    expect(seek(pb, -5).t).toBe(0);
    expect(seek(pb, 500).t).toBe(100);
    expect(seek(pb, Number.NaN).t).toBe(0);
  });
});

describe('Eksenel güç dağılımı', () => {
  it('sabit toplam güçte üst pay artınca ΔI artar (pozitif = üst yarı fazla)', () => {
    const lowTop = deltaI(splitPower(100, 0.45));
    const highTop = deltaI(splitPower(100, 0.55));
    expect(lowTop).toBeCloseTo(-10, 9);
    expect(highTop).toBeCloseTo(10, 9);
    expect(highTop).toBeGreaterThan(lowTop);
  });

  it('ΔI tam güç yüzdesi, AO toplam güce oranlıdır; ikisi farklı büyüklüklerdir', () => {
    const h = splitPower(50, 0.6);
    expect(deltaI(h)).toBeCloseTo(10, 9);
    expect(axialOffset(h)).toBeCloseTo(0.2, 9);
  });

  it('sıfır güçte NaN oluşmaz', () => {
    const h = splitPower(0, 0.7);
    expect(deltaI(h)).toBe(0);
    expect(axialOffset(h)).toBe(0);
    expect(Number.isFinite(axialOffset(splitPower(Number.NaN, Number.NaN)))).toBe(true);
  });

  it('Şekil 2-42 durakları 0/3/9/12/18/24 sa ve 10 yükseklik noktası', () => {
    expect(FIG_2_42.map((s) => s.hour)).toEqual([0, 3, 9, 12, 18, 24]);
    for (const s of FIG_2_42) {
      expect(s.power).toHaveLength(10);
      expect(s.xenon).toHaveLength(10);
      const share = topShareOfProfile(s.power);
      expect(share).toBeGreaterThan(0);
      expect(share).toBeLessThan(1);
    }
    // 12. saatte güç alt bölgede yoğunlaşmış → üst pay < 0,5.
    expect(topShareOfProfile(FIG_2_42[3].power)).toBeLessThan(0.5);
  });

  it('Şekil 2-43 hedefi: 100% güçte ~−2, 0% güçte 0; bant ±6', () => {
    expect(FIG_2_43.targetAt(100)).toBeCloseTo(-2, 9);
    expect(FIG_2_43.targetAt(0)).toBeCloseTo(0, 9);
    expect(FIG_2_43.bandHalfWidth).toBe(6);
  });
});

describe('Kaynak verileri ve modlar', () => {
  it('Şekil 2-39: başta hızlı düşüş, sonra küçük toparlanma, sonra azalma (düz çizgi değil)', () => {
    const at = (b: number) => FIG_2_39.find(([x]) => x >= b)![1];
    expect(at(0)).toBeGreaterThan(1900);
    expect(at(396)).toBeLessThan(1560);
    expect(at(1690)).toBeGreaterThan(at(396));
    expect(at(19999)).toBeLessThan(300);
    for (let i = 1; i < FIG_2_39.length; i++) expect(FIG_2_39[i][0]).toBeGreaterThan(FIG_2_39[i - 1][0]);
  });

  it('altı mod; fisyon gücü ile artık ısı ayrı; eksik hücreler tahminle doldurulmamış', () => {
    expect(MODES.map((m) => m.mode)).toEqual([1, 2, 3, 4, 5, 6]);
    for (const m of MODES.filter((x) => x.mode >= 3)) {
      expect(m.fissionPct).toBe(0);
      expect(m.decayHeat).toBe('after-shutdown');
      expect(m.view.turbine).not.toBe('generating');
    }
    expect(MODES[4].avgTempF).toBeNull();
    expect(MODES[3].cellNote).toMatch(/kesik/);
    expect(MODES[5].view.headOn).toBe(false);
  });

  it('°F → °C dönüşümü doğru', () => {
    expect(fToC(32)).toBeCloseTo(0, 9);
    expect(fToC(212)).toBeCloseTo(100, 9);
    expect(fToC(350)).toBeCloseTo(176.67, 2);
  });

  it('ısınma aşamalarında şema durumu ile ısı alıcıları listesi çelişmiyor', () => {
    for (const s of HEATUP) {
      const sinks = s.heatSinks.join(' ');
      const rhrRemovesHeat = s.view.rhrRunning && !s.view.rhrHxBypassed;
      const rhrSink = s.heatSinks.some((x) => x.startsWith('RHR ısı değiştiricisi') && !x.includes('atlatıldı'));
      const sources = s.heatSources.join(' ').toLocaleLowerCase('tr');
      expect({ id: s.id, rhr: rhrSink }).toEqual({ id: s.id, rhr: rhrRemovesHeat });
      expect({ id: s.id, dump: sinks.includes('steam dump') }).toEqual({ id: s.id, dump: s.view.steamDump });
      expect({ id: s.id, pump: sources.includes('pompa') }).toEqual({ id: s.id, pump: s.view.rcpRunning });
      expect({ id: s.id, fission: s.heatSources.some((x) => x.startsWith('Fisyon')) }).toEqual({ id: s.id, fission: s.view.fission });
      expect({ id: s.id, heaters: sources.includes('ısıtıcı') }).toEqual({ id: s.id, heaters: s.view.pzrHeaters });
    }
  });

  it('ısınma aşamaları: buhar hacmi basınçlandırıcıda; türbin yalnız son aşamada üretimde', () => {
    expect(HEATUP).toHaveLength(6);
    expect(HEATUP[0].view.pzrWater).toBe(1);
    expect(HEATUP[2].view.pzrWater).toBeLessThan(1);
    expect(HEATUP.slice(0, 5).every((s) => s.view.turbine !== 'generating')).toBe(true);
    expect(HEATUP[5].view.turbine).toBe('generating');
  });
});
