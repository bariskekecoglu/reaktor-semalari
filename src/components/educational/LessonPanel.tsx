import { t } from '../../i18n/locale';
import { useEffect, useRef } from 'react';
import type { LessonStep } from '../../reactors/shared/types';

interface Props {
  lessons: LessonStep[];
  step: number;
  reactorName: string;
  onStep: (s: number) => void;
  onExit: () => void;
}

export function LessonPanel({ lessons, step, reactorName, onStep, onExit }: Props) {
  const lesson = lessons[step];
  const headRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    headRef.current?.focus();
  }, [step]);
  if (!lesson) return null;
  return (
    <div className="side-panel lesson">
      <p className="eyebrow">
        {t(reactorName)}{t(" · adım adım anlatım · ")}{t(step + 1)}/{t(lessons.length)}
      </p>
      <ol className="steps" aria-label={t("Ders adımları")}>
        {lessons.map((l, i) => (
          <li key={l.title}>
            <button type="button" className={i === step ? 'on' : i < step ? 'done' : ''} aria-current={i === step ? 'step' : undefined} onClick={() => onStep(i)} title={l.title}>
              {t(i + 1)}
            </button>
          </li>
        ))}
      </ol>
      <h3 ref={headRef} tabIndex={-1}>
        {t(lesson.title)}
      </h3>
      <p>{t(lesson.text)}</p>
      <p className="hint">{t("İlgili bölümler şemada kesikli çerçeve ve kalın çizgiyle vurgulanır; diğerleri soluklaşır.")}</p>
      <div className="btn-row">
        <button type="button" onClick={() => onStep(step - 1)} disabled={step === 0}>{t("← Önceki")}</button>
        <button type="button" className="primary" onClick={() => onStep(step + 1)} disabled={step === lessons.length - 1}>{t("Sonraki →")}</button>
      </div>
      <button type="button" className="link" onClick={onExit}>{t("Şema görünümüne dön")}</button>
    </div>
  );
}
