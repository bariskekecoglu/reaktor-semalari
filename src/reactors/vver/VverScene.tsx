import type { SceneProps } from '../shared/types';
import { Hotspot, Label, SceneNote } from '../shared/SceneContext';
import { Flow } from '../shared/flow/Flow';
import { TurbineGenerator } from '../shared/equipment/TurbineGenerator';
import { Condenser, CoolingSource } from '../shared/equipment/Condenser';
import { GridLink, Pump } from '../shared/equipment/Pump';
import { Bubbles, HeatPulse, RodGroup } from '../shared/equipment/animated';

const SHELL = 'M430 250 H630 A50 50 0 0 1 630 350 H430 A50 50 0 0 1 430 250 Z';
const TUBE_ROWS = [304, 310, 316, 322, 328, 334, 340];

/** Yatay boru demeti: her satır çifti iki uçta U dönüşüyle bağlanır. */
function TubeBundle() {
  const parts = [];
  for (let i = 0; i < TUBE_ROWS.length - 1; i += 2) {
    const a = TUBE_ROWS[i];
    const b = TUBE_ROWS[i + 1];
    const r = (b - a) / 2;
    parts.push(<path key={`l${i}`} className="h-tube" d={`M500 ${a} H${414} A${r} ${r} 0 0 0 414 ${b} H500`} />);
    parts.push(<path key={`r${i}`} className="h-tube" d={`M560 ${a} H${646} A${r} ${r} 0 0 1 646 ${b} H560`} />);
  }
  parts.push(<path key="mid" className="h-tube" d="M500 340 H560 M500 304 H560" />);
  return <>{parts}</>;
}

