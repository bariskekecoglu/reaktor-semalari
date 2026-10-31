import type { SceneProps } from '../shared/types';
import { Hotspot, Label, SceneNote } from '../shared/SceneContext';
import { Flow } from '../shared/flow/Flow';
import { TurbineGenerator } from '../shared/equipment/TurbineGenerator';
import { Condenser, CoolingSource } from '../shared/equipment/Condenser';
import { GridLink, Pump } from '../shared/equipment/Pump';
import { Bubbles, RodGroup } from '../shared/equipment/animated';
import { Junction, Penetration } from '../shared/equipment/PipeMarks';
import { FluidTag, MaterialDefs, PipeBridge } from '../shared/equipment/materials';
import {
  CAL,
  CANDU_CONDENSER,
  CANDU_FEEDPUMP,
  CANDU_ROUTES as RT,
  CANDU_TURBINE,
  CH_FLOW_IDS,
  CH_Y,
  channelPath,
  CONTAINMENT,
  containmentRightAtY,
  CT_HALF,
  EF,
  END_SHIELD,
  FEED_SPLIT,
  FEEDER_CROSSINGS,
  FEEDER_L_IDS,
  FEEDER_R_IDS,
  feederRoute,
  HDR,
  HDR_R,
  HTP,
  HTP_R,
  MOD,
  PT,
  PZR,
  SG,
  sgShell,
  sgTubePath,
  STEAM_HEADER_Y,
} from './canduLayout';

const BUNDLES = 12;
const ROD_X = [330, 470];
const ROD_TRAVEL = 110;
const LEFT = FEEDER_L_IDS.map((id, i) => ({ id, i, r: feederRoute('left', i) }));
const RIGHT = FEEDER_R_IDS.map((id, i) => ({ id, i, r: feederRoute('right', i) }));
/** Kesişmede altta kalan besleyiciler önce, üstten geçen (kanal 2’nin, i = 1) en son çizilir. */
const ORDER = [0, 2, 3, 1];

function SteamGenerator({ id, cx, tubesId, showFlow }: { id: string; cx: number; tubesId: string; showFlow: boolean }) {
  const clip = `candu-sg-clip-${id}`;
  return (
    <>
      <defs>
        <clipPath id={clip}>
          <path d={sgShell(cx)} />
        </clipPath>
      </defs>
      <Hotspot id={id} contains={[tubesId]}>
        <path className="sg-shell" d={sgShell(cx)} />
        <g clipPath={`url(#${clip})`}>
          <rect className="secondary-water" x={cx - 40} y={SG.level} width={80} height={SG.bottom - SG.level} />
        </g>
        <line className="level" x1={cx - 30} x2={cx + 30} y1={SG.level} y2={SG.level} />
        <path className="dryer" d={`M${cx - 30} 150 l10 7 l10 -7 l10 7 l10 -7 l10 7 l10 -7`} />
        {[0, 8, 16].map((k) => (
          <path key={k} className="u-tube" d={`M${cx - 20 + k} ${SG.bottom} V${206 + k} A${20 - k} ${20 - k} 0 0 1 ${cx + 20 - k} ${206 + k} V${SG.bottom}`} />
        ))}
        <path className="channel-head" d={`M${cx - SG.half} ${SG.bottom} A${SG.half} ${SG.head.ry} 0 0 0 ${cx + SG.half} ${SG.bottom} Z`} />
        <line className="divider" x1={cx} x2={cx} y1={SG.bottom} y2={SG.bottom + SG.head.ry} />
        <rect className="nozzle steam" x={cx - 7} y={SG.top - 4} width={14} height={10} />
      </Hotspot>
      <Bubbles x={cx - 26} y={SG.level + 2} w={52} h={50} count={10} showFlow={showFlow} speed={16} />
      <Flow
        id={tubesId}
        d={sgTubePath(cx)}
        kind="grad"
        pipe={0}
        speed={40}
        spacing={15}
        scale="constant"
        showFlow={showFlow}
        r={2.4}
      />
      <Flow id={`${id}-steam-in`} d={`M${cx} ${SG.level - 2} V${SG.top + 4}`} kind="steam" pipe={0} speed={24} spacing={14} showFlow={showFlow} r={2.4} />
    </>
  );
}

