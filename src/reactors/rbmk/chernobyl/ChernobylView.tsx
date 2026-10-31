import { useEffect, useState } from 'react';
import { usePrefersReducedMotion } from '../../../hooks/useSimulation';
import { useViewLayout } from '../../../hooks/useViewLayout';
import { AccidentCharts } from './AccidentCharts';
import { AccidentTimeline } from './AccidentTimeline';
import { Az5RodDetail } from './Az5RodDetail';
import { Evidence } from './Evidence';
import { VoidFeedbackAnimation } from './VoidFeedbackAnimation';
import { getStage, STAGES, type ChernobylStageId } from './stages';
import { accidentClock, clampTime, END_TIME, TEST_START, TIMELINE } from './timeline';
import { advanceTime, stateAt } from './curves';
import './chernobyl.css';

export function ChernobylView({ stageId, onStage, onCompare }: { stageId: ChernobylStageId; onStage: (id: ChernobylStageId) => void; onCompare: () => void }) {
  const stage = getStage(stageId);
  const reduced = usePrefersReducedMotion();
  const layout = useViewLayout().layout;
  const [time, setTime] = useState(stage.range[0]);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [copied, setCopied] = useState(false);
  const [theme, setTheme] = useState('auto');
  const [still, setStill] = useState(false);
  const noMotion = reduced || still;
  const seconds = stageId !== 'conditions';
  const min = seconds ? TEST_START : TIMELINE[0].t;
  const max = seconds ? END_TIME : TEST_START;
  useEffect(() => { setPlaying(false); setTime(stage.range[0]); setCopied(false); }, [stage]);
  useEffect(() => { if (noMotion) setPlaying(false); }, [noMotion]);
  useEffect(() => {
    if (!playing || noMotion) return;
    let previous = performance.now();
    const id = window.setInterval(() => {
      const now = performance.now();
      const dt = Math.min((now - previous) / 1000, 0.25); previous = now;
      setTime(t => advanceTime(t, dt, speed, seconds));
    }, 100);
    return () => window.clearInterval(id);
  }, [playing, noMotion, speed, max, seconds]);
  useEffect(() => { if (time >= max) setPlaying(false); }, [time, max]);
  const seek = (t: number) => { setPlaying(false); setTime(clampTime(t, min, max)); };
  const step = (direction: number) => {
    const events = TIMELINE.filter(e => e.t >= min && e.t <= max);
    seek(direction > 0 ? events.find(e => e.t > time + .01)?.t ?? max : [...events].reverse().find(e => e.t < time - .01)?.t ?? min);
  };
  const s = stateAt(time);
  return <article className="chernobyl" data-acc-layout={layout} data-acc-theme={theme} aria-labelledby="chernobyl-title">
    <header className="acc-intro"><p className="eyebrow">RBMK · Kaynaklı tarihsel canlandırma</p><h2 id="chernobyl-title">Çernobil 1986 — Kaza analizi</h2><p>Animasyon, grafik ve olay kaydı aynı tarihsel zamanı izler. Bu bölüm bir fizik simülatörü değildir; çizimlerdeki hareket ve eğriler ölçüm olarak okunmamalıdır.</p></header>
    <nav className="acc-stages" aria-label="Kaza analizi aşamaları">{STAGES.map((v, i) => <button key={v.id} type="button" aria-current={stageId === v.id ? 'step' : undefined} onClick={() => onStage(v.id)}><small>AŞAMA {i + 1}</small>{v.title}</button>)}</nav>
    <div className="acc-preferences"><label>Bölüm teması <select aria-label="Bölüm teması" value={theme} onChange={e => setTheme(e.target.value)}><option value="auto">Sistem</option><option value="light">Açık</option><option value="dark">Koyu</option></select></label><label><input type="checkbox" checked={still} onChange={e => setStill(e.target.checked)} /> Durağan karelerle incele</label></div>
    <section className="acc-card acc-explanation"><h3>{STAGES.indexOf(stage) + 1}. {stage.title}</h3><p>{stage.text}</p><Evidence sourceIds={stage.sourceIds} locator={stage.locator} />
      <button type="button" onClick={async () => { try { await navigator.clipboard.writeText(window.location.href); setCopied(true); } catch { setCopied(false); } }}>{copied ? 'Bağlantı kopyalandı' : 'Bu aşamanın bağlantısını kopyala'}</button>
      {stageId === 'void' && <><p>PWR/BWR’de su aynı zamanda moderatördür; olağan işletme koşullarında buhar boşluğu artışı negatif reaktivite geri beslemesi verir. Bu fark, her kazanın imkânsız olduğu anlamına gelmez.</p><Evidence sourceIds={['iaea-bme-void']} locator="BME Void coefficient measurement, §1–2, s. 1–3: moderasyon ve reaktivite ilişkisi" /><button type="button" onClick={onCompare}>Moderatörleri karşılaştır</button></>}
    </section>
    <div className="acc-controls" role="group" aria-label="Tarihsel canlandırma kontrolleri"><div className="acc-control-row">
      <button type="button" onClick={() => step(-1)} disabled={time <= min}>← Önceki olay</button><button type="button" disabled={noMotion || time >= max} aria-pressed={playing} onClick={() => setPlaying(p => !p)}>{playing ? 'Duraklat' : 'Oynat'}</button><button type="button" onClick={() => step(1)} disabled={time >= max}>Sonraki olay →</button>
      <label>Hız <select value={speed} onChange={e => setSpeed(Number(e.target.value))}><option value={.25}>0,25×</option><option value={.5}>0,5×</option><option value={1}>1×</option></select></label><button type="button" onClick={() => seek(min)}>Başa dön</button>
    </div><label className="acc-slider">Tarihsel zaman · {accidentClock(time)}<input aria-label="Tarihsel zaman" aria-valuetext={accidentClock(time)} type="range" min={min} max={max} step={seconds ? .1 : 60} value={time} onChange={e => seek(Number(e.target.value))} /></label><small>{noMotion ? 'Hareketi azalt açık: otomatik oynatma kapalı; olay düğmeleri ve zaman kaydırıcısıyla durağan kareleri inceleyin.' : seconds ? '1×: bir gerçek saniyede bir tarihsel saniye.' : '1×: bir gerçek saniyede bir tarihsel saat; saatler ölçeği sıkıştırılmıştır.'}</small></div>
    <div className="acc-grid"><div>{stage.scene === 'rod' ? <Az5RodDetail time={time} /> : stage.scene === 'review' ? <section className="acc-card"><h3>1992 raporunda bildirilen değişiklikler</h3><ul><li>Alt su sütununu ortadan kaldıran çubuk tasarımı ve uzatılmış soğurucu.</li><li>Ek sabit soğurucular ve daha yüksek yakıt zenginleştirmesi.</li><li>Daha hızlı kapatma ve ayrı hızlı acil koruma sistemi.</li><li>ORM gösterimi, koruma bypass kısıtları ve işletme talimatlarında değişiklikler.</li></ul><Evidence sourceIds={['iaea-insag7']} locator="Ek: Measures to improve the safety of RBMK plants, s. 27–28" /><p>Bu tarihsel liste güncel santral sertifikası veya güvenlik garantisi değildir.</p></section> : <VoidFeedbackAnimation time={time} />}<div className="acc-card"><h3>Eşzamanlı şema durumu</h3><p>{s.powerLabel}</p><p>Testteki pompalar: {s.flowDrawing === null ? 'okumalar güvenilmez; çizim durdu' : time < TEST_START ? 'test henüz başlamadı' : 'serbest dönüşte debi azalması (temsili)'}.</p><p>Çubuk: {s.rodDrawing === null ? 'konum bilinmiyor' : s.rodDrawing > 0 ? 'ilk giriş bölümü (temsili)' : 'başlangıç konumu (temsili)'}.</p><Evidence sourceIds={['iaea-insag7']} locator="§2.2, s. 4; Ek I §I-4.6.2–I-4.6.3, s. 65–67; Tablo I-I, s. 55" level="representative" /></div></div>
    <div>{stageId === 'seconds' && <VoidFeedbackAnimation time={time} />}<AccidentCharts time={time} seconds={seconds} range={stage.range} onSeek={seek} /><AccidentTimeline time={time} seconds={seconds} onSeek={seek} /></div></div>
    <footer className="acc-footer"><button type="button" disabled={stageId === STAGES[0].id} onClick={() => onStage(STAGES[STAGES.indexOf(stage) - 1].id)}>← Önceki aşama</button><button type="button" disabled={stageId === STAGES[4].id} onClick={() => onStage(STAGES[STAGES.indexOf(stage) + 1].id)}>Sonraki aşama →</button></footer>
  </article>;
}
