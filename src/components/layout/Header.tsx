import type { ReactorConfig, ReactorId } from '../../reactors/shared/types';
import type { ViewMode } from '../../app/appState';

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
}

export function Header({ reactor, config, view, onReactor, onView }: Props) {
  return (
    <header className="header">
      <div className="title-row">
        <div>
          <h1>Nükleer Santral Şemaları</h1>
          <p className="subtitle">PWR · BWR · VVER — normal çalışma prensipleri, temsili ve ölçeksiz</p>
        </div>
        <nav className="seg" aria-label="Görünüm">
          {VIEWS.map((v) => (
            <button key={v.id} type="button" className={view === v.id ? 'on' : ''} aria-pressed={view === v.id} onClick={() => onView(v.id)}>
              {v.label}
            </button>
          ))}
        </nav>
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
          <div className="reactor-summary">
            <h2>{config.fullName}</h2>
            <p className="family">{config.family}</p>
            <p>{config.summary}</p>
          </div>
        </div>
      )}
    </header>
  );
}
