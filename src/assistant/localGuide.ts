import type { KnowledgeEntry, KnowledgeSource } from '../knowledge/kb';
import type { AssistantAction } from './actions';
import { normalize, reactorsIn, search } from './search';
import { buildGuideCatalog, type GuideCard } from './guideCatalog';
import { guideWords, searchGuide } from './guideSearch';
import type { AssistantContext, AssistantReply } from './types';
import { findChartEvent } from '../reactors/pwr/operations/models/xenonScenarios';

const catalogs = new WeakMap<KnowledgeSource, GuideCard[]>();
export function guideCatalog(kb: KnowledgeSource): readonly GuideCard[] {
  let cards = catalogs.get(kb);
  if (!cards) { cards = buildGuideCatalog(kb); catalogs.set(kb, cards); }
  return cards;
}
function fromCard(card: GuideCard, detailed: boolean): AssistantReply {
  return { mode: 'local', guideId: card.id, text: card.answer + (detailed && card.detail ? '\n\n' + card.detail : ''),
    sourceIds: card.sourceIds, entryIds: card.entryIds, actions: card.actions };
}
function fromEntry(e: KnowledgeEntry): AssistantReply {
  return { mode: 'local', text: e.summary, sourceIds: e.sourceIds, entryIds: [e.id], actions: e.targets.slice(0, 3) };
}

export function localAnswer(kb: KnowledgeSource, question: string, ctx: AssistantContext,
  opts: { detailed?: boolean; previous?: AssistantReply } = {}): AssistantReply {
  const detailed = opts.detailed ?? true;
  const q = question.trim().slice(0, 500);
  const n = normalize(q);
  const cards = guideCatalog(kb);
  const named = reactorsIn(q);
  const previous = cards.find((c) => c.id === opts.previous?.guideId);
  // Takip sorusu yalnız açık bir işaret içeriyorsa önceki cevaba bağlanır.
  if (previous && /^(bunu goster|bunu ac|daha ayrintili|ayrintili anlat|biraz daha acikla|kaynaklari goster)$/.test(n)) {
    return fromCard(previous, true);
  }
  if (previous?.id.startsWith('compare:') && named.length === 1 && guideWords(q).length === 0) {
    const target = cards.find((c) => c.id === previous.id.replace(/:[^:]+$/, ':' + named[0]));
    if (target) return fromCard(target, detailed);
  }
  if (guideWords(q).length === 0 && named.length === 1) {
    return fromCard(cards.find((c) => c.id === `entry:${named[0]}`)!, detailed);
  }
  if (guideWords(q).length === 0 && named.length > 1 && /fark|karsilastir|ayni/.test(n)) {
    return fromCard(cards.find((c) => c.id === `families:${named.join('-')}`)!, detailed);
  }

  // Grafik işaretinin anlamını sormak ile belirli bir tepeyi sormak farklıdır.
  if (/\bgrafi[kg]/.test(n) && /(tepe|zirve|pik|en yuksek|bu nokta)/.test(n) && (!named.length || named[0] === 'pwr')) {
    const scenario = /kapat/.test(n) ? 'shut-100' : /yuk takibi/.test(n) ? 'load-12-3-6-3' : ctx.xenonScenario;
    if (scenario) {
      const id = 'xenon:' + scenario + ':peak-model';
      const e = kb.get(id);
      const fig = kb.get('xenon:' + scenario + ':peak-figure');
      const action: AssistantAction = { type: 'focusChartEvent', eventId: id };
      if (e) return { ...fromEntry(e), text: e.summary + (fig ? ' ' + fig.summary : ''),
        sourceIds: [...new Set([...e.sourceIds, ...(fig?.sourceIds ?? [])])], actions: [action] };
      const event = findChartEvent(id)?.event;
      if (event) return { mode: 'local', text: event.text, sourceIds: event.sourceIds,
        entryIds: ['pwr.ops.xenon'], actions: [action] };
      // Varsayılan dışı senaryoda uydurma olay üretmek yerine genel konu açıklanır.
      return fromCard(cards.find((c) => c.id === 'xenon-peak')!, detailed);
    }
    return { mode: 'local', text: 'Hangi grafiği kastediyorsunuz?', sourceIds: [], actions: [], entryIds: [],
      clarify: { question: 'Hangi grafik?', options: [
        { label: 'Kapatma sonrası ksenon', query: 'PWR kapatmadan sonra ksenon grafiğindeki tepeyi açıkla' },
        { label: 'Yük takibi ksenonu', query: 'PWR yük takibi ksenon grafiğindeki tepeyi açıkla' },
      ] } };
  }
  const hits = searchGuide(cards, q, ctx.reactor);
  const top = hits[0];
  if (top) {
    if (guideWords(q).length === 1 && !/(nedir|ne ise|nasil|neden|nerede|goster|acikla|yarar)/.test(n) && top.score < 1.5 && top.card.category !== 'Site kullanımı') {
      const choices = hits.filter((h) => h.card.reactors.join() === top.card.reactors.join() && h.score >= top.score - 0.12)
        .filter((h, i, all) => all.findIndex((x) => x.card.entryIds.join() === h.card.entryIds.join()) === i).slice(0, 3);
      if (choices.length > 1) return { mode: 'local', text: 'Bu konunun hangi yönünü öğrenmek istiyorsunuz?', sourceIds: [], actions: [], entryIds: [],
        clarify: { question: 'Hangi konu?', options: choices.map((h) => ({ label: h.card.question, query: h.card.question })) } };
    }
    return fromCard(top.card, detailed);
  }
  return { mode: 'local', text: 'Bu soruya hazırlanmış güvenilir bir cevabım yok. PWR, BWR, VVER, RBMK ve CANDU ekipmanları, devreleri, karşılaştırmaları, PWR işletme davranışı ve site kullanımı hakkında yardımcı olabilirim. Hazır sorulardan birini seçebilir veya soruyu tek bir konuya odaklayabilirsiniz.',
    sourceIds: [], actions: [], entryIds: [], notCovered: true };
}

/** Uzak modele aday olarak gönderilecek girdi kimlikleri (metin değil; sunucu kendi kopyasından okur). */
export function candidateIds(kb: KnowledgeSource, question: string, ctx: AssistantContext, limit = 6): string[] {
  const named = reactorsIn(question);
  const hits = search(kb, question, { reactors: named.length ? named : undefined, limit: limit + 2 });
  const ids = hits.map((h) => h.entry.id);
  if (ctx.xenonScenario) ids.push(`xenon:${ctx.xenonScenario}:peak-model`);
  if (!ids.includes(ctx.reactor)) ids.push(ctx.reactor);
  return [...new Set(ids)].filter((id) => kb.get(id)).slice(0, limit + 2);
}
