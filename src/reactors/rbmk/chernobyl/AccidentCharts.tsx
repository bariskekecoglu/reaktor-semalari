import { POWER_POINTS, stateAt, TREND_NOTE, TREND_SOURCES } from './curves';
import { accidentClock, AZ5_TIME, END_TIME, TEST_START, TIMELINE } from './timeline';
import { Evidence } from './Evidence';
export function AccidentCharts({ time, seconds, range, onSeek }: { time: number; seconds: boolean; range: readonly [number, number]; onSeek: (t: number) => void }) {
  const min = seconds ? TEST_START : TIMELINE[0].t;
  const max = seconds ? END_TIME : TEST_START;
  const x = (t: number) => 65 + 590 * (Math.max(min, Math.min(max, t)) - min) / (max - min);
  const events = TIMELINE.filter(e => e.t >= min && e.t <= max);
  const points = Array.from({ length: 44 }, (_, i) => stateAt(TEST_START + i));
  const trend = (key: 'flowDrawing' | 'voidDrawing') => points.filter(s => s[key] !== null).map(s => `${x(s.t)},${235 - s[key]! * 155}`).join(' ');
  const unknownX = x(TEST_START + 39);
  const lineX = x(time);
  return <section className="acc-card acc-chart"><h3>{seconds ? 'Son saniyeler · nitel eğilimler' : 'Saatler ölçeği · ısıl güç'}</h3>
    <p>{seconds ? 'Dikey eksen: ölçeksiz çizim alanı; MW, debi veya boşluk yüzdesi okunamaz.' : 'Dikey eksen: MW ısıl. Kareler belgelenmiş noktalar; kesikli bağlantılar temsili, ölçüm değildir.'}</p>
    {seconds && <div className="acc-trend-key"><span><i /> Debi · testteki pompalar</span><span className="void"><i /> Kanal boşluk oranı</span><span className="power"><i /> Güç · temsili</span></div>}
    <div className="acc-chart-scroll" tabIndex={0} aria-label="Grafik alanı; dar ekranda yatay kaydırılabilir"><svg viewBox="0 0 710 330" role="group" aria-label={seconds ? 'Test başlangıcından son kayda kadar nitel debi, boşluk ve güç eğilimleri. Son bölümde belirsizlik alanı.' : 'Belgelenmiş ayrık ısıl güç noktaları ve aralarındaki temsili bağlantılar.'}>
      <rect x={x(range[0])} y="45" width={Math.max(0, x(range[1]) - x(range[0]))} height="220" fill="var(--accent)" opacity=".06" />
      <path d="M65 45 V265 H655" fill="none" stroke="currentColor" />
      {seconds ? <>
        <rect x={unknownX} y="45" width={655 - unknownX} height="220" fill="var(--metal)" opacity=".5" />
        <polyline points={trend('flowDrawing')} fill="none" stroke="var(--cold)" strokeWidth="3" strokeDasharray="9 4" />
        <polyline points={trend('voidDrawing')} fill="none" stroke="var(--cool)" strokeWidth="3" strokeDasharray="2 5" />
        <path d={`M65 218 H${x(AZ5_TIME)} Q${x(AZ5_TIME + 2)} 218 ${unknownX} 150`} fill="none" stroke="var(--ink)" strokeWidth="3" strokeDasharray="12 4 2 4" />
        <text x={unknownX + 6} y="125" fontSize="12" transform={`rotate(-90 ${unknownX + 6} 125)`}>Tepe bilinmiyor</text>
      </> : <>
        {[0, 800, 1600].map(v => <g key={v}><text x="8" y={265 - v / 8}>{v}</text><path d={`M65 ${265 - v / 8} H655`} stroke="var(--rule)" strokeDasharray="3 4" /></g>)}
        <polyline points={POWER_POINTS.map(e => `${x(e.t)},${265 - e.thermalMW! / 8}`).join(' ')} fill="none" stroke="var(--accent)" strokeWidth="2" strokeDasharray="6 5" />
        {POWER_POINTS.map(e => <g key={e.id}><rect x={x(e.t) - 4} y={261 - e.thermalMW! / 8} width="8" height="8" fill="var(--accent)" /><title>{`${e.clock}: yaklaşık ${e.thermalMW} MW ısıl — ${e.locator}`}</title></g>)}
      </>}
      {events.map((e, i) => <g key={e.id} role="button" tabIndex={0} aria-label={`${e.clock}: ${e.label}; bu ana git`} onClick={() => onSeek(e.t)} onKeyDown={k => { if (k.key === 'Enter' || k.key === ' ') { k.preventDefault(); onSeek(e.t); } }}>
        <title>{`${e.clock} · ${e.label}`}</title><rect x={x(e.t) - 9} y={270 + i % 2 * 20} width="18" height="20" fill="transparent" /><path d={`M${x(e.t)} 260 v${15 + i % 2 * 20}`} stroke="currentColor" /><circle cx={x(e.t)} cy={280 + i % 2 * 20} r="4" fill="var(--paper)" stroke="currentColor" />
      </g>)}
      <path d={`M${lineX} 45 V265`} stroke="var(--focus)" strokeWidth="2" />
      <text x="65" y="325">{seconds ? '0 s · 01:23:04' : '25 Nis · 01:06'}</text><text x="655" y="325" textAnchor="end">{seconds ? '56 s · 01:24:00' : '26 Nis · 01:23:04'}</text>
    </svg></div>
    <p>İmleç: {accidentClock(time)}. İşaretlerin büyük dokunma hedefleri aşağıdaki olay düğmeleridir.</p>
    {seconds && <p>{TREND_NOTE} 01:23:43 sonrası güç sayısallaştırılmaz; 01:23:47 sonrası debi ve boşluk çizimleri de kesilir.</p>}
    <Evidence sourceIds={TREND_SOURCES.sourceIds} locator={seconds ? TREND_SOURCES.locator + '; Tablo I-I, s. 55; §4.1, s. 13' : 'Ek I, Tablo I-I, s. 53–54; 00:28 ölçüm belirsizliği: s. 73–74'} level="representative" />
  </section>;
}
