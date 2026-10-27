import type { DetailProps } from '../shared/types';
import { Label } from '../shared/SceneContext';
import { Flow } from '../shared/flow/Flow';
import { Bubbles, HeatPulse } from '../shared/equipment/animated';
import { VverCoreDetail } from './VverCoreDetail';

const SHELL = 'M120 120 H520 A90 90 0 0 1 520 300 H120 A90 90 0 0 1 120 120 Z';

function HsgCloseUp({ showFlow }: { showFlow: boolean }) {
  const rows = [216, 228, 240, 252, 264, 276];
  return (
    <svg viewBox="0 0 640 430" className="detail-svg" role="img" aria-label="Yatay buhar üreteci kesiti">
      <defs>
        <clipPath id="hsg-clip">
          <path d={SHELL} />
        </clipPath>
      </defs>
      <path className="sg-shell" d={SHELL} />
      <g clipPath="url(#hsg-clip)">
        <rect className="secondary-water" x="20" y="196" width="600" height="110" />
      </g>
      <line className="level" x1="40" x2="600" y1="196" y2="196" />
      <path className="dryer" d={`M70 150 ${'l12 9 l12 -9 '.repeat(20)}`} />
      <HeatPulse>
        <path className="u-tube-glow" d="M70 216 H570 M70 276 H570" />
      </HeatPulse>
      {rows.map((y, i) =>
        i % 2 === 0 ? (
          <g key={y}>
            <path className="h-tube" d={`M260 ${y} H70 A6 6 0 0 0 70 ${y + 12} H260`} />
            <path className="h-tube" d={`M380 ${y} H570 A6 6 0 0 1 570 ${y + 12} H380`} />
          </g>
        ) : null,
      )}
      <line className="pipe-wall" x1="330" y1="204" x2="600" y2="204" strokeWidth={5} />
      <Bubbles x={60} y={198} w={520} h={100} count={34} showFlow={showFlow} speed={20} />
      <Flow id="h-left" d="M270 360 V216 H70 A30 30 0 0 0 70 276 H370 V360" kind="grad" pipe={0} speed={45} spacing={18} scale="constant" showFlow={showFlow} r={3} />
      <Flow id="h-right" d="M270 360 V228 H570 A24 24 0 0 1 570 276 H370 V360" kind="grad" pipe={0} speed={45} spacing={18} scale="constant" showFlow={showFlow} r={3} />
      <rect className="collector" x="252" y="140" width="36" height="226" rx="6" />
      <rect className="collector cold" x="352" y="140" width="36" height="226" rx="6" />
      <Flow id="h-feed" d="M620 204 H340" kind="feed" pipe={0} speed={30} spacing={18} showFlow={showFlow} r={2.4} />
      {[180, 320, 460].map((x) => (
        <g key={x}>
          <rect className="nozzle steam" x={x - 10} y="100" width="20" height="24" />
          <Flow id={`h-s-${x}`} d={`M${x} 190 V40`} kind="steam" pipe={0} speed={30} spacing={20} showFlow={showFlow} r={3} />
        </g>
      ))}
      <Flow id="h-in" d="M150 410 H262 Q270 410 270 396 V366" kind="hot" pipe={12} speed={45} spacing={20} scale="constant" showFlow={showFlow} />
      <Flow id="h-out" d="M370 366 V396 Q370 410 378 410 H490" kind="cold" pipe={12} speed={45} spacing={20} scale="constant" showFlow={showFlow} />
      <g className="labels">
        <Label x={460} y={50} tx={632} ty={22} text="Buhar çıkış nozulları" anchor="end" />
        <Label x={510} y={154} tx={632} ty={62} text="Panjur tipi nem ayırıcı" anchor="end" />
        <Label x={596} y={196} tx={560} ty={322} text="Su seviyesi" anchor="start" />
        <Label x={590} y={204} tx={500} ty={350} text="Besleme dağıtıcısı" />
        <Label x={100} y={252} tx={20} ty={330} text="Yatay U boruları" sub="birincil su İÇİNDE" />
        <Label x={200} y={200} tx={20} ty={66} text="Gövde tarafı: ikincil su kaynar" sub="gövde geniş bir buhar tamburu gibi" />
        <Label x={260} y={150} tx={180} ty={8} text="Sıcak kolektör" />
        <Label x={378} y={150} tx={300} ty={8} text="Soğuk kolektör" anchor="start" />
      </g>
      <text x="20" y="428" className="detail-note">
        Temsili kesit · ölçeksiz. Gerçek boru düzeni plan görünüşte iki demet hâlindedir; burada sadeleştirildi.
      </text>
    </svg>
  );
}

