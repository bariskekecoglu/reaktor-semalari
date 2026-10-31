import type { ReactorConfig, ReactorId } from '../../reactors/shared/types';
import type { ViewMode } from '../../app/appState';
import { VIEW_PREFERENCES } from '../../app/viewPreference';
import { useViewLayout } from '../../hooks/useViewLayout';
import { REACTOR_IDS, REACTOR_META } from '../../reactors/meta';

const LAYOUT_NAME = { narrow: 'dar', medium: 'orta', wide: 'geniş' } as const;

const REACTORS = REACTOR_IDS.map((id) => ({ id, label: REACTOR_META[id].name, hint: REACTOR_META[id].hint }));

const VIEWS: { id: ViewMode; label: string }[] = [
  { id: 'scheme', label: 'Şema' },
  { id: 'compare', label: 'Karşılaştırma' },
  { id: 'learn', label: 'Öğrenme' },
];

interface Props {
  reactor: ReactorId;
  config: ReactorConfig;
  view: ViewMode;
  onReactor: (id: ReactorId) => void;
  onView: (v: ViewMode) => void;
  assistantOpen: boolean;
  onAssistant: () => void;
  safetyOpen: boolean;
  onSafety: () => void;
}

export function Header({ reactor, config, view, onReactor, onView, assistantOpen, onAssistant, safetyOpen, onSafety }: Props) {
  const { preference, layout, setPreference } = useViewLayout();
  const narrow = layout === 'narrow';
  return (
    <header className="header">
      <div className="title-row">
        <div className="brand">
          <div className="brand-top">
            <p className="brand-kicker"><span aria-hidden="true">◈</span> ETKİLEŞİMLİ ÖĞRENME LABORATUVARI</p>
            <div className="author">
              <span className="author-name">Barış Kekeçoğlu</span>
              <span className="author-sep" aria-hidden="true">·</span>
              <span className="author-field">Nükleer Mühendislik</span>
              <span className="author-sep" aria-hidden="true">·</span>
              <a className="author-link" href="https://www.linkedin.com/in/bariskekecoglu" target="_blank" rel="noopener noreferrer">
                linkedin.com/in/bariskekecoglu
              </a>
            </div>
          </div>
          <h1>Nükleer Santral Şemaları</h1>
          <p className="subtitle">PWR · BWR · VVER · RBMK · CANDU — normal çalışma prensipleri, temsili ve ölçeksiz</p>
        </div>
        <div className="header-controls">
          <div className="header-nav-row">
            <nav className="seg content-seg" aria-label="İçerik">
              {VIEWS.map((v) => (
                <button key={v.id} type="button" className={view === v.id ? 'on' : ''} aria-pressed={view === v.id} onClick={() => onView(v.id)}>
                  {v.label}
                </button>
              ))}
            </nav>
            <button type="button" id="safety-toggle" aria-expanded={safetyOpen} aria-controls="safety-layer" onClick={onSafety}>Güvenlik sistemleri</button>
            <button type="button" id="assistant-toggle" className="assistant-toggle" aria-expanded={assistantOpen} aria-controls="assistant-panel" onClick={onAssistant}>
              <span aria-hidden="true">✦</span> Asistan
            </button>
          </div>
          {/* Yerleşim tercihi: içerik seçiminden ayrıdır; reaktörü veya dersi değiştirmez. */}
          <div className="layout-pref" role="group" aria-labelledby="layout-pref-label">
            <label id="layout-pref-label" htmlFor="layout-choice" className="layout-pref-label">
              Görünüm
            </label>
            <select id="layout-choice" value={preference} onChange={(e) => setPreference(e.target.value as typeof preference)}>
              {VIEW_PREFERENCES.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
            <span className="layout-now" aria-live="polite">
              {preference === 'auto' ? `şu an: ${LAYOUT_NAME[layout]}` : ''}
            </span>
          </div>
        </div>
      </div>
      {view !== 'compare' && (
        <div className="reactor-row">
          <div className="seg reactor-seg" role="group" aria-label="Reaktör tipi">
            {REACTORS.map((r) => (
              <button key={r.id} type="button" className={reactor === r.id ? 'on' : ''} aria-pressed={reactor === r.id} title={r.hint} onClick={() => onReactor(r.id)}>
                <strong>{r.label}</strong>
                <span>{r.hint}</span>
              </button>
            ))}
          </div>
          {narrow ? (
            <details className="reactor-summary compact">
              <summary>
                <span className="family-pill">{config.shortName}</span>
                <strong>{config.fullName}</strong>
              </summary>
              <p className="family">{config.family}</p>
              <p>{config.summary}</p>
            </details>
          ) : (
            <div className="reactor-summary">
              <div className="reactor-summary-head">
                <h2>{config.fullName}</h2>
                <span className="family">{config.family}</span>
              </div>
              <p>{config.summary}</p>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
