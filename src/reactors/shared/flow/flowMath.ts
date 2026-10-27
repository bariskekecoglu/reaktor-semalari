/** Akış parçacıkları için yol örnekleme yardımcıları (DOM'dan bağımsız, test edilebilir). */

export interface PathLut {
  length: number;
  step: number;
  /** x,y,nx,ny dörtlüleri (nx,ny: birim normal). */
  data: Float32Array;
}

export function buildLut(length: number, pointAt: (s: number) => { x: number; y: number }, step = 2): PathLut {
  const n = Math.max(2, Math.ceil(length / step) + 1);
  const data = new Float32Array(n * 4);
  for (let i = 0; i < n; i++) {
    const s = Math.min(length, i * step);
    const p = pointAt(s);
    data[i * 4] = p.x;
    data[i * 4 + 1] = p.y;
  }
  for (let i = 0; i < n; i++) {
    const a = Math.max(0, i - 1);
    const b = Math.min(n - 1, i + 1);
    const dx = data[b * 4] - data[a * 4];
    const dy = data[b * 4 + 1] - data[a * 4 + 1];
    const len = Math.hypot(dx, dy) || 1;
    data[i * 4 + 2] = -dy / len;
    data[i * 4 + 3] = dx / len;
  }
  return { length, step, data };
}

/** s konumunu [0, L) aralığına sarar. */
export function wrap(s: number, length: number): number {
  if (length <= 0) return 0;
  const r = s % length;
  return r < 0 ? r + length : r;
}

export function sampleLut(lut: PathLut, s: number): [number, number, number, number] {
  const i = Math.min(lut.data.length / 4 - 1, Math.max(0, Math.round(s / lut.step)));
  const d = lut.data;
  return [d[i * 4], d[i * 4 + 1], d[i * 4 + 2], d[i * 4 + 3]];
}

/** Akış hızı katsayısı: sabit debili devrelerde 1, güce bağlı devrelerde güçle artar. */
export function flowFactor(mode: 'power' | 'constant', thermal: number): number {
  return mode === 'constant' ? 1 : 0.3 + 0.7 * thermal;
}
