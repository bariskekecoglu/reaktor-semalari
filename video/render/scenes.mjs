// Sahne tanımları. Zamanlar seslendirmeden ölçülen cümle başlangıçlarına (T.l(i)) ve bitişlerine (T.e(i)) bağlıdır.
// Her sahne: setup (kayıt öncesi durum), plan.cam (kamera), plan.items (katman), events (zamanlı uygulama eylemleri).
const id = (x) => `.scene-svg [data-id="${x}"]`;
const SVG = '.scene-svg';
const FULL = [40, 40, 1840, 900];
const NAVY = '#17283d';
const URL_TEXT = 'bariskekecoglu.github.io/reaktor-semalari';

const ev = (at, run) => ({ at, run });
function base(T, kicker, opts = {}) {
  const items = [{ type: 'cover', in: opts.noIn ? 0 : 0.45, out: opts.noOut ? 0 : 0.45, dur: T.dur }];
  if (kicker) items.unshift({ type: 'kicker', t0: kicker.t0 ?? 0.25, t1: kicker.t1 ?? T.dur - 0.3, ...kicker });
  return items;
}
async function reactor(h, name) { await h.clickText(name, '.reactor-seg'); await h.settle(700); }
async function view(h, name) { await h.clickText(name, 'nav.content-seg'); await h.settle(700); }

// İmleç izi + eşzamanlı tıklamalar: cur.go(t, sel) yalnız hareket, cur.tap(t, sel, run) hareket + tıklama.
function cursor() {
  const keys = [], events = [];
  return {
    go(t, sel, o = {}) { keys.push({ t, sel, ...o }); return this; },
    tap(t, sel, run, o = {}) { keys.push({ t, sel, click: true, ...o }); events.push(ev(t + 0.05, run)); return this; },
    item(t1) { return { type: 'cursor', keys: keys.sort((a, b) => a.t - b.t), t1 }; },
    events,
  };
}
const card = (html, t0, t1, anim, extra = {}) => ({ type: 'card', t0, t1, html, anim, f: 0.45, ...extra });
const H1 = (txt, cls = 'a') => `<div class="${cls}" style="font-size:66px;font-weight:700;line-height:1.15;max-width:1500px">${txt}</div>`;

const SCENES = {};

// ---------- 01 · Açılış ----------
SCENES.s01 = (T) => {
  const l3 = T.l(3), d3 = T.e(3) - l3;
  const seg = (k) => l3 + (d3 * k) / 4;
  return {
    async setup(h) { await reactor(h, 'PWR'); await h.focus(true); await h.settle(1500); },
    plan: {
      cam: [
        { t: 0, sel: SVG, pad: 10, box: FULL },
        { t: seg(0) - 0.3, d: 1.3, sel: [id('vessel')], pad: 60, maxS: 1.9 },
        { t: seg(1) - 0.2, d: 1.1, sel: [id('sg')], pad: 60, maxS: 1.7 },
        { t: seg(2) - 0.2, d: 1.1, sel: [id('hp'), id('lp')], pad: 60, maxS: 1.9 },
        { t: seg(3) - 0.2, d: 1.1, sel: [id('gen')], pad: 120, maxS: 2 },
        { t: T.l(4) - 0.4, d: 1.4, sel: SVG, pad: 10, box: FULL },
      ],
      items: [
        { type: 'cover', in: 0.8, out: 0, dur: T.dur, color: '#000' },
        card(`<div style="position:absolute;inset:0;background:${NAVY};opacity:.86"></div>
          <div style="position:relative;display:flex;flex-direction:column;align-items:center;gap:34px">
            <div class="q1" style="font-size:62px;font-weight:700;max-width:1500px;line-height:1.2">Nükleer santralde ısı elektriğe nasıl dönüşür?</div>
            <div class="q2" style="font-size:50px;font-weight:600;color:#e0aa7f;max-width:1500px;line-height:1.2">Farklı reaktörler neden farklı görünür?</div></div>`,
          0.3, T.l(3) - 0.1, [['.q1', T.l(1) - 0.2, T.l(1) + 0.6], ['.q2', T.l(2) - 0.2, T.l(2) + 0.6]], { bg: 'transparent' }),
        { type: 'callout', t0: seg(0) + 0.2, t1: seg(1) + 0.1, target: id('vessel'), side: 'r', dist: 70, ay: 0.6, text: '1 · Çekirdekte ısı', box: true },
        { type: 'callout', t0: seg(1) + 0.2, t1: seg(2) + 0.1, target: id('sg'), side: 'r', dist: 70, ay: 0.3, text: '2 · Buhar', box: true },
        { type: 'callout', t0: seg(2) + 0.2, t1: seg(3) + 0.1, target: id('lp'), side: 'b', dist: 80, text: '3 · Türbin döner', box: true },
        { type: 'callout', t0: seg(3) + 0.2, t1: T.e(3) + 0.5, target: id('gen'), side: 'b', dist: 80, text: '4 · Elektrik', box: true },
        { type: 'chip', t0: T.l(4) + 0.4, t1: T.l(5) - 0.2, x: 1180, y: 40, center: true, text: 'Isının türbine giden yolu tasarıma göre değişir' },
        card(`<div class="k" style="font-size:24px;letter-spacing:.18em;color:#e0aa7f;font-weight:700">◈ ETKİLEŞİMLİ ÖĞRENME LABORATUVARI</div>
          <div class="t" style="font-size:96px;font-weight:800;margin-top:14px">Nükleer Santral Şemaları</div>
          <div class="s" style="font-size:36px;margin-top:18px;color:#e9e2d4">PWR · BWR · VVER · RBMK · CANDU</div>
          <div class="s2" style="font-size:26px;margin-top:26px;color:#cfc6b4">Hareketli, temsili ve ölçeksiz teknik kesitler</div>`,
          T.l(5) - 0.3, T.dur + 1, [['.k', T.l(5), T.l(5) + 0.6], ['.t', T.l(5) + 0.2, T.l(5) + 0.9], ['.s', T.l(5) + 0.6, T.l(5) + 1.3], ['.s2', T.l(5) + 1.1, T.l(5) + 1.8]], { top: true }),
        { type: 'cover', in: 0, out: 0.45, dur: T.dur },
      ],
    },
    events: [
      // ikinci soruda arka planda beş reaktör sırayla
      ...['BWR', 'VVER', 'RBMK', 'CANDU', 'PWR'].map((r, i) => ev(T.l(2) + i * ((T.l(3) - T.l(2) - 0.3) / 5), (h) => h.clickText(r, '.reactor-seg'))),
    ],
  };
};

