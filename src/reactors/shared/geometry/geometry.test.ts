import { describe, expect, it } from 'vitest';
import { dist, ellipseBottom, pathEnds, route, type Pt, type Route } from './route';
import * as P from '../../pwr/pwrLayout';
import * as B from '../../bwr/bwrLayout';
import * as V from '../../vver/vverLayout';

const near = (a: Pt, b: Pt, tol = 0.11) => expect(dist(a, b)).toBeLessThanOrEqual(tol);

/** Rota dizgisinin gerçek uçları, bildirilen port uçlarıyla aynı mı? (Çizim ve parçacık yolu aynı `d`'yi kullanır.) */
function expectRouteEnds(r: Route, start: Pt, end: Pt) {
  const e = pathEnds(r.d);
  near(e.start, start);
  near(e.end, end);
  near(r.start, start);
  near(r.end, end);
}

describe('route()', () => {
  it('köşe yuvarlatma uç noktaları kaydırmaz', () => {
    const r = route([0, 0], [{ h: 100 }, { v: 50 }, [20, 50]], 16);
    expectRouteEnds(r, [0, 0], [20, 50]);
    expect(r.d).toContain('Q100 0');
  });
  it('kısa parçada köşe yarıçapı parça uzunluğunun yarısıyla sınırlanır', () => {
    const r = route([0, 0], [{ h: 100 }, { v: 10 }], 40);
    // İkinci parça 10 birim: en çok 5 birimlik yuvarlatma, son nokta yine (100,10).
    expect(r.d).toMatch(/L95 0 Q100 0 100 5/);
    expectRouteEnds(r, [0, 0], [100, 10]);
  });
  it('pathEnds göreli komutları reddeder', () => {
    expect(() => pathEnds('M0 0 l10 10')).toThrow();
  });
});

describe('PWR bağlantı noktaları', () => {
  const ch = P.PWR_SG.channelHead;
  it('sıcak kol kap çıkışından kanal başlığının giriş (sıcak) tarafına bağlanır', () => {
    expectRouteEnds(P.PWR_ROUTES.hotleg, P.PWR_VESSEL.hotNozzle, P.PWR_SG.inlet);
    expect(P.PWR_SG.inlet[0]).toBeLessThan(ch.cx);
  });
  it('giriş/çıkış uçları kanal başlığı yüzeyinde ve bölme plakasının iki yanında', () => {
    for (const p of [P.PWR_SG.inlet, P.PWR_SG.outlet]) {
      const k = ((p[0] - ch.cx) / ch.rx) ** 2 + ((p[1] - ch.cy) / ch.ry) ** 2;
      expect(k).toBeCloseTo(1, 6);
    }
    expect(P.PWR_SG.outlet[0]).toBeGreaterThan(ch.cx);
    near(ellipseBottom(ch.cx, ch.cy, ch.rx, ch.ry, 0), [ch.cx, ch.cy + ch.ry]);
  });
  it('U boru yolu girişte başlar, çıkışta biter', () => {
    expectRouteEnds(P.PWR_ROUTES.sgTubes, P.PWR_SG.inlet, P.PWR_SG.outlet);
  });
  it('ara bacak pompa emmesine, soğuk kol pompa basmasından kap girişine gider', () => {
    expectRouteEnds(P.PWR_ROUTES.crossleg, P.PWR_SG.outlet, P.PWR_RCP_PORTS.suction);
    expectRouteEnds(P.PWR_ROUTES.coldleg, P.PWR_RCP_PORTS.discharge, P.PWR_VESSEL.coldNozzle);
    for (const p of Object.values(P.PWR_RCP_PORTS)) expect(dist(p, P.PWR_RCP.c)).toBeCloseTo(P.PWR_RCP.r, 6);
  });
  it('besleme suyu kondenser tabanından (boşluksuz) pompaya, oradan buhar üretecine', () => {
    expect(P.PWR_HOTWELL_OUT[1]).toBe(P.PWR_CONDENSER.y + P.PWR_CONDENSER.h);
    expectRouteEnds(P.PWR_ROUTES.feed1, P.PWR_HOTWELL_OUT, P.PWR_FEEDPUMP_PORTS.suction);
    expectRouteEnds(P.PWR_ROUTES.feed2, P.PWR_FEEDPUMP_PORTS.discharge, P.PWR_SG.feed);
  });
  it('ana buhar hattı buhar üreteci nozulundan türbin girişine', () => {
    expectRouteEnds(P.PWR_ROUTES.steamline, P.PWR_SG.steam, P.PWR_TURBINE.inlet);
  });
  it('koruma yapısı geçişleri duvar üzerinde', () => {
    const c = P.PWR_CONTAINMENT;
    const [dome, wall] = P.PWR_PENETRATIONS;
    expect(((dome.at[0] - c.cx) / c.rx) ** 2 + ((dome.at[1] - c.springY) / c.ry) ** 2).toBeCloseTo(1, 6);
    expect(wall.at[0]).toBe(c.right);
  });
});

