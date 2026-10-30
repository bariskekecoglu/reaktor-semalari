/**
 * VVER ana şemasının yerleşim sabitleri ve adlandırılmış bağlantı noktaları.
 * Yatay buhar üretecinin boru demeti `hsgGeometry.ts` içinde tanımlıdır; burada dış hatlar ve kolektör uçları var.
 */
import { ellipseRightAtY, route, type Pt } from '../shared/geometry/route';

export const VVER_CONTAINMENT = { right: 700, springY: 230, cx: 370, rx: 330, ry: 190 } as const;

export const VVER_VESSEL = { hotNozzle: [228, 380] as Pt, coldNozzle: [228, 450] as Pt } as const;

/** Kolektörler: dikey silindirler; birincil su alttan girer (sıcak) / alttan çıkar (soğuk). */
export const VVER_COLLECTORS = {
  hot: { x: 479, y: 262, w: 22, h: 110 },
  cold: { x: 559, y: 262, w: 22, h: 110 },
} as const;
/** Sıcak kol kolektöre alttan girer; uç, kolektör tabanının 6 birim içindedir (boru ağzı kolektöre oturur). */
export const VVER_HOT_COLLECTOR_IN: Pt = [VVER_COLLECTORS.hot.x + VVER_COLLECTORS.hot.w / 2, VVER_COLLECTORS.hot.y + VVER_COLLECTORS.hot.h - 6];
export const VVER_COLD_COLLECTOR_OUT: Pt = [VVER_COLLECTORS.cold.x + VVER_COLLECTORS.cold.w / 2, VVER_COLLECTORS.cold.y + VVER_COLLECTORS.cold.h];

export const VVER_HSG = {
  steamNozzles: [470, 530, 590] as const,
  steamHeaderY: 212,
  feed: [686, 298] as Pt,
} as const;

export const VVER_MCP = { c: [396, 560] as Pt, r: 22 } as const;
export const VVER_MCP_PORTS = {
  suction: [VVER_MCP.c[0] + VVER_MCP.r, VVER_MCP.c[1]] as Pt,
  discharge: [VVER_MCP.c[0] - VVER_MCP.r, VVER_MCP.c[1]] as Pt,
};

export const VVER_PRESSURIZER = { surgeTop: [290, 322] as Pt, surgeBottom: [290, 374] as Pt } as const;

export const VVER_CONDENSER = { x: 885, y: 336, w: 180, h: 150 } as const;
export const VVER_HOTWELL_OUT: Pt = [930, VVER_CONDENSER.y + VVER_CONDENSER.h];
export const VVER_FEEDPUMP = { c: [829, 620] as Pt, r: 16 } as const;
export const VVER_FEEDPUMP_PORTS = {
  suction: [VVER_FEEDPUMP.c[0] + VVER_FEEDPUMP.r, VVER_FEEDPUMP.c[1]] as Pt,
  discharge: [VVER_FEEDPUMP.c[0] - VVER_FEEDPUMP.r, VVER_FEEDPUMP.c[1]] as Pt,
};
export const VVER_TURBINE = { x: 760, y: 260, inlet: [782, 233] as Pt } as const;

const R = 16;

export const VVER_ROUTES = {
  /** Sıcak kol üst kotta: kap çıkışından sıcak kolektörün altına. */
  hotleg: route(VVER_VESSEL.hotNozzle, [
    { h: VVER_HOT_COLLECTOR_IN[0] - 14 },
    { raw: `Q${VVER_HOT_COLLECTOR_IN[0]} ${VVER_VESSEL.hotNozzle[1]} ${VVER_HOT_COLLECTOR_IN[0]} ${VVER_HOT_COLLECTOR_IN[1]}`, end: VVER_HOT_COLLECTOR_IN },
  ]),
  /** Soğuk kolektörden alt kottaki pompaya. */
  crossleg: route(VVER_COLD_COLLECTOR_OUT, [{ v: 560 }, VVER_MCP_PORTS.suction], 20),
  coldleg: route(VVER_MCP_PORTS.discharge, [{ h: 245 }, { v: VVER_VESSEL.coldNozzle[1] }, VVER_VESSEL.coldNozzle], 15),
  steamline: route([VVER_HSG.steamNozzles[0] - 7, VVER_HSG.steamHeaderY], [{ h: VVER_TURBINE.inlet[0] }, VVER_TURBINE.inlet], R),
  feed1: route(VVER_HOTWELL_OUT, [{ v: 620 }, VVER_FEEDPUMP_PORTS.suction], R),
  feed2: route(VVER_FEEDPUMP_PORTS.discharge, [{ h: 720 }, { v: VVER_HSG.feed[1] }, VVER_HSG.feed], R),
};

export const VVER_PENETRATIONS: { at: Pt; orient: 'h' | 'v'; pipe: number }[] = [
  {
    at: [ellipseRightAtY(VVER_CONTAINMENT.cx, VVER_CONTAINMENT.springY, VVER_CONTAINMENT.rx, VVER_CONTAINMENT.ry, VVER_HSG.steamHeaderY), VVER_HSG.steamHeaderY],
    orient: 'h',
    pipe: 12,
  },
  { at: [VVER_CONTAINMENT.right, VVER_HSG.feed[1]], orient: 'h', pipe: 9 },
];
