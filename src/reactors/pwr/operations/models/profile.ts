import type { PowerProfile } from '../types';

/**
 * Profilde t saatteki istenen güç (%). Noktalar arası doğrusal; aynı saatteki iki nokta
 * şekildeki idealize dikey geçiştir: o saatte ve sonrasında ikinci nokta geçerlidir.
 */
export function demandAt(profile: PowerProfile, t: number): number {
  const p = profile.points;
  if (t <= p[0][0]) return p[0][1];
  for (let i = p.length - 1; i >= 0; i--) {
    if (t >= p[i][0]) {
      const next = p[i + 1];
      if (!next) return p[i][1];
      if (next[0] === p[i][0]) return next[1];
      const f = (t - p[i][0]) / (next[0] - p[i][0]);
      return p[i][1] + f * (next[1] - p[i][1]);
    }
  }
  return p[p.length - 1][1];
}

export function profileDuration(profile: PowerProfile): number {
  return profile.points[profile.points.length - 1][0] - profile.points[0][0];
}

/** Rampa (eğimli bölüm) aralıkları: [başlangıç, bitiş, başlangıç gücü, bitiş gücü]. */
export function ramps(profile: PowerProfile): [number, number, number, number][] {
  const out: [number, number, number, number][] = [];
  const p = profile.points;
  for (let i = 0; i < p.length - 1; i++) {
    if (p[i + 1][0] > p[i][0] && p[i + 1][1] !== p[i][1]) out.push([p[i][0], p[i + 1][0], p[i][1], p[i + 1][1]]);
  }
  return out;
}

/** Güç seviyesinin değiştiği olay saatleri (rampa başı/sonu ve basamaklar). */
export function profileEvents(profile: PowerProfile): { t: number; text: string }[] {
  const p = profile.points;
  const ev: { t: number; text: string }[] = [];
  for (let i = 0; i < p.length - 1; i++) {
    const [t0, v0] = p[i];
    const [t1, v1] = p[i + 1];
    if (v0 === v1) continue;
    if (t0 === t1) ev.push({ t: t0, text: `%${v0} → %${v1} (şekilde dikey geçiş, idealize)` });
    else {
      ev.push({ t: t0, text: `${v1 < v0 ? 'Güç azaltma' : 'Güç artırma'} rampası başlıyor (%${v0} → %${v1})` });
      ev.push({ t: t1, text: `Rampa bitti: %${v1}` });
    }
  }
  return ev;
}
