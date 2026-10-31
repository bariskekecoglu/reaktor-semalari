/**
 * Beş reaktörün ortak, bileşenden bağımsız meta verisi (sıra, kısa ad, başlık ipucu).
 * Reaktör listesi gereken her yer (başlık, karşılaştırma, ilerleme, asistan doğrulaması) buradan okur;
 * böylece yeni reaktör eklemek sabitlenmiş üçlü listeleri tek tek aramayı gerektirmez.
 */
import type { ReactorId } from './shared/types';

export const REACTOR_IDS: readonly ReactorId[] = ['pwr', 'bwr', 'vver', 'rbmk', 'candu'];

export interface ReactorMeta {
  /** Arayüzdeki kısa ad. */
  name: string;
  /** Reaktör seçicideki kısa açıklama. */
  hint: string;
  /** Karşılaştırma kartı alt başlığı (çizilen temsili tasarım). */
  compareSubtitle: string;
}

export const REACTOR_META: Record<ReactorId, ReactorMeta> = {
  pwr: { name: 'PWR', hint: 'Basınçlı su reaktörü', compareSubtitle: 'temsili dikey buhar üreteçli tasarım' },
  bwr: { name: 'BWR', hint: 'Kaynar su reaktörü', compareSubtitle: 'kaynar su reaktörü' },
  vver: { name: 'VVER', hint: 'Rus tasarımı basınçlı su reaktörü', compareSubtitle: 'PWR ailesi, yatay buhar üreteçli' },
  rbmk: { name: 'RBMK', hint: 'Grafit moderatörlü kanal reaktörü', compareSubtitle: 'temsili RBMK-1000, grafit + kaynayan hafif su' },
  candu: { name: 'CANDU', hint: 'Basınçlı ağır su reaktörü', compareSubtitle: 'temsili CANDU 6, yatay basınç tüplü' },
};

export const REACTOR_NAME: Record<ReactorId, string> = Object.fromEntries(REACTOR_IDS.map((r) => [r, REACTOR_META[r].name])) as Record<ReactorId, string>;

export const isReactorId = (v: unknown): v is ReactorId => typeof v === 'string' && (REACTOR_IDS as readonly string[]).includes(v);

/** Anlatım dersi kimliği (`pwr.tour`) → reaktör; değilse null. */
export function tourReactor(lessonId: string): ReactorId | null {
  const m = /^([a-z]+)\.tour$/.exec(lessonId);
  return m && isReactorId(m[1]) ? m[1] : null;
}

/** Anlatım adımı bağlantısı (`pwr.tour` ya da `pwr.tour.sg`) → reaktör ve adım eki. */
export function parseTourId(id: string): { reactor: ReactorId; step: string | null } | null {
  const m = /^([a-z]+)\.tour(?:\.([\w-]+))?$/.exec(id);
  return m && isReactorId(m[1]) ? { reactor: m[1], step: m[2] ?? null } : null;
}
