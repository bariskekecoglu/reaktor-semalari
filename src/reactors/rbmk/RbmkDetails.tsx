import type { DetailProps } from '../shared/types';
import { Label } from '../shared/SceneContext';
import { Flow } from '../shared/flow/Flow';
import { Bubbles } from '../shared/equipment/animated';
import { FluidTag, MaterialDefs } from '../shared/equipment/materials';
import { route } from '../shared/geometry/route';
import { RbmkCoreDetail } from './RbmkCoreDetail';

/** Yakın plan 1: grafit kolonu – basınç tüpü – soğutucu – yakıt (üstten kesit + yan görünüş). */
function ChannelCloseUp({ showFlow }: { showFlow: boolean }) {
  const cx = 150;
  const cy = 170;
  const pins = [
    ...Array.from({ length: 6 }, (_, k) => ({ r: 18, a: (Math.PI / 3) * k })),
    ...Array.from({ length: 12 }, (_, k) => ({ r: 34, a: (Math.PI / 6) * k + Math.PI / 12 })),
  ];
  return (
    <svg viewBox="0 0 720 430" className="detail-svg" role="img" aria-label="RBMK kanal kesiti: grafit blok, basınç tüpü, hafif su soğutucu ve yakıt çubukları">
      <defs>
        <MaterialDefs prefix="rbmkd1" />
      </defs>
      <text x="150" y="26" textAnchor="middle" className="detail-caption">
        Üstten kesit (bir grafit kolonu)
      </text>
      <rect x={cx - 100} y={cy - 100} width="200" height="200" fill="url(#rbmkd1-graphite)" className="graphite-block" />
      <circle cx={cx} cy={cy} r={64} className="gas-gap" stroke="#45464a" strokeWidth={1.2} />
      <circle cx={cx} cy={cy} r={58} className="pressure-tube" />
      <circle cx={cx} cy={cy} r={51} className="h2o-zone" />
      <circle cx={cx} cy={cy} r={5} className="end-fitting" />
      {pins.map((p, i) => (
        <circle key={i} cx={cx + p.r * Math.cos(p.a)} cy={cy + p.r * Math.sin(p.a)} r={6.2} className="fuel-pin" />
      ))}
      <FluidTag x={cx} y={cy + 84} text="GRAFİT" kind="graphite" />

      <text x="540" y="26" textAnchor="middle" className="detail-caption">
        Yan görünüş (ölçeksiz)
      </text>
      {Array.from({ length: 6 }, (_, k) => (
        <rect key={k} x="470" y={80 + k * 42} width="140" height="40" fill="url(#rbmkd1-graphite)" className="graphite-block" />
      ))}
      <rect x="460" y="56" width="160" height="22" className="shield-plate" />
      <rect x="460" y="334" width="160" height="22" className="shield-plate" />
      <rect x="526" y="40" width="28" height="332" rx="3" className="channel-tube" />
      <rect x="535" y="90" width="10" height="236" className="fuel-assy" />
      <Flow id="d1-flow" d="M540 372 V40" kind="mix" boilAt={0.4} pipe={0} speed={36} spacing={16} scale="constant" showFlow={showFlow} r={2.8} />
      <text x="540" y="398" textAnchor="middle" className="detail-caption small">
        ↑ su alttan girer
      </text>

      <g className="labels">
        <Label x={210} y={95} tx={262} ty={64} text="Grafit blok" sub="moderatör" anchor="start" />
        <Label x={196} y={208} tx={262} ty={214} text="Basınç tüpü" sub="basınç sınırı" anchor="start" />
        <Label x={140} y={137} tx={262} ty={128} text="Hafif su soğutucu" sub="kanalda kaynar" anchor="start" />
        <Label x={183} y={170} tx={262} ty={170} text="Yakıt çubukları" sub="Zr kaplı UO₂" anchor="start" />
        <Label x={208} y={164} tx={262} ty={270} text="Grafitle tüp arası" sub="bloklar arası N₂–He gazı" anchor="start" />
        <Label x={618} y={66} tx={630} ty={40} text="Üst plaka" anchor="start" />
        <Label x={618} y={344} tx={630} ty={330} text="Alt plaka" anchor="start" />
      </g>
      <text x="20" y="412" className="detail-note">
        Basınç tüpün içinde tutulur; grafit basınç altında değildir. Grafit, zırh ve bina ayrı yapılardır. Çubuk sayısı ve boşluk temsilidir.
      </text>
    </svg>
  );
}

