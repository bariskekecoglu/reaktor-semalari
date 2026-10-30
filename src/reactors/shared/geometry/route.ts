/**
 * Şema geometrisi için küçük yardımcılar (DOM'dan bağımsız, test edilebilir).
 *
 * Borular ve akış parçacıkları aynı `d` dizgisini kullanır (Flow bileşeni); bu modül o dizgiyi
 * adlandırılmış bağlantı noktalarından (port) üretir. Böylece bir ekipman taşınınca boru uçları da taşınır.
 */

export type Pt = readonly [number, number];

/** Rota adımı: mutlak nokta, yatay (`h`) / dikey (`v`) hedef ya da hazır SVG parçası. */
export type Step = Pt | { h: number } | { v: number } | { raw: string; end: Pt };

export interface Route {
  d: string;
  start: Pt;
  end: Pt;
}

const f = (n: number) => (Number.isInteger(n) ? String(n) : n.toFixed(1));

/**
 * Dik açılı (ve isteğe bağlı eğik) noktalar arasından, köşeleri `r` yarıçapıyla yuvarlatılmış yol üretir.
 * Köşe, iki komşu doğru parçasının kısasının yarısından büyük yuvarlatılmaz (uç kaymaz).
 */
export function route(start: Pt, steps: Step[], r = 0): Route {
  const pts: Pt[] = [start];
  const raws: (string | null)[] = [null];
  let cur: Pt = start;
  for (const s of steps) {
    if ('raw' in s) {
      raws.push(s.raw);
      pts.push(s.end);
      cur = s.end;
      continue;
    }
    const next: Pt = 'h' in s ? [s.h, cur[1]] : 'v' in s ? [cur[0], s.v] : s;
    raws.push(null);
    pts.push(next);
    cur = next;
  }
  let d = `M${f(start[0])} ${f(start[1])}`;
  for (let i = 1; i < pts.length; i++) {
    const raw = raws[i];
    if (raw) {
      d += ` ${raw}`;
      continue;
    }
    const p = pts[i];
    const nextIsLine = i + 1 < pts.length && !raws[i + 1];
    if (r > 0 && nextIsLine) {
      const a = pts[i - 1];
      const b = pts[i + 1];
      const l1 = Math.hypot(p[0] - a[0], p[1] - a[1]);
      const l2 = Math.hypot(b[0] - p[0], b[1] - p[1]);
      const k = Math.min(r, l1 / 2, l2 / 2);
      if (k > 0.5 && l1 > 0 && l2 > 0) {
        const p1: Pt = [p[0] - ((p[0] - a[0]) / l1) * k, p[1] - ((p[1] - a[1]) / l1) * k];
        const p2: Pt = [p[0] + ((b[0] - p[0]) / l2) * k, p[1] + ((b[1] - p[1]) / l2) * k];
        d += ` L${f(p1[0])} ${f(p1[1])} Q${f(p[0])} ${f(p[1])} ${f(p2[0])} ${f(p2[1])}`;
        continue;
      }
    }
    d += ` L${f(p[0])} ${f(p[1])}`;
  }
  return { d, start, end: cur };
}

/** Eliptik bir yüzeyin (ör. kanal başlığı) alt yarısında, merkezden `dx` uzaktaki nokta. */
export function ellipseBottom(cx: number, cy: number, rx: number, ry: number, dx: number): Pt {
  const t = Math.max(-1, Math.min(1, dx / rx));
  return [cx + dx, cy + ry * Math.sqrt(1 - t * t)];
}

/** Daire üzerindeki nokta (açı derece; 0 = sağ, 90 = alt — SVG y ekseni aşağı). */
export function onCircle(cx: number, cy: number, r: number, deg: number): Pt {
  const a = (deg * Math.PI) / 180;
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
}

/** Elipsin üst yarısında, verilen y kotundaki sağ kenar x'i (koruma yapısı kubbesi geçişleri için). */
export function ellipseRightAtY(cx: number, cy: number, rx: number, ry: number, y: number): number {
  const t = (cy - y) / ry;
  return cx + rx * Math.sqrt(Math.max(0, 1 - t * t));
}

export const dist = (a: Pt, b: Pt) => Math.hypot(a[0] - b[0], a[1] - b[1]);

/**
 * Bir SVG yolunun ilk ve son mutlak noktası (yalnız mutlak M/L/H/V/Q/C/A komutları).
 * Testlerde boru uçlarının port'lara oturduğunu doğrulamak için kullanılır.
 */
export function pathEnds(d: string): { start: Pt; end: Pt } {
  const tokens = d.match(/[MLHVQCAZ]|-?\d*\.?\d+(?:e-?\d+)?/gi) ?? [];
  let i = 0;
  let cmd = '';
  let x = 0;
  let y = 0;
  let start: Pt | null = null;
  const num = () => Number(tokens[i++]);
  while (i < tokens.length) {
    const t = tokens[i];
    if (/^[A-Za-z]$/.test(t)) {
      if (t !== t.toUpperCase()) throw new Error(`Göreli komut desteklenmez: ${t}`);
      cmd = t;
      i++;
      if (cmd === 'Z') continue;
    }
    switch (cmd) {
      case 'M':
      case 'L':
        x = num();
        y = num();
        break;
      case 'H':
        x = num();
        break;
      case 'V':
        y = num();
        break;
      case 'Q':
        num();
        num();
        x = num();
        y = num();
        break;
      case 'C':
        num();
        num();
        num();
        num();
        x = num();
        y = num();
        break;
      case 'A':
        num();
        num();
        num();
        num();
        num();
        x = num();
        y = num();
        break;
      default:
        i++;
    }
    if (!start) start = [x, y];
  }
  return { start: start ?? [0, 0], end: [x, y] };
}
