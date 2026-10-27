/**
 * Görünüm tercihi (kullanıcının seçimi) ve etkili yerleşim (ekrana göre hesaplanan) ayrı kavramlardır.
 *
 *  - viewPreference: 'auto' | 'mobile' | 'desktop' — yalnız bu değer saklanır.
 *  - effectiveLayout: 'narrow' | 'medium' | 'wide' — her an hesaplanır, saklanmaz.
 *
 * Eşikler (CSS piksel, kullanılabilir genişlik; cihaz türü değildir):
 *  - < 768  → narrow: santral sahnesi (viewBox 1400) ile 340 px yan panel yan yana sığmaz; bölüm
 *    sekmeleri ve kontroller tek satırda okunmaz. Tek sütun, büyük dokunma alanları.
 *  - 768–1199 → medium: içerik genişse iki sütun (sahne ≥ 640 px + yan panel ≥ 300 px), değilse alta iner.
 *  - ≥ 1200 → wide: sahne ~820 px ve üstü; etiketler okunaklı kalırken yan panel ve yan yana grafikler sığar.
 *
 * Not: index.html içindeki küçük betik ilk çizimden önce aynı mantığı uygular; değişirse ikisi birlikte güncellenmeli.
 */

export type ViewPreference = 'auto' | 'mobile' | 'desktop';
export type EffectiveLayout = 'narrow' | 'medium' | 'wide';

export const VIEW_PREF_KEY = 'reaktor-semalari:view-preference:v1';
export const NARROW_MAX = 768;
export const WIDE_MIN = 1200;

export const VIEW_PREFERENCES: { id: ViewPreference; label: string }[] = [
  { id: 'auto', label: 'Otomatik' },
  { id: 'mobile', label: 'Mobil' },
  { id: 'desktop', label: 'Masaüstü' },
];

export function isViewPreference(v: unknown): v is ViewPreference {
  return v === 'auto' || v === 'mobile' || v === 'desktop';
}

/** Ekran genişliğine göre otomatik yerleşim. */
export function autoLayout(width: number): EffectiveLayout {
  if (!Number.isFinite(width) || width <= 0) return 'wide';
  if (width < NARROW_MAX) return 'narrow';
  if (width < WIDE_MIN) return 'medium';
  return 'wide';
}

/**
 * Tercih + genişlik → etkili yerleşim.
 * Mobil her genişlikte kompakt (narrow). Masaüstü her genişlikte yoğun (wide); dar ekranda taşmayı
 * CSS’teki sarılan esnek kutular ve kendi alanında kayan görseller önler (korumalar kapanmaz).
 */
export function effectiveLayout(pref: ViewPreference, width: number): EffectiveLayout {
  if (pref === 'mobile') return 'narrow';
  if (pref === 'desktop') return 'wide';
  return autoLayout(width);
}

export interface PrefStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

/** Depolama erişimi engellenirse tercih bu oturumda bellekte tutulur. */
let memoryPref: ViewPreference | null = null;

function safeStorage(): PrefStorage | null {
  try {
    return typeof window !== 'undefined' ? window.localStorage : null;
  } catch {
    return null;
  }
}

export function readPreference(storage: PrefStorage | null = safeStorage()): ViewPreference {
  if (memoryPref) return memoryPref;
  try {
    const v = storage?.getItem(VIEW_PREF_KEY);
    return isViewPreference(v) ? v : 'auto';
  } catch {
    return 'auto';
  }
}

export function writePreference(pref: ViewPreference, storage: PrefStorage | null = safeStorage()): void {
  const value: ViewPreference = isViewPreference(pref) ? pref : 'auto';
  try {
    if (!storage) throw new Error('storage yok');
    storage.setItem(VIEW_PREF_KEY, value);
    memoryPref = null;
  } catch {
    memoryPref = value;
  }
}

/** Testler için bellek yedeğini sıfırlar. */
export function resetMemoryPreference(): void {
  memoryPref = null;
}

/** Kök öğeye tercihi ve etkili yerleşimi yazar (CSS bu özniteliklere bağlıdır). */
export function applyToRoot(pref: ViewPreference, layout: EffectiveLayout, root: HTMLElement = document.documentElement): void {
  if (root.dataset.viewPreference !== pref) root.dataset.viewPreference = pref;
  if (root.dataset.layout !== layout) root.dataset.layout = layout;
}