/** Yakın plan 2: kanal içinde kaynama; her kanalın kendi buhar–su borusu. */
const B_CH = [150, 250] as const;
const B_DRUM = { x0: 440, x1: 580, cy: 165, r: 40 };
const B_RISER = [
  route([150, 70], [{ v: 30 }, { h: 545 }, { v: B_DRUM.cy - B_DRUM.r + 2 }], 12),
  route([250, 70], [{ v: 52 }, { h: 490 }, { v: B_DRUM.cy - B_DRUM.r + 2 }], 12),
];

function BoilingCloseUp({ showFlow }: { showFlow: boolean }) {
  const drum = `M${B_DRUM.x0} ${B_DRUM.cy - B_DRUM.r} H${B_DRUM.x1} A${B_DRUM.r} ${B_DRUM.r} 0 0 1 ${B_DRUM.x1} ${B_DRUM.cy + B_DRUM.r} H${B_DRUM.x0} A${B_DRUM.r} ${B_DRUM.r} 0 0 1 ${B_DRUM.x0} ${B_DRUM.cy - B_DRUM.r} Z`;
  return (
    <svg viewBox="0 0 720 450" className="detail-svg" role="img" aria-label="RBMK kanalında kaynama: su alttan girer, yukarı akarken kaynar, karışım kendi borusuyla ayırıcı tambura gider">
      <defs>
        <MaterialDefs prefix="rbmkd2" />
        <clipPath id="rbmkd2-drum">
          <path d={drum} />
        </clipPath>
      </defs>
      <rect x="100" y="90" width="200" height="290" fill="url(#rbmkd2-graphite)" className="graphite-block" />
      {B_CH.map((x) => (
        <g key={x}>
          <rect x={x - 13} y="70" width="26" height="330" rx="3" className="channel-tube" />
          <rect x={x - 4} y="110" width="8" height="250" className="fuel-assy" />
        </g>
      ))}
      {/* Kaynama başlangıcı bölgesi (temsili konum) */}
      <line x1="110" x2="290" y1="270" y2="270" className="level" strokeDasharray="5 4" />
      {B_CH.map((x) => (
        <Flow key={x} id={`d2-ch-${x}`} d={`M${x} 420 V70`} kind="mix" boilAt={0.42} pipe={0} speed={36} spacing={15} scale="constant" showFlow={showFlow} r={3} />
      ))}
      {B_RISER.map((r, i) => (
        <Flow key={i} id={`d2-riser-${i}`} d={r.d} kind="mix" boilAt={0} pipe={8} speed={36} spacing={16} showFlow={showFlow} r={2.6} />
      ))}
      <path className="drum" d={drum} />
      <g clipPath="url(#rbmkd2-drum)">
        <rect className="secondary-water" x={B_DRUM.x0 - B_DRUM.r} y={B_DRUM.cy + 4} width={300} height={80} />
      </g>
      <line className="level" x1={B_DRUM.x0 - 30} x2={B_DRUM.x1 + 30} y1={B_DRUM.cy + 4} y2={B_DRUM.cy + 4} />
      <Bubbles x={452} y={B_DRUM.cy + 6} w={90} h={28} count={10} showFlow={showFlow} speed={14} />
      <Flow id="d2-steam" d={`M600 ${B_DRUM.cy} V40`} kind="steam" pipe={9} speed={30} spacing={18} showFlow={showFlow} r={2.8} />
      <Flow id="d2-down" d={`M560 ${B_DRUM.cy + B_DRUM.r - 2} V420`} kind="cold" pipe={9} speed={30} spacing={18} scale="constant" showFlow={showFlow} r={2.6} />
      <FluidTag x={200} y={414} text="H₂O · alt-soğutulmuş su" />
      <FluidTag x={360} y={18} text="H₂O + buhar" />
      <g className="labels">
        <Label x={250} y={340} tx={320} ty={330} text="Su yukarı akarken ısınır" anchor="start" />
        <Label x={290} y={270} tx={320} ty={258} text="Kaynama başlar" sub="konum güce ve giriş koşullarına bağlı" anchor="start" />
        <Label x={250} y={150} tx={320} ty={196} text="Buhar–su karışımı" sub="kabarcıklar yukarı" anchor="start" />
        <Label x={300} y={52} tx={300} ty={86} text="Her kanalın kendi borusu" sub="birleşmez · kesişmez" anchor="start" />
        <Label x={606} y={70} tx={700} ty={34} text="Buhar türbine" anchor="end" />
        <Label x={564} y={300} tx={574} ty={312} text="Su iniş borusuna" sub="→ pompa → kanallar" anchor="start" />
        <Label x={612} y={180} tx={630} ty={206} text={'Ayırıcı\ntambur'} anchor="start" />
      </g>
      <text x="20" y="440" className="detail-note">
        Temsili: iki kanal gösterildi; kesikli çizgi kaynamanın başladığı bölgeyi yaklaşık işaretler, sabit bir kot değildir.
      </text>
    </svg>
  );
}

