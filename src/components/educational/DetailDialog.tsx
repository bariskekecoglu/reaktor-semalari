import { useId, useLayoutEffect, useRef, type KeyboardEvent, type ReactNode } from 'react';

interface Props {
  title: string;
  onClose: () => void;
  children: ReactNode;
}

const FOCUSABLE = 'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** Açan kontrol artık sayfada değilse odağın döneceği güvenli yer. */
function fallbackFocusTarget(): HTMLElement | null {
  return document.querySelector<HTMLElement>('.side-panel button, .viewport-toolbar button, main button');
}

/**
 * Yakın plan penceresi: yerel <dialog> + showModal().
 * Tarayıcı arka planı inert yapar (fare/klavye kapalı); ayrıca Tab/Shift+Tab pencere içinde döndürülür.
 * Escape ve Kapat düğmesi pencereyi kapatır; kapanınca odak açan kontrole (yoksa güvenli bir yere) döner.
 * Açılış/kapanış efekti yalnız bağlanma/ayrılmada çalışır: üst bileşenin yeniden render edilmesi odağı geri çekmez.
 */
export function DetailDialog({ title, onClose, children }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  const titleId = useId();

  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;

    // Arka plan kaydırmasını, mevcut kaydırma konumunu koruyarak kilitle.
    const root = document.documentElement;
    const prevOverflow = root.style.overflow;
    root.style.overflow = 'hidden';

    if (!dialog.open) dialog.showModal();
    closeRef.current?.focus();

    // Escape: tarayıcının kendi kapatmasını engelle, kapanışı React durumu yönetsin.
    const onCancel = (e: Event) => {
      e.preventDefault();
      onCloseRef.current();
    };
    dialog.addEventListener('cancel', onCancel);

    return () => {
      dialog.removeEventListener('cancel', onCancel);
      if (dialog.open) dialog.close();
      root.style.overflow = prevOverflow;
      const target = opener && opener.isConnected ? opener : fallbackFocusTarget();
      target?.focus({ preventScroll: true });
    };
  }, []);

  // Odak tuzağı: Tab ve Shift+Tab pencere içindeki kontroller arasında döner.
  const onKeyDown = (e: KeyboardEvent<HTMLDialogElement>) => {
    if (e.key !== 'Tab') return;
    const dialog = dialogRef.current;
    if (!dialog) return;
    const items = Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((el) => el.offsetParent !== null || el === document.activeElement);
    if (items.length === 0) {
      e.preventDefault();
      return;
    }
    const first = items[0];
    const last = items[items.length - 1];
    const active = document.activeElement;
    if (e.shiftKey && (active === first || !dialog.contains(active))) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && (active === last || !dialog.contains(active))) {
      e.preventDefault();
      first.focus();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      className="detail-dialog"
      aria-labelledby={titleId}
      onKeyDown={onKeyDown}
      onClick={(e) => {
        // Arka plana (backdrop) tıklama pencereyi kapatır.
        if (e.target === dialogRef.current) onCloseRef.current();
      }}
    >
      <div className="detail-box">
        <div className="detail-head">
          <h3 id={titleId}>{title}</h3>
          <button ref={closeRef} type="button" onClick={() => onCloseRef.current()}>
            Kapat ✕
          </button>
        </div>
        <div className="detail-body">{children}</div>
      </div>
    </dialog>
  );
}
