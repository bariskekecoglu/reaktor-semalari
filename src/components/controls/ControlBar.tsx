import { t } from '../../i18n/locale';
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
    <section className="controls" aria-label={t("Simülasyon kontrolleri")}>
      <div className="controls-main">
        <div className="ctrl-group ctrl-playback">
          <button type="button" className="primary play" aria-pressed={playing} onClick={() => (playing ? clock.pause() : clock.play())}>
            {t(playing ? '❚❚ Duraklat' : '▶ Oynat')}
          </button>
          <button type="button" onClick={onReset} title={t("Modeli, grafiği ve sahneyi başlangıca döndürür")}>{t("↺ Sıfırla")}</button>
        </div>

        <div className="ctrl-group ctrl-speed" role="group" aria-label={t("Animasyon hızı")}>
          <span className="ctrl-label">{t("Animasyon hızı")}</span>
          <div className="seg small">
            {SPEEDS.map((s) => (
              <button key={s} type="button" className={speed === s ? 'on' : ''} aria-pressed={speed === s} onClick={() => clock.setSpeed(s)}>
                {t(s)}×
              </button>
            ))}
          </div>
        </div>

        <div className="ctrl-group power">
          <label htmlFor="power" className="ctrl-label">{t("Eğitim senaryosu: göreli güç ")}<output htmlFor="power">{t(pct(power))}</output>
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
            <dt>{t("Isıl güç")}</dt>
            <dd>{t(pct(snap.thermal))}</dd>
          </div>
          <div>
            <dt>{t("Elektrik")}</dt>
            <dd>{t(pct(snap.electric))}</dd>
          </div>
          <div>
            <dt>{t("Kontrol çubukları")}</dt>
            <dd>{t(pct(snap.rodInsertion))}{t(" içeride")}</dd>
          </div>
          <div>
            <dt>{t("Türbin mili")}</dt>
            <dd>{t("senkron · sabit hız")}</dd>
          </div>
        </dl>

        <div className="ctrl-group ctrl-learn">
          <button type="button" aria-pressed={learning} disabled={disabledScene} onClick={onToggleLearn}>
            {t(learning ? 'Anlatımı kapat' : 'Adım adım anlatım')}
          </button>
        </div>
      </div>
      <p className="ctrl-note">{t("Değerler nominal ısıl güce göre temsili oranlardır; gerçek kontrol paneli veya işletme prosedürü değildir. Çubuk konumu güçle birebir eşlenmez: güç değişirken geçici olarak fazla hareket eder, sonra yeni dengeye oturur.")}</p>
    </section>
  );
}
