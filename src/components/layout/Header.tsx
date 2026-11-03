import { t } from '../../i18n/locale';
import type { ReactorConfig, ReactorId } from '../../reactors/shared/types';
import type { ViewMode } from '../../app/appState';
import { VIEW_PREFERENCES } from '../../app/viewPreference';
import { useViewLayout } from '../../hooks/useViewLayout';
import { REACTOR_IDS, REACTOR_META } from '../../reactors/meta';
import { useLanguage } from '../../i18n/locale';
import { PwaControls } from '../../pwa/PwaControls';

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
  const { language, setLanguage } = useLanguage();
  const { preference, layout, setPreference } = useViewLayout();
  const narrow = layout === 'narrow';
  return (
    <header className="header">
      <div className="title-row">
        <div className="brand">
          <div className="brand-top">
            <p className="brand-kicker"><span aria-hidden="true">◈</span>{t(" ETKİLEŞİMLİ ÖĞRENME LABORATUVARI")}</p>
          </div>
          <h1>{t("Nükleer Santral Şemaları")}</h1>
          <p className="subtitle">{t("PWR · BWR · VVER · RBMK · CANDU — normal çalışma prensipleri, temsili ve ölçeksiz")}</p>
          <div className="author">
            <span className="author-name">{t("Barış Kekeçoğlu")}</span>
            <span className="author-sep" aria-hidden="true">·</span>
            <span className="author-field">{t("Nükleer Mühendislik")}</span>
            <span className="author-sep" aria-hidden="true">·</span>
            <a className="author-link" href="https://www.linkedin.com/in/bariskekecoglu" target="_blank" rel="noopener noreferrer">{t("LinkedIn ↗")}</a>
            <span className="author-sep" aria-hidden="true">·</span>
            <a className="author-link" href="./tanitim/">{t("▶ Tanıtım videosu")}</a>
          </div>
        </div>
        <div className="header-controls">
          <div className="header-nav-row">
            <div className="seg" role="group" aria-label={t("Language / Dil")}>
              <button type="button" lang="tr" aria-pressed={language === 'tr'} onClick={() => setLanguage('tr')}>{t("TR")}</button>
              <button type="button" lang="en" aria-pressed={language === 'en'} onClick={() => setLanguage('en')}>{t("EN")}</button>
            </div>
            <PwaControls />
            <nav className="seg content-seg" aria-label={t("İçerik")}>
              {VIEWS.map((v) => (
                <button key={v.id} type="button" className={view === v.id ? 'on' : ''} aria-pressed={view === v.id} onClick={() => onView(v.id)}>
                  {t(v.label)}
                </button>
              ))}
            </nav>
            <button type="button" id="safety-toggle" aria-expanded={safetyOpen} aria-controls="safety-layer" onClick={onSafety}>{t("Güvenlik sistemleri")}</button>
            <button type="button" id="assistant-toggle" className="assistant-toggle" aria-expanded={assistantOpen} aria-controls="assistant-panel" onClick={onAssistant}>
              <span aria-hidden="true">✦</span>{t(" Asistan")}</button>
          </div>
          {/* Yerleşim tercihi: içerik seçiminden ayrıdır; reaktörü veya dersi değiştirmez. */}
          <div className="layout-pref" role="group" aria-labelledby="layout-pref-label">
            <label id="layout-pref-label" htmlFor="layout-choice" className="layout-pref-label">{t("Görünüm")}</label>
            <select id="layout-choice" value={preference} onChange={(e) => setPreference(e.target.value as typeof preference)}>
              {VIEW_PREFERENCES.map((p) => (
                <option key={p.id} value={p.id}>
                  {t(p.label)}
                </option>
              ))}
            </select>
            <span className="layout-now" aria-live="polite">
              {t(preference === 'auto' ? `şu an: ${LAYOUT_NAME[layout]}` : '')}
            </span>
          </div>
        </div>
      </div>
      {language === 'en' && <p className="translation-note" lang="en">{t("English: navigation, diagram controls and the BWR prediction lesson. Some existing technical content is still in Turkish.")}</p>}
      {view !== 'compare' && (
        <div className="reactor-row">
          <div className="seg reactor-seg" role="group" aria-label={t("Reaktör tipi")}>
            {REACTORS.map((r) => (
              <button key={r.id} type="button" className={reactor === r.id ? 'on' : ''} aria-pressed={reactor === r.id} title={r.hint} onClick={() => onReactor(r.id)}>
                <strong>{t(r.label)}</strong>
                <span>{t(r.hint)}</span>
              </button>
            ))}
          </div>
          {narrow ? (
            <details className="reactor-summary compact">
              <summary>
                <span className="family-pill">{t(config.shortName)}</span>
                <strong>{t(config.fullName)}</strong>
              </summary>
              <p className="family">{t(config.family)}</p>
              <p>{t(config.summary)}</p>
            </details>
          ) : (
            <div className="reactor-summary">
              <div className="reactor-summary-head">
                <h2>{t(config.fullName)}</h2>
                <span className="family">{t(config.family)}</span>
              </div>
              <p>{t(config.summary)}</p>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
