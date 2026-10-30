import type { SceneProps } from '../shared/types';
import { Hotspot, Label, SceneNote } from '../shared/SceneContext';
import { Flow } from '../shared/flow/Flow';
import { TurbineGenerator } from '../shared/equipment/TurbineGenerator';
import { Condenser, CoolingSource } from '../shared/equipment/Condenser';
import { GridLink, Pump } from '../shared/equipment/Pump';
import { Bubbles, HeatPulse, RodGroup } from '../shared/equipment/animated';
import { Junction, Penetration } from '../shared/equipment/PipeMarks';
import { PWR_CONDENSER, PWR_FEEDPUMP, PWR_PENETRATIONS, PWR_PRESSURIZER, PWR_RCP, PWR_ROUTES as RT, PWR_TURBINE } from './pwrLayout';

/**
 * PWR sahnesi — dikey U borulu buhar üreteçli temsili basınçlı su reaktörü.
 * Sol: koruma yapısı içinde reaktör kabı, basınçlandırıcı, buhar üreteci ve pompa.
 * Sağ: türbin-jeneratör, kondenser, besleme suyu hattı ve ayrı soğutma suyu çevrimi.
 */
const SURGE = `M${PWR_PRESSURIZER.surgeTop.join(' ')} V${PWR_PRESSURIZER.surgeBottom[1]}`;

