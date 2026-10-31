import { useSyncExternalStore } from 'react';
import en from './en.json';

export type Language = 'tr' | 'en';
const KEY = 'reaktor-semalari:language:v1';
const dictionary: Record<string, string> = en;
let language: Language = 'tr';
try { if (localStorage.getItem(KEY) === 'en') language = 'en'; } catch { /* Storage can be disabled. */ }
const listeners = new Set<() => void>();
export function setLanguage(value: Language) {
  language = value;
  try { localStorage.setItem(KEY, value); } catch { /* Keep in memory. */ }
  if (typeof document !== 'undefined') {
    document.documentElement.lang = value;
    document.title = value === 'en' ? 'Nuclear Plant Diagrams — PWR, BWR, VVER, RBMK, CANDU' : 'Reaktör Şemaları — PWR, BWR, VVER, RBMK, CANDU';
  }
  listeners.forEach(fn => fn());
}
export function useLanguage() {
  const current = useSyncExternalStore(fn => { listeners.add(fn); return () => { listeners.delete(fn); }; }, () => language, () => 'tr' as Language);
  return { language: current, setLanguage };
}
/** Exact keys preserve identifiers, source quotations and untranslated Turkish content. */
export function t<T>(value: T): T {
  if (language !== 'en' || typeof value !== 'string') return value;
  const key = value.trim().replace(/\s+/g, ' ');
  const translated = dictionary[key];
  if (!translated) return value;
  return (value.match(/^\s*/)?.[0] + translated + value.match(/\s*$/)?.[0]) as T;
}
export function translateData<T>(value: T): T {
  if (typeof value === 'string') return t(value);
  if (Array.isArray(value)) return value.map(translateData) as T;
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, translateData(v)])) as T;
  return value;
}
if (typeof document !== 'undefined') setLanguage(language);
