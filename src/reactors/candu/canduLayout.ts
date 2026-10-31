/**
 * CANDU ana şemasının yerleşim sabitleri ve adlandırılmış bağlantı noktaları (yan görünüş).
 *
 * Temsili CANDU 6. Kaynak (Zhang & Shalaby, AECL — Qinshan Phase III CANDU 6, CANTEACH):
 * ısı taşıma sistemi iki halkadır; her halkada 2 buhar üreteci, 2 pompa, 2 giriş ve 2 çıkış kolektörü vardır;
 * komşu kanallarda akış ters yöndedir ve toplam akış “sekiz” biçimindedir (pompalar seri).
 * Burada iki halkadan BİRİ çizilir; 380 kanal yerine dört temsili kanal (ikisi soldan sağa, ikisi sağdan sola).
 *
 * Kolektörler reaktör yüzeyine dik uzandığı için yan görünüşte daire (uç görünüş) olarak çizilir.
 * Kolektörler çekirdeğin, buhar üreteçleri kolektörlerin üstündedir (CANDU Fundamentals, Bölüm 14).
 *
 * Sekiz şekli: SÇ1 (sol çıkış) → BÜ-1 → P-1 → SG1 (sol giriş) → A kanalları (→) → SÇ2 (sağ çıkış) → BÜ-2 → P-2
 *              → SG2 (sağ giriş) → B kanalları (←) → SÇ1.
 * Besleyiciler aynı yüzeyde farklı kolektörlere gittiği için yan görünüşte bir yerde üst üste geçer;
 * bu kesişmeler birleşme değildir ve köprüyle (boşluk) gösterilir. Gerçek birleşmeler ● ile işaretlenir.
 */
import { ellipseBottom, route, type Pt } from '../shared/geometry/route';

export const CAL = { x0: 240, x1: 560, y0: 440, y1: 620 } as const;
export const END_SHIELD = { w: 30, y0: 425, y1: 635 } as const;
/** Temsili kanalların kotları ve akış yönleri (+1 = soldan sağa). Komşu kanallar ters yönde. */
export const CH_Y = [470, 510, 550, 590] as const;
export const CH_DIR = [1, -1, 1, -1] as const;
export const PT = { x0: 190, x1: 610, half: 6 } as const;
export const CT_HALF = 10;
export const EF = { w: 20, half: 9 } as const;
/** Besleyicinin uç bağlantısına bağlandığı nokta. */
export const EF_LEFT = PT.x0 - EF.w;
export const EF_RIGHT = PT.x1 + EF.w;

export const HDR_R = 14;
/** Kolektörler (uç görünüş): SG = giriş, SÇ = çıkış. */
export const HDR = {
  in1: { c: [152, 390] as Pt, side: 'left' as const },
  out2: { c: [104, 360] as Pt, side: 'left' as const },
  out1: { c: [648, 390] as Pt, side: 'right' as const },
  in2: { c: [696, 360] as Pt, side: 'right' as const },
};
/** Besleyicilerin dikey indiği x (kanal sırasıyla). Alt kanallar daha dışarıdan iner; böylece kesişme en aza iner. */
export const FEEDER_X = {
  left: [158, 110, 146, 98] as const,
  right: [642, 690, 654, 702] as const,
};
/** Kanal → yüzeydeki kolektör. A kanalları (0, 2) soldan girer; B kanalları (1, 3) sağdan girer. */
export const FEEDER_HDR = {
  left: ['in1', 'out2', 'in1', 'out2'] as const,
  right: ['out1', 'in2', 'out1', 'in2'] as const,
};

/** Kolektör dairesinin alt yüzeyinde, verilen x’teki nokta. */
export function headerBottom(h: keyof typeof HDR, x: number): Pt {
  const [cx, cy] = HDR[h].c;
  return [x, cy + Math.sqrt(HDR_R ** 2 - (x - cx) ** 2)];
}

/** i. kanalın sol ya da sağ besleyicisi; akış yönüne göre kolektörden kanala ya da kanaldan kolektöre. */
export function feederRoute(side: 'left' | 'right', i: number) {
  const x = FEEDER_X[side][i];
  const hdr = FEEDER_HDR[side][i];
  const top = headerBottom(hdr, x);
  const end: Pt = [side === 'left' ? EF_LEFT : EF_RIGHT, CH_Y[i]];
  const intoChannel = hdr.startsWith('in');
  return intoChannel ? route(top, [{ v: CH_Y[i] }, end], 8) : route(end, [{ h: x }, top], 8);
}