/** Yakın plan 3: ayırıcı tamburda su/buhar ayrılması. */
const D = { x0: 150, x1: 490, cy: 190, r: 92, level: 196 };
function DrumCloseUp({ showFlow }: { showFlow: boolean }) {
  const shell = `M${D.x0} ${D.cy - D.r} H${D.x1} A${D.r} ${D.r} 0 0 1 ${D.x1} ${D.cy + D.r} H${D.x0} A${D.r} ${D.r} 0 0 1 ${D.x0} ${D.cy - D.r} Z`;
  const inlets = [180, 240, 300, 360];
  return (
    <svg viewBox="0 0 640 450" className="detail-svg" role="img" aria-label="Ayırıcı tambur kesiti: kanallardan gelen karışım girer, buhar üstten türbine, su alttan iniş borularına">
      <defs>
        <clipPath id="rbmkd3-clip">
          <path d={shell} />
        </clipPath>
      </defs>
      <path className="drum" d={shell} />
      <g clipPath="url(#rbmkd3-clip)">
        <rect className="secondary-water" x={D.x0 - D.r} y={D.level} width={D.x1 - D.x0 + 2 * D.r} height={D.r * 2} />
      </g>
      <line className="level" x1={D.x0 - 60} x2={D.x1 + 60} y1={D.level} y2={D.level} />
      <Bubbles x={170} y={D.level + 4} w={210} h={60} count={22} showFlow={showFlow} speed={18} />
      {inlets.map((x) => (
        <Flow key={x} id={`d3-in-${x}`} d={`M${x} 382 V250`} kind="mix" boilAt={0} pipe={9} speed={30} spacing={16} showFlow={showFlow} r={2.6} />
      ))}
      {[220, 420].map((x) => (
        <Flow key={x} id={`d3-steam-${x}`} d={`M${x} ${D.level - 6} V20`} kind="steam" pipe={0} speed={28} spacing={18} showFlow={showFlow} r={3} />
      ))}
      {[220, 420].map((x) => (
        <rect key={x} className="nozzle steam" x={x - 11} y={D.cy - D.r - 12} width={22} height={14} />
      ))}
      {/* Besleme suyu dağıtıcısı */}
      <line className="pipe-wall" x1={300} y1={D.level + 22} x2={D.x1 + D.r - 6} y2={D.level + 22} strokeWidth={5} />
      <Flow id="d3-feed" d={`M640 ${D.level + 22} H310`} kind="feed" pipe={0} speed={28} spacing={16} showFlow={showFlow} r={2.4} />
      <Flow id="d3-water" d={`M380 ${D.cy + 60} H460`} kind="cold" pipe={0} speed={22} spacing={16} scale="constant" showFlow={showFlow} r={2.6} />
      {[460, 520].map((x) => (
        <Flow key={x} id={`d3-down-${x}`} d={`M${x} ${D.cy + D.r - 30} V382`} kind="cold" pipe={11} speed={30} spacing={18} scale="constant" showFlow={showFlow} r={2.8} />
      ))}
      <FluidTag x={320} y={130} text="buhar" />
      <FluidTag x={320} y={262} text="su (H₂O)" />
      <g className="labels">
        <Label x={420} y={60} tx={460} ty={14} text="Buhar türbine" sub="arada ısı değiştirici yok" anchor="start" />
        <Label x={480} y={D.level} tx={500} ty={150} text="Su seviyesi" anchor="start" />
        <Label x={180} y={330} tx={20} ty={330} text="Kanallardan gelen" sub="buhar–su karışımı (ayrı borular)" anchor="start" />
        <Label x={520} y={D.level + 22} tx={520} ty={228} text="Besleme suyu" anchor="start" />
        <Label x={490} y={380} tx={540} ty={360} text="İniş boruları" sub="→ ana pompa" anchor="start" />
        <Label x={160} y={110} tx={14} ty={54} text="Buhar boşluğu" anchor="start" />
      </g>
      <text x="14" y="420" className="detail-note">
        Tambur ısı aktarmaz; buhar kanallarda oluşmuştur. Bu yüzden buhar üreteci değildir.
      </text>
      <text x="14" y="438" className="detail-note">
        İç ayırma düzenekleri ve boru sayıları sadeleştirildi (temsili).
      </text>
    </svg>
  );
}

export function RbmkDetails({ detailKey, showFlow }: DetailProps) {
  if (detailKey === 'channel') return <ChannelCloseUp showFlow={showFlow} />;
  if (detailKey === 'boiling') return <BoilingCloseUp showFlow={showFlow} />;
  if (detailKey === 'drum') return <DrumCloseUp showFlow={showFlow} />;
  return <RbmkCoreDetail showFlow={showFlow} />;
}
