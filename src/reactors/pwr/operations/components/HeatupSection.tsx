import { useState } from 'react';
import { HEATUP } from '../data/heatup';
import type { PlantPart } from '../types';
import { MiniPlant } from './MiniPlant';
import { ModelNote, SourceTags, WhyBox } from './common';

export function HeatupSection() {
  const [i, setI] = useState(0);
  const s = HEATUP[i];
  const hl: PlantPart[] = [];
  if (s.view.rhrRunning) hl.push('rhr');
  if (s.view.rcpRunning) hl.push('rcp');
  if (s.view.pzrHeaters) hl.push('pzr-heaters');
  if (s.view.steamDump) hl.push('dump');
  if (s.view.turbine === 'generating') hl.push('generator');
  if (i === 2) hl.push('pzr');
  return (
    <div className="ops-section">
      <div className="ops-vis">
        <div className="ops-stepper" role="group" aria-label="Isınma aşamaları">
          <button type="button" onClick={() => setI(Math.max(0, i - 1))} disabled={i === 0}>
            ← Önceki
          </button>
          <ol>
            {HEATUP.map((h, k) => (
              <li key={h.id}>
                <button type="button" aria-current={k === i ? 'step' : undefined} className={k === i ? 'on' : ''} onClick={() => setI(k)} title={h.title}>
                  {k + 1}
                </button>
              </li>
            ))}
          </ol>
          <button type="button" onClick={() => setI(Math.min(HEATUP.length - 1, i + 1))} disabled={i === HEATUP.length - 1}>
            Sonraki →
          </button>
        </div>
        <MiniPlant view={s.view} highlight={hl} label={`${s.title}: temsili PWR görünümü`} />
        <div className="ops-heat">
          <div>
            <h4>Isı kaynakları</h4>
            <ul>
              {s.heatSources.map((x) => (
                <li key={x} className="src">
                  {x}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4>Isı alıcıları / yolları</h4>
            <ul>
              {s.heatSinks.map((x) => (
                <li key={x} className="sink">
                  {x}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4>Basınçlandırıcı</h4>
            <p>{s.pzrLabel}</p>
            <p className="ops-small">Basınçlandırıcıdaki buhar hacmi basınç kontrolü içindir; çekirdekte kaynama değildir.</p>
          </div>
        </div>
      </div>
      <div className="ops-text">
        <h3>{s.title}</h3>
        <p className="ops-cond">{s.condition}</p>
        <WhyBox>{s.whatWhy}</WhyBox>
        <ModelNote>
          Kavramsal anlatım; işletme prosedürü değildir. Kaynaktaki vana/pompa işlem sıraları, güvenlik sistemi işlemleri ve sayısal kritiklik hesapları bilinçli olarak görev hâline
          getirilmedi. Şemadaki çubuk ve seviye konumları temsilidir.
        </ModelNote>
        <SourceTags sources={s.sources} />
      </div>
    </div>
  );
}
