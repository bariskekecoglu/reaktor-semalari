/**
 * Yatay buhar üreteci için temsili boru geometrisi.
 * Boru çizimi ve parçacık yolu aynı döngü tanımından üretilir; böylece parçacıklar
 * çizilen boruyu izler. Her döngü sıcak kolektörde başlar, soğuk kolektörde biter.
 *
 * Yan kesit sadeleştirmesi: gerçek düzende borular plan görünüşte iki demettir. Yan
 * görünüşte sol demetin dönüş kolu sıcak kolektörün, sağ demetin gidiş kolu soğuk
 * kolektörün ARKASINDAN geçer. Bu bölümler kesikli çizilir.
 */

export interface HsgLayout {
  hotX: number;
  coldX: number;
  /** Kolektör genişliği. */
  colW: number;
  /** Kolektör alt ucu (birincil kolun bağlandığı kot). */
  bottom: number;
}

export interface HsgLoop {
  side: 'left' | 'right';
  /** Sıcak kolektörden çıkış satırı. */
  yOut: number;
  /** Soğuk kolektöre dönüş satırı. */
  yRet: number;
  /** U dönüşünün başladığı x. */
  bendX: number;
}

const walls = (L: HsgLayout) => ({
  hotL: L.hotX - L.colW / 2,
  hotR: L.hotX + L.colW / 2,
  coldL: L.coldX - L.colW / 2,
  coldR: L.coldX + L.colW / 2,
});

/** Borunun sıcak kolektör duvarından soğuk kolektör duvarına kadar olan kısmı (komutlar, M hariç). */
function tubeBody(L: HsgLayout, loop: HsgLoop): { start: number; body: string } {
  const w = walls(L);
  const r = (loop.yRet - loop.yOut) / 2;
  if (loop.side === 'left') {
    return { start: w.hotL, body: `H${loop.bendX} A${r} ${r} 0 0 0 ${loop.bendX} ${loop.yRet} H${w.coldL}` };
  }
  return { start: w.hotR, body: `H${loop.bendX} A${r} ${r} 0 0 1 ${loop.bendX} ${loop.yRet} H${w.coldR}` };
}

/** Görünür boru: sıcak kolektör duvarı → U dönüşü → soğuk kolektör duvarı. */
export function tubePath(L: HsgLayout, loop: HsgLoop): string {
  const { start, body } = tubeBody(L, loop);
  return `M${start} ${loop.yOut} ${body}`;
}

/** Parçacık yolu: sıcak kolektör tabanı → kolektör içinde yukarı → boru → soğuk kolektör tabanı. */
export function particlePath(L: HsgLayout, loop: HsgLoop): string {
  const { start, body } = tubeBody(L, loop);
  return `M${L.hotX} ${L.bottom} V${loop.yOut} H${start} ${body} H${L.coldX} V${L.bottom}`;
}

/**
 * Borunun bir kolektörün arkasından geçtiği yatay bölüm (kesikli gösterim için).
 * Sol döngüde dönüş kolu sıcak kolektörün, sağ döngüde gidiş kolu soğuk kolektörün arkasından geçer.
 */
export function hiddenSegment(L: HsgLayout, loop: HsgLoop): string {
  const w = walls(L);
  return loop.side === 'left' ? `M${w.hotL} ${loop.yRet} H${w.hotR}` : `M${w.coldL} ${loop.yOut} H${w.coldR}`;
}

/** Ana sahnedeki boru döngüsü sayısı (her iki demette). Kimlikler sahne, yapılandırma ve dersler arasında ortaktır. */
export const MAIN_LOOP_COUNT = 3;
export const HSG_FLOW_IDS: string[] = Array.from({ length: MAIN_LOOP_COUNT }, (_, k) =>
  k === 0 ? ['f-sg-left', 'f-sg-right'] : [`f-sg-left-${k + 1}`, `f-sg-right-${k + 1}`],
).flat();
