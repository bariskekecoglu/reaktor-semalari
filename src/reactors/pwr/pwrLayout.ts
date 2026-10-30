/**
 * PWR ana şemasının yerleşim sabitleri ve adlandırılmış bağlantı noktaları.
 * Boru güzergâhları ve akış parçacıkları buradaki rotalardan beslenir (Flow aynı `d`'yi çizer ve izler).
 */
import { ellipseBottom, ellipseRightAtY, route, type Pt } from '../shared/geometry/route';

/** Koruma yapısı: dikey duvarlar + üstte eliptik kubbe. */
export const PWR_CONTAINMENT = { left: 40, right: 610, springY: 230, cx: 325, rx: 285, ry: 185, ground: 745 } as const;

export const PWR_VESSEL = { hotNozzle: [236, 438] as Pt, coldNozzle: [236, 585] as Pt } as const;

/** Dikey U borulu buhar üreteci: kanal başlığı yarım elipsi ve nozullar. */
const CH = { cx: 495, cy: 527, rx: 30, ry: 34 };
export const PWR_SG = {
  channelHead: CH,
  /** Bölme plakasının sıcak (giriş) tarafı. */
  inlet: ellipseBottom(CH.cx, CH.cy, CH.rx, CH.ry, -17),
  /** Bölme plakasının soğuk (çıkış) tarafı. */
  outlet: ellipseBottom(CH.cx, CH.cy, CH.rx, CH.ry, 17),
  steam: [495, 140] as Pt,
  feed: [549, 285] as Pt,
  /** En dıştaki U borusunun bacakları. */
  tubeHot: 472,
  tubeCold: 518,
  tubeTop: 360,
} as const;

export const PWR_RCP = { c: [380, 652] as Pt, r: 22 } as const;
export const PWR_RCP_PORTS = {
  suction: [PWR_RCP.c[0], PWR_RCP.c[1] + PWR_RCP.r] as Pt,
  discharge: [PWR_RCP.c[0] - PWR_RCP.r, PWR_RCP.c[1]] as Pt,
};

export const PWR_PRESSURIZER = { surgeTop: [300, 402] as Pt, surgeBottom: [300, 432] as Pt } as const;

export const PWR_CONDENSER = { x: 845, y: 306, w: 180, h: 150 } as const;
/** Sıcak kuyu (hotwell) çıkışı: kondenser tabanında. */
export const PWR_HOTWELL_OUT: Pt = [890, PWR_CONDENSER.y + PWR_CONDENSER.h];

export const PWR_FEEDPUMP = { c: [769, 600] as Pt, r: 16 } as const;
export const PWR_FEEDPUMP_PORTS = {
  suction: [PWR_FEEDPUMP.c[0] + PWR_FEEDPUMP.r, PWR_FEEDPUMP.c[1]] as Pt,
  discharge: [PWR_FEEDPUMP.c[0] - PWR_FEEDPUMP.r, PWR_FEEDPUMP.c[1]] as Pt,
};

export const PWR_TURBINE = { x: 720, y: 230, inlet: [742, 203] as Pt } as const;

const R = 16;

export const PWR_ROUTES = {
  hotleg: route(
    PWR_VESSEL.hotNozzle,
    [[350, 438], { raw: 'C398 438 404 584 446 584', end: [446, 584] }, { raw: `Q${PWR_SG.inlet[0]} 584 ${PWR_SG.inlet[0]} ${PWR_SG.inlet[1].toFixed(1)}`, end: PWR_SG.inlet }],
  ),
  /** Kanal başlığı girişinden en dış U borusuna, oradan çıkış tarafına (birincil su boru içinde kalır). */
  sgTubes: route(PWR_SG.inlet, [[PWR_SG.tubeHot, CH.cy], { v: PWR_SG.tubeTop }, { raw: `A23 23 0 0 1 ${PWR_SG.tubeCold} ${PWR_SG.tubeTop}`, end: [PWR_SG.tubeCold, PWR_SG.tubeTop] }, { v: CH.cy }, PWR_SG.outlet]),
  crossleg: route(PWR_SG.outlet, [{ v: 690 }, { h: PWR_RCP_PORTS.suction[0] }, PWR_RCP_PORTS.suction], 34),
  coldleg: route(PWR_RCP_PORTS.discharge, [{ h: 285 }, { v: 585 }, PWR_VESSEL.coldNozzle], 15),
  steamline: route(PWR_SG.steam, [{ v: 108 }, { h: PWR_TURBINE.inlet[0] }, PWR_TURBINE.inlet], R),
  feed1: route(PWR_HOTWELL_OUT, [{ v: 600 }, PWR_FEEDPUMP_PORTS.suction], R),
  feed2: route(PWR_FEEDPUMP_PORTS.discharge, [{ h: 590 }, { v: PWR_SG.feed[1] }, PWR_SG.feed], R),
};

/** Koruma yapısını delen hatlar: geçiş kovanı (penetrasyon) çizilir. */
export const PWR_PENETRATIONS: { at: Pt; orient: 'h' | 'v'; pipe: number }[] = [
  { at: [ellipseRightAtY(PWR_CONTAINMENT.cx, PWR_CONTAINMENT.springY, PWR_CONTAINMENT.rx, PWR_CONTAINMENT.ry, 108), 108], orient: 'h', pipe: 12 },
  { at: [PWR_CONTAINMENT.right, 600], orient: 'h', pipe: 9 },
];
