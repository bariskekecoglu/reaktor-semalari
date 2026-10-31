import { stateAt } from './curves';
export function VoidFeedbackAnimation({ time }: { time: number }) {
  const s = stateAt(time);
  const count = s.voidDrawing === null ? 0 : Math.round(3 + s.voidDrawing * 14);
  return <section className="acc-card"><h3>Kanalda su ve buhar</h3>
    <svg viewBox="0 0 500 280" role="img" aria-label="Grafit içinde yakıt kanalı; buhar kabarcıkları ve yukarı doğru su akışı. Temsili kesit.">
      <rect x="65" y="20" width="165" height="230" rx="8" fill="var(--metal-dark)" stroke="currentColor" />
      <rect x="115" y="20" width="65" height="230" fill="var(--feed)" stroke="currentColor" />
      <rect x="140" y="35" width="15" height="200" fill="var(--fuel)" stroke="currentColor" />
      {Array.from({ length: count }, (_, i) => <circle key={i} cx={i % 2 ? 128 : 167} cy={235 - i * 12} r={4 + i % 3} fill="var(--paper)" stroke="var(--line)" />)}
      <path d="M95 240 V45 l-7 12 m7-12 l7 12" stroke="currentColor" fill="none" strokeWidth="3" />
      <text x="255" y="55">Grafit → moderatör</text><text x="255" y="95">Su → soğutucu</text><text x="255" y="135">Sarı çubuk → yakıt</text>
      <text x="255" y="180">{s.voidDrawing === null ? 'Dağılım bilinmiyor' : 'Kabarcıklar → buhar'}</text><text x="255" y="220">Geometri ve miktar temsili</text>
    </svg>
    <ol className="acc-loop" aria-label="Pozitif geri besleme döngüsü">{['Daha fazla buhar', 'Daha az su / nötron soğurulması', 'Reaktivite ve güç artışı', 'Daha fazla kaynama ↺'].map((v, i) => <li key={v}><b>{i + 1}</b> {v} →</li>)}</ol>
    <p>Grafit yerinde kalır. Döngü, kaza koşullarındaki pozitif geri beslemeyi açıklar; eğitici çizimdir.</p>
    <div className="acc-flow-glyph" aria-label="Testteki pompalarda nitel debi göstergesi; ölçüm değildir"><span>Pompa → kanal · temsili debi</span><svg viewBox="0 0 400 45" role="img" aria-label={s.flowDrawing === null ? 'Debi okumaları güvenilmez; çizim kesildi' : 'Ok uzunluğu kavramsal debi eğilimini gösterir'}><path d="M15 22 H385" stroke="var(--rule)" strokeWidth="12" />{s.flowDrawing !== null ? <path d={`M15 22 H${30 + s.flowDrawing * 340} l-12-8 m12 8 l-12 8`} stroke="var(--cold)" strokeWidth="4" fill="none" /> : <text x="25" y="28">Okumalar güvenilmez</text>}</svg></div>
  </section>;
}
