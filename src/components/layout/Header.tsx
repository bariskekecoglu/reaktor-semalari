import type { ReactorConfig, ReactorId } from '../../reactors/shared/types';
import type { ViewMode } from '../../app/appState';
import { VIEW_PREFERENCES } from '../../app/viewPreference';
import { useViewLayout } from '../../hooks/useViewLayout';

const LAYOUT_NAME = { narrow: 'dar', medium: 'orta', wide: 'geniş' } as const;

const REACTORS: { id: ReactorId; label: string; hint: string }[] = [
  { id: 'pwr', label: 'PWR', hint: 'Basınçlı su reaktörü' },
  { id: 'bwr', label: 'BWR', hint: 'Kaynar su reaktörü' },
  { id: 'vver', label: 'VVER', hint: 'Rus tasarımı basınçlı su reaktörü' },
];

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
}

export function Header({ reactor, config, view, onReactor, onView, assistantOpen, onAssistant }: Props) {
  const { preference, layout, setPreference } = useViewLayout();
  const narrow = layout === 'narrow';
  return (
    <header className="header">
      <div className="title-row">
        <div className="brand">
          <p className="brand-kicker"><span aria-hidden="true">◈</span> ETKİLEŞİMLİ ÖĞRENME LABORATUVARI</p>
          <h1>Nükleer Santral Şemaları</h1>
          <p className="subtitle">PWR · BWR · VVER — normal çalışma prensipleri, temsili ve ölçeksiz</p>
        </div>
        <div className="header-controls">
          <nav className="seg content-seg" aria-label="İçerik">
            {VIEWS.map((v) => (
              <button key={v.id} type="button" className={view === v.id ? 'on' : ''} aria-pressed={view === v.id} onClick={() => onView(v.id)}>
                {v.label}
              </button>
            ))}
          </nav>
          <button type="button" id="assistant-toggle" className="assistant-toggle" aria-expanded={assistantOpen} aria-controls="assistant-panel" onClick={onAssistant}>
            <span aria-hidden="true">✦</span> Asistan
          </button>
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
                <strong>{config.fullName}</strong>
              </summary>
              <p className="family">{config.family}</p>
              <p>{config.summary}</p>
            </details>
          ) : (
            <div className="reactor-summary">
              <h2>{config.fullName}</h2>
              <p className="family">{config.family}</p>
              <p>{config.summary}</p>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
