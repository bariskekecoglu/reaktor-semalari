/**
 * Küçük, deterministik iyot-135 / ksenon-135 eğitim modeli. TEMSİLİ — doğrulanmış reaktör modeli değildir.
 *
 * Değişkenler normalize edilmiştir: I ve X, %100 güçteki denge ksenonu X = 1 olacak şekilde ölçeklenir.
 * P: göreli fisyon gücü (0–1). Zaman birimi: saat.
 *
 *   dI/dt = a·P − λI·I                       (iyot: fisyonla üretim − bozunma)
 *   dX/dt = b·P + λI·I − λX·X − κ·P·X         (ksenon: doğrudan üretim + iyot bozunması − bozunma − nötronla tüketim)
 *
 * λI, λX: I-135 ve Xe-135 yarı ömürlerinden (6,57 sa ve 9,14 sa; genel nükleer veri, kaynak PDF’te yok).
 * κ: %100 güçte nötron soğurmasıyla ksenon tüketim hızı. κ = 3·λX seçildi; bu değer Şekil 2-41’deki
 *    eğrilerin tepe zamanlarına ve büyüklük sırasına yaklaşık uyacak biçimde ayarlanmış TEMSİLİ bir katsayıdır.
 * a, b: doğrudan üretim payı %5 alınarak (b = 0,05·(λX+κ)) dengede X(P=1) = 1 olacak şekilde seçildi.
 *
 * Ksenon etkisi (worth) temsili olarak −X ile orantılı alınır: güçlü negatif reaktivite = daha büyük X.
 */

export const LAMBDA_I = Math.log(2) / 6.57;
export const LAMBDA_X = Math.log(2) / 9.14;
export const KAPPA = 3 * LAMBDA_X;
const SUM = LAMBDA_X + KAPPA;
export const A = 0.95 * SUM;
export const B = 0.05 * SUM;
/** Sayısal adım (saat). Sabit adım + RK4: aynı girdi her zaman aynı sonucu verir. */
export const DT = 0.02;

export interface XeState {
  I: number;
  X: number;
}

/** P (0–1) gücünde denge durumu. */
export function equilibrium(P: number): XeState {
  const p = Math.max(0, P);
  return { I: (A * p) / LAMBDA_I, X: ((A + B) * p) / (LAMBDA_X + KAPPA * p) };
}

function deriv(s: XeState, P: number): XeState {
  return {
    I: A * P - LAMBDA_I * s.I,
    X: B * P + LAMBDA_I * s.I - LAMBDA_X * s.X - KAPPA * P * s.X,
  };
}

/** P bu adım boyunca sabit kabul edilen tek RK4 adımı. Sonuçlar negatif olamaz. */
export function step(s: XeState, P: number, dt = DT): XeState {
  const k1 = deriv(s, P);
  const k2 = deriv({ I: s.I + (dt / 2) * k1.I, X: s.X + (dt / 2) * k1.X }, P);
  const k3 = deriv({ I: s.I + (dt / 2) * k2.I, X: s.X + (dt / 2) * k2.X }, P);
  const k4 = deriv({ I: s.I + dt * k3.I, X: s.X + dt * k3.X }, P);
  return {
    I: Math.max(0, s.I + (dt / 6) * (k1.I + 2 * k2.I + 2 * k3.I + k4.I)),
    X: Math.max(0, s.X + (dt / 6) * (k1.X + 2 * k2.X + 2 * k3.X + k4.X)),
  };
}

export interface Trajectory {
  /** Örnek zamanları (saat). */
  t: Float64Array;
  /** İstenen güç (%). */
  demand: Float64Array;
  /** Temsili gerçekleşen fisyon gücü (%). */
  power: Float64Array;
  /** Normalize iyot: I / I_denge(%100). */
  iodine: Float64Array;
  /** Normalize ksenon (%100 denge = 1). */
  xenon: Float64Array;
  /** Temsili ksenon etkisi: −X (birimsiz; %100 dengede −1). */
  worth: Float64Array;
  /** Örnek aralığı (saat). */
  sample: number;
}

