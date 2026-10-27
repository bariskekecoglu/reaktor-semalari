/**
 * Eğitim amaçlı, normalize edilmiş temsili güç modeli.
 * Doğrulanmış bir reaktör dinamiği modeli DEĞİLDİR. Tüm değerler nominal ısıl güce
 * göre oransaldır (1 = %100). Amaç; güç değişiminin göstergelere yumuşak yansımasını,
 * enerji dengesinin kendi içinde tutarlı olmasını ve kontrol çubuğu konumunun güçle
 * birebir doğrusal eşlenmediğini göstermektir.
 */

/** Temsili net çevrim verimi. Ders notları: LWR ısı çevrimi verimi ≈ %33. */
export const CYCLE_EFFICIENCY = 0.33;
/** Isıl gücün hedefe yaklaşma zaman sabiti (simülasyon saniyesi, temsili). */
export const THERMAL_TAU = 5;
/** Buhar/türbin tarafının ısıl güce gecikmeli tepkisi (temsili). */
export const TURBINE_TAU = 2;
export const HISTORY_WINDOW = 60;
export const SAMPLE_INTERVAL = 0.5;
export const MAX_SAMPLES = Math.round(HISTORY_WINDOW / SAMPLE_INTERVAL) + 1;
export const MIN_POWER = 0.2;
export const MAX_POWER = 1;
export const INITIAL_POWER = 1;

export interface ModelSnapshot {
  /** Hedef göreli güç (kullanıcı seçimi). */
  target: number;
  /** Göreli ısıl güç (çekirdekten çekilen ısı). */
  thermal: number;
  /** Buharın türbine taşıdığı göreli güç (gecikmeli). */
  steam: number;
  /** Göreli elektrik çıkışı. */
  electric: number;
  /** Kondenserden soğutma suyuna atılan göreli ısı akışı (= buhar − elektrik). */
  rejected: number;
  /**
   * Depolama/boşalma hızı (= ısıl − buhar). Bir enerji miktarı değil, normalize güç
   * (enerji değişim hızı) değeridir. Pozitif: sistemde enerji birikiyor (güç artışı);
   * negatif: depolanmış enerji sisteme geri veriliyor (güç düşüşü). Kararlı durumda ≈ 0.
   */
  storageRate: number;
  /** Kontrol çubuğu sokulma oranı 0–1 (temsili, güçle doğrusal değil). */
  rodInsertion: number;
}

export interface HistorySample {
  t: number;
  thermal: number;
  electric: number;
}

export const clampPower = (p: number) => Math.min(MAX_POWER, Math.max(MIN_POWER, p));

/**
 * Dengedeki temsili çubuk konumu: düşük güçte biraz daha içeride.
 * Bilerek doğrusal olmayan, küçük eğimli bir eğri seçildi.
 */
export function equilibriumRod(power: number): number {
  return 0.3 + 0.22 * Math.pow(1 - clampPower(power), 1.4);
}

export class EducationalModel {
  state: ModelSnapshot;
  private history: HistorySample[] = [];
  private sinceSample = 0;
  private time = 0;

  constructor(initial = INITIAL_POWER) {
    this.state = EducationalModel.steady(initial);
    this.pushSample();
  }

  static steady(power: number): ModelSnapshot {
    const p = clampPower(power);
    const electric = p * CYCLE_EFFICIENCY;
    return {
      target: p,
      thermal: p,
      steam: p,
      electric,
      rejected: p - electric,
      storageRate: 0,
      rodInsertion: equilibriumRod(p),
    };
  }

  setTarget(power: number): void {
    this.state = { ...this.state, target: clampPower(power) };
  }

  reset(power = INITIAL_POWER): void {
    this.state = EducationalModel.steady(power);
    this.history = [];
    this.sinceSample = 0;
    this.time = 0;
    this.pushSample();
  }

  step(dt: number): void {
    if (dt <= 0) return;
    const s = this.state;
    const a = 1 - Math.exp(-dt / THERMAL_TAU);
    const b = 1 - Math.exp(-dt / TURBINE_TAU);
    const thermal = s.thermal + (s.target - s.thermal) * a;
    const steam = s.steam + (thermal - s.steam) * b;
    const electric = steam * CYCLE_EFFICIENCY;
    // Güç değişirken çubuklar geçici olarak daha fazla hareket eder, sonra yeni dengeye oturur.
    const transient = Math.max(-0.25, Math.min(0.25, -0.9 * (s.target - thermal)));
    const rodTarget = Math.min(0.95, Math.max(0.05, equilibriumRod(thermal) + transient));
    const rodInsertion = s.rodInsertion + (rodTarget - s.rodInsertion) * (1 - Math.exp(-dt / 0.8));
    this.state = {
      target: s.target,
      thermal,
      steam,
      electric,
      // Enerji dengesi (temsili): buhar = elektrik + atılan ısı;
      // ısıl = elektrik + atılan ısı + depolama hızı.
      rejected: steam - electric,
      storageRate: thermal - steam,
      rodInsertion,
    };
    this.time += dt;
    this.sinceSample += dt;
    while (this.sinceSample >= SAMPLE_INTERVAL) {
      this.sinceSample -= SAMPLE_INTERVAL;
      this.pushSample();
    }
  }

  private pushSample() {
    this.history.push({ t: this.time, thermal: this.state.thermal, electric: this.state.electric });
    if (this.history.length > MAX_SAMPLES) this.history.splice(0, this.history.length - MAX_SAMPLES);
  }

  get simTime(): number {
    return this.time;
  }

  getHistory(): readonly HistorySample[] {
    return this.history;
  }
}