/**
 * CANDU sahnesi — yatay calandria, yatay basınç tüplü kanallar, sekiz biçimli birincil ağır su halkası,
 * ayrı ikincil hafif su devresi ve ayrı moderatör soğutma sistemi. Temsili CANDU 6; PWR kabından türetilmemiştir.
 */
export function CanduScene({ showLabels, showFlow }: SceneProps) {
  const domeX = containmentRightAtY(STEAM_HEADER_Y);
  return (
    <svg viewBox="0 0 1400 800" className="scene-svg" role="group" aria-label="CANDU santral şeması">
      <defs>
        <pattern id="candu-ground" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="10" className="hatch" />
        </pattern>
        <MaterialDefs prefix="candu" />
      </defs>
      <rect x="0" y="745" width="1400" height="14" fill="url(#candu-ground)" />

      <Hotspot id="containment" hit={false} pad={0}>
        <path
          className="containment"
          d={`M${CONTAINMENT.left} 745 V${CONTAINMENT.springY} A${(CONTAINMENT.right - CONTAINMENT.left) / 2} ${CONTAINMENT.ry} 0 0 1 ${CONTAINMENT.right} ${CONTAINMENT.springY} V745`}
        />
      </Hotspot>

      {/* ---------- Moderatör soğutma sistemi (ayrı, düşük basınçlı) ---------- */}
      <Hotspot id="modsys" pad={4} contains={['f-mod-out', 'f-mod-hx', 'f-mod-in', 'f-modcool']}>
        <Flow id="f-mod-out" d={RT.modOut.d} kind="mod" pipe={8} speed={30} spacing={20} scale="constant" showFlow={showFlow} r={2.6} />
        <Flow id="f-mod-hx" d={RT.modToHx.d} kind="mod" pipe={8} speed={30} spacing={20} scale="constant" showFlow={showFlow} r={2.6} />
        <Flow id="f-mod-in" d={RT.modIn.d} kind="mod" pipe={8} speed={30} spacing={20} scale="constant" showFlow={showFlow} r={2.6} />
        <rect className="hx-shell" x={MOD.hx.x} y={MOD.hx.y} width={MOD.hx.w} height={MOD.hx.h} rx={8} />
        {[0, 1, 2].map((k) => (
          <line key={k} className="tube-line" x1={MOD.hx.x + 8} x2={MOD.hx.x + MOD.hx.w - 8} y1={MOD.hx.y + 12 + k * 8} y2={MOD.hx.y + 12 + k * 8} />
        ))}
        <Flow id="f-modcool" d={`M${MOD.hx.x + 22} 714 V${MOD.hx.y + MOD.hx.h} M${MOD.hx.x + 58} ${MOD.hx.y + MOD.hx.h} V714`} kind="cool" pipe={4} speed={20} spacing={12} scale="constant" showFlow={showFlow} r={1.8} />
        <Pump x={MOD.pump.c[0]} y={MOD.pump.c[1]} r={MOD.pump.r} motor="none" rps={0.8} />
      </Hotspot>

      {/* ---------- Calandria ve ağır su moderatörü ---------- */}
      <Hotspot id="moderator" pad={0}>
        <rect x={CAL.x0} y={CAL.y0} width={CAL.x1 - CAL.x0} height={CAL.y1 - CAL.y0} fill="url(#candu-d2o)" />
      </Hotspot>

      {/* Reaktivite kontrol düzenekleri: moderatörün içinden, kanalların arasından geçer */}
      <Hotspot id="rods" hit={false} pad={2}>
        {ROD_X.map((x) => (
          <g key={x}>
            <rect className="ctrl-channel" x={x - 4} y={CAL.y0 - 30} width={8} height={CAL.y1 - CAL.y0 + 18} />
            <rect className="ctrl-drive" x={x - 9} y={CAL.y0 - 38} width={18} height={14} rx={2} />
          </g>
        ))}
        <RodGroup travel={ROD_TRAVEL} dir={1}>
          {ROD_X.map((x) => (
            <rect key={x} className="control-rod" x={x - 2.5} y={CAL.y0 - 24} width={5} height={60} />
          ))}
        </RodGroup>
      </Hotspot>

      <Hotspot id="calandria" hit={false} pad={2}>
        <rect className="calandria-shell" x={CAL.x0} y={CAL.y0} width={CAL.x1 - CAL.x0} height={CAL.y1 - CAL.y0} rx={6} />
      </Hotspot>
      <Hotspot id="endshields" hit={false} pad={1}>
        <rect className="end-shield" x={CAL.x0 - END_SHIELD.w} y={END_SHIELD.y0} width={END_SHIELD.w} height={END_SHIELD.y1 - END_SHIELD.y0} />
        <rect className="end-shield" x={CAL.x1} y={END_SHIELD.y0} width={END_SHIELD.w} height={END_SHIELD.y1 - END_SHIELD.y0} />
        {CH_Y.map((y) => (
          <g key={y}>
            <rect className="end-fitting" x={PT.x0 - EF.w} y={y - EF.half} width={EF.w} height={EF.half * 2} rx={2} />
            <rect className="end-fitting" x={PT.x1} y={y - EF.half} width={EF.w} height={EF.half * 2} rx={2} />
          </g>
        ))}
      </Hotspot>

      {/* ---------- Yatay yakıt kanalları: calandria tüpü (dış) + gaz halkası + basınç tüpü (iç) ---------- */}
      <Hotspot id="channels" hit={false} pad={1} contains={[...CH_FLOW_IDS, ...FEEDER_L_IDS, ...FEEDER_R_IDS]}>
        {CH_Y.map((y) => (
          <g key={y}>
            <rect className="calandria-tube" x={CAL.x0} y={y - CT_HALF} width={CAL.x1 - CAL.x0} height={CT_HALF * 2} />
            <rect className="pressure-tube" x={PT.x0} y={y - PT.half} width={PT.x1 - PT.x0} height={PT.half * 2} />
          </g>
        ))}
      </Hotspot>
      <Hotspot id="fuel" hit={false} pad={1}>
        {CH_Y.map((y) =>
          Array.from({ length: BUNDLES }, (_, k) => {
            const w = (CAL.x1 - CAL.x0 - 10) / BUNDLES;
            return <rect key={`${y}-${k}`} className="fuel-bundle" x={CAL.x0 + 5 + k * w + 0.8} y={y - 3.5} width={w - 1.6} height={7} rx={1.5} />;
          }),
        )}
      </Hotspot>
      {CH_Y.map((_, i) => (
        <Flow key={i} id={CH_FLOW_IDS[i]} d={channelPath(i)} kind="grad" invert pipe={0} speed={50} spacing={20} scale="constant" showFlow={showFlow} r={2.6} />
      ))}

      {/* ---------- Besleyiciler (kesişmeler köprüyle; birleşme değil) ---------- */}
      <Hotspot id="feeders-l" hit={false} pad={2} contains={FEEDER_L_IDS}>
        {ORDER.map((i) => (
          <g key={i}>
            {i === 1 && <PipeBridge at={FEEDER_CROSSINGS[0].at} orient="h" pipe={5} len={16} />}
            <Flow id={LEFT[i].id} d={LEFT[i].r.d} kind={i % 2 === 0 ? 'cold' : 'hot'} pipe={5} speed={40} spacing={14} scale="constant" showFlow={showFlow} r={2.1} />
          </g>
        ))}
      </Hotspot>
      <Hotspot id="feeders-r" hit={false} pad={2} contains={FEEDER_R_IDS}>
        {ORDER.map((i) => (
          <g key={i}>
            {i === 1 && <PipeBridge at={FEEDER_CROSSINGS[1].at} orient="h" pipe={5} len={16} />}
            <Flow id={RIGHT[i].id} d={RIGHT[i].r.d} kind={i % 2 === 0 ? 'hot' : 'cold'} pipe={5} speed={40} spacing={14} scale="constant" showFlow={showFlow} r={2.1} />
          </g>
        ))}
      </Hotspot>

      {/* ---------- Kolektörler (uç görünüş) ---------- */}
      <Hotspot id="headers-l" hit={false} pad={2}>
        <circle className="header-end cold" cx={HDR.in1.c[0]} cy={HDR.in1.c[1]} r={HDR_R} />
        <circle className="header-end" cx={HDR.out2.c[0]} cy={HDR.out2.c[1]} r={HDR_R} />
      </Hotspot>
      <Hotspot id="headers-r" hit={false} pad={2}>
        <circle className="header-end" cx={HDR.out1.c[0]} cy={HDR.out1.c[1]} r={HDR_R} />
        <circle className="header-end cold" cx={HDR.in2.c[0]} cy={HDR.in2.c[1]} r={HDR_R} />
      </Hotspot>

      {/* ---------- Birincil halka: kolektör → buhar üreteci → pompa → kolektör ---------- */}
      <Flow id="f-out2-sg1" d={RT.out2ToSg1.d} kind="hot" pipe={9} speed={50} spacing={20} scale="constant" showFlow={showFlow} r={2.6} />
      <Flow id="f-sg1-p1" d={RT.sg1ToP1.d} kind="cold" pipe={9} speed={50} spacing={20} scale="constant" showFlow={showFlow} r={2.6} />
      <Flow id="f-p1-in1" d={RT.p1ToIn1.d} kind="cold" pipe={9} speed={50} spacing={20} scale="constant" showFlow={showFlow} r={2.6} />
      <Flow id="f-out1-sg2" d={RT.out1ToSg2.d} kind="hot" pipe={9} speed={50} spacing={20} scale="constant" showFlow={showFlow} r={2.6} />
      <Flow id="f-sg2-p2" d={RT.sg2ToP2.d} kind="cold" pipe={9} speed={50} spacing={20} scale="constant" showFlow={showFlow} r={2.6} />
      <Flow id="f-p2-in2" d={RT.p2ToIn2.d} kind="cold" pipe={9} speed={50} spacing={20} scale="constant" showFlow={showFlow} r={2.6} />

      <SteamGenerator id="sg1" cx={SG.left.cx} tubesId="f-sg1-tubes" showFlow={showFlow} />
      <SteamGenerator id="sg2" cx={SG.right.cx} tubesId="f-sg2-tubes" showFlow={showFlow} />

      <Hotspot id="htp1">
        <Pump x={HTP.left[0]} y={HTP.left[1]} r={HTP_R} motor="top" rps={1.2} />
      </Hotspot>
      <Hotspot id="htp2">
        <Pump x={HTP.right[0]} y={HTP.right[1]} r={HTP_R} motor="top" rps={1.2} />
      </Hotspot>

      {/* Basınçlandırıcı */}
      <Hotspot id="pressurizer" contains={['f-surge']}>
        <rect className="vessel-wall" x={PZR.x} y={PZR.y} width={PZR.w} height={PZR.h} rx={PZR.w / 2} />
        <path className="pzr-steam" d={`M${PZR.x + 3} 220 V${PZR.y + 20} A17 17 0 0 1 ${PZR.x + PZR.w - 3} ${PZR.y + 20} V220 Z`} />
        <path className="pzr-water" d={`M${PZR.x + 3} 220 H${PZR.x + PZR.w - 3} V${PZR.y + PZR.h - 20} A17 17 0 0 1 ${PZR.x + 3} ${PZR.y + PZR.h - 20} Z`} />
        <line className="level" x1={PZR.x + 3} x2={PZR.x + PZR.w - 3} y1={220} y2={220} />
      </Hotspot>
      <Flow id="f-surge" d={RT.surge.d} kind="hot" pipe={6} speed={0} spacing={40} scale="constant" showFlow={false} />
      <Junction at={RT.surge.end} r={3.5} />

      {/* ---------- İkincil devre: buhar (hafif su) türbine ---------- */}
      <Hotspot id="steamline" pad={2} contains={['f-steamline', 'f-steam-2']}>
        <Flow id="f-steamline" d={RT.steamline.d} kind="steam" pipe={11} speed={80} spacing={26} showFlow={showFlow} />
        <Flow id="f-steam-2" d={RT.steamRight.d} kind="steam" pipe={11} speed={40} spacing={20} showFlow={showFlow} />
        <Junction at={[SG.right.cx, STEAM_HEADER_Y]} r={3.6} />
      </Hotspot>
      <Penetration at={[domeX, STEAM_HEADER_Y]} orient="h" pipe={11} />

      <TurbineGenerator x={CANDU_TURBINE.x} y={CANDU_TURBINE.y} ids={{ hp: 'hp', lp: 'lp', gen: 'gen', crossover: 'f-crossover' }} showFlow={showFlow} />
      <Flow id="f-lp-l" d="M1005 206 C965 206 952 298 1002 326 V348" kind="steam" pipe={0} speed={50} spacing={20} showFlow={showFlow} r={2.8} />
      <Flow id="f-lp-r" d="M1025 206 C1065 206 1078 298 1028 326 V348" kind="steam" pipe={0} speed={50} spacing={20} showFlow={showFlow} r={2.8} />
      <GridLink x={1296} y={260} />
      <Condenser {...CANDU_CONDENSER} id="condenser" coolId="f-cool" coolTo={1150} showFlow={showFlow} />
      <CoolingSource x={1150} y={360} id="coolsource" />

      <Flow id="f-feed1" d={RT.feed1.d} kind="feed" pipe={9} speed={45} spacing={24} showFlow={showFlow} />
      <Flow id="f-feed2" d={RT.feed2.d} kind="feed" pipe={9} speed={45} spacing={24} showFlow={showFlow} />
      <Flow id="f-feed3" d={RT.feed3.d} kind="feed" pipe={9} speed={45} spacing={24} showFlow={showFlow} />
      <Junction at={FEED_SPLIT} r={3.8} />
      <Penetration at={[CONTAINMENT.right, CANDU_FEEDPUMP.c[1]]} orient="h" pipe={9} />
      <Hotspot id="feedpump">
        <Pump x={CANDU_FEEDPUMP.c[0]} y={CANDU_FEEDPUMP.c[1]} r={CANDU_FEEDPUMP.r} motor="top" rps={1.5} />
      </Hotspot>

      {/* Akışkan etiketleri: renge ek metin */}
      <FluidTag x={400} y={450} text="D₂O · moderatör · düşük basınç" kind="mod" />
      <FluidTag x={556} y={344} text="D₂O · birincil · basınçlı" />
      <FluidTag x={SG.right.cx} y={262} text="H₂O" />
      <FluidTag x={SG.left.cx} y={262} text="H₂O" />
      <FluidTag x={470} y={STEAM_HEADER_Y} text="buhar (H₂O)" />
      <FluidTag x={HDR.in1.c[0]} y={HDR.in1.c[1] + 1} text="G" />
      <FluidTag x={HDR.out2.c[0]} y={HDR.out2.c[1] + 1} text="Ç" />
      <FluidTag x={HDR.out1.c[0]} y={HDR.out1.c[1] + 1} text="Ç" />
      <FluidTag x={HDR.in2.c[0]} y={HDR.in2.c[1] + 1} text="G" />

      <SceneNote
        x={900}
        y={520}
        w={490}
        lines={[
          'Temsili CANDU 6 (ölçeksiz): iki ısı taşıma halkasından biri çizildi.',
          '380 kanal yerine 4 temsili kanal; komşu kanallarda akış ters yönde.',
          'Kolektörler uç görünüşte daire: G = giriş, Ç = çıkış. Köprülü geçişler birleşmez.',
        ]}
      />

      <g className="circuit-tags">
        <text x="56" y="782">BİRİNCİL · basınçlı ağır su (D₂O) · moderatör ayrı D₂O sistemi</text>
        <text x="760" y="782">İKİNCİL · hafif su: buhar (kesikli) / besleme (noktalı)</text>
        <text x="1220" y="782">SOĞUTMA SUYU</text>
      </g>

      <g className="labels" style={{ display: showLabels ? undefined : 'none' }}>
        <Label x={250} y={40} tx={60} ty={2} text="Koruma binası" for="containment" />
        <Label x={100} y={170} tx={8} ty={40} text="BÜ-1" sub="buhar üreteci" for="sg1" />
        <Label x={700} y={170} tx={560} ty={14} text="BÜ-2" sub="buhar üreteci" for="sg2" />
        <Label x={198} y={300} tx={215} ty={226} text="P-1" sub="ısı taşıma pompası" for="htp1" />
        <Label x={744} y={300} tx={742} ty={358} text="P-2" for="htp2" />
        <Label x={392} y={190} tx={215} ty={168} text="Basınçlandırıcı" for="pressurizer" />
        <Label x={330} y={414} tx={210} ty={112} text="Reaktivite kontrol düzenekleri" sub="moderatör içinden" for="rods" />
        <Label x={556} y={444} tx={460} ty={128} text="Calandria" sub="düşük basınçlı tank, kap değil" for="calandria" />
        <Label x={520} y={530} tx={460} ty={186} text="Ağır su moderatörü" sub="D₂O · düşük basınç" for="moderator" />
        <Label x={548} y={590} tx={460} ty={244} text="Yatay yakıt kanalları" sub="basınç tüpü + calandria tüpü" for="channels" />
        <Label x={340} y={688} tx={70} ty={690} text="Moderatör soğutma sistemi" sub="ayrı · birincille bağlantısız" for="modsys" />
        <Label x={840} y={300} tx={846} ty={318} text="YB türbini" for="hp" />
        <Label x={1090} y={206} tx={1040} ty={134} text="AB türbini" for="lp" />
        <Label x={1210} y={216} tx={1186} ty={158} text="Jeneratör" for="gen" />
        <Label x={1102} y={470} tx={1110} ty={496} text="Kondenser" for="condenser" />
        <Label x={872} y={636} tx={804} ty={672} text="Besleme suyu pompası" for="feedpump" />
        {/* Ayrıntı */}
        <Label level="detail" x={104} y={346} tx={8} ty={300} text="Kolektörler" sub="G giriş · Ç çıkış" for="headers-l" />
        <Label level="detail" x={110} y={500} tx={8} ty={512} text="Besleyiciler" for="feeders-l" />
        <Label level="detail" x={600} y={630} tx={600} ty={656} text="Uç kalkanı" sub="ve uç bağlantıları" for="endshields" />
        <Label level="detail" x={262} y={590} tx={70} ty={630} text="Yakıt demetleri" sub="kanal başına 12 (CANDU 6)" for="fuel" />
        <Label level="detail" x={300} y={STEAM_HEADER_Y} tx={290} ty={56} text="Ana buhar hattı" for="steamline" />
        <Label level="detail" x={636} y={396} tx={630} ty={402} text="Sağ kolektörler" anchor="end" for="headers-r" />
      </g>
    </svg>
  );
}
