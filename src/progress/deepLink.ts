/**
 * Doğrudan ders bağlantısı: `#ders=<ders veya adım kimliği>[&adim=<adım>]`.
 * Örnekler: `#ders=pwr.tour.sg`, `#ders=pwr.predict.xenon-shutdown&adim=experiment`.
 * Bilinmeyen kimlikler yok sayılır (site normal açılır). Hash kullanıldığı için statik yayında sunucu ayarı gerekmez.
 */
import type { ReactorId } from '../reactors/shared/types';
import { parseTourId } from '../reactors/meta';
import type { ProgressCatalog } from './progressStore';
import { isChernobylStage, type ChernobylStageId } from '../reactors/rbmk/chernobyl/stages';

export type LessonLink = { kind: 'tour'; reactor: ReactorId; step: number } | { kind: 'predict'; lessonId: string; stepId: string | null } | { kind: 'chernobyl'; stage: ChernobylStageId };

export function parseLessonHash(hash: string, cat: ProgressCatalog): LessonLink | null {
  const params = new URLSearchParams(hash.replace(/^#/, ''));
  const id = params.get('ders');
  if (!id || id.length > 80) return null;
  if (id === 'rbmk.chernobyl') {
    const stage = params.get('adim');
    return { kind: 'chernobyl', stage: isChernobylStage(stage) ? stage : 'conditions' };
  }
  const tour = parseTourId(id);
  if (tour && cat.tours[tour.reactor]) {
    const r = tour.reactor;
    const steps = cat.tours[r];
    const i = tour.step ? steps.indexOf(id) : 0;
    return { kind: 'tour', reactor: r, step: Math.max(0, i) };
  }
  const p = cat.predict[id];
  if (p) {
    const step = params.get('adim');
    return { kind: 'predict', lessonId: id, stepId: step && p.steps.includes(step) ? step : null };
  }
  return null;
}

export function lessonHash(link: LessonLink, cat: ProgressCatalog): string {
  if (link.kind === 'chernobyl') return `#ders=rbmk.chernobyl&adim=${link.stage}`;
  if (link.kind === 'tour') return `#ders=${encodeURIComponent(cat.tours[link.reactor][link.step] ?? `${link.reactor}.tour`)}`;
  return `#ders=${encodeURIComponent(link.lessonId)}${link.stepId ? `&adim=${encodeURIComponent(link.stepId)}` : ''}`;
}
