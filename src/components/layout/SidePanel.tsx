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

  return (
    <div className="side-panel" aria-live="polite">
      {comp ? (
        <div className="info">
          <p className="eyebrow">Seçili ekipman · {config.shortName}</p>
          <h3 id="side-info-title" tabIndex={-1}>
            {comp.name}
          </h3>
          <p className="role">{comp.role}</p>
          <h4>Bu reaktörde nasıl çalışır?</h4>
          <p>{comp.how}</p>
          {comp.related.length > 0 && (
            <>
              <h4>Bağlantılı bölümler (şemada vurgulandı)</h4>
              <ul className="chips">
                {comp.related
                  .filter((r) => !r.startsWith('f-'))
                  .map((r) => (
                    <li key={r}>
                      <button type="button" onClick={() => onSelect(r)}>
                        {config.components.find((c) => c.id === r)?.name ?? r}
                      </button>
                    </li>
                  ))}
              </ul>
            </>
          )}
          <div className="btn-row">
            {comp.detail && (
              <button type="button" className="primary" onClick={() => onDetail(comp.detail!)}>
                Yakın planı aç
              </button>
            )}
            <button type="button" onClick={() => onSelect(null)}>
              Seçimi kaldır
            </button>
          </div>
        </div>
      ) : action ? (
        <div className="info">
          <p className="eyebrow">{config.shortName} · odak</p>
          <h3>{action.label}</h3>
          <p>{action.text}</p>
          <div className="btn-row">
            {action.detail && (
              <button type="button" className="primary" onClick={() => onDetail(action.detail!)}>
                Yakın planı aç
              </button>
            )}
            <button type="button" onClick={() => onFocus(null)}>
              Vurguyu kaldır
            </button>
          </div>
        </div>
      ) : (
        <div className="info">
          <p className="eyebrow">{config.shortName}</p>
          <h3>Ekipman seçin</h3>
          <p>Şemadaki bir ekipmana tıklayın ya da Tab ile odaklanıp Enter’a basın. Görevi, bu reaktörde nasıl çalıştığı ve bağlantılı hatlar burada gösterilir.</p>
        </div>
      )}

      <div className="focus-list">
        <h4>{config.shortName}’ye özgü konular</h4>
        <ul>
          {config.focusActions.map((a) => (
            <li key={a.id}>
              <button type="button" aria-pressed={focus === a.id} onClick={() => onFocus(focus === a.id ? null : a.id)}>
                {a.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="focus-list">
        <h4>Tüm ekipmanlar</h4>
        <ul className="chips">
          {config.components.map((c) => (
            <li key={c.id}>
              <button type="button" aria-pressed={selected === c.id} onClick={() => onSelect(selected === c.id ? null : c.id)}>
                {c.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