describe('BWR bağlantı noktaları', () => {
  it('devridaim döngüsü kaptan pompaya, pompadan jet pompası sürücü nozuluna', () => {
    expectRouteEnds(B.BWR_ROUTES.recircOut, B.BWR_VESSEL.recircOut, B.BWR_RECIRC_PORTS.suction);
    expectRouteEnds(B.BWR_ROUTES.recircIn, B.BWR_RECIRC_PORTS.discharge, B.BWR_VESSEL.jetPumpDrive);
    // Dönüş hattı kap duvarını nozul kotunda geçer.
    expect(B.BWR_VESSEL.jetPumpDrive[1]).toBe(B.BWR_VESSEL.recircInNozzle[1]);
    expect(B.BWR_VESSEL.jetPumpDrive[0]).toBeLessThan(B.BWR_VESSEL.wallR);
  });
  it('buhar doğrudan kaptan türbine; besleme suyu kaba döner (buhar üreteci yok)', () => {
    expectRouteEnds(B.BWR_ROUTES.steamline, B.BWR_VESSEL.steamOut, B.BWR_TURBINE.inlet);
    expectRouteEnds(B.BWR_ROUTES.feed1, B.BWR_HOTWELL_OUT, B.BWR_FEEDPUMP_PORTS.suction);
    expectRouteEnds(B.BWR_ROUTES.feed2, B.BWR_FEEDPUMP_PORTS.discharge, B.BWR_VESSEL.feedIn);
    expect(B.BWR_HOTWELL_OUT[1]).toBe(B.BWR_CONDENSER.y + B.BWR_CONDENSER.h);
  });
});

describe('VVER bağlantı noktaları', () => {
  it('sıcak kol sıcak kolektöre, soğuk kolektörden pompaya ve kaba', () => {
    expectRouteEnds(V.VVER_ROUTES.hotleg, V.VVER_VESSEL.hotNozzle, V.VVER_HOT_COLLECTOR_IN);
    expectRouteEnds(V.VVER_ROUTES.crossleg, V.VVER_COLD_COLLECTOR_OUT, V.VVER_MCP_PORTS.suction);
    expectRouteEnds(V.VVER_ROUTES.coldleg, V.VVER_MCP_PORTS.discharge, V.VVER_VESSEL.coldNozzle);
  });
  it('sıcak kol soğuk koldan daha yüksek kottadır (VVER ayırt edici özelliği)', () => {
    expect(V.VVER_VESSEL.hotNozzle[1]).toBeLessThan(V.VVER_VESSEL.coldNozzle[1]);
  });
  it('sıcak kol ucu sıcak kolektörün içinde', () => {
    const c = V.VVER_COLLECTORS.hot;
    const [x, y] = V.VVER_HOT_COLLECTOR_IN;
    expect(x).toBeGreaterThan(c.x);
    expect(x).toBeLessThan(c.x + c.w);
    expect(y).toBeLessThanOrEqual(c.y + c.h);
    expect(y).toBeGreaterThan(c.y);
  });
  it('buhar başlığı tüm buhar nozullarının üstünden geçer, besleme hattı buhar üretecine', () => {
    const s = V.VVER_ROUTES.steamline;
    for (const x of V.VVER_HSG.steamNozzles) expect(x).toBeGreaterThanOrEqual(s.start[0]);
    expectRouteEnds(V.VVER_ROUTES.feed1, V.VVER_HOTWELL_OUT, V.VVER_FEEDPUMP_PORTS.suction);
    expectRouteEnds(V.VVER_ROUTES.feed2, V.VVER_FEEDPUMP_PORTS.discharge, V.VVER_HSG.feed);
    expect(V.VVER_HOTWELL_OUT[1]).toBe(V.VVER_CONDENSER.y + V.VVER_CONDENSER.h);
  });
});