/** Buhar üreteçleri: dikey U borulu (CANDU 6: “vertical U-tube with integral steam drum and preheater”). */
export const SG = {
  left: { cx: 128 },
  right: { cx: 672 },
  half: 30,
  topHalf: 38,
  bottom: 285,
  head: { ry: 22 },
  top: 118,
  level: 190,
} as const;
export const sgInlet = (cx: number): Pt => ellipseBottom(cx, SG.bottom, SG.half, SG.head.ry, -12);
export const sgOutlet = (cx: number): Pt => ellipseBottom(cx, SG.bottom, SG.half, SG.head.ry, 12);
/** Ortadaki U borusunun animasyonu, dış hatlarla aynı bağlantı noktalarını kullanır. */
export const sgTubePath = (cx: number): string => {
  const [ix, iy] = sgInlet(cx);
  const [ox, oy] = sgOutlet(cx);
  return `M${ix} ${iy} V214 A12 12 0 0 1 ${ox} 214 V${oy}`;
};
export const sgShell = (cx: number) =>
  `M${cx - SG.half} ${SG.bottom} V185 L${cx - SG.topHalf} 165 V140 A${SG.topHalf} 22 0 0 1 ${cx + SG.topHalf} 140 V165 L${cx + SG.half} 185 V${SG.bottom} Z`;

export const HTP_R = 18;
export const HTP = { left: [190, 330] as Pt, right: [730, 330] as Pt };
const ports = (c: Pt) => ({ suction: [c[0] - HTP_R, c[1]] as Pt, discharge: [c[0] + HTP_R, c[1]] as Pt });
export const HTP_PORTS = { left: ports(HTP.left), right: ports(HTP.right) };

export const PZR = { x: 390, y: 150, w: 40, h: 150 } as const;
export const PZR_SURGE_TOP: Pt = [PZR.x + PZR.w / 2, PZR.y + PZR.h];
/** Dalgalanma hattı sağ çıkış kolektörünün sol yüzüne bağlanır. */
export const PZR_SURGE_END: Pt = [HDR.out1.c[0] - HDR_R, HDR.out1.c[1]];

export const STEAM_HEADER_Y = 100;
export const CONTAINMENT = { left: 30, right: 790, springY: 200, ry: 190 } as const;
export const CONT_CX = (CONTAINMENT.left + CONTAINMENT.right) / 2;
export const CONT_RX = (CONTAINMENT.right - CONTAINMENT.left) / 2;

export const CANDU_TURBINE = { x: 800, y: 260, inlet: [822, 233] as Pt } as const;
export const CANDU_CONDENSER = { x: 925, y: 336, w: 180, h: 150 } as const;
export const CANDU_HOTWELL_OUT: Pt = [970, CANDU_CONDENSER.y + CANDU_CONDENSER.h];
export const CANDU_FEEDPUMP = { c: [869, 620] as Pt, r: 16 } as const;
export const CANDU_FEEDPUMP_PORTS = {
  suction: [CANDU_FEEDPUMP.c[0] + CANDU_FEEDPUMP.r, CANDU_FEEDPUMP.c[1]] as Pt,
  discharge: [CANDU_FEEDPUMP.c[0] - CANDU_FEEDPUMP.r, CANDU_FEEDPUMP.c[1]] as Pt,
};
export const FEED_SPLIT: Pt = [775, CANDU_FEEDPUMP.c[1]];
export const SG_FEED_Y = 230;

/** Moderatör sistemi (sadeleştirilmiş): calandria → pompa → ısı değiştirici → calandria. */
export const MOD = {
  out: [300, CAL.y1] as Pt,
  pump: { c: [340, 672] as Pt, r: 15 },
  hx: { x: 420, y: 652, w: 80, h: 40 },
  in: [520, CAL.y1] as Pt,
} as const;

const R = 14;
const hdrSide = (h: keyof typeof HDR, dir: 'l' | 'r'): Pt => [HDR[h].c[0] + (dir === 'l' ? -HDR_R : HDR_R), HDR[h].c[1]];
const hdrTop = (h: keyof typeof HDR): Pt => [HDR[h].c[0], HDR[h].c[1] - HDR_R];

