import { t } from '../../i18n/locale';

/** Sayfa altındaki tanıtım videosu kartı; karekod aynı videoyu telefonda açar (dar ekranda gizli). */
export function IntroVideoCard() {
  return (
    <aside className="intro-video" aria-label={t("Tanıtım videosu")}>
      <a className="intro-video-link" href="./tanitim/">
        <span className="intro-video-play" aria-hidden="true">▶</span>
        <span>
          <strong>{t("Tanıtım videosu")}</strong>
          <span className="intro-video-meta">{t("5 dk 54 sn · Türkçe seslendirme · altyazılı")}</span>
        </span>
      </a>
      <img className="intro-video-qr" src="./tanitim/qr.svg" width={88} height={88} alt={t("Telefonda izlemek için karekod")} />
      <p className="intro-video-hint">{t("Telefonda izlemek için karekodu okutun.")}</p>
    </aside>
  );
}
