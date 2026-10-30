import type { ReactorId } from '../reactors/shared/types';
import type { OpsSectionId } from '../reactors/pwr/operations/types';
import type { AssistantAction } from './actions';

/** Asistana verilen kısa uygulama bağlamı (yalnız gezinme durumu; kullanıcı verisi yok). */
export interface AssistantContext {
  reactor: ReactorId;
  view: 'scheme' | 'compare' | 'learn';
  pwrView: 'plant' | 'ops';
  opsSection: OpsSectionId;
  selected: string | null;
  /** Açık ksenon senaryosu (ör. 'shut-100'), işletme modülünde ksenon bölümü açıksa. */
  xenonScenario: string | null;
}

export interface ClarifyOption {
  label: string;
  /** Seçilince gönderilecek, netleştirilmiş soru. */
  query: string;
}

export type ReplyMode = 'local' | 'ai';

export interface AssistantReply {
  /** Hazır soru-cevap kimliği; kısa takip sorularında aynı konuya dönmek için. */
  guideId?: string;
  mode: ReplyMode;
  text: string;
  /** Doğrulanmış kaynak kimlikleri. */
  sourceIds: string[];
  /** Doğrulanmış işlemler. */
  actions: AssistantAction[];
  /** Belirsiz soru için tek kısa açıklayıcı soru. */
  clarify?: { question: string; options: ClarifyOption[] };
  /** Kaynaklar soruyu karşılamıyor. */
  notCovered?: boolean;
  /** Reddedilen model önerileri (kullanıcıya kısa not olarak gösterilir). */
  rejected?: string[];
  /** Yanıtın dayandığı bilgi tabanı girdileri. */
  entryIds: string[];
}