export interface SimOptions {
  hours: number;
  /** Saatte istenen güç (%). */
  demand: (t: number) => number;
  /** Başlangıç gücü (%) — başlangıç I/Xe bu güçteki dengeden alınır. */
  initialPower: number;
  /** Gerçekleşen gücün isteği izleme zaman sabiti (saat); 0 = birebir izleme. */
  lag?: number;
  /** Kaydedilen örnek aralığı (saat). */
  sample?: number;
}

/**
 * Bir senaryonun tüm yörüngesini önceden hesaplar. Zaman çizgisinde ileri/geri gezinme bu dizilerden okunur;
 * böylece aynı zaman her zaman aynı sonucu verir ve geçmiş sınırsız büyümez.
 */
export function simulate(opts: SimOptions): Trajectory {
  const sample = opts.sample ?? 0.1;
  const lag = opts.lag ?? 0;
  const n = Math.round(opts.hours / sample) + 1;
  const out: Trajectory = {
    t: new Float64Array(n),
    demand: new Float64Array(n),
    power: new Float64Array(n),
    iodine: new Float64Array(n),
    xenon: new Float64Array(n),
    worth: new Float64Array(n),
    sample,
  };
  const iEq100 = equilibrium(1).I;
  let s = equilibrium(opts.initialPower / 100);
  let p = opts.initialPower;
  let t = 0;
  const substeps = Math.max(1, Math.round(sample / DT));
  const h = sample / substeps;
  for (let k = 0; k < n; k++) {
    out.t[k] = t;
    out.demand[k] = opts.demand(t);
    out.power[k] = p;
    out.iodine[k] = s.I / iEq100;
    out.xenon[k] = s.X;
    out.worth[k] = -s.X;
    if (k === n - 1) break;
    for (let j = 0; j < substeps; j++) {
      const d = opts.demand(t);
      p = lag > 0 ? p + (d - p) * (1 - Math.exp(-h / lag)) : d;
      s = step(s, Math.max(0, p) / 100, h);
      t += h;
    }
    t = (k + 1) * sample;
  }
  return out;
}

/** Zaman t (saat) için en yakın örneğin indeksi. */
export function indexAt(tr: Trajectory, t: number): number {
  return Math.min(tr.t.length - 1, Math.max(0, Math.round(t / tr.sample)));
}

/** Dizideki en büyük ksenon değerinin zamanı. */
export function peakXenon(tr: Trajectory): { t: number; x: number } {
  let best = 0;
  for (let i = 1; i < tr.xenon.length; i++) if (tr.xenon[i] > tr.xenon[best]) best = i;
  return { t: tr.t[best], x: tr.xenon[best] };
}

/**
 * Kapatma sonrası artık ısı (göreli, işletme gücüne oranla) — Way–Wigner yaklaşık bağıntısı.
 * GENEL YAKLAŞIK BAĞINTI; kaynak PDF’te yoktur, yalnız büyüklük sırası için:
 *   Pd/P0 ≈ 0,0622 · [ t^−0,2 − (t + T)^−0,2 ],  t ve T saniye (T: kapatma öncesi işletme süresi).
 */
export function decayHeatFraction(hoursAfterShutdown: number, operatingDays = 365): number {
  const t = Math.max(1, hoursAfterShutdown * 3600);
  const T = operatingDays * 86400;
  const v = 0.0622 * (Math.pow(t, -0.2) - Math.pow(t + T, -0.2));
  return Number.isFinite(v) ? Math.max(0, v) : 0;
}

/**
 * Kapatma sonrası artık ısıyı iki ayrı referansla verir (yüzde):
 *  - ofPrior: kapatmadan önceki işletme gücüne oranla,
 *  - ofNominal: nominal (tam) güce oranla = ofPrior × önceki güç / 100.
 * Örnek: %25 güçten 1 saat sonra ofPrior ≈ %1,01, ofNominal ≈ %0,25.
 */
export function decayHeatPercents(hoursAfterShutdown: number, priorPowerPct: number): { ofPrior: number; ofNominal: number } {
  const f = decayHeatFraction(hoursAfterShutdown);
  const prior = Number.isFinite(priorPowerPct) ? Math.max(0, priorPowerPct) : 0;
  return { ofPrior: f * 100, ofNominal: f * prior };
}
