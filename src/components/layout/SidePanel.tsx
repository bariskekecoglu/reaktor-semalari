import { t } from '../../i18n/locale';
import type { ReactorConfig } from '../../reactors/shared/types';

interface Props {
  config: ReactorConfig;
  selected: string | null;
  focus: string | null;
  onFocus: (id: string | null) => void;
  onSelect: (id: string | null) => void;
  onDetail: (key: string) => void;
}

export function SidePanel({ config, selected, focus, onFocus, onSelect, onDetail }: Props) {
  const comp = selected ? config.components.find((c) => c.id === selected) : null;
  const action = focus ? config.focusActions.find((a) => a.id === focus) : null;
  const relatedComps = comp ? comp.related.filter((r) => !r.startsWith('f-')) : [];

  return (
    <div className="side-panel" aria-live="polite">
      {comp ? (
        <div className="info info-card is-active">
          <p className="eyebrow">{t("Seçili ekipman · ")}{t(config.shortName)}</p>
          <h3 id="side-info-title" tabIndex={-1}>
            {t(comp.name)}
          </h3>
          <p className="role">{t(comp.role)}</p>
          <h4>{t("Bu reaktörde nasıl çalışır?")}</h4>
          <p>{t(comp.how)}</p>
          {relatedComps.length > 0 && (
            <>
              <h4>{t("Bağlantılı bölümler (şemada vurgulandı)")}</h4>
              <ul className="chips">
                {relatedComps.map((r) => (
                  <li key={r}>
                    <button type="button" onClick={() => onSelect(r)}>
                      {t(config.components.find((c) => c.id === r)?.name ?? r)}
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
          <div className="btn-row">
            {comp.detail && (
              <button type="button" className="primary" onClick={() => onDetail(comp.detail!)}>{t("Yakın planı aç")}</button>
            )}
            <button type="button" onClick={() => onSelect(null)}>{t("Seçimi kaldır")}</button>
          </div>
        </div>
      ) : action ? (
        <div className="info info-card is-active">
          <p className="eyebrow">{t(config.shortName)}{t(" · odak")}</p>
          <h3>{t(action.label)}</h3>
          <p>{t(action.text)}</p>
          <div className="btn-row">
            {action.detail && (
              <button type="button" className="primary" onClick={() => onDetail(action.detail!)}>{t("Yakın planı aç")}</button>
            )}
            <button type="button" onClick={() => onFocus(null)}>{t("Vurguyu kaldır")}</button>
          </div>
        </div>
      ) : (
        <div className="info info-card is-empty">
          <p className="eyebrow">{t(config.shortName)}</p>
          <h3>{t("Ekipman seçin")}</h3>
          <p>{t("Şemadaki bir ekipmana tıklayın ya da Tab ile odaklanıp Enter’a basın. Görevi, bu reaktörde nasıl çalıştığı ve bağlantılı hatlar burada gösterilir.")}</p>
        </div>
      )}

      <div className="focus-list">
        <h4>{t(config.shortName)}{t("’ye özgü konular")}</h4>
        <ul>
          {config.focusActions.map((a) => (
            <li key={a.id}>
              <button type="button" aria-pressed={focus === a.id} onClick={() => onFocus(focus === a.id ? null : a.id)}>
                {t(a.label)}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="focus-list">
        <h4>{t("Tüm ekipmanlar (")}{t(config.components.length)})</h4>
        <ul className="chips">
          {config.components.map((c) => (
            <li key={c.id}>
              <button type="button" aria-pressed={selected === c.id} onClick={() => onSelect(selected === c.id ? null : c.id)}>
                {t(c.name)}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
