import type { KeyboardEvent } from 'react';
import type { ChartEvent, EventKind } from '../models/xenonScenarios';
import { formatSource, getSource, SOURCE_KIND_LABEL } from '../../../../knowledge/sources';
import { pwrConfig } from '../../pwrConfig';
import { fmt, type ChartScales } from './common';

export const EVENT_KIND_LABEL: Record<EventKind, string> = {
  source: 'Kaynakta tanımlı',
  figure: 'Şekilden okunan',
  model: 'Modelden hesaplanan',
};

/** Olay türü renge ek olarak işaret biçimiyle ayrılır: kaynak = kare, şekil = eşkenar dörtgen, model = daire. */
function Glyph({ kind, x, y, r }: { kind: EventKind; x: number; y: number; r: number }) {
  if (kind === 'source') return <rect x={x - r} y={y - r} width={r * 2} height={r * 2} />;
  if (kind === 'figure') return <path d={`M${x} ${y - r * 1.25} L${x + r * 1.25} ${y} L${x} ${y + r * 1.25} L${x - r * 1.25} ${y} Z`} />;
  return <circle cx={x} cy={y} r={r} />;
}

/**
 * Grafik içindeki olay işaretleri. `interactive` olan grafikte işaretler dokunma, tıklama ve klavyeyle seçilir.
 * Açıklama grafiğin üstünde değil, altındaki ayrı alanda gösterilir (veriyi kapatmaz).
 */
export function EventMarkers({ events, s, selected, onSelect, interactive = false }: { events: ChartEvent[]; s: ChartScales; selected: string | null; onSelect?: (id: string) => void; interactive?: boolean }) {
  return (
    <g className="ops-events-layer">
      {events.map((e) => {
        const x = s.x(e.t);
        const on = e.id === selected;
        const key = (ev: KeyboardEvent<SVGGElement>) => {
          if (ev.key === 'Enter' || ev.key === ' ') {
            ev.preventDefault();
            onSelect?.(e.id);
          }
        };
        return (
          <g key={e.id} className={`ops-evt kind-${e.kind}${on ? ' on' : ''}`}>
            <line className="ops-event" x1={x} x2={x} y1={s.top} y2={s.bottom} />
            {interactive && (
              <g
                className="ops-evt-hit"
                role="button"
                tabIndex={0}
                aria-pressed={on}
                aria-label={`Olay: ${e.title}, ${fmt(e.t)} saat (${EVENT_KIND_LABEL[e.kind]})`}
                onClick={() => onSelect?.(e.id)}
                onKeyDown={key}
              >
                {/* Geniş dokunma alanı */}
                <rect x={x - 11} y={s.top - 2} width={22} height={22} fill="transparent" />
                <Glyph kind={e.kind} x={x} y={s.top + 8} r={on ? 6 : 4.5} />
              </g>
            )}
          </g>
        );
      })}
    </g>
  );
}

const nameOf = (id: string) => pwrConfig.components.find((c) => c.id === id)?.name ?? id;

/** Olay listesi + seçili olayın açıklaması. Seçmek zamanı değiştirmez; zamanı götürmek ayrı, adı açık bir işlemdir. */
export function EventList({ events, selected, onSelect, onSeek }: { events: ChartEvent[]; selected: string | null; onSelect: (id: string | null) => void; onSeek: (t: number) => void }) {
  const ev = events.find((e) => e.id === selected) ?? null;
  return (
    <div className="ops-evt-panel">
      <ul className="ops-events">
        {events.map((e) => (
          <li key={e.id}>
            <button type="button" aria-pressed={e.id === selected} className={`ops-evt-btn kind-${e.kind}`} onClick={() => onSelect(e.id === selected ? null : e.id)}>
              <svg width="14" height="14" viewBox="-7 -7 14 14" aria-hidden="true" className={`ops-evt kind-${e.kind}`}>
                <Glyph kind={e.kind} x={0} y={0} r={4.5} />
              </svg>
              <span className="ops-evt-time">{fmt(e.t)} sa</span> {e.title}
            </button>
          </li>
        ))}
      </ul>
      <p className="ops-small">İşaret türleri: ■ kaynakta tanımlı · ◆ şekilden okunan · ● modelden hesaplanan. Bir olayı seçmek senaryo saatini değiştirmez.</p>
      {ev && (
        <div className="ops-evt-detail" aria-live="polite">
          <p className="eyebrow">
            {EVENT_KIND_LABEL[ev.kind]} · {fmt(ev.t)} sa
          </p>
          <h5>{ev.title}</h5>
          <p>{ev.text}</p>
          {ev.related.length > 0 && <p className="ops-small">İlgili: {ev.related.map(nameOf).join(', ')}</p>}
          <ul className="ops-sources">
            {ev.sourceIds.map((id) => {
              const src = getSource(id);
              return src ? (
                <li key={id} className={`src-${src.kind === 'web' ? 'pdf' : src.kind}`}>
                  <span className="src-kind">{SOURCE_KIND_LABEL[src.kind]}</span> {formatSource(src)}
                </li>
              ) : null;
            })}
          </ul>
          <div className="btn-row">
            <button type="button" onClick={() => onSeek(ev.t)}>
              Senaryo saatini bu olaya götür ({fmt(ev.t)} sa)
            </button>
            <button type="button" className="link" onClick={() => onSelect(null)}>
              Açıklamayı kapat
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
