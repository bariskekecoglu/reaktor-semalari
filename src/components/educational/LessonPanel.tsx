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
        {reactorName} · adım adım anlatım · {step + 1}/{lessons.length}
      </p>
      <ol className="steps" aria-label="Ders adımları">
        {lessons.map((l, i) => (
          <li key={l.title}>
            <button type="button" className={i === step ? 'on' : i < step ? 'done' : ''} aria-current={i === step ? 'step' : undefined} onClick={() => onStep(i)} title={l.title}>
              {i + 1}
            </button>
          </li>
        ))}
      </ol>
      <h3 ref={headRef} tabIndex={-1}>
        {lesson.title}
      </h3>
      <p>{lesson.text}</p>
      <p className="hint">İlgili bölümler şemada kesikli çerçeve ve kalın çizgiyle vurgulanır; diğerleri soluklaşır.</p>
      <div className="btn-row">
        <button type="button" onClick={() => onStep(step - 1)} disabled={step === 0}>
          ← Önceki
        </button>
        <button type="button" className="primary" onClick={() => onStep(step + 1)} disabled={step === lessons.length - 1}>
          Sonraki →
        </button>
      </div>
      <button type="button" className="link" onClick={onExit}>
        Şema görünümüne dön
      </button>
    </div>
  );
}
