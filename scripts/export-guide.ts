/** Hazır soru-cevapları içerik incelemesi için okunabilir bir dosyaya aktarır. */
import { writeFileSync } from 'node:fs';
import { localKnowledge } from '../src/knowledge/kb';
import { guideCatalog } from '../src/assistant/localGuide';
import { GUIDE_CATEGORIES } from '../src/assistant/guideCatalog';

const cards = guideCatalog(localKnowledge);
const variants = new Set(cards.flatMap((c) => [c.question, ...c.variants]));
const lines = [
  '# Yerel rehber soru-cevap kataloğu', '',
  `${cards.length} hazır cevap; ${variants.size} farklı soru ifadesi.`, '',
  'Bu dosya `npm run guide:export` ile üretilir. Düzenleme yeri: `src/assistant/guideCatalog.ts` ve referans aldığı mevcut ders/ekipman verileri.', '',
  'Kapsam: PWR, BWR, VVER, karşılaştırma, PWR işletme davranışı ve site kullanımı. Bütün olası soruları kapsadığı iddia edilmez. Kaynakta olmayan cevaplar üretilmez.', '',
];
for (const category of GUIDE_CATEGORIES) {
  lines.push(`## ${category}`, '');
  for (const c of cards.filter((c) => c.category === category)) {
    lines.push(`### ${c.question}`, '', `Kimlik: \`${c.id}\``, '', c.answer, '');
    if (c.detail) lines.push(c.detail, '');
    lines.push(`Kaynaklar: ${c.sourceIds.map((id) => `\`${id}\``).join(', ')}`, '',
      '<details><summary>Alternatif soru ifadeleri</summary>', '',
      ...[...new Set(c.variants)].map((q) => `- ${q}`), '', '</details>', '');
  }
}
writeFileSync(new URL('../docs/LOCAL_GUIDE_QUESTIONS.md', import.meta.url), lines.join('\n').trimEnd() + '\n', 'utf8');
console.log(`${cards.length} cevap, ${variants.size} soru ifadesi: docs/LOCAL_GUIDE_QUESTIONS.md`);
