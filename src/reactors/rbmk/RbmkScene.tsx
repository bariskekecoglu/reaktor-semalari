import type { SceneProps } from '../shared/types';
import { Hotspot, Label, SceneNote } from '../shared/SceneContext';
import { Flow } from '../shared/flow/Flow';
import { TurbineGenerator } from '../shared/equipment/TurbineGenerator';
import { Condenser, CoolingSource } from '../shared/equipment/Condenser';
import { GridLink, Pump } from '../shared/equipment/Pump';
import { Bubbles, RodGroup } from '../shared/equipment/animated';
import { Junction } from '../shared/equipment/PipeMarks';
import { FluidTag, MaterialDefs } from '../shared/equipment/materials';
import {
  lowerRoute,
  riserRoute,
  RBMK_CHANNEL_IDS,
  RBMK_CONDENSER,
  RBMK_CORE as CORE,
  RBMK_CTRL_TUBE,
  RBMK_CTRL_X,
  RBMK_DGH,
  RBMK_DRUM as DRUM,
  RBMK_FEEDPUMP,
  RBMK_FUEL_X,
  RBMK_GRAPHITE as GR,
  RBMK_LOWER_IDS,
  RBMK_MCP,
  RBMK_RISER_IDS,
  RBMK_ROUTES as RT,
  RBMK_SHIELD as SH,
  RBMK_TUBE as TUBE,
  RBMK_TURBINE,
} from './rbmkLayout';

const DRUM_PATH = `M${DRUM.x0} ${DRUM.cy - DRUM.r} H${DRUM.x1} A${DRUM.r} ${DRUM.r} 0 0 1 ${DRUM.x1} ${DRUM.cy + DRUM.r} H${DRUM.x0} A${DRUM.r} ${DRUM.r} 0 0 1 ${DRUM.x0} ${DRUM.cy - DRUM.r} Z`;
const RISERS = RBMK_FUEL_X.map((_, i) => riserRoute(i));
const LOWERS = RBMK_FUEL_X.map((_, i) => lowerRoute(i));
/** Çubuk kaydırma mesafesi: sokulma 0 iken çubuk ucu çekirdeğin üst sınırında. */
const ROD_TRAVEL = 200;
const ROD_LEN = 60;

/**
 * RBMK sahnesi — grafit yığını içinde dikey basınç kanalları, kanallarda kaynama, kap dışındaki ayırıcı tambur
 * ve buharın doğrudan türbine gidişi. Temsili RBMK-1000, tek çevrim; BWR kabından türetilmemiştir.
 */
