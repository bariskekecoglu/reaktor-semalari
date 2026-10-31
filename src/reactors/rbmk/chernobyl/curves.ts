import { AZ5_TIME, clampTime, END_TIME, eventAt, TEST_START, TIMELINE } from './timeline';
import type { ChernobylStageId } from './stages';
/** Only these isolated thermal power observations have numeric MW values. Connections are illustrative. */
export const POWER_POINTS = TIMELINE.filter(e => e.thermalMW !== undefined);
export const TREND_NOTE = 'Temsili — ölçüm değildir. Debi ve kanal boşluk oranı için yalnız nitel eğilim; fiziksel birim veya yüzdeye çevrilemez.';
export const TREND_SOURCES = { sourceIds: ['iaea-insag7'], locator: '§2.1–2.2, s. 3–4; Ek I §I-4.6.2–I-4.6.3, s. 65–67' };
/** Independent presentation time: no coupling to reactor power or the common physical model. */
export function advanceTime(t: number, dt: number, speed: number, seconds: boolean): number {
  const min = seconds ? TEST_START : TIMELINE[0].t;
  const max = seconds ? END_TIME : TEST_START;
  return clampTime(clampTime(t, min, max) + Math.max(0, Number.isFinite(dt) ? dt : 0) * speed * (seconds ? 1 : 3600), min, max);
}
/** Drawing coordinates only, deliberately not engineering quantities. Stop on loss of reliable readings. */
export function stateAt(input: number) {
  const t = clampTime(input, TIMELINE[0].t, END_TIME);
  const elapsed = Math.max(0, t - TEST_START);
  const uncertain = elapsed >= 39;
  const stage: ChernobylStageId = t < TEST_START ? 'conditions' : t < AZ5_TIME ? 'void' : elapsed < 39 ? 'az5' : elapsed < 45 ? 'seconds' : 'lessons';
  return {
    t, event: eventAt(t), stage, uncertain,
    flowDrawing: elapsed >= 43 ? null : 1 - Math.min(elapsed, 39) / 140,
    voidDrawing: elapsed >= 43 ? null : 0.15 + Math.min(elapsed, 39) / 80,
    rodDrawing: elapsed >= 43 ? null : Math.max(0, Math.min(0.32, (t - AZ5_TIME) / 18)),
    powerLabel: elapsed >= 39 ? 'Tepe bilinmiyor; 01:23:43’te >530 MW eşiği' : t >= 90180 ? 'Son belgelenmiş nokta: 200 MW ısıl' : 'Ayrık kayıt noktaları grafikte',
  };
}