// ---------- 02 · Projenin amacı ----------
SCENES.s02 = (T) => {
  const cur = cursor()
    .go(T.l(3) - 0.6, 'text:.reactor-seg|PWR')
    .tap(T.l(3) + 0.3, 'text:.reactor-seg|BWR', (h) => h.clickText('BWR', '.reactor-seg'))
    .tap(T.l(3) + (T.e(3) - T.l(3)) * 0.45, 'text:.reactor-seg|RBMK', (h) => h.clickText('RBMK', '.reactor-seg'))
    .tap(T.l(3) + (T.e(3) - T.l(3)) * 0.8, 'text:.reactor-seg|CANDU', (h) => h.clickText('CANDU', '.reactor-seg'));
  return {
    async setup(h) {
      await reactor(h, 'PWR'); await h.focus(true);
      await h.clickText('Akış işaretleri', '.viewport-toolbar'); await h.clickText('Duraklat', '.controls');
      await h.js(() => { document.querySelector('.scene-svg').style.filter = 'grayscale(1) contrast(.9)'; });
      await h.settle(800);
    },
    plan: {
      cam: [
        { t: 0, sel: SVG, pad: 10, box: FULL },
        { t: T.l(2) + 0.25, d: 0.01, view: 'page' },
        { t: T.l(2) + 1.2, d: 2.6, sel: ['.header', '.stage', '.side-panel'], pad: 10, box: [40, 30, 1840, 900] },
        { t: T.l(3) - 0.6, d: 1.2, sel: ['.reactor-row', '.scene-canvas'], pad: 16, box: [40, 30, 1840, 900] },
        { t: T.l(4) - 0.3, d: 0.01, sel: ['.scene-canvas', '.legend'], pad: 10, box: [40, 30, 1840, 900] },
        { t: T.l(4) + 0.6, d: 1.6, sel: ['.legend'], pad: 20, box: [40, 280, 1840, 500], maxS: 1.6 },
        { t: T.l(5) - 0.4, d: 1.4, sel: ['.brand'], pad: 30, box: [40, 120, 1840, 640], maxS: 2 },
      ],
      items: [
        ...base(T),
        { type: 'chip', t0: 0.5, t1: T.l(2) + 0.1, x: 1180, y: 40, center: true, text: 'Statik şema: hangi hat nereye gidiyor?' },
        { type: 'wipe', t: T.l(2) + 0.25, d: 0.5 },
        { type: 'wipe', t: T.l(4) - 0.3, d: 0.5 },
        cur.item(T.e(3) + 0.3),
        { type: 'ring', t0: T.l(5) + 0.3, t1: T.dur - 0.4, target: '.subtitle', pad: 10 },
      ],
    },
    events: [
      ev(T.l(2) + 0.2, async (h) => {
        await h.js(() => { document.querySelector('.scene-svg').style.filter = ''; });
        await h.clickText('Akış işaretleri', '.viewport-toolbar'); await h.clickText('Oynat', '.controls'); await h.focus(false);
      }),
      ...cur.events,
      ev(T.l(4) - 0.3, (h) => h.clickText('PWR', '.reactor-seg')),
    ],
  };
};