/** Dikey (PWR) ve yatay (VVER) buhar üreteci geometrisinin yan yana karşılaştırması. */
function SgCompare({ showFlow }: { showFlow: boolean }) {
  return (
    <svg viewBox="0 0 640 400" className="detail-svg" role="img" aria-label="Dikey ve yatay buhar üreteci karşılaştırması">
      <text x="110" y="24" textAnchor="middle" className="detail-caption">
        Dikey U borulu (PWR)
      </text>
      <path className="sg-shell" d="M80 330 V170 L65 145 V70 A45 26 0 0 1 155 70 V145 L140 170 V330 Z" />
      <path className="secondary-water" d="M82 328 V172 L74 160 H146 L138 172 V328 Z" />
      {[0, 7, 14].map((k) => (
        <path key={k} className="u-tube" d={`M${88 + k} 330 V${200 + k} A${22 - k} ${22 - k} 0 0 1 ${132 - k} ${200 + k} V330`} />
      ))}
      <path className="channel-head" d="M80 330 A30 26 0 0 0 140 330 Z" />
      <Flow id="c-v" d="M88 352 V200 A22 22 0 0 1 132 200 V352" kind="grad" pipe={0} speed={40} spacing={16} scale="constant" showFlow={showFlow} r={2.6} />
      <Flow id="c-vs" d="M110 150 V44" kind="steam" pipe={0} speed={30} spacing={18} showFlow={showFlow} r={2.8} />
      <text x="110" y="366" textAnchor="middle" className="detail-caption small">
        uzun ve dar · alt kanal başlığı
      </text>
      <text x="110" y="382" textAnchor="middle" className="detail-caption small">
        doğal dolaşım itici yüksekliği daha fazla
      </text>

      <text x="440" y="24" textAnchor="middle" className="detail-caption">
        Yatay (VVER)
      </text>
      <path className="sg-shell" d="M330 160 H550 A50 50 0 0 1 550 260 H330 A50 50 0 0 1 330 160 Z" />
      <path className="secondary-water" d="M286 204 H594 A48 48 0 0 1 550 258 H330 A48 48 0 0 1 286 204 Z" />
      {[214, 226, 238].map((y) => (
        <line key={y} className="h-tube" x1="300" x2="580" y1={y} y2={y} />
      ))}
      <rect className="collector" x="408" y="170" width="16" height="110" rx="3" />
      <rect className="collector cold" x="458" y="170" width="16" height="110" rx="3" />
      <Flow id="c-h" d="M416 300 V214 H310 A12 12 0 0 0 310 238 H466 V300" kind="grad" pipe={0} speed={40} spacing={16} scale="constant" showFlow={showFlow} r={2.6} />
      <Flow id="c-hs" d="M440 200 V120" kind="steam" pipe={0} speed={30} spacing={18} showFlow={showFlow} r={2.8} />
      <text x="440" y="330" textAnchor="middle" className="detail-caption small">
        uzun ve yatay · dikey kolektörler · geniş buhar boşluğu
      </text>
      <text x="440" y="348" textAnchor="middle" className="detail-caption small">
        tortu temizliği kolay · doğal dolaşım itici yüksekliği daha az
      </text>
      <text x="20" y="396" className="detail-note">
        İki tasarımda da birincil su boruların içinde kalır; ikincil taraf ayrı devredir. Çizimler aynı ölçekte değildir.
      </text>
    </svg>
  );
}

export function VverDetails({ detailKey, showFlow }: DetailProps) {
  if (detailKey === 'hsg') return <HsgCloseUp showFlow={showFlow} />;
  if (detailKey === 'compare') return <SgCompare showFlow={showFlow} />;
  return <VverCoreDetail showFlow={showFlow} />;
}
