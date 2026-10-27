/**
 * Eksenel güç dağılımı yardımcıları (temsili).
 *
 * Kaynak 2-98: alt yarıdaki güç aralığı dedektörünün çıkışı üst yarıdakinden çıkarılır ve
 * tam gücün yüzdesi olarak gösterilir → eksenel akı farkı:
 *   ΔI = (üst − alt)  [tam gücün %’si cinsinden]
 * İşaret: ΔI > 0 → üst yarı daha fazla güç üretiyor; ΔI < 0 → alt yarı daha fazla.
 *
 * Bundan ayrı bir büyüklük (kaynakta adı geçmez, burada karşılaştırma için):
 *   AO (axial offset) = (üst − alt) / (üst + alt)   [birimsiz, toplam güce oranlı]
 *
 * Temsili varsayım: dedektör sinyalleri ilgili yarı çekirdeğin gücüyle orantılıdır.
 */

export interface HalfPowers {
  /** Üst yarı gücü, tam gücün %’si. */
  top: number;
  /** Alt yarı gücü, tam gücün %’si. */
  bottom: number;
}

/** Toplam güç (%) ve üst yarı payından (0–1) yarı güçleri. */
export function splitPower(totalPct: number, topShare: number): HalfPowers {
  const total = Number.isFinite(totalPct) ? Math.max(0, totalPct) : 0;
  const share = Number.isFinite(topShare) ? Math.min(1, Math.max(0, topShare)) : 0.5;
  return { top: total * share, bottom: total * (1 - share) };
}

/** ΔI = üst − alt (tam gücün %’si). */
export function deltaI(h: HalfPowers): number {
  const v = h.top - h.bottom;
  return Number.isFinite(v) ? v : 0;
}

/** AO = (üst − alt)/(üst + alt). Toplam sıfıra çok yakınsa 0 döner (NaN üretmez). */
export function axialOffset(h: HalfPowers): number {
  const sum = h.top + h.bottom;
  if (!(sum > 1e-9)) return 0;
  const v = (h.top - h.bottom) / sum;
  return Number.isFinite(v) ? v : 0;
}

/** 10 noktalı profilden (alttan üste) üst yarı payı. */
export function topShareOfProfile(profile: number[]): number {
  const n = profile.length;
  const half = Math.floor(n / 2);
  let lo = 0;
  let hi = 0;
  profile.forEach((v, i) => {
    const x = Math.max(0, v);
    if (i < half) lo += x;
    else hi += x;
  });
  const sum = lo + hi;
  return sum > 1e-9 ? hi / sum : 0.5;
}
