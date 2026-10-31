import { accidentClock, EVIDENCE_LABELS, eventAt, TEST_START, TIMELINE } from './timeline';
import { Evidence } from './Evidence';
export function AccidentTimeline({ time, seconds, onSeek }: { time: number; seconds: boolean; onSeek: (t: number) => void }) {
  const active = eventAt(time);
  return <section className="acc-card"><h3>Olay kaydı · {accidentClock(time)}</h3>
    <div className="acc-events" aria-label="Zaman çizelgesi olayları">{TIMELINE.filter(e => !seconds || e.t >= TEST_START).map(e => <button key={e.id} type="button" aria-pressed={active.id === e.id} onClick={() => onSeek(e.t)}><small>{e.clock}</small><span>{e.label}</span></button>)}</div>
    <div aria-live="polite" aria-atomic="true" className="acc-event-detail"><h4>{active.label}</h4><p>{active.detail}</p><Evidence sourceIds={active.sourceIds} locator={active.locator} level={active.level} /></div>
    <p className="acc-legend">{Object.values(EVIDENCE_LABELS).join(' · ')}</p>
  </section>;
}
