// Video kompozisyon katmanı: uygulamanın üstüne sayfa içinde eklenir (uygulama kaynağı değişmez).
// Her kare update(t) ile zamana bağlı çizilir; CSS animasyonu kullanılmaz (kare kare deterministik).
(() => {
  const W = 1920, H = 1080;
  const NAVY = '#17283d', COPPER = '#e0aa7f', COPPER_D = '#9a512f', CREAM = '#faf5ed';
  const css = `
  #vo-root{position:fixed;left:0;top:0;width:${W}px;height:${H}px;pointer-events:none;z-index:2147483646;font-family:'Segoe UI',system-ui,sans-serif;color:${CREAM};overflow:hidden}
  #vo-root *{box-sizing:border-box}
  .vo-kicker{position:absolute;left:56px;top:44px;background:rgba(23,40,61,.94);border-left:5px solid ${COPPER};padding:16px 26px 18px 22px;border-radius:6px;max-width:980px;box-shadow:0 8px 28px rgba(0,0,0,.18)}
  .vo-kicker .k{font-size:19px;letter-spacing:.14em;color:${COPPER};font-weight:700;text-transform:uppercase}
  .vo-kicker .t{font-size:38px;font-weight:700;line-height:1.15;margin-top:4px}
  .vo-kicker .s{font-size:24px;line-height:1.3;margin-top:6px;color:#e9e2d4}
  .vo-callout{position:absolute;background:${NAVY};color:${CREAM};font-size:26px;font-weight:600;padding:9px 18px 10px;border-radius:999px;white-space:nowrap;border:2px solid ${COPPER};box-shadow:0 6px 18px rgba(0,0,0,.18)}
  .vo-callout small{display:block;font-size:19px;font-weight:400;color:#e9e2d4;margin-top:1px}
  .vo-callout.box{border-radius:10px}
  .vo-chip{position:absolute;background:${COPPER_D};color:#fff;font-size:30px;font-weight:700;padding:12px 24px;border-radius:8px;white-space:nowrap;box-shadow:0 8px 22px rgba(0,0,0,.2)}
  .vo-note{position:absolute;right:48px;bottom:156px;font-size:20px;color:#55555c;background:rgba(251,250,246,.92);padding:6px 14px;border-radius:6px;border:1px solid #d9d4c7}
  .vo-card{position:absolute;inset:0;background:${NAVY};display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center}
  .vo-cover{position:absolute;inset:0}
  .vo-cursor{position:absolute;width:40px;height:40px;margin:-4px 0 0 -6px;filter:drop-shadow(0 3px 4px rgba(0,0,0,.35))}
  .vo-ripple{position:absolute;border:4px solid ${COPPER_D};border-radius:50%}
  .vo-ring{position:absolute;border:5px solid ${COPPER};border-radius:14px;box-shadow:0 0 0 4px rgba(154,81,47,.35),0 0 28px rgba(224,170,127,.7)}
  svg.vo-lines{position:absolute;left:0;top:0;width:${W}px;height:${H}px;overflow:visible}
  `;
  const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
  const ease = (x) => { x = clamp(x); return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
  const fadeIO = (t, t0, t1, f = 0.35) => (t < t0 || t > t1) ? 0 : Math.min(clamp((t - t0) / f), clamp((t1 - t) / f));

  let root, lines, plan = { items: [], cam: [] }, nodes = new Map(), camState = null, rectCache = new Map();
  const app = () => document.getElementById('root');

  // 'text:<kapsam>|<metin>' biçimi: kapsam içindeki düğme/etiket/bağlantıyı metninden bulur.
  function q(s) {
    if (typeof s === 'string' && s.startsWith('text:')) {
      const [sc, tx] = s.slice(5).split('|');
      const els = [...document.querySelectorAll(`${sc || 'body'} :is(button,label,a,summary,[role=button])`)].filter((e) => e.textContent.replace(/\s+/g, ' ').trim().includes(tx));
      return els.length ? [els[0]] : [];
    }
    return [...document.querySelectorAll(s)];
  }
  function curT() { const m = (app().style.transform || '').match(/translate\(([-\d.]+)px, ([-\d.]+)px\) scale\(([-\d.]+)\)/); return m ? { x: +m[1], y: +m[2], s: +m[3] } : { x: 0, y: 0, s: 1 }; }
  // Sayfa (dönüşümsüz) koordinatında dikdörtgen.
  function layoutRect(sel) {
    if (Array.isArray(sel) && typeof sel[0] === 'number') return { x: sel[0], y: sel[1], w: sel[2], h: sel[3] };
    const sels = Array.isArray(sel) ? sel : [sel];
    const c = curT(); let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9, n = 0;
    for (const s of sels) for (const el of q(s)) {
      const r = el.getBoundingClientRect(); if (!r.width && !r.height) continue; n++;
      const a = (r.left - c.x) / c.s, b = (r.top - c.y) / c.s, a2 = (r.right - c.x) / c.s, b2 = (r.bottom - c.y) / c.s;
      x0 = Math.min(x0, a); y0 = Math.min(y0, b); x1 = Math.max(x1, a2); y1 = Math.max(y1, b2);
    }
    if (!n) return null;
    return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
  }
  function screenRect(sel) {
    if (Array.isArray(sel) && typeof sel[0] === 'number') return { x: sel[0], y: sel[1], w: sel[2] || 0, h: sel[3] || 0 };
    const sels = Array.isArray(sel) ? sel : [sel]; let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9, n = 0;
    for (const s of sels) for (const el of q(s)) {
      const r = el.getBoundingClientRect(); if (!r.width && !r.height) continue; n++;
      x0 = Math.min(x0, r.left); y0 = Math.min(y0, r.top); x1 = Math.max(x1, r.right); y1 = Math.max(y1, r.bottom);
    }
    return n ? { x: x0, y: y0, w: x1 - x0, h: y1 - y0 } : null;
  }
  function fit(R, B, pad, maxS) {
    const r = { x: R.x - pad, y: R.y - pad, w: R.w + 2 * pad, h: R.h + 2 * pad };
    const s = Math.min(B.w / r.w, B.h / r.h, maxS || 3);
    return { x: B.x + B.w / 2 - (r.x + r.w / 2) * s, y: B.y + B.h / 2 - (r.y + r.h / 2) * s, s };
  }
  function camAt(t) {
    const ks = plan.cam || []; if (!ks.length) return { x: 0, y: 0, s: 1 };
    const target = (k, i) => {
      if (k.view === 'page') return { x: 0, y: -(k.scroll || 0), s: 1 };
      const key = i + ':' + JSON.stringify(k.sel);
      if (!rectCache.has(key)) { const R = layoutRect(k.sel); if (!R) return null; rectCache.set(key, R); }
      const R = rectCache.get(key);
      const B = k.box ? { x: k.box[0], y: k.box[1], w: k.box[2], h: k.box[3] } : { x: 40, y: 40, w: W - 80, h: H - 220 };
      return fit(R, B, k.pad ?? 24, k.maxS);
    };
    let st = null;
    for (let i = 0; i < ks.length; i++) {
      const k = ks[i]; if (k.t > t) break;
      const tg = target(k, i); if (!tg) continue;
      if (!st) { st = tg; continue; }
      const d = k.d ?? 1.2, u = ease((t - k.t) / d);
      // ölçek logaritmik, konum ölçekle tutarlı (odak noktası düzgün kayar)
      const s = Math.exp(Math.log(st.s) + (Math.log(tg.s) - Math.log(st.s)) * u);
      const cx0 = (W / 2 - st.x) / st.s, cy0 = (H / 2 - st.y) / st.s, cx1 = (W / 2 - tg.x) / tg.s, cy1 = (H / 2 - tg.y) / tg.s;
      const cx = cx0 + (cx1 - cx0) * u, cy = cy0 + (cy1 - cy0) * u;
      st = { x: W / 2 - cx * s, y: H / 2 - cy * s, s };
    }
    return st || { x: 0, y: 0, s: 1 };
  }
  function node(i, cls, tag = 'div') {
    let n = nodes.get(i); if (!n) { n = document.createElement(tag); n.className = cls; root.appendChild(n); nodes.set(i, n); }
    return n;
  }
  function placeCallout(n, it, tr, a) {
    const side = it.side || 'r', dist = it.dist ?? 70;
    const anc = { x: tr.x + tr.w * (it.ax ?? .5), y: tr.y + tr.h * (it.ay ?? .5) };
    const w = n.offsetWidth, h = n.offsetHeight; let x, y;
    if (side === 'r') { x = tr.x + tr.w + dist; y = anc.y - h / 2; }
    if (side === 'l') { x = tr.x - dist - w; y = anc.y - h / 2; }
    if (side === 't') { x = anc.x - w / 2; y = tr.y - dist - h; }
    if (side === 'b') { x = anc.x - w / 2; y = tr.y + tr.h + dist; }
    x += it.dx || 0; y += it.dy || 0;
    x = clamp(x, 24, W - w - 24); y = clamp(y, 24, H - 160 - h);
    n.style.left = x + 'px'; n.style.top = y + 'px';
    const ex = clamp(anc.x, x, x + w), ey = clamp(anc.y, y, y + h);
    return { anc, ex: side === 'r' ? x : side === 'l' ? x + w : ex, ey: side === 't' ? y + h : side === 'b' ? y : ey };
  }
  function update(t) {
    const c = camAt(t);
    const a = app();
    a.style.transformOrigin = '0 0';
    a.style.transform = `translate(${c.x.toFixed(2)}px, ${c.y.toFixed(2)}px) scale(${c.s.toFixed(4)})`;
    let svgOut = '';
    plan.items.forEach((it, i) => {
      const vis = it.type === 'cursor' || it.type === 'cover' || it.type === 'wipe' ? 1 : fadeIO(t, it.t0, it.t1, it.f ?? 0.35);
      if (it.type === 'kicker') {
        const n = node(i, 'vo-kicker');
        if (!n.dataset.k) { n.innerHTML = `<div class="k">${it.k || ''}</div><div class="t">${it.title}</div>${it.sub ? `<div class="s">${it.sub}</div>` : ''}`; n.dataset.k = 1; }
        if (it.x != null) n.style.left = it.x + 'px'; if (it.y != null) n.style.top = it.y + 'px';
        n.style.opacity = vis; n.style.transform = `translateY(${(1 - vis) * -12}px)`;
      } else if (it.type === 'callout' || it.type === 'chip') {
        const n = node(i, it.type === 'chip' ? 'vo-chip' : 'vo-callout' + (it.box ? ' box' : ''));
        if (n.dataset.html !== it.text) { n.innerHTML = it.text; n.dataset.html = it.text; }
        n.style.opacity = vis;
        if (vis <= 0) return;
        if (it.type === 'chip') { n.style.left = it.x + 'px'; n.style.top = it.y + 'px'; if (it.center) n.style.transform = 'translateX(-50%)'; return; }
        const tr = screenRect(it.target); if (!tr) { n.style.opacity = 0; return; }
        const p = placeCallout(n, it, tr, vis);
        const len = clamp((t - it.t0) / 0.5);
        const x2 = p.anc.x + (p.ex - p.anc.x) * len, y2 = p.anc.y + (p.ey - p.anc.y) * len;
        svgOut += `<g opacity="${vis}"><line x1="${p.anc.x}" y1="${p.anc.y}" x2="${x2}" y2="${y2}" stroke="${NAVY}" stroke-width="3"/><circle cx="${p.anc.x}" cy="${p.anc.y}" r="9" fill="${COPPER}" stroke="${NAVY}" stroke-width="3"/></g>`;
      } else if (it.type === 'ring') {
        const n = node(i, 'vo-ring'); n.style.opacity = vis; if (vis <= 0) return;
        const tr = screenRect(it.target); if (!tr) { n.style.opacity = 0; return; }
        const pad = (it.pad ?? 10) + Math.sin((t - it.t0) * 4) * 3;
        Object.assign(n.style, { left: tr.x - pad + 'px', top: tr.y - pad + 'px', width: tr.w + 2 * pad + 'px', height: tr.h + 2 * pad + 'px', borderRadius: (it.round ? '50%' : '14px') });
      } else if (it.type === 'note') {
        const n = node(i, 'vo-note'); n.textContent = it.text; n.style.opacity = vis;
      } else if (it.type === 'card') {
        const n = node(i, 'vo-card'); if (!n.dataset.k) { n.innerHTML = it.html; n.dataset.k = 1; if (it.bg) n.style.background = it.bg; }
        n.style.opacity = vis; n.style.display = vis > 0 ? 'flex' : 'none';
        if (it.anim) it.anim.forEach(([sel, a0, a1]) => n.querySelectorAll(sel).forEach((el) => { const v = ease((t - a0) / (a1 - a0)); el.style.opacity = v; el.style.transform = `translateY(${(1 - v) * 18}px)`; }));
      } else if (it.type === 'cover') {
        // sahne giriş/çıkışında lacivert geçiş (dip)
        const n = node(i, 'vo-cover'); n.style.background = it.color || NAVY;
        // son kare (dur - 1/30) tam örtülü olsun: sahne sınırında tek karelik sıçrama olmaz
        const inA = it.in ? 1 - clamp(t / it.in) : 0, outA = it.out ? clamp((t - (it.dur - it.out)) / (it.out - 1 / 30)) : 0;
        n.style.opacity = Math.max(inA, outA);
      } else if (it.type === 'wipe') {
        const n = node(i, 'vo-cover'); n.style.background = it.color || '#fbfaf6';
        const d = it.d || 0.6; n.style.opacity = t < it.t - d / 2 || t > it.t + d / 2 ? 0 : 1 - Math.abs(t - it.t) / (d / 2);
      } else if (it.type === 'cursor') {
        const n = node(i, 'vo-cursor');
        if (!n.dataset.k) { n.innerHTML = `<svg viewBox="0 0 24 24" width="40" height="40"><path d="M3 2 L3 19 L8 14.5 L11.2 21.5 L14 20.3 L10.9 13.4 L17.5 13.4 Z" fill="#fff" stroke="#111" stroke-width="1.6" stroke-linejoin="round"/></svg>`; n.dataset.k = 1; }
        const ks = it.keys;
        ks.forEach((k, j) => { const r = nodes.get(i + ':r' + j); if (r) r.style.opacity = 0; });
        if (t < ks[0].t - 0.3 || t > (it.t1 ?? 1e9)) { n.style.opacity = 0; return; }
        n.style.opacity = clamp((t - ks[0].t + 0.3) / 0.3) * (it.t1 ? clamp((it.t1 - t) / 0.3) : 1);
        const pos = (k) => { if (k.sel) { const r = screenRect(k.sel); if (r) return { x: r.x + r.w * (k.ax ?? .5), y: r.y + r.h * (k.ay ?? .5) }; } return { x: k.x, y: k.y }; };
        let p = pos(ks[0]);
        for (let j = 1; j < ks.length; j++) { if (t < ks[j].t - (ks[j].d ?? .7)) break; const q = pos(ks[j]); const u = ease((t - (ks[j].t - (ks[j].d ?? .7))) / (ks[j].d ?? .7)); p = { x: p.x + (q.x - p.x) * u, y: p.y + (q.y - p.y) * u }; }
        n.style.left = p.x + 'px'; n.style.top = p.y + 'px';
        ks.forEach((k, j) => { if (!k.click) return; const age = t - k.t; const r = node(i + ':r' + j, 'vo-ripple');
          if (age < 0 || age > 0.55) { r.style.opacity = 0; return; }
          const rad = 10 + age * 70; Object.assign(r.style, { opacity: 1 - age / 0.55, left: p.x - rad + 'px', top: p.y - rad + 'px', width: 2 * rad + 'px', height: 2 * rad + 'px' }); });
        root.appendChild(n); // imleç en üstte
      }
    });
    lines.innerHTML = svgOut;
    // geçiş örtüleri en üstte kalsın
    plan.items.forEach((it, i) => { if (it.type === 'cover' || it.type === 'wipe' || (it.type === 'card' && it.top)) root.appendChild(nodes.get(i)); });
  }
  window.__vo = {
    init() {
      const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
      root = document.createElement('div'); root.id = 'vo-root'; document.body.appendChild(root);
      lines = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); lines.setAttribute('class', 'vo-lines'); root.appendChild(lines);
      document.documentElement.style.overflow = 'hidden'; document.body.style.overflow = 'hidden'; window.scrollTo(0, 0);
    },
    setPlan(p) { plan = p; rectCache.clear(); },
    resetCache() { rectCache.clear(); },
    update,
    rect: layoutRect,
  };
})();