export const CANDU_ROUTES = {
  /** Sol çıkış kolektörü → sol buhar üreteci girişi (sıcak). */
  out2ToSg1: route(hdrTop('out2'), [{ v: 330 }, { h: sgInlet(SG.left.cx)[0] }, sgInlet(SG.left.cx)], 8),
  sg1ToP1: route(sgOutlet(SG.left.cx), [{ v: HTP.left[1] }, HTP_PORTS.left.suction], 8),
  p1ToIn1: route(HTP_PORTS.left.discharge, [{ h: 225 }, { v: HDR.in1.c[1] }, hdrSide('in1', 'r')], 10),
  /** Sağ çıkış kolektörü → sağ buhar üreteci girişi (sıcak). */
  out1ToSg2: route(hdrTop('out1'), [{ v: 345 }, { h: sgInlet(SG.right.cx)[0] }, sgInlet(SG.right.cx)], 8),
  sg2ToP2: route(sgOutlet(SG.right.cx), [{ v: HTP.right[1] }, HTP_PORTS.right.suction], 8),
  p2ToIn2: route(HTP_PORTS.right.discharge, [{ h: 755 }, { v: HDR.in2.c[1] }, hdrSide('in2', 'r')], 8),
  surge: route(PZR_SURGE_TOP, [{ v: HDR.out1.c[1] }, PZR_SURGE_END]),
  /** Sol buhar üreteci tepesinden buhar başlığı boyunca türbine. */
  steamline: route([SG.left.cx, SG.top], [{ v: STEAM_HEADER_Y }, { h: CANDU_TURBINE.inlet[0] }, CANDU_TURBINE.inlet], R),
  steamRight: route([SG.right.cx, SG.top], [{ v: STEAM_HEADER_Y }]),
  feed1: route(CANDU_HOTWELL_OUT, [{ v: CANDU_FEEDPUMP.c[1] }, CANDU_FEEDPUMP_PORTS.suction], R),
  /** Besleme → sağ buhar üreteci (ikincil taraf). */
  feed2: route(CANDU_FEEDPUMP_PORTS.discharge, [{ h: FEED_SPLIT[0] }, { v: SG_FEED_Y }, [SG.right.cx + SG.half, SG_FEED_Y]], R),
  /** Ayrım noktasından reaktörün altından geçip sol buhar üretecine. */
  feed3: route(FEED_SPLIT, [{ v: 725 }, { h: 60 }, { v: SG_FEED_Y }, [SG.left.cx - SG.half, SG_FEED_Y]], R),
  modOut: route(MOD.out, [{ v: MOD.pump.c[1] }, [MOD.pump.c[0] - MOD.pump.r, MOD.pump.c[1]]], 8),
  modToHx: route([MOD.pump.c[0] + MOD.pump.r, MOD.pump.c[1]], [{ h: MOD.hx.x }]),
  modIn: route([MOD.hx.x + MOD.hx.w, MOD.pump.c[1]], [{ h: MOD.in[0] }, MOD.in], 8),
};

/** Kanal içi akış yolu (yöne göre). */
export function channelPath(i: number): string {
  const y = CH_Y[i];
  return CH_DIR[i] > 0 ? `M${PT.x0} ${y} H${PT.x1}` : `M${PT.x1} ${y} H${PT.x0}`;
}

export const CH_FLOW_IDS = CH_Y.map((_, i) => `f-ch-${i + 1}`);
export const FEEDER_L_IDS = CH_Y.map((_, i) => `f-fd-l-${i + 1}`);
export const FEEDER_R_IDS = CH_Y.map((_, i) => `f-fd-r-${i + 1}`);

/** Dış kabuk (koruma binası) üzerinde, verilen kottaki sağ kenar. */
export function containmentRightAtY(y: number): number {
  const t = (CONTAINMENT.springY - y) / CONTAINMENT.ry;
  return CONT_CX + CONT_RX * Math.sqrt(Math.max(0, 1 - t * t));
}

/** Yan görünüşte üst üste geçen (birleşmeyen) besleyici noktaları: üstten geçen kanal 1 besleyicisi. */
export const FEEDER_CROSSINGS: { at: Pt; over: 'h' | 'v' }[] = [
  { at: [FEEDER_X.left[2], CH_Y[1]], over: 'h' },
  { at: [FEEDER_X.right[2], CH_Y[1]], over: 'h' },
];
