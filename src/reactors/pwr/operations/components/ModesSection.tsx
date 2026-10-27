import { useState } from 'react';
import { MODES, fToC } from '../data/modes';
import { decayHeatFraction } from '../models/xenon';
import { MiniPlant } from './MiniPlant';
import { ModelNote, SourceTags, WhyBox, fmt } from './common';

const AFTER = [
  { h: 1, label: '1 saat' },
  { h: 24, label: '1 gün' },
  { h: 24 * 7, label: '1 hafta' },
  { h: 24 * 30, label: '1 ay' },
];

/** “≥ 350 °F” gibi bir hücreye °C karşılığını ekler. */
function withCelsius(cell: string | null): string {
  if (!cell) return 'okunamıyor';
  const m = cell.match(/(\d+)\s*°F/);
  return m ? `${cell} (${cell.replace(/[\d]+\s*°F/, `${fmt(fToC(Number(m[1])), 0)} °C`)})` : cell;
}

export function ModesSection() {
  const [sel, setSel] = useState(0);
  const [after, setAfter] = useState(1);
  const m = MODES[sel];
  const decayPct =
    m.decayHeat === 'after-shutdown' ? decayHeatFraction(AFTER[after].h) * 100 : 0.06 * m.fissionPct; // çalışırken: fisyon ısısının içinde küçük pay
  const coolingParts = m.cooling === 'rhr' ? (['rhr'] as const) : (['rcp', 'sg'] as const);
  return (
    <div className="ops-section">
      <div className="ops-vis">
        <div className="ops-pick" role="group" aria-label="İşletme modu seçimi">
          {MODES.map((x, i) => (
            <button key={x.mode} type="button" aria-pressed={i === sel} onClick={() => setSel(i)}>
              <strong>Mod {x.mode}</strong> {x.name}
            </button>
          ))}
        </div>
        <MiniPlant view={m.view} highlight={[...coolingParts]} label={`Mod ${m.mode} ${m.name} için temsili PWR görünümü`} />
        <div className="ops-bars" aria-label="Isı üretimi">
          <div className="ops-bar-row">
            <span>Fisyon gücü</span>
            <div className="ops-bar">
              <div className="fill fission" style={{ width: `${Math.min(100, m.fissionPct)}%` }} />
            </div>
            <output>%{fmt(m.fissionPct, 0)}</output>
          </div>
          <div className="ops-bar-row">
            <span>Artık ısı</span>
            <div className="ops-bar">
              <div className="fill decay" style={{ width: `${Math.min(100, decayPct * 10)}%` }} />
            </div>
            <output>%{fmt(decayPct, decayPct < 1 ? 2 : 1)}</output>
          </div>
          <p className="ops-small">Yüzdeler nominal (tam) güce göredir. Kapatılmış modlarda kapatmadan önce %100 güçte işletme varsayıldığı için nominal güce ve önceki güce göre değer aynıdır. Artık ısı çubuğu okunabilirlik için 10 kat büyütüldü.</p>
          {m.decayHeat === 'after-shutdown' && (
            <div className="ops-pick small" role="group" aria-label="Kapatmadan sonra geçen süre">
              <span className="ops-small">Kapatmadan sonra geçen süre:</span>
              {AFTER.map((a, i) => (
                <button key={a.h} type="button" aria-pressed={i === after} onClick={() => setAfter(i)}>
                  {a.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="ops-text">
        <h3>
          Mod {m.mode}: {m.name} <span className="ops-en">({m.sourceName})</span>
        </h3>
        <table className="ops-table">
          <caption>Tablo 2-14’teki satır (kaynakta göründüğü gibi)</caption>
          <tbody>
            <tr>
              <th scope="row">Reaktivite koşulu, k_eff</th>
              <td>{m.keff ?? 'okunamıyor'}</td>
            </tr>
            <tr>
              <th scope="row">Nominal ısıl güç yüzdesi*</th>
              <td>{m.thermalPower ?? 'okunamıyor'}</td>
            </tr>
            <tr>
              <th scope="row">Ortalama soğutucu sıcaklığı</th>
              <td>{withCelsius(m.avgTempF)}</td>
            </tr>
          </tbody>
        </table>
        {m.cellNote && <p className="ops-warn">{m.cellNote}</p>}
        <p className="ops-small">* Tablo dipnotu: artık ısı hariç. Tablodaki k_eff eşikleri idari mod sınıflandırmasıdır; fiziksel kritiklik koşulu k_eff = 1’dir.</p>
        <dl className="ops-facts">
          <dt>Isı uzaklaştırma</dt>
          <dd>{m.coolingText}</dd>
          <dt>Türbin / jeneratör</dt>
          <dd>{m.turbineText}</dd>
          <dt>Çubuklar ve kap</dt>
          <dd>{m.rodsText}</dd>
        </dl>
        <WhyBox>{m.whatWhy}</WhyBox>
        <ModelNote>
          Temsili eğitim modeli: şema ve çubuk konumu görseldir. Artık ısı değerleri genel Way–Wigner yaklaşık bağıntısıyla (1 yıllık işletme varsayımıyla) verilir; kaynak PDF’te yoktur. Kaynak
          bu bölümde basıncı psig (gösterge basıncı) ile verir; mutlak basınç ≈ psig + 14,7 psi.
        </ModelNote>
        <SourceTags sources={[...m.sources, { kind: 'model', ref: 'Artık ısı: Way–Wigner yaklaşık bağıntısı (kaynakta yok)' }]} />
      </div>
    </div>
  );
}
