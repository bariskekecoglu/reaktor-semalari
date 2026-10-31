import { getSource } from '../../../knowledge/sources';
import { EVIDENCE_LABELS, type EvidenceLevel } from './timeline';
export function Evidence({ sourceIds, locator, level }: { sourceIds: readonly string[]; locator: string; level?: EvidenceLevel }) {
  return <div className="acc-evidence">{level && <strong>{EVIDENCE_LABELS[level]}</strong>}<span>{sourceIds.map(id => { const s = getSource(id); return <a key={id} href={s?.url} target="_blank" rel="noreferrer">{id === 'iaea-insag7' ? 'IAEA INSAG-7 (1992)' : s?.title ?? id}</a>; })}</span><small>{locator}</small></div>;
}
