import type { SceneProps } from '../shared/types';
import { Hotspot, Label, SceneNote } from '../shared/SceneContext';
import { Flow } from '../shared/flow/Flow';
import { TurbineGenerator } from '../shared/equipment/TurbineGenerator';
import { Condenser, CoolingSource } from '../shared/equipment/Condenser';
import { GridLink, Pump } from '../shared/equipment/Pump';
import { Bubbles, RodGroup } from '../shared/equipment/animated';
import { HSG_FLOW_IDS, MAIN_LOOP_COUNT, type HsgLayout } from './hsgGeometry';
import { Junction, Penetration } from '../shared/equipment/PipeMarks';
import {
  VVER_COLLECTORS as COL,
  VVER_CONDENSER,
  VVER_FEEDPUMP,
  VVER_HSG,
  VVER_MCP,
  VVER_PENETRATIONS,
  VVER_PRESSURIZER,
  VVER_ROUTES as RT,
  VVER_TURBINE,
} from './vverLayout';
import { HsgHiddenSegments, HsgTubes, type HsgTubeLoop } from './HsgTubes';

const SHELL = 'M430 250 H630 A50 50 0 0 1 630 350 H430 A50 50 0 0 1 430 250 Z';
/** Yatay buhar üreteci: kolektör konumları ve temsili U boru döngüleri (sıcak → soğuk kolektör). */
const HSG: HsgLayout = { hotX: 490, coldX: 570, colW: 22, bottom: 368 };
const HSG_LOOPS: HsgTubeLoop[] = Array.from({ length: MAIN_LOOP_COUNT }, (_, k) => k).flatMap((k) => [
  { id: k === 0 ? 'f-sg-left' : `f-sg-left-${k + 1}`, side: 'left' as const, yOut: 302 + 8 * k, yRet: 342 - 8 * k, bendX: 420 + 8 * k },
  { id: k === 0 ? 'f-sg-right' : `f-sg-right-${k + 1}`, side: 'right' as const, yOut: 302 + 8 * k, yRet: 342 - 8 * k, bendX: 640 - 8 * k },
]);

/**
 * VVER sahnesi — PWR ailesinden, yatay buhar üreteçli temsili tek çevrim.
 * Dar/uzun kap ve yüksek üst blok, farklı kotlarda sıcak/soğuk kol, geniş yatay buhar üreteci.
 */
const SURGE = `M${VVER_PRESSURIZER.surgeTop.join(' ')} V${VVER_PRESSURIZER.surgeBottom[1]}`;
const rectOf = (r: { x: number; y: number; w: number; h: number }) => ({ x: r.x, y: r.y, width: r.w, height: r.h });

