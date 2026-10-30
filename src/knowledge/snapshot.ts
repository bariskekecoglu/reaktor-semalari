/** Sunucuya giden bilgi tabanı anlık görüntüsü (yalnız veri; React veya DOM bağımlılığı yok). */
import { localKnowledge } from './kb';
import { SOURCES } from './sources';

export const KNOWLEDGE_VERSION = 1;

export function knowledgeSnapshot() {
  return {
    version: KNOWLEDGE_VERSION,
    sources: SOURCES.map((s) => ({ id: s.id, kind: s.kind, title: s.title, locator: s.locator ?? null })),
    entries: localKnowledge.all().map((e) => ({
      id: e.id,
      reactorId: e.reactorId,
      kind: e.kind,
      name: e.name,
      summary: e.summary,
      body: e.body ?? null,
      sourceIds: e.sourceIds,
      targets: e.targets,
    })),
  };
}
