/**
 * BWR ana şemasının yerleşim sabitleri ve adlandırılmış bağlantı noktaları.
 * Kap içi akışlar (kaynama, ayırma, kurutma) şemada kendi yollarıyla kalır; burada dış hatlar tanımlanır.
 */
import { route, type Pt } from '../shared/geometry/route';

export const BWR_CONTAINMENT = { left: 150, right: 620 } as const;

/** Reaktör kabı duvarları (x) ve nozullar. */
export const BWR_VESSEL = {
  wallL: 230,
  wallR: 450,
  steamOut: [456, 115] as Pt,
  feedIn: [452, 275] as Pt,
  recircOut: [456, 600] as Pt,
  /** Devridaim dönüşü: kap duvarından jet pompası sürücü nozuluna. */
  recircInNozzle: [450, 520] as Pt,
  jetPumpDrive: [440, 520] as Pt,
} as const;

export const BWR_RECIRC_PUMP = { c: [535, 700] as Pt, r: 20 } as const;
export const BWR_RECIRC_PORTS = {
  suction: [BWR_RECIRC_PUMP.c[0] - BWR_RECIRC_PUMP.r, BWR_RECIRC_PUMP.c[1]] as Pt,
  discharge: [BWR_RECIRC_PUMP.c[0] + BWR_RECIRC_PUMP.r, BWR_RECIRC_PUMP.c[1]] as Pt,
};

export const BWR_CONDENSER = { x: 845, y: 306, w: 180, h: 150 } as const;
export const BWR_HOTWELL_OUT: Pt = [890, BWR_CONDENSER.y + BWR_CONDENSER.h];
export const BWR_FEEDPUMP = { c: [769, 600] as Pt, r: 16 } as const;
export const BWR_FEEDPUMP_PORTS = {
  suction: [BWR_FEEDPUMP.c[0] + BWR_FEEDPUMP.r, BWR_FEEDPUMP.c[1]] as Pt,
  discharge: [BWR_FEEDPUMP.c[0] - BWR_FEEDPUMP.r, BWR_FEEDPUMP.c[1]] as Pt,
};
export const BWR_TURBINE = { x: 720, y: 230, inlet: [742, 203] as Pt } as const;

const R = 16;

export const BWR_ROUTES = {
  steamline: route(BWR_VESSEL.steamOut, [{ h: BWR_TURBINE.inlet[0] }, BWR_TURBINE.inlet], R),
  recircOut: route(BWR_VESSEL.recircOut, [{ h: 500 }, { v: 700 }, BWR_RECIRC_PORTS.suction], 14),
  recircIn: route(BWR_RECIRC_PORTS.discharge, [{ h: 575 }, { v: 520 }, BWR_VESSEL.jetPumpDrive], 14),
  feed1: route(BWR_HOTWELL_OUT, [{ v: 600 }, BWR_FEEDPUMP_PORTS.suction], R),
  feed2: route(BWR_FEEDPUMP_PORTS.discharge, [{ h: 600 }, { v: BWR_VESSEL.feedIn[1] }, BWR_VESSEL.feedIn], R),
};

export const BWR_PENETRATIONS: { at: Pt; orient: 'h' | 'v'; pipe: number }[] = [
  { at: [BWR_CONTAINMENT.right, 115], orient: 'h', pipe: 12 },
  { at: [BWR_CONTAINMENT.right, 600], orient: 'h', pipe: 9 },
];