export function VverScene({ showLabels, showFlow }: SceneProps) {
  return (
    <svg viewBox="0 0 1400 800" className="scene-svg" role="group" aria-label="VVER santral şeması">
      <defs>
        <pattern id="vver-ground" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="10" className="hatch" />
        </pattern>
        <clipPath id="vver-shell-clip">
          <path d={SHELL} />
        </clipPath>
      </defs>
      <rect x="0" y="745" width="1400" height="14" fill="url(#vver-ground)" />

      <Hotspot id="containment" hit={false} pad={0}>
        <path className="containment" d="M40 745 V230 A330 190 0 0 1 700 230 V745" />
      </Hotspot>

      {/* ---------- Reaktör kabı (dar, uzun) + üst blok ---------- */}
      <Hotspot id="vessel">
        <path className="vessel-wall thick" d="M120 318 V640 A50 50 0 0 0 220 640 V318 Z" />
        <path className="vessel-head" d="M120 310 A50 26 0 0 1 220 310 Z" />
        <rect className="flange" x="112" y="306" width="116" height="13" />
        <line className="barrel" x1="132" y1="326" x2="132" y2="656" />
        <line className="barrel" x1="208" y1="326" x2="208" y2="372" />
        <line className="barrel" x1="208" y1="388" x2="208" y2="656" />
        <rect className="core-zone" x="138" y="470" width="64" height="150" />
        {[143, 152, 161, 170, 179, 188, 197].map((x) => (
          <line key={x} className="fuel-rod" x1={x} x2={x} y1="474" y2="616" />
        ))}
        <rect className="nozzle hot" x="218" y="372" width="10" height="16" />
        <rect className="nozzle cold" x="218" y="442" width="10" height="16" />
        <line className="barrel" x1="208" y1="420" x2="220" y2="420" strokeWidth={3} />
      </Hotspot>
      <Flow id="f-vessel-down" d="M228 450 H214 V640 Q214 668 190 668 H170" kind="cold" pipe={0} speed={55} spacing={20} scale="constant" showFlow={showFlow} r={2.8} />
      <Flow id="f-core-up" d="M170 668 V390 Q170 380 180 380 H228" kind="hot" pipe={0} speed={55} spacing={22} scale="constant" showFlow={showFlow} r={2.8} />

      <Hotspot id="rods">
        <rect className="crdm" x="124" y="150" width="92" height="10" />
        {[135, 149, 163, 177, 191, 205].map((x) => (
          <g key={x}>
            <rect className="crdm" x={x - 4} y="160" width="8" height="126" rx="2" />
            <line className="drive-line" x1={x} x2={x} y1="286" y2="470" />
          </g>
        ))}
        <RodGroup travel={130} dir={1}>
          {[147, 165, 183, 196].map((x) => (
            <rect key={x} className="control-rod" x={x - 2.5} y="330" width="5" height="140" />
          ))}
        </RodGroup>
      </Hotspot>

      {/* Basınçlandırıcı */}
      <Hotspot id="pressurizer">
        <rect className="vessel-wall" x="266" y="140" width="48" height="182" rx="24" />
        <path className="pzr-steam" d="M269 230 V164 A21 21 0 0 1 311 164 V230 Z" />
        <path className="pzr-water" d="M269 230 H311 V298 A21 21 0 0 1 269 298 Z" />
        <line className="level" x1="269" x2="311" y1="230" y2="230" />
        <path className="heater" d="M276 306 l4 -8 l4 8 l4 -8 l4 8 l4 -8 l4 8 l4 -8" />
      </Hotspot>
      <Hotspot id="surge" pad={4}>
        <path className="pipe-wall" d={SURGE} strokeWidth={9} />
        <path className="pipe-fluid fluid-hot" d={SURGE} strokeWidth={5} />
      </Hotspot>

      {/* Sıcak kol (üst kot) */}
      <Hotspot id="hotleg" pad={2} contains={['f-hotleg']}>
        <Flow id="f-hotleg" d={RT.hotleg.d} kind="hot" pipe={12} speed={60} spacing={24} scale="constant" showFlow={showFlow} />
      </Hotspot>

      {/* ---------- Yatay buhar üreteci ---------- */}
      <Hotspot id="hsg" contains={HSG_FLOW_IDS}>
        <path className="sg-shell" d={SHELL} />
        <g clipPath="url(#vver-shell-clip)">
          <rect className="secondary-water" x="380" y="290" width="300" height="62" />
        </g>
        <line className="level" x1="386" x2="674" y1="290" y2="290" />
        {/* Panjur tipi nem ayırıcı */}
        <path className="dryer" d="M420 266 l10 7 l10 -7 l10 7 l10 -7 l10 7 l10 -7 l10 7 l10 -7 l10 7 l10 -7 l10 7 l10 -7 l10 7 l10 -7 l10 7 l10 -7 l10 7 l10 -7 l10 7 l10 -7 l10 7 l10 -7" />
        {/* Besleme suyu dağıtıcısı */}
        <line className="pipe-wall" x1="520" y1="296" x2="678" y2="296" strokeWidth={4} />
        {[470, 530, 590].map((x) => (
          <rect key={x} className="nozzle steam" x={x - 7} y="236" width="14" height="16" />
        ))}
        <rect className="nozzle feed" x="676" y="292" width="10" height="12" />
      </Hotspot>
      <Bubbles x={404} y={292} w={252} h={54} count={26} showFlow={showFlow} speed={18} />
      {/* U boruları: çizim ve parçacık yolu aynı tanımdan; kolektörlerden önce çizilir. */}
      <HsgTubes layout={HSG} loops={HSG_LOOPS} showFlow={showFlow} />
      <Flow id="f-feed-int" d="M684 296 H524" kind="feed" pipe={0} speed={30} spacing={16} showFlow={showFlow} r={2.2} />
      {[470, 530, 590].map((x, i) => (
        <Flow key={x} id={`f-sg-steam-${i + 1}`} d={`M${x} 288 V212`} kind="steam" pipe={0} speed={30} spacing={20} showFlow={showFlow} r={2.8} />
      ))}

      {/* Kolektörler */}
      <Hotspot id="collector-hot" pad={2}>
        <rect className="collector" {...rectOf(COL.hot)} rx="4" />
      </Hotspot>
      <Hotspot id="collector-cold" pad={2}>
        <rect className="collector cold" {...rectOf(COL.cold)} rx="4" />
      </Hotspot>
      <HsgHiddenSegments layout={HSG} loops={HSG_LOOPS} />

      {/* Soğuk kol (alt kot) + ana sirkülasyon pompası */}
      <Hotspot id="coldleg" pad={2} contains={['f-crossleg', 'f-coldleg']}>
        <Flow id="f-crossleg" d={RT.crossleg.d} kind="cold" pipe={12} speed={60} spacing={24} scale="constant" showFlow={showFlow} />
        <Flow id="f-coldleg" d={RT.coldleg.d} kind="cold" pipe={12} speed={60} spacing={24} scale="constant" showFlow={showFlow} />
      </Hotspot>
      <Hotspot id="mcp">
        <Pump x={VVER_MCP.c[0]} y={VVER_MCP.c[1]} r={VVER_MCP.r} motor="top" rps={1.2} />
      </Hotspot>

      {/* ---------- İkincil devre ---------- */}
      <Hotspot id="steamline" pad={2} contains={['f-steamline']}>
        {[470, 530, 590].map((x) => (
          <g key={x}>
            <path className="pipe-wall" d={`M${x} 212 V240`} strokeWidth={13} />
            <path className="pipe-fluid fluid-steam" d={`M${x} 212 V240`} strokeWidth={8} />
          </g>
        ))}
        {VVER_HSG.steamNozzles.map((x) => (
          <Junction key={`j${x}`} at={[x, VVER_HSG.steamHeaderY]} r={3.5} />
        ))}
        <Flow id="f-steamline" d={RT.steamline.d} kind="steam" pipe={12} speed={80} spacing={26} showFlow={showFlow} />
      </Hotspot>
      <TurbineGenerator x={VVER_TURBINE.x} y={VVER_TURBINE.y} ids={{ hp: 'hp', lp: 'lp', gen: 'gen', crossover: 'f-crossover' }} showFlow={showFlow} />
      <Flow id="f-lp-l" d="M965 206 C925 206 912 298 962 326 V348" kind="steam" pipe={0} speed={50} spacing={20} showFlow={showFlow} r={2.8} />
      <Flow id="f-lp-r" d="M985 206 C1025 206 1038 298 988 326 V348" kind="steam" pipe={0} speed={50} spacing={20} showFlow={showFlow} r={2.8} />
      <GridLink x={1272} y={260} />
      <Condenser {...VVER_CONDENSER} id="condenser" coolId="f-cool" coolTo={1280} showFlow={showFlow} />
      <CoolingSource x={1280} y={360} id="coolsource" />

      <Flow id="f-feed1" d={RT.feed1.d} kind="feed" pipe={9} speed={45} spacing={24} showFlow={showFlow} />
      <Flow id="f-feed2" d={RT.feed2.d} kind="feed" pipe={9} speed={45} spacing={24} showFlow={showFlow} />
      <Hotspot id="feedpump">
        {/* Motor üstte: emme ve basma hatları motorun içinden geçmez. */}
        <Pump x={VVER_FEEDPUMP.c[0]} y={VVER_FEEDPUMP.c[1]} r={VVER_FEEDPUMP.r} motor="top" rps={1.5} />
      </Hotspot>
      <Hotspot id="heater">
        <rect className="heater-box" x="735" y="604" width="54" height="32" rx="5" />
        <path className="heater-coil" d="M741 620 q5 -9 10 0 t10 0 t10 0 t10 0 t10 0" />
      </Hotspot>

      <Junction at={VVER_PRESSURIZER.surgeBottom} r={3.5} />
      {VVER_PENETRATIONS.map((p) => (
        <Penetration key={p.at.join()} {...p} />
      ))}

      <SceneNote
        x={960}
        y={640}
        w={430}
        lines={['Temsili VVER şeması; çevrim sayısı ve yerleşim modele göre', 'değişir. Tek çevrim çizildi (sadeleştirme): ders notlarına göre', 'VVER-1000 dört, VVER-440/213 altı çevrimlidir.']}
      />

      <g className="circuit-tags">
        <text x="56" y="782">BİRİNCİL DEVRE · basınçlı su · düz çizgi</text>
        <text x="720" y="782">İKİNCİL DEVRE · buhar (kesikli) / besleme (noktalı)</text>
        <text x="1180" y="782">SOĞUTMA SUYU</text>
      </g>

      <g className="labels" style={{ display: showLabels ? undefined : 'none' }}>
        <Label x={370} y={41} tx={430} ty={6} text="Koruma yapısı (containment)" for="containment" />
        <Label x={150} y={170} tx={8} ty={104} text={'Üst blok:\nçubuk sürücüleri'} sub="çubuklar üstten girer" for="rods" />
        <Label x={124} y={600} tx={30} ty={704} text="Reaktör kabı (dar, uzun)" for="vessel" />
        <Label x={312} y={196} tx={330} ty={150} text="Basınçlandırıcı" for="pressurizer" />
        <Label x={520} y={252} tx={470} ty={140} text="Yatay buhar üreteci" sub="yatay boru demeti + kolektörler" for="hsg" />
        <Label x={410} y={572} tx={420} ty={604} text="Ana sirkülasyon pompası" for="mcp" />
        <Label x={800} y={300} tx={806} ty={318} text="YB türbini" for="hp" />
        <Label x={1050} y={206} tx={1000} ty={134} text="AB türbini" for="lp" />
        <Label x={1170} y={216} tx={1146} ty={158} text="Jeneratör" for="gen" />
        <Label x={1062} y={470} tx={1080} ty={504} text="Kondenser" for="condenser" />
        <Label x={832} y={636} tx={764} ty={672} text="Besleme suyu pompası" for="feedpump" />
        {/* Ayrıntı: kolektörler, kotlar ve hatlar */}
        <Label level="detail" x={350} y={380} tx={318} ty={350} text="Sıcak kol (üst kot)" for="hotleg" />
        <Label level="detail" x={232} y={452} tx={250} ty={598} text="Soğuk kol (alt kot)" for="coldleg" />
        <Label level="detail" x={486} y={370} tx={420} ty={408} text="Sıcak kolektör" for="collector-hot" />
        <Label level="detail" x={576} y={370} tx={592} ty={436} text="Soğuk kolektör" for="collector-cold" />
        <Label level="detail" x={660} y={212} tx={700} ty={168} text="Ana buhar hattı" for="steamline" />
        <Label level="detail" x={762} y={604} tx={735} ty={556} text="Ön ısıtıcı" for="heater" />
        <Label level="detail" x={620} y={267} tx={640} ty={196} text="Nem ayırıcı" />
        <Label level="detail" x={160} y={610} tx={30} ty={730} text="Altıgen yakıt demetleri" for="vessel" />
      </g>
    </svg>
  );
}
