import type { DetailProps } from '../shared/types';
import { Label } from '../shared/SceneContext';
import { Flow } from '../shared/flow/Flow';
import { Bubbles, HeatPulse } from '../shared/equipment/animated';
import { PwrCoreDetail } from './PwrCoreDetail';

function SgCloseUp({ showFlow }: { showFlow: boolean }) {
  const tubes = [0, 8, 16, 24, 32];
  return (
    <svg viewBox="0 0 640 440" className="detail-svg" role="img" aria-label="Dikey U borulu buhar üreteci kesiti">
      <path className="sg-shell" d="M170 360 V170 L140 130 V60 A90 40 0 0 1 320 60 V130 L290 170 V360 Z" />
      <path className="secondary-water" d="M174 358 V172 L160 150 H300 L286 172 V358 Z" />
      <line className="level" x1="156" x2="304" y1="148" y2="148" />
      {/* Sargı (wrapper) — ikincil su aşağı iner, demet boyunca yukarı çıkar */}
      <line className="barrel" x1="186" y1="175" x2="186" y2="340" />
      <line className="barrel" x1="274" y1="175" x2="274" y2="340" />
      {[175, 230, 285].map((x) => (
        <rect key={x} className="separator" x={x - 13} y="92" width="26" height="46" rx="4" />
      ))}
      <path className="dryer" d="M150 58 l14 12 l14 -12 l14 12 l14 -12 l14 12 l14 -12 l14 12 l14 -12 l14 12 l14 -12 l14 12 l14 -12" />
      <rect className="tubesheet" x="166" y="358" width="128" height="14" />
      <path className="channel-head" d="M170 372 A60 50 0 0 0 290 372 Z" />
      <line className="divider" x1="230" y1="372" x2="230" y2="420" />
      <HeatPulse>
        {tubes.map((k) => (
          <path key={k} className="u-tube-glow" d={`M${196 + k} 358 V${215 + k} A${34 - k} ${34 - k} 0 0 1 ${264 - k} ${215 + k} V358`} />
        ))}
      </HeatPulse>
      {tubes.map((k) => (
        <path key={k} className="u-tube" d={`M${196 + k} 358 V${215 + k} A${34 - k} ${34 - k} 0 0 1 ${264 - k} ${215 + k} V358`} />
      ))}
      <Bubbles x={190} y={160} w={80} h={190} count={22} showFlow={showFlow} />
      <Flow id="d-tube" d="M196 412 V215 A34 34 0 0 1 264 215 V412" kind="grad" pipe={0} speed={50} spacing={18} scale="constant" showFlow={showFlow} r={3} />
      <Flow id="d-steam" d="M230 140 V12" kind="steam" pipe={0} speed={35} spacing={22} showFlow={showFlow} r={3.4} />
      <Flow id="d-feed" d="M330 150 H296 Q290 150 290 160 V178 Q290 186 282 190 H280 V330" kind="feed" pipe={0} speed={30} spacing={20} showFlow={showFlow} r={2.6} />
      <Flow id="d-in" d="M100 420 Q160 420 200 405" kind="hot" pipe={10} speed={50} spacing={20} scale="constant" showFlow={showFlow} />
      <Flow id="d-out" d="M260 405 Q300 420 360 420" kind="cold" pipe={10} speed={50} spacing={20} scale="constant" showFlow={showFlow} />
      <g className="labels">
        <Label x={230} y={22} tx={360} ty={6} text="Kuru doymuş buhar çıkışı → türbin" />
        <Label x={300} y={64} tx={360} ty={44} text="Kurutucular (nem tutucu)" />
        <Label x={298} y={112} tx={360} ty={88} text="Siklon tipi nem ayırıcılar" />
        <Label x={318} y={150} tx={360} ty={132} text="Besleme suyu girişi" sub="ikincil su sargı dışından aşağı iner" />
        <Label x={262} y={250} tx={360} ty={200} text="U boru demeti (Inconel)" sub="birincil su boruların İÇİNDE" />
        <Label x={276} y={300} tx={360} ty={252} text="Kaynama boruların DIŞINDA" sub="ikincil tarafta" />
        <Label x={292} y={365} tx={360} ty={312} text="Boru levhası" />
        <Label x={230} y={400} tx={360} ty={346} text="Bölme plakası" sub="giriş (sıcak) / çıkış (soğuk) başlığı" />
        <Label x={110} y={420} tx={20} ty={380} text="Sıcak kol" />
      </g>
      <text x="20" y="436" className="detail-note">
        Temsili kesit · ölçeksiz. Isı boru duvarından geçer; akışkanlar karışmaz.
      </text>
    </svg>
  );
}

