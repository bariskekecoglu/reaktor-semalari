import { useEffect, useState } from 'react';
import { t } from '../i18n/locale';

interface InstallEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PwaControls() {
  const [install, setInstall] = useState<InstallEvent | null>(null);
  const [offline, setOffline] = useState(!navigator.onLine);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const offer = (e: Event) => { e.preventDefault(); setInstall(e as InstallEvent); };
    const installed = () => setInstall(null);
    const status = () => setOffline(!navigator.onLine);
    window.addEventListener('beforeinstallprompt', offer);
    window.addEventListener('appinstalled', installed);
    window.addEventListener('online', status);
    window.addEventListener('offline', status);
    let active = true;
    if (import.meta.env.PROD && 'serviceWorker' in navigator) {
      navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`).then(() => navigator.serviceWorker.ready).then(() => { if (active) setReady(true); }).catch(() => { if (active) setFailed(true); });
    }
    return () => {
      active = false;
      window.removeEventListener('beforeinstallprompt', offer);
      window.removeEventListener('appinstalled', installed);
      window.removeEventListener('online', status);
      window.removeEventListener('offline', status);
    };
  }, []);
  return <span className="pwa-controls">
    {install && <button type="button" onClick={async () => { try { await install.prompt(); await install.userChoice; } finally { setInstall(null); } }}>{t('Uygulamayı yükle')}</button>}
    <span role="status">{failed ? t('Çevrimdışı hazırlık başarısız; bağlantınızı kontrol edip sayfayı yenileyin.') : offline ? t('Çevrimdışı') : ready ? t('Çevrimdışı kullanıma hazır') : ''}</span>
  </span>;
}