// ---------- 03 · PWR ----------
SCENES.s03 = (T) => ({
  async setup(h) { await reactor(h, 'PWR'); await h.focus(true); await h.settle(1500); },
  plan: {
    cam: [
      { t: 0, sel: SVG, pad: 10, box: FULL },
      { t: T.l(2) - 0.2, d: 1.4, sel: [id('vessel'), id('pressurizer'), id('rcp')], pad: 40 },
      { t: T.l(3) - 0.2, d: 1.4, sel: [id('sg'), id('hotleg'), id('coldleg')], pad: 40 },
      { t: T.l(4) - 0.1, d: 1.2, sel: [id('pressurizer'), id('vessel'), id('sg')], pad: 40 },
      { t: T.l(5) - 0.2, d: 1.6, sel: [id('sg'), id('steamline'), id('hp'), id('lp')], pad: 40 },
      { t: T.dur - 2.2, d: 1.8, sel: SVG, pad: 10, box: FULL },
    ],
    items: [
      ...base(T, { k: 'Beş reaktör · 1/5', title: 'PWR — basınçlı su reaktörü', sub: 'İki ayrı devre, buhar üretecinde buluşur', t1: T.l(2) + 0.6 }),
      { type: 'callout', t0: T.l(2) + 0.4, t1: T.e(2) + 0.3, target: id('vessel'), side: 'r', dist: 60, ay: 0.35, text: 'Birincil devre<small>yüksek basınç · toplu kaynama yok</small>', box: true },
      { type: 'callout', t0: T.l(3) + 0.8, t1: T.e(3) + 0.2, target: id('sg'), side: 'l', dist: 90, ay: 0.62, text: 'U boruları<small>ısı duvardan geçer, su karışmaz</small>', box: true },
      { type: 'callout', t0: T.l(3) + 1.6, t1: T.e(3) + 0.2, target: id('sg'), side: 'r', dist: 70, ay: 0.12, dy: -50, text: 'İkincil taraf · buhar' },
      { type: 'ring', t0: T.l(4) + 0.3, t1: T.e(4) + 0.2, target: id('pressurizer'), pad: 12 },
      { type: 'callout', t0: T.l(4) + 0.5, t1: T.e(4) + 0.2, target: id('pressurizer'), side: 'l', dist: 60, text: 'Basınçlandırıcı' },
      { type: 'callout', t0: T.l(5) + 1.2, t1: T.dur - 1.6, target: id('hp'), side: 'b', dist: 120, text: 'Türbine yalnız ikincil devrenin buharı' },
    ],
  },
  events: [
    ev(T.l(3) - 0.1, (h) => h.click(id('sg'))),
    ev(T.l(4) - 0.1, (h) => h.click(id('pressurizer'))),
    ev(T.l(5), (h) => h.click(id('steamline'))),
  ],
});

// ---------- 04 · BWR ----------
SCENES.s04 = (T) => ({
  async setup(h) { await reactor(h, 'BWR'); await h.focus(true); await h.settle(1500); },
  plan: {
    cam: [
      { t: 0, sel: SVG, pad: 10, box: FULL },
      { t: T.l(2) - 0.2, d: 1.4, sel: [id('core')], pad: 50, maxS: 2.2 },
      { t: T.l(3) - 0.2, d: 1.4, sel: [id('separators'), id('dryers'), id('steamline'), id('hp')], pad: 40 },
      { t: T.l(4) - 0.2, d: 1.2, sel: [id('core'), id('rods')], pad: 50, maxS: 2 },
      { t: T.dur - 2.0, d: 1.6, sel: SVG, pad: 10, box: FULL },
    ],
    items: [
      ...base(T, { k: 'Beş reaktör · 2/5', title: 'BWR — kaynar su reaktörü', sub: 'Buhar kabın içinde oluşur; tek çevrim', t1: T.l(2) + 0.4 }),
      { type: 'chip', t0: T.l(1) + 1.2, t1: T.e(1) + 0.4, x: 1180, y: 40, center: true, text: 'Buhar üreteci yok · basınçlandırıcı yok' },
      { type: 'callout', t0: T.l(2) + 0.6, t1: T.e(2) + 0.6, target: id('core'), side: 'r', dist: 80, text: 'Kaynama çekirdekte', box: true },
      { type: 'callout', t0: T.l(3) + 0.5, t1: T.e(3) + 0.2, target: id('separators'), side: 'b', dist: 90, dx: 120, text: 'Ayırıcılar ve kurutucular' },
      { type: 'callout', t0: T.l(3) + 1.8, t1: T.e(3) + 0.2, target: id('hp'), side: 'b', dist: 70, text: 'Doğrudan türbine' },
      { type: 'callout', t0: T.l(4) + 0.4, t1: T.dur - 1.3, target: id('rods'), side: 'r', dist: 90, text: 'Kontrol çubukları alttan girer' },
    ],
  },
  events: [
    ev(T.l(3) - 0.1, (h) => h.click(id('steamline'))),
    ev(T.l(4) - 0.1, (h) => h.click(id('rods'))),
  ],
});

