/**
 * RBMK ana şemasının yerleşim sabitleri ve adlandırılmış bağlantı noktaları.
 *
 * Temsili RBMK-1000, tek çevrim (INSAG-7 §2.9: iki bağımsız çevrim, her biri çekirdeğin yarısını soğutur).
 * Binlerce kanal yerine beş temsili yakıt kanalı ve iki kontrol/koruma kanalı çizilir.
 * Her yakıt kanalının çıkışı tambura KENDİ borusuyla gider (INSAG-7: “individual pipes”); borular birleştirilmez.
 * Borular iç içe L biçimindedir: soldaki kanal daha yüksekte döner ve tamburun daha solundan girer,
 * böylece hiçbir buhar–su borusu diğerini kesmez.
 */
import { route, type Pt } from '../shared/geometry/route';

export const RBMK_GRAPHITE = { x: 115, y: 360, w: 330, h: 255 } as const;
export const RBMK_CORE = { y0: 385, y1: 595 } as const;
/** Biyolojik zırh ve reaktör boşluğu: yan duvarlar + üst/alt plakalar. */
export const RBMK_SHIELD = { x0: 80, x1: 480, wall: 30, top: 330, topH: 22, bottom: 620, bottomH: 22 } as const;

/** Temsili yakıt kanalları ve kontrol/koruma kanalları (x). */
export const RBMK_FUEL_X = [145, 190, 235, 325, 370] as const;
export const RBMK_CTRL_X = [280, 415] as const;
export const RBMK_TUBE = { top: 310, bottom: 660, half: 7 } as const;
export const RBMK_CTRL_TUBE = { top: 318, bottom: 612 } as const;

/** Grup dağıtım kolektörü (alt su boruları buradan ayrılır). */
export const RBMK_DGH = { y: 700, x0: 135, x1: 470 } as const;

/** Ayırıcı tambur: yatay silindir. */
export const RBMK_DRUM = { x0: 520, x1: 700, cy: 150, r: 28, level: 152 } as const;
export const RBMK_DRUM_BOTTOM = RBMK_DRUM.cy + RBMK_DRUM.r;
export const RBMK_DRUM_TOP = RBMK_DRUM.cy - RBMK_DRUM.r;
/** Buhar–su borularının tambur tabanına giriş noktaları (kanal sırasıyla soldan sağa). */
export const RBMK_RISER_IN = [535, 560, 585, 610, 635] as const;
/** Buhar–su borularının yatay döndüğü kotlar: soldaki kanal en yukarıda. */
export const RBMK_RISER_LEVEL = [210, 230, 250, 270, 290] as const;
export const RBMK_DOWNCOMER_X = 690;
export const RBMK_STEAM_OUT: Pt = [600, RBMK_DRUM_TOP];
/** Besleme suyu tamburun sağ uç kapağına girer (yarım daire üzerindeki nokta). */
export const RBMK_FEED_IN: Pt = [RBMK_DRUM.x1 + Math.sqrt(RBMK_DRUM.r ** 2 - (RBMK_DRUM.cy - 140) ** 2), 140];

export const RBMK_MCP = { c: [640, 700] as Pt, r: 22 } as const;
export const RBMK_MCP_PORTS = {
  suction: [RBMK_MCP.c[0] + RBMK_MCP.r, RBMK_MCP.c[1]] as Pt,
  discharge: [RBMK_MCP.c[0] - RBMK_MCP.r, RBMK_MCP.c[1]] as Pt,
};

export const RBMK_TURBINE = { x: 760, y: 260, inlet: [782, 233] as Pt } as const;
export const RBMK_CONDENSER = { x: 885, y: 336, w: 180, h: 150 } as const;
export const RBMK_HOTWELL_OUT: Pt = [930, RBMK_CONDENSER.y + RBMK_CONDENSER.h];
export const RBMK_FEEDPUMP = { c: [829, 620] as Pt, r: 16 } as const;
export const RBMK_FEEDPUMP_PORTS = {
  suction: [RBMK_FEEDPUMP.c[0] + RBMK_FEEDPUMP.r, RBMK_FEEDPUMP.c[1]] as Pt,
  discharge: [RBMK_FEEDPUMP.c[0] - RBMK_FEEDPUMP.r, RBMK_FEEDPUMP.c[1]] as Pt,
};

const R = 14;

/** i. yakıt kanalının çıkışından tambura giden kendi buhar–su borusu. */
export function riserRoute(i: number) {
  const x = RBMK_FUEL_X[i];
  return route([x, RBMK_TUBE.top], [{ v: RBMK_RISER_LEVEL[i] }, { h: RBMK_RISER_IN[i] }, { v: RBMK_DRUM_BOTTOM - 2 }], R);
}

/** Grup kolektöründen i. kanalın altına giden alt su borusu. */
export function lowerRoute(i: number) {
  const x = RBMK_FUEL_X[i];
  return route([x, RBMK_DGH.y], [{ v: RBMK_TUBE.bottom }]);
}

export const RBMK_ROUTES = {
  /** Tamburda ayrılan su iniş borusundan pompaya. */
  downcomer: route([RBMK_DOWNCOMER_X, RBMK_DRUM_BOTTOM - 2], [{ v: RBMK_MCP.c[1] }, RBMK_MCP_PORTS.suction], R),
  /** Pompa basması → basma kolektörü → grup dağıtım kolektörünün ucu. */
  pressure: route(RBMK_MCP_PORTS.discharge, [{ h: RBMK_DGH.x1 }]),
  /** Grup dağıtım kolektörü boyunca (sağdan sola). */
  dgh: route([RBMK_DGH.x1, RBMK_DGH.y], [{ h: RBMK_DGH.x0 }]),
  steamline: route(RBMK_STEAM_OUT, [{ v: 90 }, { h: RBMK_TURBINE.inlet[0] }, RBMK_TURBINE.inlet], R),
  feed1: route(RBMK_HOTWELL_OUT, [{ v: RBMK_FEEDPUMP.c[1] }, RBMK_FEEDPUMP_PORTS.suction], R),
  feed2: route(RBMK_FEEDPUMP_PORTS.discharge, [{ h: 745 }, { v: RBMK_FEED_IN[1] }, RBMK_FEED_IN], R),
};

export const RBMK_RISER_IDS = RBMK_FUEL_X.map((_, i) => `f-riser-${i + 1}`);
export const RBMK_CHANNEL_IDS = RBMK_FUEL_X.map((_, i) => `f-ch-${i + 1}`);
export const RBMK_LOWER_IDS = RBMK_FUEL_X.map((_, i) => `f-low-${i + 1}`);
