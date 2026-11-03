// Kare kare yakalama: uygulamanın üretim derlemesini sahte saatle (Playwright clock) sürer,
// kompozisyon katmanını (overlay.js) her karede zamana göre çizer ve JPEG kareleri yazar.
// Kullanım: node render/director.mjs --scene s03 [--timing C:/vidwork/timing.json] [--out C:/vidwork/frames]
//           [--stills 1.5,8,14]  (yalnız belirtilen saniyelerde PNG önizleme)  [--from 0 --to 300] (kare aralığı)
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildScene } from './scenes.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const args = Object.fromEntries(process.argv.slice(2).reduce((a, v, i, arr) => (v.startsWith('--') ? [...a, [v.slice(2), arr[i + 1] && !arr[i + 1].startsWith('--') ? arr[i + 1] : true]] : a), []));
const FPS = 30;
const APP = args.app || 'http://localhost:4173/';
const sceneId = args.scene;
const timing = JSON.parse(fs.readFileSync(args.timing || 'C:/vidwork/timing.json', 'utf8'));
const T = makeT(timing[sceneId]);
const scene = buildScene(sceneId, T);
const outDir = path.join(args.out || 'C:/vidwork/frames', sceneId);
fs.mkdirSync(outDir, { recursive: true });

function makeT(tm) {
  return {
    dur: tm.dur, lead: tm.lead,
    l: (i) => tm.lines[i - 1][0], e: (i) => tm.lines[i - 1][1],
    mid: (i) => (tm.lines[i - 1][0] + tm.lines[i - 1][1]) / 2,
    n: tm.lines.length,
  };
}

const FOCUS_CSS = `
html.vo-focus, html.vo-focus body{background:#fbfaf6 !important}
html.vo-focus body *{visibility:hidden}
html.vo-focus .scene-svg, html.vo-focus .scene-svg *{visibility:visible}
html.vo-focus dialog[open], html.vo-focus dialog[open] *{visibility:visible}
html.vo-focus.vo-panel .side-panel, html.vo-focus.vo-panel .side-panel *{visibility:visible}
#vo-root, #vo-root *{visibility:visible !important}
::-webkit-scrollbar{display:none}
`;

const browser = await chromium.launch({ channel: 'chrome' });
const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1, acceptDownloads: true, locale: 'tr-TR', reducedMotion: 'no-preference' });
const page = await ctx.newPage();
page.on('pageerror', (e) => console.error('[pageerror]', e.message));
await page.clock.install({ time: new Date('2026-11-01T10:00:00') });
await page.goto(APP + (scene.hash || ''));
await page.waitForSelector('.reactor-seg');
await page.addStyleTag({ content: FOCUS_CSS });
await page.addScriptTag({ path: path.join(HERE, 'overlay.js') });
await page.evaluate(() => window.__vo.init());

const h = {
  page,
  tick: (ms) => page.clock.runFor(ms),
  async click(sel) {
    const ok = await page.evaluate((s) => {
      const el = document.querySelector(s); if (!el) return false;
      if (el instanceof HTMLElement) el.click(); else el.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      return true;
    }, sel);
    if (!ok) console.warn('[click] bulunamadı:', sel);
  },
  async clickText(text, scope = 'body', tag = 'button,label,summary') {
    const ok = await page.evaluate(([t, sc, tg]) => {
      const els = [...document.querySelectorAll(`${sc} :is(${tg})`)].filter((e) => e.textContent.replace(/\s+/g, ' ').trim().includes(t));
      const el = els[0]; if (!el) return false; el.click(); return true;
    }, [text, scope, tag]);
    if (!ok) console.warn('[clickText] bulunamadı:', text, scope);
  },
  focus: (on, panel = false) => page.evaluate(([o, p]) => { document.documentElement.classList.toggle('vo-focus', o); document.documentElement.classList.toggle('vo-panel', p); window.__vo.resetCache(); }, [on, panel]),
  js: (fn, arg) => page.evaluate(fn, arg),
  async settle(ms = 400) { await page.clock.runFor(ms); await page.waitForTimeout(60); },
};

if (scene.setup) await scene.setup(h);
await page.evaluate((p) => window.__vo.setPlan(p), scene.plan);
const events = [...(scene.events || [])].sort((a, b) => a.at - b.at);
let ev = 0;
const N = Math.round(T.dur * FPS);
const stills = args.stills ? String(args.stills).split(',').map(Number) : null;
const from = +(args.from || 0), to = Math.min(+(args.to || N), N);
const t0 = Date.now();
let lastMs = 0;
for (let f = 0; f < to; f++) {
  const t = f / FPS;
  while (ev < events.length && events[ev].at <= t + 1e-6) {
    try { await events[ev].run(h); } catch (e) { console.error('[event]', events[ev].at, e.message); }
    await page.waitForTimeout(30); // React işlemesi (gerçek zaman, sahte saat ilerlemez)
    ev++;
  }
  const want = stills ? stills.some((s) => Math.abs(s - t) < 0.5 / FPS) : f >= from;
  if (want) {
    await page.evaluate((tt) => window.__vo.update(tt), t);
    const file = stills ? path.join(outDir, `still_${t.toFixed(2)}.png`) : path.join(outDir, `f${String(f).padStart(5, '0')}.png`);
    await page.screenshot(stills ? { path: file } : { path: file, type: 'png' });
  }
  const ms = Math.round(((f + 1) * 1000) / FPS) - lastMs; lastMs += ms;
  await page.clock.runFor(ms);
  if (!stills && f % 150 === 0) console.log(`${sceneId}: ${f}/${to} kare, ${((Date.now() - t0) / 1000).toFixed(0)} sn`);
}
console.log(`${sceneId}: bitti ${to} kare (${(to / FPS).toFixed(2)} sn), ${((Date.now() - t0) / 1000).toFixed(0)} sn sürdü`);
await browser.close();