// ---------- 05 · VVER ----------
SCENES.s05 = (T) => ({
  async setup(h) { await reactor(h, 'VVER'); await h.focus(true); await h.settle(1500); },
  plan: {
    cam: [
      { t: 0, sel: SVG, pad: 10, box: FULL },
      { t: T.l(2) - 0.2, d: 1.4, sel: [id('hsg')], pad: 60, maxS: 2.2 },
      { t: T.l(3) - 0.1, d: 1.0, sel: [id('hsg'), id('collector-hot'), id('collector-cold')], pad: 40, maxS: 2.2 },
      { t: T.l(4) - 0.2, d: 1.4, sel: [id('vessel'), id('hotleg'), id('coldleg'), id('hsg')], pad: 40 },
      { t: T.l(5) - 0.1, d: 0.01, sel: ['.core-panel'], pad: 16, box: [40, 40, 1840, 880], maxS: 1.6 },
    ],
    items: [
      ...base(T, { k: 'Beş reaktör · 3/5', title: 'VVER — PWR ailesinden', sub: 'Yatay buhar üreteci, farklı yerleşim', t1: T.l(2) + 0.4 }),
      { type: 'callout', t0: T.l(2) + 0.5, t1: T.e(2) + 0.4, target: id('hsg'), side: 't', dist: 70, text: 'Yatay buhar üreteci', box: true },
      { type: 'callout', t0: T.l(3) + 0.4, t1: T.e(3) + 0.3, target: id('collector-hot'), side: 'b', dist: 90, dx: -60, text: 'Sıcak kolektör' },
      { type: 'callout', t0: T.l(3) + 1.6, t1: T.e(3) + 0.3, target: id('collector-cold'), side: 'b', dist: 90, dx: 60, text: 'Soğuk kolektör' },
      { type: 'callout', t0: T.l(4) + 0.5, t1: T.e(4) + 0.3, target: id('hotleg'), side: 't', dist: 60, text: 'Sıcak kol · üst kot' },
      { type: 'callout', t0: T.l(4) + 1.2, t1: T.e(4) + 0.3, target: id('coldleg'), side: 'b', dist: 60, text: 'Soğuk kol · alt kot' },
      { type: 'wipe', t: T.l(5) - 0.1, d: 0.6 },
      { type: 'chip', t0: T.l(5) + 0.5, t1: T.dur - 0.5, x: 1180, y: 40, center: true, text: 'Çekirdek yakın planı: altıgen yakıt demetleri' },
    ],
  },
  events: [
    ev(T.l(3) - 0.2, (h) => h.clickText('Kolektör ve boru demeti', '.side-panel')),
    ev(T.l(4) - 0.2, (h) => h.click(id('hotleg'))),
    ev(T.l(5) - 0.1, async (h) => { await h.clickText('Çekirdek yakın planı', '.viewport-toolbar'); await h.focus(false); }),
  ],
});

// ---------- 06 · RBMK ----------
SCENES.s06 = (T) => ({
  async setup(h) { await reactor(h, 'RBMK'); await h.focus(true); await h.settle(1500); },
  plan: {
    cam: [
      { t: 0, sel: SVG, pad: 10, box: FULL },
      { t: T.l(1) + 1.0, d: 1.6, sel: [id('graphite')], pad: 50, maxS: 2 },
      { t: T.l(2) - 0.2, d: 1.2, sel: [id('graphite'), id('channels')], pad: 50, maxS: 2 },
      { t: T.l(3) - 0.2, d: 1.4, sel: [id('channels'), id('risers'), id('drum'), id('steamline'), id('hp')], pad: 30 },
      { t: T.l(4) - 0.2, d: 1.4, sel: SVG, pad: 10, box: FULL },
    ],
    items: [
      ...base(T, { k: 'Beş reaktör · 4/5', title: 'RBMK — grafit moderatörlü kanal reaktörü', sub: 'Dikey basınç kanalları, ayırıcı tambur', t1: T.l(2) - 0.1 }),
      { type: 'callout', t0: T.l(1) + 1.8, t1: T.e(1) + 0.4, target: id('graphite'), side: 'r', dist: 60, ay: 0.7, text: 'Grafit moderatör yığını', box: true },
      { type: 'callout', t0: T.l(2) + 0.6, t1: T.e(2) + 0.3, target: id('channels'), side: 'l', dist: 70, ay: 0.3, text: 'Dikey basınç kanalları<small>su yukarı akarken kaynar</small>', box: true },
      { type: 'callout', t0: T.l(3) + 0.3, t1: T.e(3) + 0.3, target: id('drum'), side: 't', dist: 60, text: 'Ayırıcı tambur' },
      { type: 'callout', t0: T.l(3) + 1.6, t1: T.e(3) + 0.3, target: id('hp'), side: 'b', dist: 80, text: 'Buhar türbine' },
      { type: 'chip', t0: T.l(4) + 0.4, t1: T.dur - 0.8, x: 1180, y: 40, center: true, text: 'Tek bir basınç kabı yok: basınç sınırı kanallarda' },
    ],
  },
  events: [
    ev(T.l(1) + 1.0, (h) => h.click(id('graphite'))),
    ev(T.l(2) - 0.1, (h) => h.click(id('channels'))),
    ev(T.l(3) - 0.1, (h) => h.click(id('drum'))),
    ev(T.l(4) - 0.1, (h) => h.click(id('channels'))),
  ],
});

