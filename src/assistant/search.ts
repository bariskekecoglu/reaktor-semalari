/** Türkçe metin için basit, bağımlılıksız arama (küçük, yapılandırılmış bilgi tabanı için yeterli). */
import type { ReactorId } from '../reactors/shared/types';
import type { KnowledgeEntry, KnowledgeSource } from '../knowledge/kb';

const FOLD: Record<string, string> = { ç: 'c', ğ: 'g', ı: 'i', i̇: 'i', ö: 'o', ş: 's', ü: 'u', â: 'a', î: 'i', û: 'u' };

export function normalize(s: string): string {
  return s
    .toLocaleLowerCase('tr-TR')
    .replace(/[çğıöşüâîû]|i̇/g, (c) => FOLD[c] ?? c)
    .replace(/['’`]/g, ' ')
    .replace(/[^a-z0-9δ\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const STOP = new Set(
  'bir bu su ve ile de da mi mı mu mü ne neden nasil nedir icin gibi olan olur oluyor yarar isi ise ki en cok daha ya hangi bana beni goster ac acikla anlat nerede nerde zaman sonra once kadar var yok'.split(
    ' ',
  ),
);

export function tokens(s: string): string[] {
  return normalize(s)
    .split(' ')
    .filter((t) => t.length >= 2 && !STOP.has(t));
}

/** Türkçe ekleri kabaca tolere eden kelime eşleşmesi (ör. “basinclandirici” ~ “basinclandiricinin”). */
function wordMatch(a: string, b: string): boolean {
  if (a === b) return true;
  const [s, l] = a.length <= b.length ? [a, b] : [b, a];
  if (s.length < 4) return false;
  if (l.startsWith(s)) return true;
  // Ünsüz yumuşaması (ör. “ureteci” / “uretec”): ilk 5+ harf ortaksa.
  const k = Math.max(5, s.length - 2);
  return s.length >= 5 && l.slice(0, k) === s.slice(0, k);
}

export const REACTOR_WORDS: Record<ReactorId, string[]> = {
  pwr: ['pwr', 'basincli su'],
  bwr: ['bwr', 'kaynar su', 'kaynayan su'],
  vver: ['vver', 'wwer'],
  rbmk: ['rbmk', 'lwgr'],
  candu: ['candu', 'phwr', 'basincli agir su', 'agir su reaktoru'],
};

/** Reaktör adına bitişik yazılabilen Türkçe ekler (ör. “RBMKde”, “CANDUya”, “RBMKlerde”). */
export const REACTOR_SUFFIX = '(?:de|da|te|ta|den|dan|ten|tan|nin|in|un|nun|ye|ya|yi|yu|yle|yla|ler|lar|lerde|larda|lerin|larin|lerde)';

/** Soruda açıkça geçen reaktörler. */
export function reactorsIn(q: string): ReactorId[] {
  const n = ` ${normalize(q)} `;
  return (Object.keys(REACTOR_WORDS) as ReactorId[]).filter((r) => REACTOR_WORDS[r].some((w) =>
    new RegExp(` ${w}(?= |${REACTOR_SUFFIX} )`).test(n)));
}

export interface Hit {
  entry: KnowledgeEntry;
  score: number;
}

/** Bir girdinin soruyla ne kadar örtüştüğü. Tam ifade eşleşmesi tek kelimeden ağır basar. */
export function scoreEntry(q: string, e: KnowledgeEntry): number {
  const nq = ` ${normalize(q)} `;
  const qt = tokens(q);
  let score = 0;
  let full = 0;
  for (const alias of e.aliases) {
    const na = normalize(alias);
    if (!na) continue;
    const at = tokens(alias);
    let s = 0;
    if (nq.includes(` ${na}`)) s = 3 + na.split(' ').length;
    else if (at.length > 0) {
      const hit = at.filter((a) => qt.some((t) => wordMatch(a, t))).length;
      if (hit === at.length) s = 2 + hit;
      else if (hit > 0) s = hit / at.length;
    }
    if (s >= 3) full++;
    score = Math.max(score, s);
  }
  // Birden çok terim eşleşiyorsa (ör. “ksenon” + “kapatmadan sonra”) konu daha isabetlidir.
  score += Math.max(0, full - 1) * 0.6;
  // Ad ve özetteki kelimeler zayıf destek verir.
  const bag = tokens(`${e.name} ${e.summary}`);
  const support = qt.filter((t) => bag.some((b) => wordMatch(b, t))).length;
  return score + Math.min(1.5, support * 0.3);
}

export function search(kb: KnowledgeSource, q: string, opts: { reactors?: ReactorId[]; limit?: number } = {}): Hit[] {
  const hits: Hit[] = [];
  for (const e of kb.all()) {
    if (opts.reactors && opts.reactors.length && e.reactorId && !opts.reactors.includes(e.reactorId)) continue;
    const score = scoreEntry(q, e);
    if (score > 0.9) hits.push({ entry: e, score });
  }
  hits.sort((a, b) => b.score - a.score);
  return hits.slice(0, opts.limit ?? 8);
}