/**
 * VVER sahnesi — PWR ailesinden, yatay buhar üreteçli temsili tek çevrim.
 * Dar/uzun kap ve yüksek üst blok, farklı kotlarda sıcak/soğuk kol, geniş yatay buhar üreteci.
 */
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
        <path className="pipe-wall" d="M290 322 V372" strokeWidth={9} />
        <path className="pipe-fluid fluid-hot" d="M290 322 V372" strokeWidth={5} />
      </Hotspot>

      {/* Sıcak kol (üst kot) */}
      <Hotspot id="hotleg" pad={2} contains={['f-hotleg']}>
        <Flow id="f-hotleg" d="M228 380 H476 Q490 380 490 366" kind="hot" pipe={12} speed={60} spacing={24} scale="constant" showFlow={showFlow} />
      </Hotspot>

      {/* ---------- Yatay buhar üreteci ---------- */}
      <Hotspot id="hsg" contains={['f-sg-left', 'f-sg-right']}>
        <path className="sg-shell" d={SHELL} />
        <g clipPath="url(#vver-shell-clip)">
          <rect className="secondary-water" x="380" y="290" width="300" height="62" />
        </g>
        <line className="level" x1="386" x2="674" y1="290" y2="290" />
        {/* Panjur tipi nem ayırıcı */}
        <path className="dryer" d="M420 266 l10 7 l10 -7 l10 7 l10 -7 l10 7 l10 -7 l10 7 l10 -7 l10 7 l10 -7 l10 7 l10 -7 l10 7 l10 -7 l10 7 l10 -7 l10 7 l10 -7 l10 7 l10 -7 l10 7 l10 -7" />
        <HeatPulse>
          <path className="u-tube-glow" d="M414 304 H646 M414 340 H646" />
        </HeatPulse>
        <TubeBundle />
        {/* Besleme suyu dağıtıcısı */}
        <line className="pipe-wall" x1="520" y1="296" x2="678" y2="296" strokeWidth={4} />
        {[470, 530, 590].map((x) => (
          <rect key={x} className="nozzle steam" x={x - 7} y="236" width="14" height="16" />
        ))}
        <rect className="nozzle feed" x="676" y="292" width="10" height="12" />
      </Hotspot>
      <Bubbles x={404} y={292} w={252} h={54} count={26} showFlow={showFlow} speed={18} />
      <Flow id="f-sg-left" d="M490 366 V304 H414 A18 18 0 0 0 414 340 H570 V366" kind="grad" pipe={0} speed={50} spacing={18} scale="constant" showFlow={showFlow} r={2.6} />
      <Flow id="f-sg-right" d="M490 366 V316 H646 A12 12 0 0 1 646 340 H570 V366" kind="grad" pipe={0} speed={50} spacing={18} scale="constant" showFlow={showFlow} r={2.6} />
      <Flow id="f-feed-int" d="M684 296 H524" kind="feed" pipe={0} speed={30} spacing={16} showFlow={showFlow} r={2.2} />
      {[470, 530, 590].map((x, i) => (
        <Flow key={x} id={`f-sg-steam-${i + 1}`} d={`M${x} 288 V212`} kind="steam" pipe={0} speed={30} spacing={20} showFlow={showFlow} r={2.8} />
      ))}

      {/* Kolektörler */}
      <Hotspot id="collector-hot" pad={2}>
        <rect className="collector" x="479" y="262" width="22" height="110" rx="4" />
      </Hotspot>
      <Hotspot id="collector-cold" pad={2}>
        <rect className="collector cold" x="559" y="262" width="22" height="110" rx="4" />
      </Hotspot>

      {/* Soğuk kol (alt kot) + ana sirkülasyon pompası */}
      <Hotspot id="coldleg" pad={2} contains={['f-crossleg', 'f-coldleg']}>
        <Flow id="f-crossleg" d="M570 372 V540 Q570 560 550 560 H418" kind="cold" pipe={12} speed={60} spacing={24} scale="constant" showFlow={showFlow} />
        <Flow id="f-coldleg" d="M374 560 H260 Q245 560 245 545 V465 Q245 450 230 450 H228" kind="cold" pipe={12} speed={60} spacing={24} scale="constant" showFlow={showFlow} />
      </Hotspot>
      <Hotspot id="mcp">
        <Pump x={396} y={560} r={22} motor="top" rps={1.2} />
      </Hotspot>

      {/* ---------- İkincil devre ---------- */}
      <Hotspot id="steamline" pad={2} contains={['f-steamline']}>
        {[470, 530, 590].map((x) => (
          <g key={x}>
            <path className="pipe-wall" d={`M${x} 212 V240`} strokeWidth={13} />
            <path className="pipe-fluid fluid-steam" d={`M${x} 212 V240`} strokeWidth={8} />
          </g>
        ))}
        <Flow id="f-steamline" d="M463 212 H782 V233" kind="steam" pipe={12} speed={80} spacing={26} showFlow={showFlow} />
      </Hotspot>
      <TurbineGenerator x={760} y={260} ids={{ hp: 'hp', lp: 'lp', gen: 'gen', crossover: 'f-crossover' }} showFlow={showFlow} />
      <Flow id="f-lp-l" d="M965 206 C925 206 912 298 962 326 V348" kind="steam" pipe={0} speed={50} spacing={20} showFlow={showFlow} r={2.8} />
      <Flow id="f-lp-r" d="M985 206 C1025 206 1038 298 988 326 V348" kind="steam" pipe={0} speed={50} spacing={20} showFlow={showFlow} r={2.8} />
      <GridLink x={1272} y={260} />
      <Condenser x={885} y={336} w={180} h={150} id="condenser" coolId="f-cool" coolTo={1280} showFlow={showFlow} />
      <CoolingSource x={1280} y={360} id="coolsource" />

      <Flow id="f-feed1" d="M930 492 V620 H846" kind="feed" pipe={9} speed={45} spacing={24} showFlow={showFlow} />
      <Flow id="f-feed2" d="M812 620 H720 V298 H686" kind="feed" pipe={9} speed={45} spacing={24} showFlow={showFlow} />
      <Hotspot id="feedpump">
        <Pump x={829} y={620} r={16} motor="side" rps={1.5} />
      </Hotspot>
      <Hotspot id="heater">
        <rect className="heater-box" x="735" y="604" width="54" height="32" rx="5" />
        <path className="heater-coil" d="M741 620 q5 -9 10 0 t10 0 t10 0 t10 0 t10 0" />
      </Hotspot>

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
        <Label x={370} y={41} tx={430} ty={6} text="Koruma yapısı (containment)" />
        <Label x={150} y={170} tx={8} ty={104} text="Üst blok: çubuk sürücüleri" sub="çubuklar üstten girer" />
        <Label x={124} y={600} tx={30} ty={704} text="Reaktör kabı (dar, uzun)" />
        <Label x={350} y={380} tx={318} ty={350} text="Sıcak kol (üst kot)" />
        <Label x={232} y={452} tx={250} ty={598} text="Soğuk kol (alt kot)" />
        <Label x={312} y={196} tx={330} ty={150} text="Basınçlandırıcı" />
        <Label x={520} y={252} tx={470} ty={140} text="Yatay buhar üreteci" sub="yatay boru demeti + kolektörler" />
        <Label x={486} y={370} tx={420} ty={408} text="Sıcak kolektör" />
        <Label x={576} y={370} tx={592} ty={436} text="Soğuk kolektör" />
        <Label x={410} y={572} tx={420} ty={604} text="Ana sirkülasyon pompası" />
        <Label x={660} y={212} tx={700} ty={168} text="Ana buhar hattı" />
        <Label x={800} y={300} tx={806} ty={318} text="YB türbini" />
        <Label x={1050} y={206} tx={1000} ty={134} text="AB türbini" />
        <Label x={1170} y={216} tx={1146} ty={158} text="Jeneratör" />
        <Label x={1062} y={470} tx={1080} ty={504} text="Kondenser" />
        <Label x={832} y={636} tx={764} ty={672} text="Besleme suyu pompası" />
        <Label x={762} y={604} tx={735} ty={556} text="Ön ısıtıcı" />
      </g>
    </svg>
  );
}