// ---------- 07 · CANDU ----------
SCENES.s07 = (T) => ({
  async setup(h) { await reactor(h, 'CANDU'); await h.focus(true); await h.settle(1500); },
  plan: {
    cam: [
      { t: 0, sel: SVG, pad: 10, box: FULL },
      { t: T.l(1) + 0.8, d: 1.6, sel: [id('calandria'), id('channels')], pad: 50, maxS: 2 },
      { t: T.l(2) - 0.2, d: 1.4, sel: [id('channels'), id('sg1'), id('sg2'), id('htp1')], pad: 30 },
      { t: T.l(3) - 0.2, d: 1.4, sel: [id('calandria'), id('modsys')], pad: 40 },
      { t: T.l(4) - 0.2, d: 1.4, sel: [id('sg2'), id('steamline'), id('hp'), id('lp')], pad: 40 },
      { t: T.l(5) - 0.2, d: 1.4, sel: [id('channels'), id('endshields'), id('feeders-l'), id('feeders-r')], pad: 40 },
      { t: T.dur - 2.0, d: 1.6, sel: SVG, pad: 10, box: FULL },
    ],
    items: [
      ...base(T, { k: 'Beş reaktör · 5/5', title: 'CANDU — basınçlı ağır su reaktörü', sub: 'Yatay basınç tüpleri, ayrı moderatör', t1: T.l(1) + 0.9 }),
      { type: 'callout', t0: T.l(1) + 1.6, t1: T.e(1) + 0.4, target: id('channels'), side: 'b', dist: 80, text: 'Yatay basınç tüpleri · yakıt içeride', box: true },
      { type: 'callout', t0: T.l(2) + 0.5, t1: T.e(2) + 0.3, target: id('sg1'), side: 'r', dist: 70, text: 'Basınçlı ağır su → buhar üreteci', box: true },
      { type: 'callout', t0: T.l(3) + 0.5, t1: T.e(3) + 0.3, target: id('modsys'), side: 'r', dist: 70, text: 'Moderatör: düşük basınç, ayrı sistem', box: true },
      { type: 'callout', t0: T.l(4) + 0.6, t1: T.e(4) + 0.3, target: id('hp'), side: 'b', dist: 80, text: 'Türbin buharı: ikincil hafif su' },
      { type: 'callout', t0: T.l(5) + 0.4, t1: T.dur - 1.6, target: id('endshields'), side: 'b', dist: 90, text: 'Yakıt işletmede değiştirilir' },
    ],
  },
  events: [
    ev(T.l(1) + 0.8, (h) => h.click(id('channels'))),
    ev(T.l(2) - 0.1, (h) => h.click(id('sg1'))),
    ev(T.l(3) - 0.1, (h) => h.click(id('moderator'))),
    ev(T.l(4) - 0.1, (h) => h.click(id('steamline'))),
    ev(T.l(5) - 0.1, (h) => h.click(id('channels'))),
  ],
});

// ---------- 08 · Etkileşimli keşif ----------
SCENES.s08 = (T) => {
  const l5 = T.l(5), d5 = T.e(5) - l5;
  const cur = cursor()
    .go(T.l(2) - 0.4, [960, 600])
    .tap(T.l(2) + 0.5, 'text:.side-panel|Buhar nerede oluşuyor?', (h) => h.clickText('Buhar nerede oluşuyor?', '.side-panel'))
    .tap(T.l(3) + 0.6, id('separators'), (h) => h.click(id('separators')))
    .tap(T.l(4) - 0.3, 'text:.side-panel|Ayırıcı ve kurutucu yakın planı', (h) => h.clickText('Ayırıcı ve kurutucu yakın planı', '.side-panel'))
    .tap(T.l(4) + 0.7, 'text:.side-panel|Yakın planı aç', (h) => h.clickText('Yakın planı aç', '.side-panel'))
    .go(l5 - 0.2, 'text:.controls|Duraklat', { d: 0.5 })
    .tap(l5 + d5 * 0.15, 'text:.controls|Duraklat', (h) => h.clickText('Duraklat', '.controls'))
    .tap(l5 + d5 * 0.45, 'text:.controls|0.5×', async (h) => { await h.clickText('0.5×', '.controls'); await h.clickText('Oynat', '.controls'); })
    .tap(l5 + d5 * 0.8, 'text:.controls|2×', (h) => h.clickText('2×', '.controls'))
    .tap(T.l(6) + 0.1, 'text:nav.content-seg|Karşılaştırma', (h) => h.clickText('Karşılaştırma', 'nav.content-seg'), { d: 0.6 })
    .tap(T.l(6) + 1.3, 'text:.cmp-topics|Buharın oluştuğu yer', (h) => h.clickText('Buharın oluştuğu yer', '.cmp-topics'));
  return {
    async setup(h) { await reactor(h, 'BWR'); await h.settle(1200); },
    plan: {
      cam: [
        { t: 0, sel: ['.stage', '.side-panel'], pad: 10, box: [40, 40, 1840, 900] },
        { t: l5 - 0.6, d: 1.2, sel: ['.scene-canvas', '.controls'], pad: 10, box: [40, 40, 1840, 900] },
        { t: T.l(6) - 0.1, d: 1.0, sel: ['.header'], pad: 10, box: [40, 40, 1840, 900] },
        { t: T.l(6) + 0.9, d: 0.8, sel: ['.cmp-topics', '.compare-cards'], pad: 10, box: [40, 40, 1840, 900] },
        { t: T.l(7) - 0.2, d: 1.6, sel: ['.compare-cards'], pad: 10, box: [40, 40, 1840, 900] },
      ],
      items: [
        ...base(T, { k: 'Etkileşimli keşif', title: 'Buhar nerede oluşuyor?', sub: 'Bir soruyu izleyerek uygulamayı kullanmak', t1: T.l(2) + 0.6 }),
        cur.item(T.l(7) - 0.4),
        { type: 'ring', t0: T.l(3) + 1.0, t1: T.e(3) + 0.2, target: '.side-panel .info', pad: 8 },
        { type: 'callout', t0: l5 + d5 * 0.15 + 0.2, t1: l5 + d5 * 0.45, target: '.ctrl-playback', side: 't', dist: 60, text: 'Duraklat · bir anı incele' },
        { type: 'callout', t0: l5 + d5 * 0.45 + 0.2, t1: T.e(5) + 0.2, target: '.ctrl-speed', side: 't', dist: 60, text: 'Hız: 0,5× · 1× · 2×' },
      ],
    },
    events: [
      ...cur.events,
      ev(T.e(4), (h) => h.js(() => document.querySelector('dialog[open]')?.close())),
      ev(T.l(7) + 0.1, (h) => h.clickText('1×', '.controls')),
    ],
  };
};