export function RbmkScene({ showLabels, showFlow }: SceneProps) {
  return (
    <svg viewBox="0 0 1400 800" className="scene-svg" role="group" aria-label="RBMK santral şeması">
      <defs>
        <pattern id="rbmk-ground" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="10" className="hatch" />
        </pattern>
        <MaterialDefs prefix="rbmk" />
        <clipPath id="rbmk-drum-clip">
          <path d={DRUM_PATH} />
        </clipPath>
      </defs>
      <rect x="0" y="745" width="1400" height="14" fill="url(#rbmk-ground)" />

      <Hotspot id="building" hit={false} pad={0}>
        <rect x="50" y="60" width="688" height="685" rx="4" fill="none" className="containment-line" strokeDasharray="10 6" />
      </Hotspot>

      {/* ---------- Biyolojik zırh ve reaktör boşluğu (basınç kabı değildir) ---------- */}
      <Hotspot id="shield" hit={false} pad={2}>
        <rect className="shield-concrete" x={SH.x0} y={SH.top} width={SH.wall} height={SH.bottom + SH.bottomH - SH.top} />
        <rect className="shield-concrete" x={SH.x1 - SH.wall} y={SH.top} width={SH.wall} height={SH.bottom + SH.bottomH - SH.top} />
        <rect className="shield-plate" x={SH.x0} y={SH.top} width={SH.x1 - SH.x0} height={SH.topH} />
        <rect className="shield-plate" x={SH.x0} y={SH.bottom} width={SH.x1 - SH.x0} height={SH.bottomH} />
      </Hotspot>

      {/* ---------- Grafit moderatör yığını ---------- */}
      <Hotspot id="graphite" pad={0}>
        <rect x={GR.x} y={GR.y} width={GR.w} height={GR.h} fill="url(#rbmk-graphite)" className="graphite-block" />
        {[...RBMK_FUEL_X, ...RBMK_CTRL_X].map((x) => (
          <rect key={x} className="graphite-gap" x={x - 9} y={GR.y} width={18} height={GR.h} />
        ))}
        <line className="barrel" x1={GR.x} x2={GR.x + GR.w} y1={CORE.y0} y2={CORE.y0} strokeDasharray="6 4" />
        <line className="barrel" x1={GR.x} x2={GR.x + GR.w} y1={CORE.y1} y2={CORE.y1} strokeDasharray="6 4" />
      </Hotspot>

      {/* ---------- Basma ve grup dağıtım kolektörleri + alt su boruları ---------- */}
      <Hotspot id="dgh" pad={3} contains={['f-pressure', 'f-dgh', ...RBMK_LOWER_IDS]}>
        <Flow id="f-pressure" d={RT.pressure.d} kind="cold" pipe={13} speed={55} spacing={24} scale="constant" showFlow={showFlow} />
        <Flow id="f-dgh" d={RT.dgh.d} kind="cold" pipe={13} speed={55} spacing={24} scale="constant" showFlow={showFlow} />
        {LOWERS.map((r, i) => (
          <Flow key={i} id={RBMK_LOWER_IDS[i]} d={r.d} kind="cold" pipe={6} speed={40} spacing={14} scale="constant" showFlow={showFlow} r={2.3} />
        ))}
        {RBMK_FUEL_X.map((x) => (
          <Junction key={x} at={[x, RBMK_DGH.y]} r={3.6} />
        ))}
        <Junction at={[RBMK_DGH.x1, RBMK_DGH.y]} r={3.6} />
      </Hotspot>

      {/* ---------- Yakıt / basınç kanalları (temsili beş kanal) ---------- */}
      <Hotspot id="channels" hit={false} pad={2} contains={[...RBMK_CHANNEL_IDS, ...RBMK_LOWER_IDS, ...RBMK_RISER_IDS]}>
        {RBMK_FUEL_X.map((x) => (
          <rect key={x} className="channel-tube" x={x - TUBE.half} y={TUBE.top} width={TUBE.half * 2} height={TUBE.bottom - TUBE.top} rx={2} />
        ))}
      </Hotspot>
      <Hotspot id="fuel" hit={false} pad={1}>
        {RBMK_FUEL_X.map((x) => (
          <rect key={x} className="fuel-assy" x={x - 2.5} y={CORE.y0} width={5} height={CORE.y1 - CORE.y0} />
        ))}
      </Hotspot>
      {RBMK_FUEL_X.map((x, i) => (
        <Flow
          key={x}
          id={RBMK_CHANNEL_IDS[i]}
          d={`M${x} ${TUBE.bottom} V${TUBE.top}`}
          kind="mix"
          boilAt={0.32}
          pipe={0}
          speed={42}
          spacing={18}
          scale="constant"
          showFlow={showFlow}
          r={2.6}
        />
      ))}

      {/* ---------- Kontrol / koruma kanalları (yakıt kanallarından ayrı) ---------- */}
      <Hotspot id="rods" hit={false} pad={2}>
        {RBMK_CTRL_X.map((x) => (
          <g key={x}>
            <rect className="ctrl-channel" x={x - 6} y={RBMK_CTRL_TUBE.top} width={12} height={RBMK_CTRL_TUBE.bottom - RBMK_CTRL_TUBE.top} rx={2} />
            <rect className="ctrl-drive" x={x - 8} y={RBMK_CTRL_TUBE.top - 16} width={16} height={14} rx={2} />
          </g>
        ))}
        <RodGroup travel={ROD_TRAVEL} dir={1}>
          {RBMK_CTRL_X.map((x) => (
            <rect key={x} className="control-rod" x={x - 3} y={CORE.y0 - ROD_LEN} width={6} height={ROD_LEN} />
          ))}
        </RodGroup>
      </Hotspot>

      {/* ---------- Buhar–su boruları: her kanal kendi borusuyla, birleşmeden ---------- */}
      <Hotspot id="risers" pad={2} contains={RBMK_RISER_IDS}>
        {RISERS.map((r, i) => (
          <Flow key={i} id={RBMK_RISER_IDS[i]} d={r.d} kind="mix" boilAt={0} pipe={7} speed={45} spacing={16} showFlow={showFlow} r={2.4} />
        ))}
      </Hotspot>

      {/* ---------- Ayırıcı tambur ---------- */}
      <Hotspot id="drum" contains={['f-drum-steam', 'f-drum-water']}>
        <path className="drum" d={DRUM_PATH} />
        <g clipPath="url(#rbmk-drum-clip)">
          <rect className="secondary-water" x={DRUM.x0 - DRUM.r} y={DRUM.level} width={DRUM.x1 - DRUM.x0 + 2 * DRUM.r} height={DRUM.r * 2} />
        </g>
        <line className="level" x1={DRUM.x0 - 20} x2={DRUM.x1 + 20} y1={DRUM.level} y2={DRUM.level} />
        <rect className="nozzle steam" x={593} y={DRUM.cy - DRUM.r - 10} width={14} height={12} />
      </Hotspot>
      <Bubbles x={530} y={DRUM.level + 2} w={120} h={20} count={14} showFlow={showFlow} speed={16} />
      <Flow id="f-drum-steam" d={`M600 ${DRUM.level - 2} V${DRUM.cy - DRUM.r + 2}`} kind="steam" pipe={0} speed={22} spacing={10} showFlow={showFlow} r={2.4} />
      <Flow id="f-drum-water" d={`M548 ${DRUM.cy + 18} H${RT.downcomer.start[0]}`} kind="cold" pipe={0} speed={24} spacing={16} scale="constant" showFlow={showFlow} r={2.3} />

      {/* İniş borusu + ana sirkülasyon pompası */}
      <Hotspot id="downcomer" pad={2} contains={['f-downcomer']}>
        <Flow id="f-downcomer" d={RT.downcomer.d} kind="cold" pipe={12} speed={55} spacing={24} scale="constant" showFlow={showFlow} />
      </Hotspot>
      <Hotspot id="mcp">
        <Pump x={RBMK_MCP.c[0]} y={RBMK_MCP.c[1]} r={RBMK_MCP.r} motor="top" rps={1.2} />
      </Hotspot>

      {/* ---------- Buhar doğrudan türbine ---------- */}
      <Hotspot id="steamline" pad={2} contains={['f-steamline']}>
        <Flow id="f-steamline" d={RT.steamline.d} kind="steam" pipe={12} speed={80} spacing={26} showFlow={showFlow} />
      </Hotspot>
      <TurbineGenerator x={RBMK_TURBINE.x} y={RBMK_TURBINE.y} ids={{ hp: 'hp', lp: 'lp', gen: 'gen', crossover: 'f-crossover' }} showFlow={showFlow} />
      <Flow id="f-lp-l" d="M965 206 C925 206 912 298 962 326 V348" kind="steam" pipe={0} speed={50} spacing={20} showFlow={showFlow} r={2.8} />
      <Flow id="f-lp-r" d="M985 206 C1025 206 1038 298 988 326 V348" kind="steam" pipe={0} speed={50} spacing={20} showFlow={showFlow} r={2.8} />
      <GridLink x={1272} y={260} />
      <Condenser {...RBMK_CONDENSER} id="condenser" coolId="f-cool" coolTo={1280} showFlow={showFlow} />
      <CoolingSource x={1280} y={360} id="coolsource" />

      <Flow id="f-feed1" d={RT.feed1.d} kind="feed" pipe={9} speed={45} spacing={24} showFlow={showFlow} />
      <Flow id="f-feed2" d={RT.feed2.d} kind="feed" pipe={9} speed={45} spacing={24} showFlow={showFlow} />
      <Hotspot id="feedpump">
        <Pump x={RBMK_FEEDPUMP.c[0]} y={RBMK_FEEDPUMP.c[1]} r={RBMK_FEEDPUMP.r} motor="top" rps={1.5} />
      </Hotspot>

      {/* Malzeme ve akışkan etiketleri: renge ek metin */}
      <FluidTag x={280} y={GR.y + 14} text="GRAFİT · moderatör" kind="graphite" />
      <FluidTag x={545} y={RBMK_DGH.y + 26} text="H₂O · alt-soğutulmuş" />
      <FluidTag x={470} y={DRUM.cy + 100} text="H₂O + buhar" />
      <FluidTag x={RT.downcomer.start[0]} y={470} text="H₂O" />

      <SceneNote
        x={900}
        y={520}
        w={490}
        lines={[
          'Temsili RBMK-1000 (ölçeksiz): iki çevrimden biri çizildi. Gerçek çekirdekte',
          'çok sayıda kanal vardır; burada 5 yakıt + 2 kontrol kanalı temsil eder.',
          'Her çevrimde 2 tambur ve 4 pompa (3 çalışır + 1 yedek; INSAG-7) — 1’er çizildi.',
        ]}
      />

      <g className="circuit-tags">
        <text x="56" y="782">TEK (DOĞRUDAN) ÇEVRİM · hafif su kanallarda kaynar · buhar tamburdan türbine</text>
        <text x="1180" y="782">SOĞUTMA SUYU</text>
      </g>

      <g className="labels" style={{ display: showLabels ? undefined : 'none' }}>
        <Label x={436} y={420} tx={492} ty={392} text="Grafit moderatör yığını" sub="moderatör; soğutucu değil" for="graphite" />
        <Label x={377} y={470} tx={492} ty={452} text="Yakıt / basınç kanalları" sub="5 temsili kanal" for="channels" />
        <Label x={280} y={304} tx={150} ty={96} text="Kontrol / koruma kanalları" sub="yakıt kanallarından ayrı" for="rods" />
        <Label x={610} y={124} tx={530} ty={20} text="Ayırıcı tambur" sub="buhar üreteci değildir" for="drum" />
        <Label x={480} y={250} tx={500} ty={300} text={'Buhar–su boruları'} sub="her kanaldan ayrı boru" for="risers" />
        <Label x={628} y={690} tx={492} ty={612} text="Ana sirkülasyon pompası" for="mcp" />
        <Label x={300} y={700} tx={240} ty={712} text="Grup dağıtım kolektörü" for="dgh" />
        <Label x={800} y={300} tx={806} ty={318} text="YB türbini" for="hp" />
        <Label x={1050} y={206} tx={1000} ty={134} text="AB türbini" for="lp" />
        <Label x={1170} y={216} tx={1146} ty={158} text="Jeneratör" for="gen" />
        <Label x={1062} y={470} tx={1080} ty={504} text="Kondenser" for="condenser" />
        <Label x={832} y={636} tx={764} ty={672} text="Besleme suyu pompası" for="feedpump" />
        {/* Ayrıntı */}
        <Label level="detail" x={372} y={CORE.y0 + 140} tx={492} ty={512} text="Yakıt demeti" for="fuel" />
        <Label level="detail" x={SH.x1 - 10} y={SH.top + 230} tx={492} ty={552} text="Biyolojik zırh ve plakalar" sub="basınç kabı değildir" for="shield" />
        <Label level="detail" x={690} y={400} tx={600} ty={350} text="İniş borusu" for="downcomer" />
        <Label level="detail" x={760} y={90} tx={792} ty={58} text="Ana buhar hattı" for="steamline" />
        <Label level="detail" x={300} y={60} tx={232} ty={30} text="Bina / yerel koruma hacimleri" for="building" />
      </g>
    </svg>
  );
}
