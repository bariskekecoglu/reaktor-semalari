import { useState } from 'react';
import type { ReactorId } from '../reactors/shared/types';
import { reactors } from '../reactors/registry';
import { REACTOR_IDS, REACTOR_NAME, tourReactor } from '../reactors/meta';
import { PREDICT_LESSONS } from '../lessons/predict/pwrXenonShutdown';
import { STEP_LABEL, type PredictStepId } from '../lessons/predict/types';
import type { Progress } from './progressStore';
import { STAGES } from '../reactors/rbmk/chernobyl/stages';

const NAME = REACTOR_NAME;

interface Props {
  progress: Progress;
  persistent: boolean;
  onResume: () => void;
  onOpenTour: (r: ReactorId) => void;
  onOpenPredict: (lessonId: string) => void;
  onOpenChernobyl?: () => void;
  onReset: () => void;
}

/** “Kaldığım yer” metni (ör. “PWR anlatımı · 3. Buhar üreteci”). */
export function describeLast(p: Progress): string | null {
  if (!p.last) return null;
  if (p.last.lessonId === 'rbmk.chernobyl') return `Çernobil kaza analizi · ${STAGES.find(s => s.id === p.last!.stepId)?.title ?? ''}`;
  const r = tourReactor(p.last.lessonId);
  if (r) {
    const step = reactors[r].lessons.find((l) => l.id === p.last!.stepId);
    return `${NAME[r]} anlatımı · ${step?.title ?? ''}`;
  }
  const l = PREDICT_LESSONS.find((x) => x.id === p.last!.lessonId);
  return l ? `Tahmin dersi · ${l.title} · ${STEP_LABEL[p.last.stepId as PredictStepId] ?? ''}` : null;
}

export function ProgressPanel({ progress, persistent, onResume, onOpenTour, onOpenPredict, onOpenChernobyl, onReset }: Props) {
  const [confirm, setConfirm] = useState(false);
  const total = REACTOR_IDS.length + PREDICT_LESSONS.length + 1;
  const last = describeLast(progress);
  return (
    <section className="progress-panel" aria-labelledby="progress-title">
      <div className="progress-head">
        <h2 id="progress-title">Öğrenme ilerlemem</h2>
        <span className="progress-count">
          {progress.completed.length}/{total} ders tamamlandı
        </span>
      </div>
      {last ? (
        <p className="progress-resume">
          <span>Kaldığınız yer: {last}</span>
          <button type="button" className="primary" onClick={onResume}>
            Kaldığım yerden devam et
          </button>
        </p>
      ) : (
        <p className="progress-resume">Henüz kayıtlı ilerleme yok. Bir derse başlayınca burada görünür.</p>
      )}
      <details>
        <summary>Ayrıntılar</summary>
        <ul className="progress-list">
          <li><span><strong>Çernobil kaza analizi</strong> — {progress.completed.includes('rbmk.chernobyl') ? 'tamamlandı ✓' : progress.chernobyl ? STAGES.find(s => s.id === progress.chernobyl)?.title : 'başlanmadı'}</span>{onOpenChernobyl && <button type="button" onClick={onOpenChernobyl}>Aç / devam et</button>}</li>
          {(Object.keys(reactors) as ReactorId[]).map((r) => {
            const steps = reactors[r].lessons;
            const at = steps.findIndex((s) => s.id === progress.tourSteps[r]);
            const done = progress.completed.includes(`${r}.tour`);
            return (
              <li key={r}>
                <span>
                  <strong>{NAME[r]} anlatımı</strong> — {done ? 'tamamlandı ✓' : at >= 0 ? `${at + 1}/${steps.length}. adım` : 'başlanmadı'}
                </span>
                <button type="button" onClick={() => onOpenTour(r)}>
                  Aç
                </button>
              </li>
            );
          })}
          {PREDICT_LESSONS.map((l) => {
            const rec = progress.predictions[l.id];
            const choice = rec?.prediction ? l.predict.choices.find((c) => c.id === rec.prediction) : null;
            const status = !rec
              ? 'başlanmadı'
              : rec.completed
                ? 'tamamlandı ✓'
                : `${STEP_LABEL[rec.step as PredictStepId] ?? ''} adımında`;
            return (
              <li key={l.id}>
                <span>
                  <strong>Tahmin dersi: {l.title}</strong> — {status}
                  {rec && (
                    <>
                      <br />
                      <small>
                        Tahmin: {rec.skipped && !choice ? 'atlandı' : choice ? `${choice.text} (${choice.correct ? 'doğru' : 'gözlemle uyumsuz'})` : 'henüz yok'}
                      </small>
                    </>
                  )}
                </span>
                <button type="button" onClick={() => onOpenPredict(l.id)}>
                  Aç
                </button>
              </li>
            );
          })}
        </ul>
        <p className="progress-note">
          {persistent
            ? 'İlerleme yalnız bu cihaz ve tarayıcıda saklanır; hesap yoktur, başka cihaza aktarılmaz. Sohbetler ve serbest metin kaydedilmez.'
            : 'Bu tarayıcıda depolama kullanılamıyor; ilerleme yalnız bu oturum boyunca bellekte tutulur.'}
        </p>
        <div className="btn-row">
          {confirm ? (
            <>
              <button
                type="button"
                className="danger"
                onClick={() => {
                  onReset();
                  setConfirm(false);
                }}
              >
                Evet, ilerlemeyi sıfırla
              </button>
              <button type="button" onClick={() => setConfirm(false)}>
                Vazgeç
              </button>
            </>
          ) : (
            <button type="button" onClick={() => setConfirm(true)} disabled={!progress.last && progress.completed.length === 0}>
              İlerlemeyi sıfırla
            </button>
          )}
        </div>
        <p className="progress-note">Sıfırlama yalnız öğrenme ilerlemesini siler; görünüm tercihiniz (Otomatik/Mobil/Masaüstü) korunur.</p>
      </details>
    </section>
  );
}
