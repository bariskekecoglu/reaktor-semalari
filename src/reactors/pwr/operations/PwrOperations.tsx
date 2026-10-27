import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { useViewLayout } from '../../../hooks/useViewLayout';
import type { OpsSectionId } from './types';
import { ModesSection } from './components/ModesSection';
import { HeatupSection } from './components/HeatupSection';
import { BoronSection } from './components/BoronSection';
import { XenonSection } from './components/XenonSection';
import { AxialSection } from './components/AxialSection';
import { ControlsSection } from './components/ControlsSection';
import './operations.css';

const SECTIONS: { id: OpsSectionId; label: string; ref: string }[] = [
  { id: 'modes', label: '1. İşletme modları', ref: 'Tablo 2-14' },
  { id: 'heatup', label: '2. Isınma ve ısı uzaklaştırma', ref: 's. 2-89 – 2-93' },
  { id: 'boron', label: '3. Bor ve yakıt çevrimi', ref: 'Şekil 2-39' },
  { id: 'xenon', label: '4. Yük takibi ve ksenon', ref: 'Şekil 2-40, 2-41' },
  { id: 'axial', label: '5. Eksenel güç dağılımı', ref: 'Şekil 2-42, 2-43' },
  { id: 'controls', label: '6. Otomatik kontrol ilişkileri', ref: 's. 2-96' },
];

function IntroText() {
  return (
    <p>
          PWR’nin farklı işletme durumlarında neden farklı davrandığını, kaynak ders notlarının “2.5 PWR Reactor Operations” bölümüne (s. 2-88 – 2-101) dayanarak anlatır. Gerçek bir santralin
          işletme prosedürü veya doğrulanmış kontrol simülatörü değildir. Rozetler bilginin türünü gösterir: <span className="src-badge pdf">PDF</span> doğrudan kaynakta,{' '}
          <span className="src-badge figure">Şekilden yaklaşık okunmuş</span>, <span className="src-badge model">Temsili eğitim modeli</span>.
    </p>
  );
}

/**
 * PWR “İşletme ve Reaktör Davranışı” modülü. Yalnız PWR seçiliyken açılır; durumu santral sahnesinin
 * basit güç modelinden bağımsızdır. Bölüm değişince bölümün kendi durumu sıfırlanır (bileşen yeniden bağlanır).
 */
export function PwrOperations() {
  const [active, setActive] = useState<OpsSectionId>('modes');
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const narrow = useViewLayout().layout === 'narrow';

  // Seçili sekme yatay kaydırılan sekme satırında her zaman görünür kalsın (sayfa dikeyde kaymaz).
  useEffect(() => {
    const i = SECTIONS.findIndex((s) => s.id === active);
    const el = tabs.current[i];
    const row = el?.parentElement;
    if (!el || !row || row.scrollWidth <= row.clientWidth) return;
    const left = el.offsetLeft - row.offsetLeft;
    if (left < row.scrollLeft || left + el.offsetWidth > row.scrollLeft + row.clientWidth) {
      row.scrollTo({ left: Math.max(0, left - 12), behavior: 'auto' });
    }
  }, [active, narrow]);

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const i = SECTIONS.findIndex((s) => s.id === active);
    let n = i;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') n = (i + 1) % SECTIONS.length;
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') n = (i - 1 + SECTIONS.length) % SECTIONS.length;
    else if (e.key === 'Home') n = 0;
    else if (e.key === 'End') n = SECTIONS.length - 1;
    else return;
    e.preventDefault();
    setActive(SECTIONS[n].id);
    tabs.current[n]?.focus();
  };

  return (
    <section className="ops" aria-label="PWR işletme ve reaktör davranışı">
      <div className="ops-intro">
        {narrow ? (
          <details className="ops-more">
            <summary>Bu modül hakkında ve rozetlerin anlamı</summary>
            <IntroText />
          </details>
        ) : (
          <IntroText />
        )}
      </div>

      <div className="ops-tabs" role="tablist" aria-label="Bölümler" onKeyDown={onKey}>
        {SECTIONS.map((s, i) => (
          <button
            key={s.id}
            ref={(el) => (tabs.current[i] = el)}
            type="button"
            role="tab"
            id={`ops-tab-${s.id}`}
            aria-selected={s.id === active}
            aria-controls={`ops-panel-${s.id}`}
            tabIndex={s.id === active ? 0 : -1}
            onClick={() => setActive(s.id)}
          >
            <span>{s.label}</span>
            <small>{s.ref}</small>
          </button>
        ))}
      </div>
      <div role="tabpanel" id={`ops-panel-${active}`} aria-labelledby={`ops-tab-${active}`} className="ops-panel">
        {active === 'modes' && <ModesSection />}
        {active === 'heatup' && <HeatupSection />}
        {active === 'boron' && <BoronSection />}
        {active === 'xenon' && <XenonSection />}
        {active === 'axial' && <AxialSection />}
        {active === 'controls' && <ControlsSection />}
      </div>
    </section>
  );
}