function PressurizerCloseUp({ showFlow }: { showFlow: boolean }) {
  return (
    <svg viewBox="0 0 640 440" className="detail-svg" role="img" aria-label="Basınçlandırıcı kesiti">
      <rect className="vessel-wall" x="180" y="40" width="110" height="330" rx="55" />
      <path className="pzr-steam" d="M186 210 V95 A49 49 0 0 1 284 95 V210 Z" />
      <path className="pzr-water" d="M186 210 H284 V315 A49 49 0 0 1 186 315 Z" />
      <line className="level" x1="186" x2="284" y1="210" y2="210" />
      <Bubbles x={196} y={214} w={78} h={120} count={12} showFlow={showFlow} speed={22} />
      {[0, 1, 2, 3].map((i) => (
        <path key={i} className="heater" d={`M${204 + i * 20} 352 V300`} strokeWidth={4} />
      ))}
      <path className="spray" d="M235 44 V70 M215 82 l20 -12 l20 12" />
      <Flow id="d-spray" d="M235 74 V150" kind="cold" pipe={0} speed={30} spacing={16} scale="constant" showFlow={showFlow} r={2} />
      <path className="pipe-wall" d="M235 370 V410 H120" strokeWidth={13} fill="none" />
      <path className="pipe-fluid fluid-hot" d="M235 370 V410 H120" strokeWidth={8} fill="none" />
      <path className="pipe-wall" d="M320 44 H360 V400" strokeWidth={9} fill="none" />
      <path className="pipe-fluid fluid-cold" d="M320 44 H360 V400" strokeWidth={5} fill="none" />
      <path className="pipe-wall" d="M290 44 H320" strokeWidth={9} />
      <rect className="valve" x="262" y="10" width="20" height="16" />
      <line className="drive-line" x1="272" y1="26" x2="272" y2="44" />
      <g className="labels">
        <Label x={260} y={130} tx={380} ty={90} text="Buhar yastığı (~%40)" />
        <Label x={270} y={260} tx={380} ty={170} text="Doymuş su (~%60)" />
        <Label x={244} y={320} tx={380} ty={230} text="Elektrikli ısıtıcılar" sub="basınç düşerse: su buharlaşır → basınç ↑" />
        <Label x={240} y={70} tx={380} ty={30} text="Püskürtme (soğuk koldan)" sub="basınç artarsa: buhar yoğuşur → basınç ↓" />
        <Label x={160} y={410} tx={20} ty={360} text="Surge hattı → sıcak kol" />
        <Label x={272} y={18} tx={60} ty={6} text="Emniyet/tahliye vanası" />
      </g>
      <text x="20" y="434" className="detail-note">
        Değerler ders notlarındaki tipik oranlardır; temsili kesit.
      </text>
    </svg>
  );
}

export function PwrDetails({ detailKey, showFlow }: DetailProps) {
  if (detailKey === 'sg') return <SgCloseUp showFlow={showFlow} />;
  if (detailKey === 'pressurizer') return <PressurizerCloseUp showFlow={showFlow} />;
  return <PwrCoreDetail showFlow={showFlow} />;
}