// ---------- 09 · Tahmin ederek öğrenme ----------
SCENES.s09 = (T) => {
  const cur = cursor()
    .tap(T.l(2) + 0.3, 'text:.predict|Tahmine geç', (h) => h.clickText('Tahmine geç', '.predict'))
    .go(T.l(3) + 1.0, 'text:.predict|Hemen sıfıra düşer', { ax: 0.2 })
    .go(T.l(4) + 0.4, '.predict-head', { ax: 0.5, ay: 0.8 })
    .tap(T.e(4) - 0.2, 'text:.predict|Bir süre artar', (h) => h.clickText('Bir süre artar', '.predict', 'label'), { ax: 0.2 })
    .tap(T.l(5) - 0.4, 'text:.predict|Tahminimle dene', (h) => h.clickText('Tahminimle dene', '.predict'))
    .tap(T.l(5) + 0.6, 'text:.predict|Kapatmayı başlat', (h) => h.clickText('Kapatmayı başlat', '.predict'));
  return {
    async setup(h) { await reactor(h, 'PWR'); await view(h, 'Öğrenme'); await h.clickText('Tahmin et', 'body'); await h.settle(800); },
    plan: {
      cam: [
        { t: 0, sel: ['.predict'], pad: 20, box: [40, 40, 1840, 880], maxS: 1.75 },
        { t: T.l(3) - 0.3, d: 0.8, sel: ['.predict'], pad: 20, box: [40, 40, 1840, 880], maxS: 1.75 },
        { t: T.l(5) + 0.2, d: 1.0, sel: ['.predict'], pad: 20, box: [40, 40, 1840, 880], maxS: 1.75 },
        { t: T.l(6) - 0.5, d: 0.01, sel: ['.predict'], pad: 20, box: [40, 40, 1840, 880], maxS: 1.75 },
        { t: T.l(7) - 0.5, d: 0.01, sel: ['.predict'], pad: 20, box: [40, 40, 1840, 880], maxS: 1.75 },
      ],
      items: [
        ...base(T, { k: 'Tahmin ederek öğrenme', title: 'Tahmin et → dene → açıkla', x: 1180, y: 44, t1: T.l(3) }),
        cur.item(T.e(5)),
        { type: 'ring', t0: T.l(4) + 0.6, t1: T.e(4) - 0.3, target: '.predict-head', pad: 6 },
        { type: 'callout', t0: T.l(5) + 2.0, t1: T.e(5) + 0.4, target: '.predict svg', side: 'r', dist: 40, ax: 0.8, ay: 0.2, text: 'Ksenon önce artar,<small>saatler sonra azalır (temsili model)</small>', box: true },
        { type: 'wipe', t: T.l(6) - 0.5, d: 0.6 },
        { type: 'chip', t0: T.l(6) + 0.2, t1: T.e(6), x: 1500, y: 60, center: true, text: 'Kaynaklı açıklama' },
        { type: 'wipe', t: T.l(7) - 0.5, d: 0.6 },
        { type: 'chip', t0: T.l(7) + 0.2, t1: T.e(7) + 0.3, x: 1500, y: 60, center: true, text: 'BWR · devridaim debisi' },
        { type: 'chip', t0: T.l(8) + 0.2, t1: T.dur - 0.5, x: 1460, y: 60, center: true, text: 'Temsili model · sayısal tahmin değil' },
      ],
    },
    events: [
      ...cur.events,
      // gözlem ve açıklama (geçiş örtüsünün ortasında)
      ev(T.l(6) - 0.5, async (h) => {
        await h.clickText('Sona atla', '.predict'); await h.settle(200); await h.clickText('Gözleme geç', '.predict'); await h.settle(200);
        await h.clickText('Birkaç saat sonra', '.predict', 'label'); await h.settle(100); await h.clickText('Açıklamaya geç', '.predict'); await h.settle(300);
      }),
      // BWR dersi
      ev(T.l(7) - 0.5, async (h) => {
        await h.clickText('BWR', '.reactor-seg'); await h.settle(300); await h.clickText('Öğrenme', 'nav.content-seg'); await h.settle(300);
        await h.clickText('Tahmin et', 'body'); await h.settle(300); await h.clickText('Tahmine geç', '.predict'); await h.settle(200);
        await h.clickText('Güç yükselir', '.predict', 'label'); await h.settle(100); await h.clickText('Tahminimle dene', '.predict'); await h.settle(200);
        await h.clickText('Deneyi oynat', '.predict');
      }),
    ],
  };
};

