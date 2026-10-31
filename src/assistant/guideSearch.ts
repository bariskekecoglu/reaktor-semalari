import type { ReactorId } from '../reactors/shared/types';
import type { GuideCard } from './guideCatalog';
import { normalize, reactorsIn, REACTOR_SUFFIX } from './search';

const FILLER = new Set(('ne nedir neden niye nasil nerede nereden nereye hangi hangisi kac mi midir mu mudur bir bu su o ve veya ile icin ise ise yarar gore peki bana biraz lutfen acikla anlat anlatir misin soyle goster getir acar acabilir bilgi ver hakkinda detayli ayrintili daha nasil olur oluyor oluyorlar calisir calisiyor nedemek demek arasinda arasindaki fark farki farklar farklari karsilastir karsilastirma olarak de da den dan nin in un nun yi ni sini sunu bunu onun bunun kullanilir nedirler olusur olusuyor olusuyorlar'.split(' ')));

export function guideWords(q: string): string[] {
  const folded = normalize(q)
    .replace(/\b(?:xenon|xe-?135)\b/g, 'ksenon')
    .replace(/\bi-?135\b/g, 'iyot')
    .replace(/\b(?:boron)\b/g, 'bor')
    .replace(/\b(?:generat[oe]r)\b/g, 'jenerator')
    .replace(/\bsteam generator\b/g, 'buhar ureteci')
    .replace(/\bpressurizer\b/g, 'basinclandirici')
    .replace(/\b(?:asistan|rehber)\b/g, 'rehber')
    .replace(/\b(?:konsantrasyon|derisim)[a-z]*/g, 'derisim')
    .replace(/\bazal[a-z]*/g, 'azal')
    .replace(/\bgoster(?:ir|ebilir|ebilirler)?\b/g, 'goster')
    .replace(new RegExp(`\\b(?:pwr|bwr|vver|wwer|rbmk|lwgr|candu|phwr)${REACTOR_SUFFIX}?\\b`, 'g'), ' ')
    .replace(/\bbasincli (?:agir )?su reaktoru\b/g, ' ')
    .replace(/\bagir su reaktoru\b/g, ' ')
    .replace(/\b(?:kaynar|kaynayan) su reaktoru\b/g, ' ');
  return [...new Set(folded.split(' ').filter((t) => (t.length >= 2 || /^\d+$/.test(t)) && !FILLER.has(t)))];
}

/** En fazla bir yazım hatası; kısa sözcükler (bor/boru gibi) bulanık eşlenmez. */
function closeWord(a: string, b: string): number {
  if (a === b) return 1;
  const [short, long] = a.length <= b.length ? [a, b] : [b, a];
  if (short.length >= 5 && long.startsWith(short) && long.length - short.length <= 5) return 0.94;
  if (short.length < 5) return 0;
  // Türkçe ek ve ünsüz yumuşaması: türbini/türbinin, üreteci/üretecinin.
  if (short.length >= 6 && short.slice(0, -1) === long.slice(0, short.length - 1) && long.length - short.length <= 4) return 0.88;
  if (long.length - short.length > 1) return 0;
  let i = 0, j = 0, edits = 0;
  while (i < short.length && j < long.length) {
    if (short[i] === long[j]) { i++; j++; continue; }
    if (++edits > 1) return 0;
    if (short.length === long.length) { i++; j++; }
    else j++;
  }
  return edits + (long.length - j) + (short.length - i) <= 1 ? 0.8 : 0;
}

export interface GuideHit { card: GuideCard; score: number }
const prepared = new WeakMap<GuideCard, { text: string; words: string[] }[]>();
function variantsFor(card: GuideCard) {
  let variants = prepared.get(card);
  if (!variants) {
    variants = [...new Set([card.question, ...card.variants])].map((q) => ({ text: normalize(q), words: guideWords(q) }));
    prepared.set(card, variants);
  }
  return variants;
}

/** Soru kapsamı önemlidir: yalnız reaktör adı veya tek ortak sözcük cevap seçmeye yetmez. */
export function searchGuide(cards: readonly GuideCard[], question: string, reactor: ReactorId): GuideHit[] {
  const named = reactorsIn(question);
  const q = normalize(question);
  const words = guideWords(question);
  const comparison = named.length > 1 || /\b(karsilastir|fark|farki|farklari)\b/.test(q);
  const specificIntent = /\b(nerede|nereden|nereye|kac)\b/.exec(q)?.[1];
  const hits: GuideHit[] = [];
  for (const card of cards) {
    const variants = variantsFor(card);
    if (variants.some((v) => v.text === q)) {
      hits.push({ card, score: 2 + (!card.id.startsWith('entry:') ? 0.015 : 0) });
      continue;
    }
    if (named.length && card.reactors.length && (named.length !== card.reactors.length || named.some((r) => !card.reactors.includes(r)))) continue;
    if (!comparison && card.reactors.length > 1) continue;
    let best = 0;
    for (const variant of variants) {
      const v = variant.text;
      if (q === v) { best = 2; break; }
      if (!words.length) continue;
      const vw = variant.words;
      if (!vw.length) continue;
      if (specificIntent && !new RegExp(`\\b${specificIntent}\\b`).test(v)) continue;
      const match = words.map((w) => Math.max(0, ...vw.map((t) => closeWord(w, t))));
      const coverage = match.reduce((s, n) => s + n, 0) / words.length;
      // Bilinmeyen anahtar sözcüğü yok sayıp alakasız cevaba düşme.
      if (coverage < 0.78 || match.some((m) => m === 0)) continue;
      const precision = vw.filter((w) => words.some((t) => closeWord(w, t) > 0)).length / vw.length;
      best = Math.max(best, coverage * 0.8 + precision * 0.2);
    }
    if (!best) continue;
    if (!named.length && card.reactors.length === 1 && card.reactors[0] === reactor) best += 0.06;
    // Özel soru-cevaplar genel konu tanıtımından önce gelir.
    if (!card.id.startsWith('entry:')) best += 0.015;
    hits.push({ card, score: best });
  }
  return hits.sort((a, b) => b.score - a.score);
}
