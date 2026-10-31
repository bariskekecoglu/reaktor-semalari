import { safetyTopic } from '../safety/catalog';
import type { KnowledgeSource } from '../knowledge/kb';
import type { AssistantContext } from './types';

/** Öneriler görünen bağlamdan üretilir; mesaj geçmişi veya ağ gerekmez. */
export function suggestedQuestions(ctx: AssistantContext, kb: KnowledgeSource): string[] {
  const r = ctx.reactor.toUpperCase();
  if (ctx.safetyTopic) return [
    `${r} ${safetyTopic(ctx.safetyTopic).question}`,
    `${r} Acil çekirdek soğutma sistemi ECCS nedir?`,
    `${r} Güvenlik bariyerleri ve derinliğine savunma nedir?`,
  ].filter((q, i, all) => all.indexOf(q) === i);
  if (ctx.selected) {
    const e = kb.get(`${ctx.reactor}.${ctx.selected}`);
    if (e) return [`${r} ${e.name} ne işe yarar?`, `${r} Reaktör koruma sistemi ne işe yarar?`, `${r} Güvenlik bariyerleri ve derinliğine savunma nedir?`];
  }
  if (ctx.pwrView === 'ops' && ctx.reactor === 'pwr') return [
    ctx.opsSection === 'xenon' ? 'Kapatınca ksenon niye yükselir?' : 'PWR işletme modları nedir?',
    `${r} Artık ısı uzaklaştırma sistemi neden gerekir?`,
    `${r} Reaktör koruma sistemi ne işe yarar?`,
  ];
  return [`${r} Reaktör koruma sistemi ne işe yarar?`, `${r} Acil çekirdek soğutma sistemi ECCS nedir?`, `${r} Güvenlik sistemlerinde yedek elektrik neden gerekir?`];
}
