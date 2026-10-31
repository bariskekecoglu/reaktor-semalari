import { useState } from 'react';
import { useSimulation, useTick } from '../../hooks/useSimulation';
import { flowIllustration } from './bwrFlow';
import { t } from '../../i18n/locale';

export function BwrFlowExperiment({ done, onDone, onNext, note }: { done: boolean; onDone: () => void; onNext: () => void; note: string }) {
  const { clock } = useSimulation();
  const [playing, setPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(done ? 1 : 0);
  useTick(dt => {
    if (!playing || dt <= 0) return;
    const next = Math.min(1, elapsed + dt / 10);
    setElapsed(next);
    if (next >= 1) { setPlaying(false); onDone(); }
  });
  const values = flowIllustration(elapsed);
  const series = [
    { key: 'flow' as const, label: t('Devridaim debisi'), color: '#1c6fc2' },
    { key: 'voids' as const, label: t('Buhar boşluğu'), color: '#8a4b83' },
    { key: 'power' as const, label: t('Fisyon gücü'), color: '#d9480f' },
  ];
  const x = (p: number) => 65 + 500 * p;
  const y = (v: number) => 185 - (v - 0.8) * 400;
  return <div className="predict-exp">
    <p className="predict-variable">{t('Değiştirilen değişken:')} {t('Devridaim debisi')} · 1 → 1.15. {t('Basınç ve kontrol çubukları sabit.')}</p>
    <figure className="predict-chart">
      <figcaption>{t('Temsili neden–sonuç sırası · başlangıç = 1; zaman ve değerler ölçekli değildir.')}</figcaption>
      <svg viewBox="0 0 600 230" role="img" aria-label={t('Debi artışı, boşluk azalması ve güç artışı')}>
        {[0.8, 0.9, 1, 1.1, 1.2].map(v => <g key={v}><line x1="65" x2="565" y1={y(v)} y2={y(v)} stroke="#d9d4c7" /><text x="52" y={y(v) + 4} textAnchor="end" fontSize="12">{v.toFixed(1)}</text></g>)}
        {series.map(s => <path key={s.key} fill="none" stroke={s.color} strokeWidth="3" d={Array.from({ length: 101 }, (_, i) => i / 100).filter(p => p <= elapsed).map((p, i) => `${i ? 'L' : 'M'}${x(p)} ${y(flowIllustration(p)[s.key])}`).join(' ')} />)}
        <line x1={x(elapsed)} x2={x(elapsed)} y1="20" y2="190" stroke="#26262a" strokeDasharray="4 4" />
        <text x="315" y="219" textAnchor="middle" fontSize="12">{t('Neden–sonuç sırası →')}</text>
      </svg>
    </figure>
    <ul className="ops-legend">{series.map(s => <li key={s.key}><span style={{ color: s.color }}>●</span> {s.label}: {values[s.key].toFixed(2)}</li>)}</ul>
    <p className="ops-small">{note}</p>
    <div className="btn-row">
      <button type="button" className="primary" aria-pressed={playing} onClick={() => { if (playing) setPlaying(false); else { if (elapsed >= 1) setElapsed(0); clock.play(); setPlaying(true); } }}>{playing ? t('Duraklat') : elapsed >= 1 ? t('Yeniden oynat') : t('Deneyi oynat')}</button>
      <button type="button" onClick={() => { setElapsed(1); setPlaying(false); onDone(); }}>{t('Sona atla')}</button>
      <button type="button" disabled={!done} onClick={onNext}>{t('Gözleme geç')}</button>
    </div>
  </div>;
}
