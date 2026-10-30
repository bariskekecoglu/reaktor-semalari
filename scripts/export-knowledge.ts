/**
 * Bilgi tabanını sunucu için dışa aktarır: server/knowledge.json.
 * Sunucu, istemciden yalnız aday içerik KİMLİKLERİNİ alır ve metni kendi kopyasından okur;
 * böylece uç nokta serbest metin bağlamı kabul eden genel bir model vekiline dönüşmez.
 *
 * Çalıştırma: npm run kb:export
 */
import { writeFileSync } from 'node:fs';
import { knowledgeSnapshot } from '../src/knowledge/snapshot';

const out = new URL('../server/knowledge.json', import.meta.url);
writeFileSync(out, `${JSON.stringify(knowledgeSnapshot(), null, 1)}\n`, 'utf8');
console.log(`server/knowledge.json yazıldı (${knowledgeSnapshot().entries.length} girdi).`);
