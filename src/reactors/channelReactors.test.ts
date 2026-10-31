import { createElement, type ReactElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { SimClock } from '../simulation/clock';
import { EducationalModel } from '../simulation/educationalModel';
import { SimulationContext } from '../hooks/useSimulation';
import { reactors } from './registry';
import { REACTOR_IDS, REACTOR_META, parseTourId, tourReactor } from './meta';
import type { ReactorId } from './shared/types';
import { dist, pathEnds, type Pt } from './shared/geometry/route';
import * as RB from './rbmk/rbmkLayout';
import * as CA from './candu/canduLayout';

// Sunucu tarafı çizimde useLayoutEffect uyarısı beklenir (ölçümler tarayıcıda yapılır); test çıktısını kirletmesin.
const consoleError = console.error;
console.error = (...args: unknown[]) => {
  if (String(args[0]).includes('useLayoutEffect does nothing on the server')) return;
  consoleError(...args);
};

function render(el: ReactElement): string {
  const value = { clock: new SimClock(), model: new EducationalModel(1), reducedMotion: false };
  return renderToStaticMarkup(createElement(SimulationContext.Provider, { value }, el));
}
/** Sahnedeki seçilebilir ekipman (data-id) ve akış (data-flow) kimlikleri. */
const sceneIds = (html: string) => new Set([...html.matchAll(/data-(?:id|flow)="([^"]+)"/g)].map((m) => m[1]));
const near = (a: Pt, b: Pt, tol = 0.11) => expect(dist(a, b)).toBeLessThanOrEqual(tol);

const scenes = Object.fromEntries(
  REACTOR_IDS.map((r) => [r, sceneIds(render(createElement(reactors[r].Scene, { showLabels: true, showFlow: true })))]),
) as Record<ReactorId, Set<string>>;

describe('beş reaktörün kaydı', () => {
  it('kayıt ve ortak meta veri aynı beş reaktörü aynı sırayla içerir', () => {
    expect(Object.keys(reactors)).toEqual([...REACTOR_IDS]);
    for (const r of REACTOR_IDS) {
      expect(reactors[r].config.id).toBe(r);
      expect(reactors[r].config.shortName).toBe(REACTOR_META[r].name);
    }
    expect(new Set(REACTOR_IDS.map((r) => reactors[r].Scene)).size).toBe(5);
    expect(new Set(REACTOR_IDS.map((r) => reactors[r].Details)).size).toBe(5);
  });
  it('anlatım kimlikleri yeni reaktörleri tanır, bilinmeyenleri reddeder', () => {
    expect(tourReactor('rbmk.tour')).toBe('rbmk');
    expect(tourReactor('candu.tour')).toBe('candu');
    expect(tourReactor('rbmkx.tour')).toBeNull();
    expect(parseTourId('candu.tour.sg')).toEqual({ reactor: 'candu', step: 'sg' });
  });
});

describe.each(REACTOR_IDS)('%s: ders, ekipman ve yakın plan hedefleri sahnede gerçekten var', (r) => {
  const { config, lessons, Details } = reactors[r];
  it('her ekipman sahnede seçilebilir bir hedeftir', () => {
    const missing = config.components.filter((c) => !scenes[r].has(c.id)).map((c) => c.id);
    expect(missing).toEqual([]);
  });
  it('ekipman, odak ve ders vurguları sahnedeki kimliklere bağlı', () => {
    const ids = new Set([
      ...config.components.flatMap((c) => c.related),
      ...config.focusActions.flatMap((f) => f.highlight),
      ...lessons.flatMap((l) => l.highlight),
    ]);
    expect([...ids].filter((id) => !scenes[r].has(id))).toEqual([]);
  });
  it('yakın plan anahtarları tanımlı ve her biri bir çizim üretir', () => {
    const keys = new Set(config.details.map((d) => d.key));
    expect(keys.has('core')).toBe(true);
    for (const c of config.components) if (c.detail) expect(keys.has(c.detail), c.id).toBe(true);
    for (const f of config.focusActions) if (f.detail) expect(keys.has(f.detail), f.id).toBe(true);
    for (const k of keys) expect(render(createElement(Details, { detailKey: k, showFlow: true }))).toMatch(/<svg[^>]*aria-label="[^"]+"/);
  });
  it('ders kimlikleri kararlı ve reaktöre özgü', () => {
    expect(new Set(lessons.map((l) => l.id)).size).toBe(lessons.length);
    for (const l of lessons) expect(l.id.startsWith(`${r}.tour.`)).toBe(true);
  });
});

describe('RBMK ve CANDU içerik gereksinimleri', () => {
  it('en az 6 ders adımı ve 4 hızlı odak sorusu; istenen yakın planlar', () => {
    for (const r of ['rbmk', 'candu'] as const) {
      expect(reactors[r].lessons.length).toBeGreaterThanOrEqual(6);
      expect(reactors[r].config.focusActions.length).toBeGreaterThanOrEqual(4);
    }
    expect(reactors.rbmk.config.details.map((d) => d.key)).toEqual(expect.arrayContaining(['channel', 'boiling', 'drum']));
    expect(reactors.candu.config.details.map((d) => d.key)).toEqual(expect.arrayContaining(['channel', 'separation', 'sg', 'fuelling']));
    expect(reactors.rbmk.config.focusActions.map((f) => f.label)).toEqual(
      expect.arrayContaining(['Grafit ne yapar?', 'Buhar nerede oluşur?', 'Ayırıcı tambur neyi ayırır?', 'BWR’den temel farkı nedir?']),
    );
    expect(reactors.candu.config.focusActions.map((f) => f.label)).toEqual(
      expect.arrayContaining(['İki ağır su sistemi neden ayrıdır?', 'Calandria ile basınç tüpü arasındaki fark nedir?', 'Türbine hangi devrenin buharı gider?', 'Yatay kanallarda yakıt nasıl konumlanır?']),
    );
  });
  it('çizilen temsili tasarım arayüzde açıkça belirtilir', () => {
    expect(reactors.rbmk.config.fullName).toMatch(/RBMK-1000/);
    expect(reactors.candu.config.fullName).toMatch(/CANDU 6/);
    expect(reactors.rbmk.config.notes.join(' ')).toMatch(/temsil|Temsili/);
    expect(reactors.candu.config.notes.join(' ')).toMatch(/Temsili CANDU 6/);
  });
  it('RBMK’de buhar üreteci ve basınçlandırıcı yok; tambur buhar üreteci olarak sunulmaz', () => {
    const names = reactors.rbmk.config.components.map((c) => c.name).join(' | ');
    expect(names).not.toMatch(/buhar üreteci|basınçlandırıcı/i);
    expect(reactors.rbmk.config.components.find((c) => c.id === 'drum')!.how).toMatch(/buhar üreteci değildir/);
  });
});

/** Eksene paralel parçalar kesişiyor mu (uçlarda dokunma hariç)? */
type Seg = [Pt, Pt];
function crosses(a: Seg, b: Seg): Pt | null {
  const h = (s: Seg) => s[0][1] === s[1][1];
  const [p, q] = h(a) && !h(b) ? [a, b] : !h(a) && h(b) ? [b, a] : [null, null];
  if (!p || !q) return null;
  const y = p[0][1];
  const x = q[0][0];
  const within = (v: number, s: number, e: number) => v > Math.min(s, e) + 0.5 && v < Math.max(s, e) - 0.5;
  return within(x, p[0][0], p[1][0]) && within(y, q[0][1], q[1][1]) ? [x, y] : null;
}
const segs = (pts: Pt[]): Seg[] => pts.slice(1).map((p, i) => [pts[i], p]);

describe('RBMK boru geometrisi', () => {
  const polylines = RB.RBMK_FUEL_X.map((x, i) => [
    [x, RB.RBMK_TUBE.top],
    [x, RB.RBMK_RISER_LEVEL[i]],
    [RB.RBMK_RISER_IN[i], RB.RBMK_RISER_LEVEL[i]],
    [RB.RBMK_RISER_IN[i], RB.RBMK_DRUM_BOTTOM - 2],
  ] as Pt[]);
  it('her kanalın buhar–su borusu kendi kanalından tambura gider', () => {
    RB.RBMK_FUEL_X.forEach((x, i) => {
      const e = pathEnds(RB.riserRoute(i).d);
      near(e.start, [x, RB.RBMK_TUBE.top]);
      near(e.end, [RB.RBMK_RISER_IN[i], RB.RBMK_DRUM_BOTTOM - 2]);
      expect(RB.RBMK_RISER_IN[i]).toBeGreaterThan(RB.RBMK_DRUM.x0);
      expect(RB.RBMK_RISER_IN[i]).toBeLessThan(RB.RBMK_DRUM.x1);
    });
  });
  it('buhar–su boruları birleşmez ve birbirini kesmez', () => {
    for (let i = 0; i < polylines.length; i++)
      for (let j = i + 1; j < polylines.length; j++)
        for (const a of segs(polylines[i])) for (const b of segs(polylines[j])) expect(crosses(a, b), `${i}-${j}`).toBeNull();
    expect(new Set(RB.RBMK_RISER_IN).size).toBe(RB.RBMK_RISER_IN.length);
  });
  it('iniş borusu tamburdan pompaya, pompa basması kolektöre; besleme tambura', () => {
    near(pathEnds(RB.RBMK_ROUTES.downcomer.d).end, RB.RBMK_MCP_PORTS.suction);
    near(pathEnds(RB.RBMK_ROUTES.pressure.d).start, RB.RBMK_MCP_PORTS.discharge);
    near(pathEnds(RB.RBMK_ROUTES.feed2.d).end, RB.RBMK_FEED_IN);
    expect(dist(RB.RBMK_FEED_IN, [RB.RBMK_DRUM.x1, RB.RBMK_DRUM.cy])).toBeCloseTo(RB.RBMK_DRUM.r, 6);
    for (const p of Object.values(RB.RBMK_MCP_PORTS)) expect(dist(p, RB.RBMK_MCP.c)).toBeCloseTo(RB.RBMK_MCP.r, 6);
    // Alt su boruları kolektörden kanal tabanına.
    RB.RBMK_FUEL_X.forEach((x, i) => {
      const e = pathEnds(RB.lowerRoute(i).d);
      near(e.start, [x, RB.RBMK_DGH.y]);
      near(e.end, [x, RB.RBMK_TUBE.bottom]);
    });
  });
  it('kontrol kanalları yakıt kanallarından ayrıdır', () => {
    for (const c of RB.RBMK_CTRL_X) for (const f of RB.RBMK_FUEL_X) expect(Math.abs(c - f)).toBeGreaterThan(2 * RB.RBMK_TUBE.half);
  });
});

describe('CANDU boru geometrisi ve sekiz biçimli halka', () => {
  it('çizilen buhar üreteci iç akışları dış boruların bağlantı uçlarına kesintisiz bağlanır', () => {
    const html = render(createElement(reactors.candu.Scene, { showLabels: true, showFlow: true }));
    for (const [id, cx] of [['f-sg1-tubes', CA.SG.left.cx], ['f-sg2-tubes', CA.SG.right.cx]] as const) {
      const d = new RegExp(`data-flow="${id}"[^>]*>[\\s\\S]*?<path[^>]* d="([^"]+)"`).exec(html)?.[1];
      expect(d).toBeDefined();
      const ends = pathEnds(d!);
      near(ends.start, CA.sgInlet(cx));
      near(ends.end, CA.sgOutlet(cx));
      // Animasyon, çizilmiş U borularından biriyle aynı bükülmeyi izlemeli.
      expect(html).toContain(`d="M${cx - 12} 285 V214 A12 12 0 0 1 ${cx + 12} 214 V285"`);
    }
  });
  it('buhar üreteci yakın planında iç akış giriş ve çıkış borularıyla birleşir', () => {
    const html = render(createElement(reactors.candu.Details, { detailKey: 'sg', showFlow: true }));
    const flow = (id: string) => {
      const d = new RegExp(`data-flow="${id}"[^>]*>[\\s\\S]*?<path[^>]* d="([^"]+)"`).exec(html)?.[1];
      expect(d).toBeDefined();
      return pathEnds(d!);
    };
    near(flow('cd3-in').end, flow('cd3-tubes').start);
    near(flow('cd3-tubes').end, flow('cd3-out').start);
    expect(html.indexOf('class="channel-head"')).toBeLessThan(html.indexOf('data-flow="cd3-tubes"'));
  });
  it('komşu kanallarda akış yönü terstir', () => {
    for (let i = 1; i < CA.CH_DIR.length; i++) expect(CA.CH_DIR[i]).toBe(-CA.CH_DIR[i - 1]);
  });
  it('besleyiciler akış yönüne göre giriş kolektöründen kanala, kanaldan çıkış kolektörüne gider', () => {
    CA.CH_Y.forEach((y, i) => {
      const L = pathEnds(CA.feederRoute('left', i).d);
      const R = pathEnds(CA.feederRoute('right', i).d);
      if (CA.CH_DIR[i] > 0) {
        expect(CA.FEEDER_HDR.left[i]).toBe('in1');
        expect(CA.FEEDER_HDR.right[i]).toBe('out1');
        near(L.end, [CA.EF_LEFT, y]);
        near(R.start, [CA.EF_RIGHT, y]);
      } else {
        expect(CA.FEEDER_HDR.left[i]).toBe('out2');
        expect(CA.FEEDER_HDR.right[i]).toBe('in2');
        near(L.start, [CA.EF_LEFT, y]);
        near(R.end, [CA.EF_RIGHT, y]);
      }
    });
  });
  it('halka sırası: SÇ1 → BÜ-2 → P-2 → SG2 ve SÇ2 → BÜ-1 → P-1 → SG1', () => {
    const R = CA.CANDU_ROUTES;
    near(pathEnds(R.out1ToSg2.d).end, CA.sgInlet(CA.SG.right.cx));
    near(pathEnds(R.sg2ToP2.d).start, CA.sgOutlet(CA.SG.right.cx));
    near(pathEnds(R.sg2ToP2.d).end, CA.HTP_PORTS.right.suction);
    near(pathEnds(R.p2ToIn2.d).start, CA.HTP_PORTS.right.discharge);
    near(pathEnds(R.out2ToSg1.d).end, CA.sgInlet(CA.SG.left.cx));
    near(pathEnds(R.sg1ToP1.d).end, CA.HTP_PORTS.left.suction);
    near(pathEnds(R.p1ToIn1.d).start, CA.HTP_PORTS.left.discharge);
    // Kolektör uçları dairelerin üzerinde.
    for (const [route, h] of [[R.p1ToIn1, 'in1'], [R.p2ToIn2, 'in2']] as const) expect(dist(pathEnds(route.d).end, CA.HDR[h].c)).toBeCloseTo(CA.HDR_R, 6);
    for (const [route, h] of [[R.out1ToSg2, 'out1'], [R.out2ToSg1, 'out2']] as const) expect(dist(pathEnds(route.d).start, CA.HDR[h].c)).toBeCloseTo(CA.HDR_R, 6);
  });
  it('besleyicilerin yan görünüşteki tek kesişmeleri köprüyle işaretli noktalardır', () => {
    for (const side of ['left', 'right'] as const) {
      const lines = CA.CH_Y.map((y, i) => {
        const x = CA.FEEDER_X[side][i];
        const top = CA.headerBottom(CA.FEEDER_HDR[side][i], x);
        return [[side === 'left' ? CA.EF_LEFT : CA.EF_RIGHT, y], [x, y], top] as Pt[];
      });
      const found: Pt[] = [];
      for (let i = 0; i < lines.length; i++)
        for (let j = i + 1; j < lines.length; j++) for (const a of segs(lines[i])) for (const b of segs(lines[j])) {
          const c = crosses(a, b);
          if (c) found.push(c);
        }
      const marked = CA.FEEDER_CROSSINGS.filter((c) => (side === 'left' ? c.at[0] < 400 : c.at[0] > 400)).map((c) => c.at);
      expect(found).toEqual(marked);
    }
  });
  it('moderatör sistemi birincil devreye bağlı değildir', () => {
    const modsys = reactors.candu.config.components.find((c) => c.id === 'modsys')!;
    expect(modsys.related.some((id) => /f-(ch|fd|out|p\d|sg)/.test(id))).toBe(false);
    near(pathEnds(CA.CANDU_ROUTES.modOut.d).start, CA.MOD.out);
    near(pathEnds(CA.CANDU_ROUTES.modIn.d).end, CA.MOD.in);
    const html = render(createElement(reactors.candu.Scene, { showLabels: false, showFlow: true }));
    for (const id of ['f-mod-out', 'f-mod-hx', 'f-mod-in']) expect(html).toMatch(new RegExp(`class="flow flow-mod[^"]*" data-flow="${id}"`));
  });
  it('buhar başlığı koruma binasından kubbe üzerindeki geçişle çıkar', () => {
    const x = CA.containmentRightAtY(CA.STEAM_HEADER_Y);
    expect(x).toBeGreaterThan(CA.SG.right.cx);
    expect(x).toBeLessThan(CA.CANDU_TURBINE.inlet[0]);
  });
});
