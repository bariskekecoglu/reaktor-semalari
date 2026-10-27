import type { SceneProps } from '../shared/types';
import { Hotspot, Label, SceneNote } from '../shared/SceneContext';
import { Flow } from '../shared/flow/Flow';
import { TurbineGenerator } from '../shared/equipment/TurbineGenerator';
import { Condenser, CoolingSource } from '../shared/equipment/Condenser';
import { GridLink, Pump } from '../shared/equipment/Pump';
import { Bubbles, RodGroup } from '../shared/equipment/animated';

const SEP_X = [280, 310, 340, 370, 400];
const BOX_X = [270, 294, 318, 342, 366, 390];
const ROD_X = [289, 337, 385];

/**
 * BWR sahnesi — tek (doğrudan) çevrim. Odak, büyük reaktör kabı ve içindeki
 * kaynama / ayırma / kurutma bölgeleridir. Buhar kabın üstünden doğrudan türbine gider.
 */
export function BwrScene({ showLabels, showFlow }: SceneProps) {
  return (
    <svg viewBox="0 0 1400 800" className="scene-svg" role="group" aria-label="BWR santral şeması">
      <defs>
        <pattern id="bwr-ground" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="10" className="hatch" />
        </pattern>
      </defs>
      <rect x="0" y="752" width="1400" height="14" fill="url(#bwr-ground)" />

      <Hotspot id="containment" hit={false} pad={0}>
        <path className="containment" d="M150 752 V120 Q150 30 240 30 H530 Q620 30 620 120 V752" />
      </Hotspot>
      <Hotspot id="turbinebldg" hit={false} pad={0}>
        <rect x="660" y="60" width="560" height="430" rx="4" fill="none" className="containment-line" strokeDasharray="10 6" />
      </Hotspot>

      {/* ---------- Reaktör kabı ---------- */}
      {/* Kap içi parçalar vurgulanırken kap çizimi soluklaşmasın (ayırıcı/kurutucu çizimleri kabın içinde). */}
      <Hotspot
        id="vessel"
        contains={['f-core-1', 'f-core-2', 'f-core-3', 'f-steam-1', 'f-steam-2', 'f-steam-3', 'f-moist-L', 'f-moist-R', 'f-down-L', 'f-down-R', 'separators', 'dryers', 'core', 'jetpumps']}
      >
        <path className="vessel-wall thick" d="M230 104 V655 A110 45 0 0 0 450 655 V104 Z" />
        <path className="vessel-head" d="M230 98 A110 45 0 0 1 450 98 Z" />
        <rect className="flange" x="222" y="94" width="236" height="11" />
        {/* Bölgeler: buhar / sıvı / karışım */}
        <rect className="steam-zone" x="236" y="106" width="208" height="149" />
        <path className="water-zone" d="M236 255 H444 V655 A104 40 0 0 1 236 655 Z" />
        <rect className="mix-zone" x="264" y="335" width="152" height="160" opacity="0.9" />
        <line className="level" x1="236" x2="444" y1="255" y2="255" />
        {/* Kurutucular */}
        <rect x="248" y="145" width="184" height="50" fill="none" className="barrel" />
        <path className="dryer" d="M252 160 l10 10 l10 -10 l10 10 l10 -10 l10 10 l10 -10 l10 10 l10 -10 l10 10 l10 -10 l10 10 l10 -10 l10 10 l10 -10 l10 10 l10 -10 l10 10 M252 176 l10 10 l10 -10 l10 10 l10 -10 l10 10 l10 -10 l10 10 l10 -10 l10 10 l10 -10 l10 10 l10 -10 l10 10 l10 -10 l10 10 l10 -10 l10 10" />
        {/* Ayırıcılar + dikey borular */}
        {SEP_X.map((x) => (
          <g key={x}>
            <rect className="separator" x={x - 11} y="222" width="22" height="78" rx="4" />
            <path className="barrel" d={`M${x - 8} 240 l16 10 M${x - 8} 256 l16 10 M${x - 8} 272 l16 10`} />
            <rect className="separator" x={x - 5} y="300" width="10" height="36" />
          </g>
        ))}
        {/* Gömlek ve gömlek başlığı */}
        <path className="shroud" d="M262 345 Q340 318 418 345" />
        <line className="shroud" x1="262" y1="345" x2="262" y2="600" />
        <line className="shroud" x1="418" y1="345" x2="418" y2="600" />
        <line className="barrel" x1="262" y1="600" x2="418" y2="600" strokeDasharray="5 4" />
        {/* Besleme suyu dağıtıcısı */}
        <rect className="nozzle feed" x="436" y="268" width="8" height="12" />
        <rect className="nozzle feed" x="236" y="268" width="8" height="12" />
        {/* Jet pompaları */}
        <path className="jet-pump" d="M430 380 H436 V460 L440 590 H426 L430 460 Z" />
        <path className="jet-pump" d="M250 380 H244 V460 L240 590 H254 L250 460 Z" />
        <rect className="nozzle steam" x="448" y="108" width="12" height="16" />
        <rect className="nozzle" x="448" y="592" width="10" height="16" />
      </Hotspot>

      {/* Çekirdek: kanal kutulu yakıt demetleri */}
      <Hotspot id="core" contains={['f-core-1', 'f-core-2', 'f-core-3']}>
        {BOX_X.map((x) => (
          <g key={x}>
            <rect className="core-zone" x={x} y="420" width="18" height="160" />
            <line className="fuel-rod" x1={x + 6} x2={x + 6} y1="424" y2="576" />
            <line className="fuel-rod" x1={x + 12} x2={x + 12} y1="424" y2="576" />
            <rect className="channel-box" x={x} y="420" width="18" height="160" />
          </g>
        ))}
      </Hotspot>
      <Bubbles x={268} y={425} w={144} h={150} count={20} showFlow={showFlow} speed={34} />

      {/* İç akışlar */}
      <Flow id="f-down-R" d="M380 262 Q430 262 433 300 V590 Q433 640 390 640 H342" kind="cold" pipe={0} speed={45} spacing={22} showFlow={showFlow} r={2.8} />
      <Flow id="f-down-L" d="M300 262 Q250 262 247 300 V590 Q247 640 290 640 H338" kind="cold" pipe={0} speed={45} spacing={22} showFlow={showFlow} r={2.8} />
      <Flow id="f-core-1" d="M310 640 V228" kind="mix" pipe={0} speed={45} spacing={17} showFlow={showFlow} r={2.8} />
      <Flow id="f-core-2" d="M340 640 V228" kind="mix" pipe={0} speed={45} spacing={17} showFlow={showFlow} r={2.8} />
      <Flow id="f-core-3" d="M370 640 V228" kind="mix" pipe={0} speed={45} spacing={17} showFlow={showFlow} r={2.8} />
      <Flow id="f-steam-1" d="M310 222 V170 Q310 115 360 115 H456" kind="steam" pipe={0} speed={50} spacing={22} showFlow={showFlow} r={3} />
      <Flow id="f-steam-2" d="M340 222 V170 Q340 121 380 121 H456" kind="steam" pipe={0} speed={50} spacing={22} showFlow={showFlow} r={3} />
      <Flow id="f-steam-3" d="M370 222 V170 Q370 127 400 127 H456" kind="steam" pipe={0} speed={50} spacing={22} showFlow={showFlow} r={3} />
      <Flow id="f-moist-L" d="M256 196 V252" kind="feed" pipe={0} speed={22} spacing={12} showFlow={showFlow} r={2} />
      <Flow id="f-moist-R" d="M424 196 V252" kind="feed" pipe={0} speed={22} spacing={12} showFlow={showFlow} r={2} />

      {/* Kontrol çubukları: alttan giriş */}
      <Hotspot id="rods">
        <RodGroup travel={160} dir={-1}>
          {ROD_X.map((x) => (
            <rect key={x} className="control-rod" x={x - 2} y="582" width="5" height="160" />
          ))}
        </RodGroup>
        {ROD_X.map((x) => (
          <rect key={x} className="crdm" x={x - 7} y="694" width="14" height="54" rx="2" />
        ))}
      </Hotspot>

      {/* Devridaim döngüsü */}
      <Hotspot id="recirc" contains={['f-recirc-out', 'f-recirc-in']}>
        <Flow id="f-recirc-out" d="M456 600 H500 V700 H515" kind="cold" pipe={10} speed={50} spacing={22} showFlow={showFlow} />
        <Flow id="f-recirc-in" d="M555 700 H575 V520 H440" kind="cold" pipe={10} speed={60} spacing={22} showFlow={showFlow} />
        <Pump x={535} y={700} r={20} motor="none" rps={1.2} />
      </Hotspot>
      <Hotspot id="jetpumps" pad={2}>
        <rect x="425" y="378" width="18" height="214" fill="transparent" />
        <rect x="237" y="378" width="18" height="214" fill="transparent" />
      </Hotspot>

      {/* Ayırıcı/kurutucu tıklama alanları */}
      <Hotspot id="separators" pad={2}>
        <rect x="268" y="220" width="144" height="82" fill="transparent" />
      </Hotspot>
      <Hotspot id="dryers" pad={2}>
        <rect x="248" y="145" width="184" height="50" fill="transparent" />
      </Hotspot>

      {/* ---------- Türbin tarafı ---------- */}
      <Hotspot id="steamline" pad={2} contains={['f-steamline']}>
        <Flow id="f-steamline" d="M456 115 H742 V203" kind="steam" pipe={12} speed={80} spacing={26} showFlow={showFlow} />
      </Hotspot>
      <TurbineGenerator x={720} y={230} ids={{ hp: 'hp', lp: 'lp', gen: 'gen', crossover: 'f-crossover' }} showFlow={showFlow} />
      <Flow id="f-lp-l" d="M925 176 C885 176 872 268 922 296 V318" kind="steam" pipe={0} speed={50} spacing={20} showFlow={showFlow} r={2.8} />
      <Flow id="f-lp-r" d="M945 176 C985 176 998 268 948 296 V318" kind="steam" pipe={0} speed={50} spacing={20} showFlow={showFlow} r={2.8} />
      <GridLink x={1232} y={230} />
      <Condenser x={845} y={306} w={180} h={150} id="condenser" coolId="f-cool" coolTo={1250} showFlow={showFlow} />
      <CoolingSource x={1250} y={330} id="coolsource" />

      <Flow id="f-feed1" d="M890 462 V600 H786" kind="feed" pipe={9} speed={45} spacing={24} showFlow={showFlow} />
      <Flow id="f-feed2" d="M752 600 H600 V275 H452" kind="feed" pipe={9} speed={45} spacing={24} showFlow={showFlow} />
      <Hotspot id="feedpump">
        <Pump x={769} y={600} r={16} motor="side" rps={1.5} />
      </Hotspot>
      <Hotspot id="heater">
        <rect className="heater-box" x="640" y="584" width="54" height="32" rx="5" />
        <path className="heater-coil" d="M646 600 q5 -9 10 0 t10 0 t10 0 t10 0 t10 0" />
      </Hotspot>

      <SceneNote x={930} y={650} w={380} lines={['Buhar reaktör kabında oluşur ve doğrudan', 'türbine gider. Ayrı buhar üreteci ve', 'basınçlandırıcı yoktur; tek çevrim vardır.']} />

      <g className="circuit-tags">
        <text x="160" y="784">REAKTÖR ÇEVRİMİ · su → kaynama → buhar → türbin → kondenser → besleme suyu</text>
        <text x="1060" y="784">SOĞUTMA SUYU · ayrı çevrim</text>
      </g>

      <g className="labels" style={{ display: showLabels ? undefined : 'none' }}>
        <Label x={390} y={31} tx={480} ty={4} text="Koruma yapısı (temsili)" />
        <Label x={300} y={80} tx={8} ty={58} text="Buhar kubbesi" />
        <Label x={432} y={170} tx={470} ty={146} text="Buhar kurutucuları" />
        <Label x={412} y={262} tx={470} ty={196} text="Buhar ayırıcıları" sub="siklon tipi" />
        <Label x={237} y={255} tx={8} ty={226} text="Su seviyesi" sub="(temsili)" />
        <Label x={240} y={340} tx={8} ty={312} text="Downcomer" sub="halkasal boşluk" />
        <Label x={246} y={500} tx={8} ty={440} text="Jet pompaları" />
        <Label x={268} y={540} tx={8} ty={528} text="Çekirdek" sub="kaynama burada" />
        <Label x={289} y={720} tx={8} ty={650} text="Kontrol çubukları" sub="alttan girer" />
        <Label x={525} y={716} tx={470} ty={722} text="Devridaim pompası" />
        <Label x={520} y={275} tx={470} ty={290} text="Besleme suyu" />
        <Label x={560} y={115} tx={480} ty={56} text="Ana buhar hattı" sub="reaktör buharı" />
        <Label x={735} y={210} tx={736} ty={150} text="YB türbini" anchor="end" />
        <Label x={1010} y={176} tx={960} ty={104} text="AB türbini" />
        <Label x={1130} y={186} tx={1106} ty={128} text="Jeneratör" />
        <Label x={1022} y={440} tx={1040} ty={474} text="Kondenser" />
        <Label x={772} y={616} tx={704} ty={652} text="Besleme suyu pompası" />
        <Label x={664} y={584} tx={640} ty={530} text="Ön ısıtıcı" />
        <Label x={1220} y={70} tx={1214} ty={68} text="Türbin binası · korumalı bölge" anchor="end" />
      </g>
    </svg>
  );
}
