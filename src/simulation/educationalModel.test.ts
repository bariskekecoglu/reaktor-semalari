import { describe, expect, it } from 'vitest';
import { CYCLE_EFFICIENCY, EducationalModel, MAX_SAMPLES, equilibriumRod } from './educationalModel';

const run = (m: EducationalModel, seconds: number, dt = 0.05) => {
  for (let t = 0; t < seconds; t += dt) m.step(dt);
};

describe('EducationalModel', () => {
  it('başlangıçta dengede ve enerji dengesi tutarlı', () => {
    const m = new EducationalModel(1);
    const s = m.state;
    expect(s.thermal).toBe(1);
    expect(s.electric).toBeCloseTo(CYCLE_EFFICIENCY);
    expect(s.electric + s.rejected).toBeCloseTo(s.thermal);
  });

  it('hedef gücü %20–100 aralığına sınırlar', () => {
    const m = new EducationalModel(1);
    m.setTarget(0.05);
    expect(m.state.target).toBe(0.2);
    m.setTarget(3);
    expect(m.state.target).toBe(1);
  });

  it('güç değişimi yumuşaktır (anında sıçramaz) ve sonunda hedefe yaklaşır', () => {
    const m = new EducationalModel(1);
    m.setTarget(0.5);
    m.step(0.1);
    expect(m.state.thermal).toBeGreaterThan(0.95);
    run(m, 40);
    expect(m.state.thermal).toBeCloseTo(0.5, 2);
  });

  it('her adımda ısıl = elektrik + atılan ısı', () => {
    const m = new EducationalModel(1);
    m.setTarget(0.3);
    for (let i = 0; i < 200; i++) {
      m.step(0.05);
      expect(m.state.electric + m.state.rejected).toBeCloseTo(m.state.thermal, 10);
    }
  });

  it('elektrik ısıl güce gecikmeyle uyar (türbin tarafı)', () => {
    const m = new EducationalModel(1);
    m.setTarget(0.4);
    run(m, 3);
    expect(m.state.electric / CYCLE_EFFICIENCY).toBeGreaterThan(m.state.thermal);
  });

  it('kontrol çubuğu konumu güçle birebir doğrusal değil', () => {
    const r20 = equilibriumRod(0.2);
    const r60 = equilibriumRod(0.6);
    const r100 = equilibriumRod(1);
    // Eşit güç adımlarında eşit olmayan çubuk farkları.
    expect(Math.abs(r20 - r60 - (r60 - r100))).toBeGreaterThan(0.005);
    // Güç değişimi sırasında çubuk dengedeki konumundan sapar (geçici hareket).
    const m = new EducationalModel(1);
    m.setTarget(0.4);
    run(m, 2);
    expect(Math.abs(m.state.rodInsertion - equilibriumRod(m.state.thermal))).toBeGreaterThan(0.05);
  });

  it('geçmiş verisi sınırlı kalır (60 s penceresi)', () => {
    const m = new EducationalModel(1);
    run(m, 300, 0.1);
    expect(m.getHistory().length).toBeLessThanOrEqual(MAX_SAMPLES);
    const h = m.getHistory();
    expect(h[h.length - 1].t - h[0].t).toBeLessThanOrEqual(60 + 1e-6);
  });

  it('sıfırlama modeli ve grafiği başlangıca döndürür', () => {
    const m = new EducationalModel(1);
    m.setTarget(0.3);
    run(m, 20);
    m.reset();
    expect(m.state.thermal).toBe(1);
    expect(m.state.target).toBe(1);
    expect(m.simTime).toBe(0);
    expect(m.getHistory().length).toBe(1);
  });

  it('sıfır veya negatif adımda değişmez (duraklatma)', () => {
    const m = new EducationalModel(1);
    m.setTarget(0.3);
    const before = m.state;
    m.step(0);
    expect(m.state).toBe(before);
  });
});
