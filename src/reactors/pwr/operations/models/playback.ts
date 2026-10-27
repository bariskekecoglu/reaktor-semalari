/**
 * Senaryo oynatma durumu (saf fonksiyonlar). Ortak simülasyon saatinden gelen gerçek-zamanlı adım (s)
 * gösterim hızıyla fiziksel senaryo saatine çevrilir. Üç zaman birbirinden ayrıdır:
 *  - simülasyon saati: uygulamanın ortak saati (saniye),
 *  - gösterim hızı: 1 simülasyon saniyesinde ilerleyen senaryo saati (sa/s),
 *  - fiziksel zaman: senaryodaki saat (sa).
 */
export interface Playback {
  t: number;
  playing: boolean;
  /** Gösterim hızı: senaryo saati / simülasyon saniyesi. */
  rate: number;
  duration: number;
}

export const RATES = [0.5, 1, 2, 4] as const;

export function createPlayback(duration: number, rate = 1): Playback {
  return { t: 0, playing: false, rate, duration };
}

export function advance(pb: Playback, simSeconds: number): Playback {
  if (!pb.playing || !(simSeconds > 0)) return pb;
  const t = Math.min(pb.duration, pb.t + simSeconds * pb.rate);
  return { ...pb, t, playing: t < pb.duration };
}

export function seek(pb: Playback, t: number): Playback {
  const v = Number.isFinite(t) ? Math.min(pb.duration, Math.max(0, t)) : 0;
  return { ...pb, t: v };
}

export function togglePlay(pb: Playback): Playback {
  // Sona gelinmişse yeniden oynatma baştan başlar.
  if (!pb.playing && pb.t >= pb.duration) return { ...pb, t: 0, playing: true };
  return { ...pb, playing: !pb.playing };
}

export function resetPlayback(pb: Playback): Playback {
  return { ...pb, t: 0, playing: false };
}