// ---------- 10 · İleri inceleme ----------
SCENES.s10 = (T) => ({
  async setup(h) { await reactor(h, 'PWR'); await h.clickText('İşletme ve davranış'); await h.settle(1500); await h.clickText('Yük takibi ve ksenon', '.ops'); await h.settle(800); },
  plan: {
    cam: [
      { t: 0, sel: [170, 420, 1580, 300], pad: 10, box: [40, 160, 1840, 760], maxS: 1.6 },
      { t: T.l(2) - 0.4, d: 1.4, sel: [180, 590, 1560, 520], pad: 10, box: [40, 40, 1840, 880], maxS: 1.8 },
      { t: T.l(3) - 0.3, d: 1.4, sel: [180, 590, 1560, 600], pad: 10, box: [40, 40, 1840, 880], maxS: 1.8 },
      { t: T.l(4) - 0.5, d: 0.01, sel: ['.acc-intro', '.acc-stages', '.acc-controls'], pad: 16, box: [40, 40, 1840, 880], maxS: 1.4 },
      { t: T.l(5) - 0.2, d: 1.4, sel: ['.acc-controls', '.acc-chart-scroll'], pad: 16, box: [40, 40, 1840, 880], maxS: 1.5 },
      { t: T.l(6) - 0.2, d: 1.4, sel: ['.acc-intro', '.acc-stages'], pad: 16, box: [40, 40, 1840, 880], maxS: 1.6 },
    ],
    items: [
      ...base(T, { k: 'İleri inceleme', title: 'PWR · İşletme ve davranış', x: 1180, y: 44, t1: T.l(2) - 0.2 }),
      { type: 'ring', t0: T.l(3) + 0.4, t1: T.e(3) + 0.2, target: '.ops-events', pad: 6 },
      { type: 'wipe', t: T.l(4) - 0.5, d: 0.6 },
      { type: 'kicker', t0: T.l(4) - 0.2, t1: T.l(5), k: 'RBMK · kaynaklı tarihsel canlandırma', title: 'Çernobil 1986 — Kaza analizi', x: 1100, y: 44 },
      { type: 'ring', t0: T.l(5) + 0.6, t1: T.e(5) + 0.3, target: '.acc-chart-scroll', pad: 6 },
      { type: 'callout', t0: T.l(5) + 1.2, t1: T.e(5) + 0.3, target: '.acc-chart-scroll', side: 'l', dist: 40, ay: 0.2, text: 'Belgelenmiş noktalar ■<small>kesikli bağlantılar temsili</small>', box: true },
      { type: 'ring', t0: T.l(6) + 0.4, t1: T.dur - 0.4, target: '.acc-intro p', pad: 8 },
    ],
  },
  events: [
    ev(T.l(2) + 0.6, (h) => h.clickText('Oynat', '.ops')),
    ev(T.l(3) + 0.3, (h) => h.clickText('Modelde ksenon tepesi', '.ops')),
    ev(T.l(4) - 0.5, async (h) => { await h.clickText('RBMK', '.reactor-seg'); await h.settle(300); await h.clickText('Çernobil 1986'); await h.settle(800); }),
    ev(T.l(5) - 0.1, (h) => h.clickText('Oynat', '.acc-controls')),
  ],
});

