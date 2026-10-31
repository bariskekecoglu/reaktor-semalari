import { t } from '../../i18n/locale';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useSimulation, useTick } from '../../hooks/useSimulation';
import { buildScenario } from '../../reactors/pwr/operations/models/xenonScenarios';
import { formatSource, getSource, SOURCE_KIND_LABEL } from '../../knowledge/sources';
import '../../reactors/pwr/operations/operations.css';
import { PREDICT_STEPS, STEP_LABEL, type ChoiceQuestion, type PredictLesson, type PredictStepId } from './types';

import { BwrFlowExperiment } from './BwrFlowExperiment';
import { canEnter, emptyPredictState, restorePredictState, type PredictState } from './predictState';

interface Props {
  lesson: PredictLesson;
  initial: PredictState;
  onChange: (s: PredictState) => void;
  onAskAssistant?: (q: string) => void;
  onExit: () => void;
}

export function PredictLessonView({ lesson, initial, onChange, onAskAssistant, onExit }: Props) {
  const [s, setS] = useState<PredictState>(() => restorePredictState(initial));
  const [hint, setHint] = useState(0);
  const headRef = useRef<HTMLHeadingElement>(null);
  // Güncel durum ref’te de tutulur; üst bileşen olay işleyicisinde (render dışında) bilgilendirilir.
  const sRef = useRef(s);
  sRef.current = s;
  const update = (patch: Partial<PredictState>) => {
    const next = { ...sRef.current, ...patch };
    sRef.current = next;
    setS(next);
    onChange(next);
  };
  const go = (step: PredictStepId) => {
    if (canEnter(s, step)) update({ step });
  };
  useEffect(() => {
    headRef.current?.focus({ preventScroll: true });
  }, [s.step]);

  return (
    <section className="predict" aria-labelledby="predict-title">
      <header className="predict-head">
        <p className="eyebrow">{t(lesson.reactorId.toUpperCase())}{t("· Tahmin et → dene → açıkla")}</p>
        <h2 id="predict-title">{t(lesson.title)}</h2>
        <ol className="predict-steps" aria-label={t("Ders adımları")}>
          {PREDICT_STEPS.map((id, i) => {
            const ok = canEnter(s, id);
            return (
              <li key={id}>
                <button type="button" aria-current={s.step === id ? 'step' : undefined} className={s.step === id ? 'on' : ''} disabled={!ok} onClick={() => go(id)}>
                  <span aria-hidden="true">{t(i + 1)}</span> {t(STEP_LABEL[id])}
                </button>
              </li>
            );
          })}
        </ol>
      </header>

      <div className="predict-body">
        <h3 ref={headRef} tabIndex={-1}>
          {t(STEP_LABEL[s.step])}
        </h3>

        {s.step === 'goal' && (
          <>
            <p>
              <strong>{t("Öğrenme hedefi:")}</strong> {t(lesson.goal)}
            </p>
            <p>
              <strong>{t("Başlangıç durumu:")}</strong> {t(lesson.initialState)}
            </p>
            <div className="btn-row">
              <button type="button" className="primary" onClick={() => go('predict')}>{t("Tahmine geç")}</button>
            </div>
          </>
        )}

        {s.step === 'predict' && (
          <>
            <ChoiceBlock name="predict" q={lesson.predict} value={s.prediction} onPick={(id) => update({ prediction: id, skipped: false })} reveal={false} />
            {hint > 0 && (
              <ul className="predict-hints">
                {lesson.hints.slice(0, hint).map((h) => (
                  <li key={h}>{t("İpucu: ")}{t(h)}</li>
                ))}
              </ul>
            )}
            <div className="btn-row">
              <button type="button" className="primary" disabled={!s.prediction} onClick={() => update({ step: 'experiment' })}>{t("Tahminimle dene")}</button>
              {hint < lesson.hints.length && (
                <button type="button" onClick={() => setHint((h) => h + 1)}>{t("İpucu göster")}</button>
              )}
              <button type="button" className="link" onClick={() => update({ skipped: true, step: 'explain' })}>{t("Atla ve açıklamayı gör")}</button>
            </div>
          </>
        )}

        {s.step === 'experiment' && (lesson.experiment.kind === 'bwr-flow' ? <BwrFlowExperiment done={s.experimentDone} onDone={() => update({ experimentDone: true })} onNext={() => update({ step: 'observe' })} note={lesson.experiment.note} /> : <Experiment lesson={lesson} done={s.experimentDone} onDone={() => update({ experimentDone: true })} onNext={() => update({ step: 'observe' })} />)}

        {s.step === 'observe' && (
          <>
            <ChoiceBlock name="observe" q={lesson.observe} value={s.observation} onPick={(id) => update({ observation: id })} reveal={s.observation !== null} />
            <div className="btn-row">
              <button type="button" className="primary" disabled={!s.observation} onClick={() => update({ step: 'explain' })}>{t("Açıklamaya geç")}</button>
              <button type="button" onClick={() => update({ step: 'experiment' })}>{t("Deneyi yeniden izle")}</button>
            </div>
          </>
        )}

        {s.step === 'explain' && (
          <>
            <PredictionFeedback lesson={lesson} s={s} />
            <p>{t(lesson.explain.text)}</p>
            <SourceList ids={lesson.explain.sourceIds} />
            <div className="btn-row">
              <button type="button" className="primary" onClick={() => update({ step: 'assess' })}>{t("Kısa değerlendirme")}</button>
              {s.skipped && (
                <button type="button" onClick={() => update({ step: 'predict' })}>{t("Yine de tahmin yap")}</button>
              )}
              {onAskAssistant && (
                <button type="button" onClick={() => onAskAssistant(lesson.reactorId === 'bwr' ? 'BWR devridaim debisi gücü neden artırır?' : 'Ksenon neden kapatmadan sonra artabiliyor?')}>{t("Asistana sor")}</button>
              )}
            </div>
          </>
        )}

        {s.step === 'assess' && (
          <>
            <ChoiceBlock name="assess" q={lesson.assess} value={s.assessment} onPick={(id) => update({ assessment: id, completed: true })} reveal={s.assessment !== null} />
            {s.completed && <p className="predict-done">{t("Ders tamamlandı. İlerleme bu cihazda kaydedildi.")}</p>}
            <div className="btn-row">
              <button type="button" onClick={onExit}>{t("Öğrenme görünümüne dön")}</button>
              <button
                type="button"
                className="link"
                onClick={() => {
                  setHint(0);
                  const fresh = emptyPredictState();
                  setS(fresh);
                  onChange(fresh);
                }}
              >{t("Dersi baştan al")}</button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

function ChoiceBlock({ name, q, value, onPick, reveal }: { name: string; q: ChoiceQuestion; value: string | null; onPick: (id: string) => void; reveal: boolean }) {
  const picked = q.choices.find((c) => c.id === value);
  const correct = q.choices.find((c) => c.correct)!;
  return (
    <fieldset className="predict-choices">
      <legend>{t(q.question)}</legend>
      {q.choices.map((c) => (
        <label key={c.id} className={reveal && value === c.id ? (c.correct ? 'right' : 'wrong') : ''}>
          <input type="radio" name={name} checked={value === c.id} onChange={() => onPick(c.id)} /> {t(c.text)}
        </label>
      ))}
      {reveal && picked && (
        <div className="predict-feedback" aria-live="polite">
          <p>
            <strong>{t(picked.correct ? 'Doğru.' : 'Tam olarak değil.')}</strong> {t(picked.why)}
          </p>
          {!picked.correct && (
            <p>
              <strong>{t("Doğru seçenek:")}</strong> {t(correct.text)} {t(correct.why)}
            </p>
          )}
        </div>
      )}
    </fieldset>
  );
}

function PredictionFeedback({ lesson, s }: { lesson: PredictLesson; s: PredictState }) {
  if (s.skipped || !s.prediction) return <p className="predict-feedback">{t("Tahmin yapmadan açıklamaya geçtiniz.")}</p>;
  const picked = lesson.predict.choices.find((c) => c.id === s.prediction)!;
  const correct = lesson.predict.choices.find((c) => c.correct)!;
  return (
    <div className="predict-feedback">
      <p>
        <strong>{t("Tahmininiz:")}</strong> “{t(picked.text)}” — {t(picked.correct ? 'gözlemle uyumlu.' : 'gözlemle uyumlu değil.')}
      </p>
      <p>{t(picked.why)}</p>
      {!picked.correct && (
        <p>
          <strong>{t("Gözlenen:")}</strong> {t(correct.text)}
        </p>
      )}
    </div>
  );
}

function SourceList({ ids }: { ids: string[] }) {
  return (
    <ul className="predict-sources" aria-label={t("Kaynaklar")}>
      {ids.map((id) => {
        const src = getSource(id);
        return src ? (
          <li key={id}>
            <span className={`src-chip src-${src.kind}`}>{t(SOURCE_KIND_LABEL[src.kind])}</span> {t(formatSource(src))}
          </li>
        ) : null;
      })}
    </ul>
  );
}

const CW = 600;
const CH = 220;
const M = { l: 48, r: 14, t: 12, b: 34 };
/** Canlandırma süresi (simülasyon saniyesi); senaryo saati bu sürede ilerler. */
const PLAY_SECONDS = 10;

/** Kontrollü deney: temsili iyot/ksenon modelinin kapatma senaryosu, yalnız kullanıcı oynatınca ilerler. */
function Experiment({ lesson, done, onDone, onNext }: { lesson: PredictLesson; done: boolean; onDone: () => void; onNext: () => void }) {
  const { clock } = useSimulation();
  const ex = lesson.experiment;
  const sc = useMemo(() => buildScenario(ex.scenario!.lab, ex.scenario!.key), [ex.scenario!.lab, ex.scenario!.key]);
  const [playing, setPlaying] = useState(false);
  const [shownT, setShownT] = useState(done ? ex.hours : 0);
  const scenarioTime = useRef(done ? ex.hours : 0);
  const clipRef = useRef<SVGRectElement>(null);
  const curRef = useRef<SVGLineElement>(null);
  const acc = useRef(0);

  const yMax = 1.8;
  const sx = (h: number) => M.l + (h / ex.hours) * (CW - M.l - M.r);
  const sy = (v: number) => CH - M.b - (v / yMax) * (CH - M.t - M.b);
  const path = (arr: Float64Array) => {
    let d = '';
    for (let i = 0; i < sc.tr.t.length && sc.tr.t[i] <= ex.hours + 1e-9; i++) d += `${i ? 'L' : 'M'}${sx(sc.tr.t[i]).toFixed(1)} ${sy(arr[i]).toFixed(1)}`;
    return d;
  };
  const xe = useMemo(() => path(sc.tr.xenon), [sc]); // eslint-disable-line react-hooks/exhaustive-deps
  const io = useMemo(() => path(sc.tr.iodine), [sc]); // eslint-disable-line react-hooks/exhaustive-deps

  const paint = () => {
    const x = sx(scenarioTime.current);
    clipRef.current?.setAttribute('width', String(Math.max(0, x - M.l + 1)));
    curRef.current?.setAttribute('x1', String(x));
    curRef.current?.setAttribute('x2', String(x));
  };
  useTick((dt) => {
    if (!playing || dt <= 0) return paint();
    scenarioTime.current = Math.min(ex.hours, scenarioTime.current + (dt * ex.hours) / PLAY_SECONDS);
    paint();
    acc.current += dt;
    if (acc.current > 0.1 || scenarioTime.current >= ex.hours) {
      acc.current = 0;
      setShownT(scenarioTime.current);
    }
    if (scenarioTime.current >= ex.hours) {
      setPlaying(false);
      onDone();
    }
  });

  const idx = Math.min(sc.tr.t.length - 1, Math.round(shownT / sc.tr.sample));
  const play = () => {
    if (scenarioTime.current >= ex.hours) scenarioTime.current = 0;
    if (!clock.playing) clock.play();
    setPlaying(true);
  };

  return (
    <div className="predict-exp">
      <p className="predict-variable" role="note">
        <strong>{t("Değiştirilen değişken:")}</strong> {t(ex.variable)} {t(ex.from)} → {t(ex.to)}{t(". Diğer her şey sabit; yalnız zaman ilerliyor.")}</p>
      <figure className="predict-chart">
        <figcaption>{t("Temsili model: normalize Xe-135 ve I-135 (%100 denge = 1)")}</figcaption>
        <svg viewBox={`0 0 ${CW} ${CH}`} role="img" aria-label={`Kapatma sonrası ${ex.hours} saat: ksenon ve iyot. Şu an ${shownT.toFixed(1)} saat, ksenon ${sc.tr.xenon[idx].toFixed(2)}.`}>
          <defs>
            <clipPath id="predict-clip">
              <rect ref={clipRef} x={M.l} y={0} width={0} height={CH} />
            </clipPath>
          </defs>
          {[0, 0.5, 1, 1.5].map((v) => (
            <g key={v}>
              <line className="ops-grid" x1={M.l} x2={CW - M.r} y1={sy(v)} y2={sy(v)} />
              <text className="ops-tick" x={M.l - 6} y={sy(v) + 4} textAnchor="end">
                {t(v.toLocaleString('tr-TR'))}
              </text>
            </g>
          ))}
          {[0, 8, 16, 24, 32, 40, 48].map((h) => (
            <text key={h} className="ops-tick" x={sx(h)} y={CH - M.b + 16} textAnchor="middle">
              {t(h)}
            </text>
          ))}
          <text className="ops-axis-label" x={(M.l + CW - M.r) / 2} y={CH - 4} textAnchor="middle">{t("Kapatmadan sonra geçen süre (sa)")}</text>
          <line className="ops-axis" x1={M.l} x2={M.l} y1={M.t} y2={CH - M.b} />
          <line className="ops-axis" x1={M.l} x2={CW - M.r} y1={CH - M.b} y2={CH - M.b} />
          <g clipPath="url(#predict-clip)">
            <path className="ops-line iodine" d={io} />
            <path className="ops-line xenon" d={xe} />
          </g>
          <line ref={curRef} className="ops-cursor" x1={M.l} x2={M.l} y1={M.t} y2={CH - M.b} />
        </svg>
      </figure>
      <ul className="ops-legend">
        <li>
          <svg width="40" height="12" aria-hidden="true">
            <line x1="2" x2="38" y1="6" y2="6" className="ops-line xenon" />
          </svg>{t("Xe-135 (temsili model)")}</li>
        <li>
          <svg width="40" height="12" aria-hidden="true">
            <line x1="2" x2="38" y1="6" y2="6" className="ops-line iodine" />
          </svg>{t("I-135 (temsili model)")}</li>
      </ul>
      <p className="predict-readout" aria-live="off">{t("Senaryo saati: ")}<strong>{t(shownT.toLocaleString('tr-TR', { maximumFractionDigits: 1, minimumFractionDigits: 1 }))}{t(" sa")}</strong>{t(" · Fisyon gücü: ")}<strong>%0</strong>{t(" · Xe-135:")}{t(' ')}
        <strong>{t(sc.tr.xenon[idx].toLocaleString('tr-TR', { maximumFractionDigits: 2, minimumFractionDigits: 2 }))}</strong>
      </p>
      <p className="ops-small">{t(ex.note)}</p>
      <div className="btn-row">
        <button type="button" className="primary" onClick={playing ? () => setPlaying(false) : play} aria-pressed={playing}>
          {t(playing ? '❚❚ Duraklat' : shownT > 0 && shownT < ex.hours ? '▶ Devam et' : shownT >= ex.hours ? '↺ Yeniden oynat' : '▶ Kapatmayı başlat')}
        </button>
        <button
          type="button"
          onClick={() => {
            scenarioTime.current = ex.hours;
            setShownT(ex.hours);
            setPlaying(false);
            paint();
            onDone();
          }}
        >{t("Sona atla")}</button>
        <button type="button" disabled={!done} onClick={onNext}>{t("Gözleme geç")}</button>
      </div>
    </div>
  );
}
