/**
 * Sunucu tarafı asistan uç noktasına istemci. API anahtarı tarayıcıya hiç gelmez;
 * istemci yalnız soruyu, kısa gezinme bağlamını ve aday içerik kimliklerini gönderir.
 */
import type { AssistantContext } from './types';

/** Uç nokta: derleme sırasında `VITE_ASSISTANT_ENDPOINT` (gizli değildir) ya da geliştirmede vite vekili. */
export function assistantEndpoint(): string | null {
  const env = (import.meta as unknown as { env?: Record<string, string | boolean | undefined> }).env ?? {};
  const v = env.VITE_ASSISTANT_ENDPOINT;
  if (typeof v === 'string' && v.trim()) return v.trim();
  return env.DEV ? '/api/assistant' : null;
}

export const CLIENT_LIMITS = { maxQuestion: 500, timeoutMs: 25000 } as const;

export type RemoteError = 'timeout' | 'offline' | 'rate_limited' | 'unavailable' | 'bad_response' | 'aborted';

export class RemoteAssistantError extends Error {
  constructor(public kind: RemoteError, message: string) {
    super(message);
  }
}

export interface RemoteRequest {
  question: string;
  context: AssistantContext;
  candidateIds: string[];
  level: 'basic' | 'detailed';
}

/** İsteği zaman aşımı ve dış iptal sinyaliyle gönderir; JSON gövdesini döndürür (doğrulama ayrı yapılır). */
export async function callRemote(endpoint: string, req: RemoteRequest, signal: AbortSignal): Promise<unknown> {
  const ctrl = new AbortController();
  const onAbort = () => ctrl.abort();
  signal.addEventListener('abort', onAbort, { once: true });
  let timedOut = false;
  const timer = setTimeout(() => {
    timedOut = true;
    ctrl.abort();
  }, CLIENT_LIMITS.timeoutMs);
  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...req, question: req.question.slice(0, CLIENT_LIMITS.maxQuestion) }),
      signal: ctrl.signal,
      credentials: 'omit',
    });
    if (res.status === 429) throw new RemoteAssistantError('rate_limited', 'Çok sık istek gönderildi. Biraz sonra tekrar deneyin.');
    if (!res.ok) throw new RemoteAssistantError('unavailable', `Asistan servisi yanıt vermedi (${res.status}).`);
    try {
      return await res.json();
    } catch {
      throw new RemoteAssistantError('bad_response', 'Asistan servisinden okunamayan yanıt geldi.');
    }
  } catch (e) {
    if (e instanceof RemoteAssistantError) throw e;
    if (timedOut) throw new RemoteAssistantError('timeout', 'Asistan servisi zamanında yanıt vermedi.');
    if (signal.aborted) throw new RemoteAssistantError('aborted', 'İstek iptal edildi.');
    throw new RemoteAssistantError(typeof navigator !== 'undefined' && navigator.onLine === false ? 'offline' : 'unavailable', 'Asistan servisine bağlanılamadı.');
  } finally {
    clearTimeout(timer);
    signal.removeEventListener('abort', onAbort);
  }
}
