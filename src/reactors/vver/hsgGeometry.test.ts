import { describe, expect, it } from 'vitest';
import { HSG_FLOW_IDS, hiddenSegment, particlePath, tubePath, type HsgLayout, type HsgLoop } from './hsgGeometry';

const L: HsgLayout = { hotX: 490, coldX: 570, colW: 22, bottom: 368 };
const left: HsgLoop = { side: 'left', yOut: 302, yRet: 342, bendX: 420 };
const right: HsgLoop = { side: 'right', yOut: 302, yRet: 342, bendX: 640 };

/** Yol komutlarındaki son noktayı ve ilk noktayı basitçe çözer (yalnız M/H/V/A kullanılan yollar). */
function endpoints(d: string) {
  const tokens = d.match(/[MHVA][^MHVA]*/g) ?? [];
  let x = 0;
  let y = 0;
  let start: [number, number] | null = null;
  for (const t of tokens) {
    const n = t.slice(1).trim().split(/[\s,]+/).map(Number);
    if (t[0] === 'M') [x, y] = n;
    if (t[0] === 'H') x = n[0];
    if (t[0] === 'V') y = n[0];
    if (t[0] === 'A') [x, y] = [n[5], n[6]];
    if (!start) start = [x, y];
  }
  return { start: start!, end: [x, y] as [number, number] };
}

describe('VVER yatay buhar üreteci boru geometrisi', () => {
  it('görünür boru sıcak kolektör duvarından başlar, soğuk kolektör duvarında biter', () => {
    expect(endpoints(tubePath(L, left))).toEqual({ start: [479, 302], end: [559, 342] });
    expect(endpoints(tubePath(L, right))).toEqual({ start: [501, 302], end: [581, 342] });
  });

  it('parçacık yolu sıcak kolektör tabanından başlar, soğuk kolektör tabanında biter', () => {
    for (const loop of [left, right]) {
      const { start, end } = endpoints(particlePath(L, loop));
      expect(start).toEqual([L.hotX, L.bottom]);
      expect(end).toEqual([L.coldX, L.bottom]);
    }
  });

  it('parçacık yolu çizilen boruyu aynen içerir (aynı tanımdan üretilir)', () => {
    for (const loop of [left, right]) {
      const tube = tubePath(L, loop).replace(/^M\S+ \S+ /, '');
      expect(particlePath(L, loop)).toContain(tube);
    }
  });

  it('kolektör arkasından geçen bölüm doğru kolektörün genişliğinde', () => {
    expect(hiddenSegment(L, left)).toBe('M479 342 H501');
    expect(hiddenSegment(L, right)).toBe('M559 302 H581');
  });

  it('akış kimlikleri benzersiz ve eski dış döngü kimliklerini içerir', () => {
    expect(new Set(HSG_FLOW_IDS).size).toBe(HSG_FLOW_IDS.length);
    expect(HSG_FLOW_IDS).toEqual(expect.arrayContaining(['f-sg-left', 'f-sg-right']));
  });
});
