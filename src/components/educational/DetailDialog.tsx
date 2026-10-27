import { useEffect, useRef, type ReactNode } from 'react';

interface Props {
  title: string;
  onClose: () => void;
  children: ReactNode;
}

/** Şema alanının üzerinde açılan yakın plan penceresi. Esc ile kapanır, odak geri döner. */
export function DetailDialog({ title, onClose, children }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      prev?.focus?.();
    };
  }, [onClose]);
  return (
    <div className="detail-overlay" role="dialog" aria-modal="true" aria-label={title}>
      <div className="detail-box">
        <div className="detail-head">
          <h3>{title}</h3>
          <button ref={closeRef} type="button" onClick={onClose}>
            Kapat ✕
          </button>
        </div>
        <div className="detail-body">{children}</div>
      </div>
    </div>
  );
}