export function PwrScene({ showLabels, showFlow }: SceneProps) {
  const fuelX = Array.from({ length: 9 }, (_, i) => 136 + i * 8.5);
  return (
    <svg viewBox="0 0 1400 800" className="scene-svg" role="group" aria-label="PWR santral şeması">
      <defs>
        <pattern id="pwr-ground" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="10" className="hatch" />
        </pattern>
      </defs>
      <rect x="0" y="745" width="1400" height="14" fill="url(#pwr-ground)" className="ground" />

      {/* Koruma yapısı */}
      <Hotspot id="containment" hit={false} pad={0}>
        <path className="containment" d="M40 745 V230 A285 185 0 0 1 610 230 V745" />
      </Hotspot>

      {/* ---------- BİRİNCİL DEVRE ---------- */}
      {/* Reaktör kabı */}
      <Hotspot id="vessel">
        <path className="vessel-wall thick" d="M110 410 V650 A60 55 0 0 0 230 650 V410 Z" />
        <path className="vessel-head" d="M110 400 A60 32 0 0 1 230 400 Z" />
        <rect className="flange" x="102" y="398" width="136" height="13" />
        {/* Çekirdek gömleği */}
        <line className="barrel" x1="124" y1="418" x2="124" y2="662" />
        <line className="barrel" x1="216" y1="418" x2="216" y2="430" />
        <line className="barrel" x1="216" y1="446" x2="216" y2="662" />
        <path className="barrel" d="M124 662 H216" strokeDasharray="5 4" />
        <rect className="core-zone" x="130" y="520" width="80" height="120" />
        {fuelX.map((x) => (
          <line key={x} className="fuel-rod" x1={x} x2={x} y1="524" y2="636" />
        ))}
        {/* Nozullar */}
        <rect className="nozzle hot" x="228" y="430" width="10" height="16" />
        <rect className="nozzle cold" x="228" y="577" width="10" height="16" />
      </Hotspot>
      <Flow id="f-vessel-down" d="M236 585 H222 V650 Q222 676 196 676 H170" kind="cold" pipe={0} speed={55} spacing={20} scale="constant" showFlow={showFlow} r={2.8} />
      <Flow id="f-core-up" d="M170 676 V446 Q170 438 180 438 H236" kind="hot" pipe={0} speed={55} spacing={22} scale="constant" showFlow={showFlow} r={2.8} />

      {/* Kontrol çubukları (üstten) */}
      <Hotspot id="rods">
        {[140, 155, 170, 185, 200].map((x) => (
          <g key={x}>
            <rect className="crdm" x={x - 5} y="300" width="10" height="82" rx="2" />
            <line className="drive-line" x1={x} x2={x} y1="382" y2="520" />
          </g>
        ))}
        <RodGroup travel={110} dir={1}>
          {[144, 161, 178, 195].map((x) => (
            <rect key={x} className="control-rod" x={x - 2.5} y="404" width="5" height="116" />
          ))}
        </RodGroup>
      </Hotspot>

      {/* Basınçlandırıcı */}
      <Hotspot id="pressurizer">
        <rect className="vessel-wall" x="278" y="228" width="44" height="174" rx="22" />
        <path className="pzr-steam" d="M281 320 V250 A19 19 0 0 1 319 250 V320 Z" />
        <path className="pzr-water" d="M281 320 H319 V380 A19 19 0 0 1 281 380 Z" />
        <line className="level" x1="281" x2="319" y1="320" y2="320" />
        <path className="heater" d="M286 388 l4 -8 l4 8 l4 -8 l4 8 l4 -8 l4 8 l4 -8" />
        <path className="spray" d="M300 230 V244 M292 250 l8 -6 l8 6" />
      </Hotspot>
      <Hotspot id="surge" pad={4}>
        <path className="pipe-wall" d={SURGE} strokeWidth={9} />
        <path className="pipe-fluid fluid-hot" d={SURGE} strokeWidth={5} />
      </Hotspot>

      {/* Sıcak kol */}
      <Hotspot id="hotleg" pad={2} contains={['f-hotleg']}>
        <Flow id="f-hotleg" d={RT.hotleg.d} kind="hot" pipe={12} speed={60} spacing={24} scale="constant" showFlow={showFlow} />
      </Hotspot>

      {/* Buhar üreteci */}
      <Hotspot id="sg">
        <path className="sg-shell" d="M465 520 V330 L450 300 V175 A45 28 0 0 1 540 175 V300 L525 330 V520 Z" />
        {/* İkincil su (boru demeti çevresi) */}
        <path className="secondary-water" d="M467 518 V332 L460 318 H530 L523 332 V518 Z" />
        <line className="level" x1="458" x2="532" y1="316" y2="316" />
        {/* Ayırıcılar ve kurutucular */}
        {[468, 495, 522].map((x) => (
          <rect key={x} className="separator" x={x - 8} y="250" width="16" height="44" rx="3" />
        ))}
        <path className="dryer" d="M456 200 l8 8 l8 -8 l8 8 l8 -8 l8 8 l8 -8 l8 8 l8 -8 l8 8 l8 -8 M456 212 l8 8 l8 -8 l8 8 l8 -8 l8 8 l8 -8 l8 8 l8 -8 l8 8 l8 -8" />
        {/* Boru levhası, kanal başlığı, bölme plakası */}
        <rect className="tubesheet" x="462" y="518" width="66" height="9" />
        <path className="channel-head" d="M465 527 A30 34 0 0 0 525 527 Z" />
        <line className="divider" x1="495" y1="527" x2="495" y2="560" />
        {/* U boruları */}
        <HeatPulse>
          {[0, 5, 10, 15].map((k) => (
            <path key={k} className="u-tube-glow" d={`M${472 + k} 518 V${360 + k * 2} A${23 - k} ${23 - k} 0 0 1 ${518 - k} ${360 + k * 2} V518`} />
          ))}
        </HeatPulse>
        {[0, 5, 10, 15].map((k) => (
          <path key={k} className="u-tube" d={`M${472 + k} 518 V${360 + k * 2} A${23 - k} ${23 - k} 0 0 1 ${518 - k} ${360 + k * 2} V518`} />
        ))}
        <rect className="nozzle steam" x="488" y="140" width="14" height="12" />
        <rect className="nozzle feed" x="539" y="279" width="10" height="12" />
      </Hotspot>
      <Bubbles x={467} y={322} w={56} h={192} count={16} showFlow={showFlow} />
      <Flow id="f-sg-tubes" d={RT.sgTubes.d} kind="grad" pipe={0} speed={55} spacing={18} scale="constant" showFlow={showFlow} r={2.6} />
      <Flow id="f-sg-steam" d="M495 312 V160" kind="steam" pipe={0} speed={40} spacing={22} showFlow={showFlow} r={3} />

      {/* Soğuk kol: ara bacak + pompa + reaktör girişi */}
      <Hotspot id="coldleg" pad={2} contains={['f-crossleg', 'f-coldleg']}>
        <Flow id="f-crossleg" d={RT.crossleg.d} kind="cold" pipe={12} speed={60} spacing={24} scale="constant" showFlow={showFlow} />
        <Flow id="f-coldleg" d={RT.coldleg.d} kind="cold" pipe={12} speed={60} spacing={24} scale="constant" showFlow={showFlow} />
      </Hotspot>
      <Hotspot id="rcp">
        <Pump x={PWR_RCP.c[0]} y={PWR_RCP.c[1]} r={PWR_RCP.r} motor="top" rps={1.2} />
      </Hotspot>

      {/* Dalgalanma hattı sıcak kola burada bağlanır (gerçek birleşim). */}
      <Junction at={PWR_PRESSURIZER.surgeBottom} r={3.5} />

      {/* ---------- İKİNCİL DEVRE ---------- */}
      <Hotspot id="steamline" pad={2} contains={['f-steamline']}>
        <Flow id="f-steamline" d={RT.steamline.d} kind="steam" pipe={12} speed={80} spacing={26} showFlow={showFlow} />
      </Hotspot>
      <TurbineGenerator x={PWR_TURBINE.x} y={PWR_TURBINE.y} ids={{ hp: 'hp', lp: 'lp', gen: 'gen', crossover: 'f-crossover' }} showFlow={showFlow} />
      <Flow id="f-lp-l" d="M925 176 C885 176 872 268 922 296 V318" kind="steam" pipe={0} speed={50} spacing={20} showFlow={showFlow} r={2.8} />
      <Flow id="f-lp-r" d="M945 176 C985 176 998 268 948 296 V318" kind="steam" pipe={0} speed={50} spacing={20} showFlow={showFlow} r={2.8} />
      <GridLink x={1232} y={230} />

      <Condenser {...PWR_CONDENSER} id="condenser" coolId="f-cool" coolTo={1250} showFlow={showFlow} />
      <CoolingSource x={1250} y={330} id="coolsource" />

      {/* Besleme suyu dönüşü */}
      <Flow id="f-feed1" d={RT.feed1.d} kind="feed" pipe={9} speed={45} spacing={24} showFlow={showFlow} />
      <Flow id="f-feed2" d={RT.feed2.d} kind="feed" pipe={9} speed={45} spacing={24} showFlow={showFlow} />
      <Hotspot id="feedpump">
        {/* Motor üstte: emme (sağdan) ve basma (soldan) hatları motorun içinden geçmez. */}
        <Pump x={PWR_FEEDPUMP.c[0]} y={PWR_FEEDPUMP.c[1]} r={PWR_FEEDPUMP.r} motor="top" rps={1.5} />
      </Hotspot>
      <Hotspot id="heater">
        <rect className="heater-box" x="640" y="584" width="54" height="32" rx="5" />
        <path className="heater-coil" d="M646 600 q5 -9 10 0 t10 0 t10 0 t10 0 t10 0" />
      </Hotspot>

      {PWR_PENETRATIONS.map((p) => (
        <Penetration key={p.at.join()} {...p} />
      ))}

      <SceneNote
        x={930}
        y={650}
        w={360}
        lines={['Birincil su U boruların içinde kalır;', 'ikincil tarafa akışkan değil, yalnız ısı geçer.', 'Normal çalışmada birincil devrede toplu kaynama yok.']}
      />

      {/* Devre etiketleri (renge bağımlı olmayan) */}
      <g className="circuit-tags">
        <text x="56" y="782">BİRİNCİL DEVRE · basınçlı su · düz çizgi</text>
        <text x="640" y="782">İKİNCİL DEVRE · buhar (kesikli) / besleme suyu (noktalı)</text>
        <text x="1110" y="782">SOĞUTMA SUYU · kesik-noktalı</text>
      </g>

      <g className="labels" style={{ display: showLabels ? undefined : 'none' }}>
        <Label x={325} y={46} tx={372} ty={10} text="Koruma yapısı (containment)" for="containment" />
        <Label x={140} y={310} tx={58} ty={250} text="Kontrol çubukları" sub="üstten girer" for="rods" />
        <Label x={112} y={470} tx={56} ty={708} text="Reaktör basınç kabı" for="vessel" />
        <Label x={322} y={292} tx={334} ty={196} text="Basınçlandırıcı" sub="su + buhar yastığı" for="pressurizer" />
        {/* Kılavuz çizgi besleme hattını kesmesin diye yazı buhar üretecinin sağ üstünde. */}
        <Label x={540} y={235} tx={556} ty={186} text="Buhar üreteci" sub="dikey, U borulu" for="sg" />
        {/* Pompanın altından geçen ara bacağı kesmemek için iki satır, pompa ile buhar üreteci arasında. */}
        <Label x={401} y={646} tx={420} ty={616} text={'Birincil\npompa'} for="rcp" />
        <Label x={735} y={210} tx={628} ty={150} text="YB türbini" for="hp" />
        <Label x={1010} y={176} tx={960} ty={104} text="AB türbini" for="lp" />
        <Label x={1130} y={186} tx={1106} ty={128} text="Jeneratör" for="gen" />
        <Label x={1022} y={440} tx={1040} ty={474} text="Kondenser" for="condenser" />
        <Label x={772} y={616} tx={704} ty={652} text="Besleme suyu pompası" for="feedpump" />
        {/* Ayrıntı: devreler ve alt bileşenler */}
        <Label level="detail" x={205} y={625} tx={235} ty={690} text="Yakıt (çekirdek)" for="vessel" />
        <Label level="detail" x={340} y={438} tx={318} ty={466} text="Sıcak kol" for="hotleg" />
        <Label level="detail" x={252} y={585} tx={292} ty={606} text="Soğuk kol" for="coldleg" />
        <Label level="detail" x={650} y={108} tx={630} ty={66} text="Ana buhar hattı" sub="ikincil devre" for="steamline" />
        <Label level="detail" x={664} y={584} tx={622} ty={530} text="Ön ısıtıcı" for="heater" />
        <Label level="detail" x={308} y={246} tx={340} ty={244} text="Püskürtme" />
        <Label level="detail" x={316} y={384} tx={340} ty={366} text="Isıtıcılar" />
        <Label level="detail" x={300} y={418} tx={340} ty={392} text={'Dalgalanma\nhattı'} for="surge" />
        <Label level="detail" x={522} y={272} tx={438} ty={272} text={'Ayırıcı ve\nkurutucular'} anchor="end" />
        <Label level="detail" x={518} y={430} tx={532} ty={424} text={'U\nboruları'} />
      </g>
    </svg>
  );
}