// ---------- 11 · Yerel rehber ve kullanım ----------
SCENES.s11 = (T) => {
  const cur = cursor()
    .tap(T.l(1) + 0.5, '#assistant-toggle', (h) => h.click('#assistant-toggle'))
    .tap(T.l(2) - 0.3, 'text:#assistant-panel|BWR’de buhar nerede oluşuyor?', (h) => h.clickText('BWR’de buhar nerede oluşuyor?', '#assistant-panel', 'button,a'))
    .go(T.e(3) + 0.2, [1700, 700])
    .tap(T.l(6) + 0.8, 'text:.export-controls|PNG indir', (h) => h.clickText('PNG indir', '.export-controls'));
  return {
    async setup(h) {
      await reactor(h, 'PWR');
      await h.page.getByText('Çevrimdışı kullanıma hazır').first().waitFor({ timeout: 20000 }).catch(() => console.warn('PWA hazır yazısı görünmedi'));
      await h.settle(800);
    },
    plan: {
      cam: [
        { t: 0, view: 'page' },
        { t: T.l(2) + 0.3, d: 1.2, sel: [1525, 20, 380, 420], pad: 10, box: [500, 40, 1340, 880], maxS: 2.1 },
        { t: T.l(3) + 0.2, d: 1.2, view: 'page' },
        { t: T.l(4) - 0.1, d: 1.0, sel: [1525, 420, 380, 620], pad: 10, box: [500, 40, 1340, 880], maxS: 1.5 },
        { t: T.l(5) - 0.4, d: 0.01, sel: ['.header', '.progress-panel'], pad: 10, box: [40, 40, 1840, 880], maxS: 1.2 },
        { t: T.l(6) - 0.4, d: 0.01, sel: ['.header', '.viewport-toolbar'], pad: 10, box: [40, 40, 1840, 880], maxS: 1.2 },
      ],
      items: [
        ...base(T, { k: 'Yerel rehber', title: 'Hazırlanmış, kaynaklı cevaplar', sub: 'Üretken yapay zekâ değildir · sorular cihazda kalır', x: 230, y: 610, t1: T.l(2) + 0.3 }),
        cur.item(T.dur - 0.6),
        { type: 'callout', t0: T.l(2) + 1.6, t1: T.e(2) + 0.3, target: '#assistant-panel .assistant-log', side: 'l', dist: 60, ay: 0.15, text: 'Cevap + kaynak + şemada göster', box: true },
        { type: 'chip', t0: T.l(4) + 0.3, t1: T.e(4) + 0.3, x: 1180, y: 40, center: true, text: 'Kapsam dışı soruya cevap uydurulmaz' },
        { type: 'wipe', t: T.l(5) - 0.4, d: 0.6 },
        { type: 'ring', t0: T.l(5) + 0.3, t1: T.e(5) + 0.3, target: 'text:.progress-panel|Kaldığım yerden devam et', pad: 8 },
        { type: 'wipe', t: T.l(6) - 0.4, d: 0.6 },
        { type: 'ring', t0: T.l(6) + 0.2, t1: T.l(6) + 2.6, target: '.export-controls', pad: 8 },
        { type: 'ring', t0: T.l(6) + 2.6, t1: T.dur - 0.4, target: '.pwa-controls', pad: 8 },
        { type: 'callout', t0: T.l(6) + 2.8, t1: T.dur - 0.4, target: '.pwa-controls', side: 'b', dist: 70, text: 'Çevrimdışı çalışma · üretim sürümünde doğrulandı', box: true },
      ],
    },
    events: [
      ...cur.events,
      ev(T.l(3) + 0.6, (h) => h.clickText('Şemada vurgula', '#assistant-panel')),
      ev(T.l(4) - 0.2, async (h) => {
        await h.js(() => {
          const el = document.querySelector('#assistant-panel .assistant-form textarea, #assistant-panel .assistant-form input');
          const proto = el instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
          Object.getOwnPropertyDescriptor(proto, 'value').set.call(el, 'Yarın hava nasıl olacak?');
          el.dispatchEvent(new Event('input', { bubbles: true }));
        });
        await h.settle(100); await h.js(() => document.querySelector('#assistant-panel .assistant-form').requestSubmit());
        await h.settle(300); await h.js(() => { const l = document.querySelector('#assistant-panel .assistant-log'); l.scrollTop = l.scrollHeight; });
      }),
      ev(T.l(5) - 0.4, async (h) => { await h.click('#assistant-toggle'); await h.settle(200); await h.clickText('Öğrenme', 'nav.content-seg'); }),
      ev(T.l(6) - 0.4, (h) => h.clickText('Şema', 'nav.content-seg')),
    ],
  };
};

// ---------- 12 · Kapanış ----------
SCENES.s12 = (T) => ({
  async setup(h) { await view(h, 'Karşılaştırma'); await h.clickText('Isının türbine aktarılması', '.cmp-topics'); await h.settle(800); },
  plan: {
    cam: [
      { t: 0, sel: ['.compare-cards'], pad: 10, box: [40, 40, 1840, 1000] },
    ],
    items: [
      ...base(T, null, { noOut: true }),
      { type: 'chip', t0: 0.6, t1: T.l(2) - 0.2, x: 1180, y: 40, center: true, text: 'Beş reaktör · beş ayrı tasarım' },
      card(`<div class="a" style="font-size:30px;letter-spacing:.16em;color:#e0aa7f;font-weight:700">NÜKLEER SANTRAL ŞEMALARI</div>
        <div class="b" style="font-size:60px;font-weight:700;margin-top:30px;line-height:1.3">Akışı izle · Parçaları keşfet<br>Tahmin et · Karşılaştır</div>
        <div class="c" style="font-size:34px;margin-top:48px;color:#e9e2d4">${URL_TEXT}</div>
        <div class="d" style="position:absolute;bottom:46px;font-size:24px;color:#cfc6b4">Türkçe seslendirme yapay zekâ ile üretilmiştir.</div>`,
        T.l(2) - 0.3, T.dur + 1, [['.a', T.l(2), T.l(2) + 0.6], ['.b', T.l(2) + 0.2, T.l(2) + 1.0], ['.c', T.l(2) + 1.4, T.l(2) + 2.1], ['.d', T.l(2) + 1.8, T.l(2) + 2.5]], { top: true }),
    ],
  },
  events: [],
});

export function buildScene(sceneId, T) {
  const f = SCENES[sceneId];
  if (!f) throw new Error('bilinmeyen sahne ' + sceneId);
  return f(T);
}
export const SCENE_IDS = Object.keys(SCENES);
