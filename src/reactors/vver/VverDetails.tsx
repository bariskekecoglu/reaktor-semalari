import type { DetailProps } from '../shared/types';
import { Label } from '../shared/SceneContext';
import { Flow } from '../shared/flow/Flow';
import { Bubbles } from '../shared/equipment/animated';
import { VverCoreDetail } from './VverCoreDetail';
import type { HsgLayout } from './hsgGeometry';
import { HsgHiddenSegments, HsgTubes, type HsgTubeLoop } from './HsgTubes';

const SHELL = 'M120 120 H520 A90 90 0 0 1 520 300 H120 A90 90 0 0 1 120 120 Z';

/** Yakın plan: kolektörler ve sıcak → soğuk kolektör U boru döngüleri. */
const CLOSE: HsgLayout = { hotX: 270, coldX: 370, colW: 36, bottom: 366 };
const CLOSE_LOOPS: HsgTubeLoop[] = [0, 1, 2].flatMap((k) => [
  { id: `h-left-${k}`, side: 'left' as const, yOut: 214 + 12 * k, yRet: 290 - 12 * k, bendX: 110 + 12 * k },
  { id: `h-right-${k}`, side: 'right' as const, yOut: 214 + 12 * k, yRet: 290 - 12 * k, bendX: 530 - 12 * k },
]);

/** Karşılaştırma çizimi: her demetten bir temsili döngü. */
const CMP: HsgLayout = { hotX: 416, coldX: 466, colW: 16, bottom: 280 };
const CMP_LOOPS: HsgTubeLoop[] = [
  { id: 'c-h-left', side: 'left', yOut: 212, yRet: 240, bendX: 320 },
  { id: 'c-h-right', side: 'right', yOut: 218, yRet: 234, bendX: 556 },
];

function HsgCloseUp({ showFlow }: { showFlow: boolean }) {
  return (
    <svg viewBox="0 0 640 462" className="detail-svg" role="img" aria-label="Yatay buhar üreteci kesiti">
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
      <line className="pipe-wall" x1="330" y1="204" x2="600" y2="204" strokeWidth={5} />
      <Bubbles x={60} y={198} w={520} h={100} count={34} showFlow={showFlow} speed={20} />
      <HsgTubes layout={CLOSE} loops={CLOSE_LOOPS} showFlow={showFlow} tube={7} r={2.8} />
      <rect className="collector" x="252" y="140" width="36" height="226" rx="6" />
      <rect className="collector cold" x="352" y="140" width="36" height="226" rx="6" />
      <HsgHiddenSegments layout={CLOSE} loops={CLOSE_LOOPS} tube={7} />
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
      <text x="20" y="438" className="detail-note">
        Temsili kesit · ölçeksiz. Her boru sıcak kolektörden çıkar, U dönüşüyle soğuk kolektöre girer.
      </text>
      <text x="20" y="455" className="detail-note">
        Kesikli kısım: borunun öteki kolektörün arkasından geçtiği yer (yan görünüş sadeleştirmesi).
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
      <HsgTubes layout={CMP} loops={CMP_LOOPS} showFlow={showFlow} tube={5} r={2.1} />
      <rect className="collector" x="408" y="170" width="16" height="110" rx="3" />
      <rect className="collector cold" x="458" y="170" width="16" height="110" rx="3" />
      <HsgHiddenSegments layout={CMP} loops={CMP_LOOPS} tube={5} />
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
