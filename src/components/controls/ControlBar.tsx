import { SPEEDS } from '../../simulation/clock';
import { MAX_POWER, MIN_POWER } from '../../simulation/educationalModel';
import { useModelSnapshot, usePlayback, useSimulation } from '../../hooks/useSimulation';

interface Props {
  power: number;
  onPower: (p: number) => void;
  onReset: () => void;
  learning: boolean;
  disabledScene: boolean;
  onToggleLearn: () => void;
}

const pct = (v: number) => `%${Math.round(v * 100)}`;

export function ControlBar({ power, onPower, onReset, learning, disabledScene, onToggleLearn }: Props) {
  const { clock } = useSimulation();
  const { playing, speed } = usePlayback();
  const snap = useModelSnapshot(5);

  return (
    <section className="controls" aria-label="Simülasyon kontrolleri">
      <div className="ctrl-group">
        <button type="button" className="primary play" aria-pressed={playing} onClick={() => (playing ? clock.pause() : clock.play())}>
          {playing ? '❚❚ Duraklat' : '▶ Oynat'}
        </button>
        <button type="button" onClick={onReset} title="Modeli, grafiği ve sahneyi başlangıca döndürür">
          ↺ Sıfırla
        </button>
      </div>

      <div className="ctrl-group" role="group" aria-label="Animasyon hızı">
        <span className="ctrl-label">Animasyon hızı</span>
        <div className="seg small">
          {SPEEDS.map((s) => (
            <button key={s} type="button" className={speed === s ? 'on' : ''} aria-pressed={speed === s} onClick={() => clock.setSpeed(s)}>
              {s}×
            </button>
          ))}
        </div>
      </div>

      <div className="ctrl-group power">
        <label htmlFor="power" className="ctrl-label">
          Eğitim senaryosu: göreli güç <output htmlFor="power">{pct(power)}</output>
        </label>
        <input
          id="power"
          type="range"
          min={MIN_POWER * 100}
          max={MAX_POWER * 100}
          step={5}
          value={Math.round(power * 100)}
          onChange={(e) => onPower(Number(e.target.value) / 100)}
          aria-valuetext={`yüzde ${Math.round(power * 100)}`}
        />
      </div>

      <dl className="readouts" aria-live="off">
        <div>
          <dt>Isıl güç</dt>
          <dd>{pct(snap.thermal)}</dd>
        </div>
        <div>
          <dt>Elektrik</dt>
          <dd>{pct(snap.electric)}</dd>
        </div>
        <div>
          <dt>Kontrol çubukları</dt>
          <dd>{pct(snap.rodInsertion)} içeride</dd>
        </div>
        <div>
          <dt>Türbin mili</dt>
          <dd>senkron · sabit hız</dd>
        </div>
      </dl>

      <div className="ctrl-group">
        <button type="button" aria-pressed={learning} disabled={disabledScene} onClick={onToggleLearn}>
          {learning ? 'Anlatımı kapat' : 'Adım adım anlatım'}
        </button>
      </div>
      <p className="ctrl-note">
        Değerler nominal ısıl güce göre temsili oranlardır; gerçek kontrol paneli veya işletme prosedürü değildir. Çubuk konumu güçle birebir eşlenmez: güç değişirken
        geçici olarak fazla hareket eder, sonra yeni dengeye oturur.
      </p>
    </section>
  );
}
