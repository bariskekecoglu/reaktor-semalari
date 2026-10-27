import type { DetailProps } from '../shared/types';
import { Label } from '../shared/SceneContext';
import { Flow } from '../shared/flow/Flow';
import { BwrCoreDetail } from './BwrCoreDetail';

/** Siklon ayırıcı + şevron kurutucu yakın planı. */
function SeparatorCloseUp({ showFlow }: { showFlow: boolean }) {
  return (
    <svg viewBox="0 0 640 430" className="detail-svg" role="img" aria-label="BWR buhar ayırıcı ve kurutucu kesiti">
      <rect x="60" y="20" width="280" height="390" className="steam-zone" />
      <rect x="60" y="250" width="280" height="160" className="water-zone" />
      <line className="level" x1="60" x2="340" y1="250" y2="250" />
      {/* Kurutucu paneli */}
      <rect x="90" y="50" width="220" height="64" fill="none" className="barrel" />
      {[0, 1, 2].map((r) => (
        <path key={r} className="dryer" d={`M96 ${64 + r * 18} ${'l16 8 l16 -8 '.repeat(6)}`} />
      ))}
      {/* Ayırıcı */}
      <rect x="160" y="160" width="80" height="170" rx="10" className="separator" fillOpacity={0.55} />
      {[0, 1, 2, 3].map((i) => (
        <path key={i} className="barrel" d={`M168 ${290 - i * 30} l64 18`} />
      ))}
      <rect x="185" y="330" width="30" height="80" className="separator" />
      <Flow id="d-mix" d="M200 410 V300 L170 285 L230 265 L170 245 L230 225 L200 205" kind="mix" pipe={0} speed={40} spacing={14} showFlow={showFlow} r={3} />
      <Flow id="d-wl" d="M164 230 Q120 236 110 270 V400" kind="cold" pipe={0} speed={30} spacing={18} showFlow={showFlow} r={2.8} />
      <Flow id="d-wr" d="M236 230 Q280 236 290 270 V400" kind="cold" pipe={0} speed={30} spacing={18} showFlow={showFlow} r={2.8} />
      <Flow id="d-steam" d="M200 200 V20" kind="steam" pipe={0} speed={40} spacing={20} showFlow={showFlow} r={3.4} />
      <Flow id="d-drain" d="M300 115 V246" kind="feed" pipe={0} speed={22} spacing={12} showFlow={showFlow} r={2} />
      <Flow id="d-drain2" d="M100 115 V246" kind="feed" pipe={0} speed={22} spacing={12} showFlow={showFlow} r={2} />
      <g className="labels">
        <Label x={200} y={30} tx={370} ty={10} text="Kuru buhar → buhar kubbesi → türbin" />
        <Label x={310} y={82} tx={370} ty={66} text="Şevron kurutucu panelleri" sub="damlacıklar yüzeyde tutulur" />
        <Label x={300} y={180} tx={370} ty={140} text="Toplanan nem aşağı süzülür" />
        <Label x={232} y={240} tx={370} ty={200} text="Siklon ayırıcı" sub="dönen akış suyu dışa atar" />
        <Label x={290} y={320} tx={370} ty={262} text="Ayrılan su → downcomer" />
        <Label x={215} y={380} tx={370} ty={330} text="Dikey boru (standpipe)" sub="çekirdekten gelen su-buhar karışımı" />
      </g>
      <text x="20" y="426" className="detail-note">
        Temsili kesit · ölçeksiz. Ayırıcı ve kurutucu sayısı/biçimi tasarıma göre değişir.
      </text>
    </svg>
  );
}

/** Kap içindeki sıvı, karışım ve buhar bölgeleri. */
function ZonesCloseUp({ showFlow }: { showFlow: boolean }) {
  return (
    <svg viewBox="0 0 640 440" className="detail-svg" role="img" aria-label="BWR kabı içindeki bölgeler">
      <path className="vessel-wall thick" d="M120 60 V370 A100 40 0 0 0 320 370 V60 A100 40 0 0 0 120 60 Z" />
      <rect className="steam-zone" x="126" y="40" width="188" height="120" />
      <path className="water-zone" d="M126 160 H314 V370 A94 34 0 0 1 126 370 Z" />
      <rect className="mix-zone" x="150" y="170" width="140" height="160" />
      <line className="level" x1="126" x2="314" y1="160" y2="160" />
      <rect x="140" y="70" width="160" height="34" fill="none" className="barrel" />
      {[170, 220, 270].map((x) => (
        <rect key={x} x={x - 12} y="120" width="24" height="56" className="separator" />
      ))}
      <rect x="160" y="250" width="120" height="80" className="core-zone" opacity={0.7} />
      <line className="shroud" x1="150" x2="150" y1="180" y2="345" />
      <line className="shroud" x1="290" x2="290" y1="180" y2="345" />
      <Flow id="z-c1" d="M190 370 V130" kind="mix" pipe={0} speed={40} spacing={16} showFlow={showFlow} r={3} />
      <Flow id="z-c2" d="M250 370 V130" kind="mix" pipe={0} speed={40} spacing={16} showFlow={showFlow} r={3} />
      <Flow id="z-s" d="M220 118 V30" kind="steam" pipe={0} speed={40} spacing={18} showFlow={showFlow} r={3} />
      <Flow id="z-dl" d="M160 170 Q138 172 137 200 V350 Q137 385 190 385 H218" kind="cold" pipe={0} speed={36} spacing={18} showFlow={showFlow} r={2.8} />
      <Flow id="z-dr" d="M280 170 Q302 172 303 200 V350 Q303 385 250 385 H222" kind="cold" pipe={0} speed={36} spacing={18} showFlow={showFlow} r={2.8} />
      <g className="labels">
        <Label x={260} y={50} tx={360} ty={20} text="BUHAR: buhar kubbesi" sub="kurutulmuş, türbine gider" />
        <Label x={296} y={86} tx={360} ty={74} text="Kurutucular" />
        <Label x={282} y={140} tx={360} ty={116} text="Ayırıcılar" sub="karışım burada ayrışır" />
        <Label x={314} y={160} tx={360} ty={162} text="Su seviyesi" />
        <Label x={286} y={210} tx={360} ty={200} text="KARIŞIM: çekirdek üstü" sub="kabarcık oranı yüksek" />
        <Label x={280} y={300} tx={360} ty={254} text="Çekirdek: kaynama başlar" sub="alt kısımda sıvı, yukarı doğru buhar artar" />
        <Label x={304} y={330} tx={360} ty={312} text="SIVI: downcomer" sub="ayrılan su + besleme suyu" />
        <Label x={260} y={392} tx={360} ty={366} text="SIVI: alt plenum" />
      </g>
      <text x="20" y="436" className="detail-note">
        Bölge sınırları temsilidir; gerçek boşluk oranı dağılımı işletme koşuluna göre değişir.
      </text>
    </svg>
  );
}

export function BwrDetails({ detailKey, showFlow }: DetailProps) {
  if (detailKey === 'separator') return <SeparatorCloseUp showFlow={showFlow} />;
  if (detailKey === 'zones') return <ZonesCloseUp showFlow={showFlow} />;
  return <BwrCoreDetail showFlow={showFlow} />;
}
