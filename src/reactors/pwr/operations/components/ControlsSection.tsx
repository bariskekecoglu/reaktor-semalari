import { useState } from 'react';
import { AXIAL_NOT_AUTO, CONTROL_RELATIONS } from '../data/controls';
import type { PlantView } from '../types';
import { MiniPlant } from './MiniPlant';
import { ModelNote, SourceTags, WhyBox } from './common';

const POWER_VIEW: PlantView = {
  rodInsertion: 0.15,
  headOn: true,
  pzrWater: 0.6,
  pzrHeaters: true,
  rcpRunning: true,
  rhrRunning: false,
  sgActive: true,
  steamDump: false,
  turbine: 'generating',
  fission: true,
};

export function ControlsSection() {
  const [sel, setSel] = useState<string>(CONTROL_RELATIONS[0].id);
  const rel = CONTROL_RELATIONS.find((r) => r.id === sel);
  return (
    <div className="ops-section">
      <div className="ops-vis">
        <div className="ops-match" role="group" aria-label="Ölçülen büyüklük ve kontrol sistemi eşleşmeleri">
          {CONTROL_RELATIONS.map((r) => (
            <button key={r.id} type="button" aria-pressed={r.id === sel} onClick={() => setSel(r.id)}>
              <span className="m">{r.measured}</span>
              <span className="arrow" aria-hidden="true">
                →
              </span>
              <span className="s">{r.system}</span>
            </button>
          ))}
          <button type="button" aria-pressed={sel === 'axial'} onClick={() => setSel('axial')} className="axial">
            <span className="m">Eksenel güç dağılımı</span>
            <span className="arrow" aria-hidden="true">
              ✕
            </span>
            <span className="s">tek bir otomatik kontrol değişkeni yok</span>
          </button>
        </div>
        <MiniPlant view={POWER_VIEW} highlight={rel ? rel.parts : ['core', 'rods']} label="Güç işletmesinde temsili PWR; seçili kontrol ilişkisinin ekipmanı vurgulu" />
      </div>
      <div className="ops-text">
        {rel ? (
          <>
            <h3>{rel.measured}</h3>
            <dl className="ops-facts">
              <dt>Ölçülen büyüklük</dt>
              <dd>{rel.measured}</dd>
              <dt>Kontrol eden sistem</dt>
              <dd>{rel.system}</dd>
              <dt>Kontrol etkisi</dt>
              <dd>{rel.effect}</dd>
            </dl>
            <WhyBox>{rel.feedback}</WhyBox>
          </>
        ) : (
          <>
            <h3>Eksenel güç dağılımı</h3>
            <WhyBox>{AXIAL_NOT_AUTO}</WhyBox>
          </>
        )}
        <ModelNote>Kavramsal eşleştirme; gerçek kontrolör ayarları, koruma eşikleri ve işletme reçeteleri içermez.</ModelNote>
        <SourceTags
          sources={[
            { kind: 'pdf', ref: 's. 2-96 (otomatik kontrol listesi)' },
            { kind: 'pdf', ref: 's. 2-97 – 2-98 (eksenel dağılım ve ΔI)' },
          ]}
        />
      </div>
    </div>
  );
}
