/**
 * Uzak modelden (sunucu üzerinden) gelen JSON yanıtın çalışma zamanı doğrulaması.
 * Model kaynak listesini serbestçe uyduramaz: kaynak kimlikleri hem kayıtlı olmalı hem de
 * modele verilen aday girdilerin kaynakları arasında bulunmalıdır. İşlemler ayrıca `validateActions`tan geçer.
 */
import type { KnowledgeSource } from '../knowledge/kb';
import { isSourceId } from '../knowledge/sources';
import { validateActions, type ActionRegistry } from './actions';
import type { AssistantReply } from './types';

export const REPLY_LIMITS = { maxAnswer: 1800, maxClarify: 200, maxIds: 10 } as const;

export type ModelReplyResult = { ok: true; reply: AssistantReply } | { ok: false; error: string };

const isObj = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);

export function validateModelReply(raw: unknown, candidates: string[], kb: KnowledgeSource, reg: ActionRegistry): ModelReplyResult {
  if (!isObj(raw)) return { ok: false, error: 'Yanıt nesne değil' };
  const answer = raw.answer;
  if (typeof answer !== 'string' || !answer.trim()) return { ok: false, error: 'Yanıt metni yok' };
  if (answer.length > REPLY_LIMITS.maxAnswer) return { ok: false, error: 'Yanıt metni çok uzun' };
  const coverage = raw.coverage;
  if (coverage !== 'covered' && coverage !== 'partial' && coverage !== 'not_covered') return { ok: false, error: 'Kapsam alanı geçersiz' };

  const rejected: string[] = [];
  const candSet = new Set(candidates);
  const entryIds = Array.isArray(raw.entryIds) ? raw.entryIds.filter((id): id is string => typeof id === 'string' && candSet.has(id) && !!kb.get(id)).slice(0, REPLY_LIMITS.maxIds) : [];
  if (Array.isArray(raw.entryIds) && raw.entryIds.length !== entryIds.length) rejected.push('Bilinmeyen içerik kimliği yok sayıldı');

  const allowedSources = new Set(candidates.flatMap((id) => kb.get(id)?.sourceIds ?? []));
  const sourceIds: string[] = [];
  if (Array.isArray(raw.sourceIds)) {
    for (const s of raw.sourceIds.slice(0, REPLY_LIMITS.maxIds)) {
      if (isSourceId(s) && allowedSources.has(s)) sourceIds.push(s);
      else rejected.push(`Doğrulanamayan kaynak yok sayıldı: ${String(s).slice(0, 40)}`);
    }
  }
  if (coverage !== 'not_covered' && sourceIds.length === 0) return { ok: false, error: 'Kaynaksız yanıt' };

  const acts = validateActions(raw.actions ?? [], reg);
  rejected.push(...acts.rejected);

  let clarify: AssistantReply['clarify'];
  if (typeof raw.clarifyingQuestion === 'string' && raw.clarifyingQuestion.trim()) {
    clarify = { question: raw.clarifyingQuestion.slice(0, REPLY_LIMITS.maxClarify), options: [] };
  }

  return {
    ok: true,
    reply: {
      mode: 'ai',
      text: answer.trim(),
      sourceIds: [...new Set(sourceIds)],
      actions: acts.actions,
      clarify,
      notCovered: coverage === 'not_covered' || undefined,
      rejected: rejected.length ? rejected : undefined,
      entryIds,
    },
  };
}
