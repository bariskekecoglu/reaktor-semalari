import { useRef } from 'react';
import type { DetailProps } from '../shared/types';
import { Label } from '../shared/SceneContext';
import { Flow } from '../shared/flow/Flow';
import { Bubbles } from '../shared/equipment/animated';
import { Pump } from '../shared/equipment/Pump';
import { FluidTag, MaterialDefs } from '../shared/equipment/materials';
import { useTick } from '../../hooks/useSimulation';
import { CanduCoreDetail } from './CanduCoreDetail';

/** 37 elemanlı demet: 1 + 6 + 12 + 18 (Qinshan III CANDU 6: “fuel bundle assembly of 37 elements”). */
const RINGS = [
  { n: 1, r: 0 },
  { n: 6, r: 11 },
  { n: 12, r: 22 },
  { n: 18, r: 33 },
];

/** Yakın plan 1: yakıt demeti → basınç tüpü → gaz aralığı → calandria tüpü → moderatör. */
function ChannelLayers({ showFlow }: { showFlow: boolean }) {
  const cx = 150;
  const cy = 190;
  return (
    <svg viewBox="0 0 720 446" className="detail-svg" role="img" aria-label="CANDU yakıt kanalı katmanları: yakıt demeti, basınç tüpü, gaz aralığı, calandria tüpü ve dıştaki moderatör">
      <defs>
        <MaterialDefs prefix="cdd1" />
      </defs>
      <text x={cx} y="24" textAnchor="middle" className="detail-caption">
        Kesit (içten dışa)
      </text>
      <rect x={cx - 120} y={cy - 120} width="240" height="240" fill="url(#cdd1-d2o)" stroke="#3b3b40" />
      <circle cx={cx} cy={cy} r={68} className="calandria-tube" strokeWidth={4} />
      <circle cx={cx} cy={cy} r={62} className="gas-gap" />
      <circle cx={cx} cy={cy} r={50} className="pressure-tube" strokeWidth={5} />
      <circle cx={cx} cy={cy} r={46} fill="#f9d6c4" />
      {RINGS.flatMap((ring) =>
        Array.from({ length: ring.n }, (_, k) => {
          const a = (2 * Math.PI * k) / ring.n;
          return <circle key={`${ring.r}-${k}`} cx={cx + ring.r * Math.cos(a)} cy={cy + ring.r * Math.sin(a)} r={4.6} className="fuel-pin" />;
        }),
      )}
      <FluidTag x={cx} y={cy + 100} text="D₂O · moderatör" kind="mod" />

      <text x="510" y="24" textAnchor="middle" className="detail-caption">
        Boyuna kesit (yarım, ölçeksiz)
      </text>
      <rect x="340" y="60" width="350" height="300" fill="url(#cdd1-d2o)" stroke="#3b3b40" />
      <rect x="340" y="132" width="350" height="136" className="calandria-tube" strokeWidth={3} />
      <rect x="340" y="146" width="350" height="108" className="gas-gap" />
      <rect x="340" y="156" width="350" height="88" className="pressure-tube" strokeWidth={4} />
      <rect x="342" y="160" width="346" height="80" fill="#f9d6c4" />
      {Array.from({ length: 6 }, (_, k) => (
        <rect key={k} x={350 + k * 56} y={176} width={52} height={48} rx={6} className="fuel-bundle" />
      ))}
      {/* Aralayıcı (garter yayı): basınç tüpünü calandria tüpünden ayırır */}
      {[460, 600].map((x) => (
        <path key={x} d={`M${x} 147 q3 4 6 0 t6 0 t6 0`} fill="none" stroke="#3b3b40" strokeWidth={1.6} />
      ))}
      <Flow id="cd1-flow" d="M345 200 H688" kind="grad" invert pipe={0} speed={40} spacing={22} scale="constant" showFlow={showFlow} r={3} />
      <FluidTag x={515} y={300} text="D₂O · moderatör · düşük basınç" kind="mod" />
      <FluidTag x={515} y={100} text="D₂O · moderatör" kind="mod" />

      <g className="labels">
        <Label x={cx} y={cy} tx={14} ty={330} text="1. Yakıt demeti" sub="37 eleman · doğal UO₂ (CANDU 6)" anchor="start" />
        <Label x={cx + 48} y={cy - 12} tx={14} ty={372} text="2. Basınç tüpü + soğutucu" sub="basınçlı, sıcak D₂O · basınç sınırı" anchor="start" />
        <Label x={600} y={150} tx={706} ty={378} text="3. Gaz aralığı" sub="CO₂ · yalıtım + sızıntı algılama" anchor="end" />
        <Label x={cx + 66} y={cy + 20} tx={300} ty={378} text="4. Calandria tüpü" anchor="start" />
        <Label x={cx - 100} y={cy - 100} tx={14} ty={40} text="5. Moderatör (dışarıda)" sub="düşük basınçlı, daha soğuk D₂O" anchor="start" />
        <Label x={606} y={148} tx={620} ty={110} text="Aralayıcı" anchor="start" />
      </g>
      <text x="14" y="420" className="detail-note">
        Katman kalınlıkları ölçeksizdir. Gaz (CO₂) ve aralayıcılar: CANDU Fundamentals Bölüm 11;
      </text>
      <text x="14" y="436" className="detail-note">
        37 elemanlı doğal uranyum demeti: Qinshan III CANDU 6. Diğer CANDU yakıt seçenekleri olabilir.
      </text>
    </svg>
  );
}

/** Yakın plan 2: iki ayrı ağır su sistemi (ana ısı taşıma ve moderatör) — akışkan geçişi yok. */
function SeparationView({ showFlow }: { showFlow: boolean }) {
  return (
    <svg viewBox="0 0 720 460" className="detail-svg" role="img" aria-label="Moderatör sistemi ile ana ısı taşıma sisteminin ayrılığı">
      <defs>
        <MaterialDefs prefix="cdd2" />
      </defs>
      {/* Ana ısı taşıma sistemi (üst): kanal → çıkış kolektörü → buhar üreteci → pompa → giriş kolektörü → kanal */}
      <rect x="560" y="50" width="70" height="120" rx="20" className="sg-shell" />
      <path className="u-tube" d="M580 170 V90 A15 15 0 0 1 610 90 V170" />
      <Flow id="cd2-hts-out" d="M540 250 H610 V170" kind="hot" pipe={10} speed={40} spacing={20} scale="constant" showFlow={showFlow} r={2.6} />
      <Flow id="cd2-hts-sg" d="M610 170 V90 A15 15 0 0 0 580 90 V170" kind="grad" pipe={0} speed={30} spacing={16} scale="constant" showFlow={showFlow} r={2.4} />
      <Flow id="cd2-hts-back" d="M580 170 V196 H120 V250 H180" kind="cold" pipe={10} speed={40} spacing={22} scale="constant" showFlow={showFlow} r={2.6} />
      <Pump x={330} y={196} r={16} motor="none" rps={1} />

      {/* Calandria: moderatör; ortasından bir kanal geçer */}
      <rect x="200" y="210" width="320" height="140" rx="8" fill="url(#cdd2-d2o)" />
      <rect x="200" y="210" width="320" height="140" rx="8" className="calandria-shell" />
      <rect x="200" y="238" width="320" height="24" className="calandria-tube" />
      <rect x="180" y="243" width="360" height="14" className="pressure-tube" />
      <Flow id="cd2-ch" d="M182 250 H538" kind="grad" invert pipe={0} speed={40} spacing={20} scale="constant" showFlow={showFlow} r={2.6} />

      {/* Moderatör sistemi (alt): calandria → pompa → ısı değiştirici → calandria */}
      <Flow id="cd2-mod-a" d="M250 350 V410 H330" kind="mod" pipe={9} speed={26} spacing={18} scale="constant" showFlow={showFlow} r={2.4} />
      <Flow id="cd2-mod-b" d="M362 410 H420" kind="mod" pipe={9} speed={26} spacing={18} scale="constant" showFlow={showFlow} r={2.4} />
      <Flow id="cd2-mod-c" d="M500 410 H520 Q540 410 540 390 V330 H520" kind="mod" pipe={9} speed={26} spacing={18} scale="constant" showFlow={showFlow} r={2.4} />
      <Pump x={346} y={410} r={16} motor="none" rps={0.7} />
      <rect className="hx-shell" x="420" y="392" width="80" height="36" rx="8" />
      <Flow id="cd2-cool" d="M445 446 V428 M475 428 V446" kind="cool" pipe={4} speed={18} spacing={10} scale="constant" showFlow={showFlow} r={1.8} />

      <FluidTag x={360} y={300} text="D₂O · moderatör" kind="mod" />
      <FluidTag x={420} y={180} text="D₂O · birincil soğutucu" />

      <g className="labels">
        <Label x={300} y={190} tx={250} ty={128} text="Ana ısı taşıma sistemi" sub="yüksek basınç · sıcak D₂O" anchor="start" />
        <Label x={590} y={60} tx={644} ty={40} text={'Buhar\nüreteci'} anchor="start" />
        <Label x={300} y={410} tx={14} ty={426} text="Moderatör sistemi" sub="düşük basınç · daha soğuk D₂O" anchor="start" />
        <Label x={500} y={428} tx={560} ty={426} text="Isı değiştirici" anchor="start" />
        <Label x={205} y={250} tx={14} ty={272} text={'Kanal: iki sistemin\nsınırı'} sub="basınç tüpü · gaz · calandria tüpü" anchor="start" />
      </g>
      <text x="14" y="30" className="detail-note">
        İki sistem aynı maddeyi (ağır su) kullanır ama birbirine bağlı değildir;
      </text>
      <text x="14" y="48" className="detail-note">
        akışkan bir sistemden ötekine geçmez. Moderatördeki ısı ayrı ısı değiştiricilerle atılır.
      </text>
      <text x="14" y="66" className="detail-note">
        Kaynak: Qinshan III CANDU 6 (AECL). Sekiz biçimli halka burada tek döngüyle sadeleştirildi.
      </text>
    </svg>
  );
}

/** Yakın plan 3: buhar üretecinde birincil (ağır su, boru içi) ve ikincil (hafif su, boru dışı). */
function SgView({ showFlow }: { showFlow: boolean }) {
  const shell = 'M250 400 V230 L230 200 V110 A90 46 0 0 1 410 110 V200 L390 230 V400 Z';
  return (
    <svg viewBox="0 0 720 470" className="detail-svg" role="img" aria-label="CANDU buhar üreteci: birincil ağır su U borularda, ikincil hafif su gövde tarafında kaynar">
      <defs>
        <clipPath id="cdd3-clip">
          <path d={shell} />
        </clipPath>
      </defs>
      <path className="sg-shell" d={shell} />
      <g clipPath="url(#cdd3-clip)">
        <rect className="secondary-water" x="220" y="230" width="200" height="180" />
      </g>
      <line className="level" x1="250" x2="390" y1="230" y2="230" />
      <path className="dryer" d={`M240 140 ${'l10 8 l10 -8 '.repeat(8)}`} />
      {[0, 10, 20, 30].map((k) => (
        <path key={k} className="u-tube" d={`M${270 + k} 400 V${270 + k} A${50 - k} ${50 - k} 0 0 1 ${370 - k} ${270 + k} V400`} />
      ))}
      <Bubbles x={262} y={236} w={116} h={150} count={20} showFlow={showFlow} speed={18} />
      <path className="channel-head" d="M250 400 A70 44 0 0 0 390 400 Z" />
      <line className="divider" x1="320" x2="320" y1="400" y2="444" />
      <Flow id="cd3-tubes" d="M280 432 V280 A40 40 0 0 1 360 280 V432" kind="grad" pipe={0} speed={36} spacing={18} scale="constant" showFlow={showFlow} r={2.8} />
      <Flow id="cd3-in" d="M150 440 H272 Q280 440 280 432" kind="hot" pipe={11} speed={36} spacing={18} scale="constant" showFlow={showFlow} />
      <Flow id="cd3-out" d="M360 432 Q360 440 368 440 H500" kind="cold" pipe={11} speed={36} spacing={18} scale="constant" showFlow={showFlow} />
      <Flow id="cd3-steam" d="M320 220 V20" kind="steam" pipe={0} speed={30} spacing={18} showFlow={showFlow} r={3} />
      <rect className="nozzle steam" x="310" y="58" width="20" height="10" />
      <Flow id="cd3-feed" d="M560 330 H392" kind="feed" pipe={8} speed={30} spacing={18} showFlow={showFlow} r={2.4} />
      <FluidTag x={150} y={414} text="D₂O · birincil (boru içi)" />
      <FluidTag x={500} y={300} text="H₂O · ikincil (gövde tarafı)" />
      <g className="labels">
        <Label x={320} y={40} tx={360} ty={14} text="İkincil buhar türbine" sub="hafif su buharı" anchor="start" />
        <Label x={300} y={140} tx={430} ty={110} text="Nem ayırıcı / kurutucu" anchor="start" />
        <Label x={290} y={300} tx={20} ty={240} text="U boruları" sub="içinde sıcak ağır su" anchor="start" />
        <Label x={360} y={300} tx={430} ty={210} text="Boru dışında hafif su kaynar" anchor="start" />
        <Label x={520} y={330} tx={540} ty={350} text="Besleme suyu" sub="ön ısıtıcı bölümü çizilmedi" anchor="start" />
        <Label x={290} y={420} tx={20} ty={380} text="Giriş / çıkış bölmeleri" anchor="start" />
      </g>
      <text x="420" y="410" className="detail-note">
        CANDU 6: dikey U borulu, tümleşik buhar tamburu
      </text>
      <text x="420" y="428" className="detail-note">
        ve ön ısıtıcı (Qinshan III CANDU 6). İki akışkan karışmaz.
      </text>
    </svg>
  );
}

/** Yakın plan 4: işletme sırasında yakıt değiştirme ilkesi (kavramsal; prosedür değil). */
const FU = { x0: 160, x1: 560, y: 220, w: 32, n: 14 };
function FuellingView({ showFlow }: { showFlow: boolean }) {
  const ref = useRef<SVGGElement>(null);
  const travel = useRef(0);
  useTick((dt) => {
    // Yavaş, sürekli kayma: yeni demet soldan girer, kullanılmış demet sağdan çıkar (kavramsal).
    travel.current = (travel.current + dt * 6) % FU.w;
    const g = ref.current;
    if (!g) return;
    const kids = g.children;
    for (let k = 0; k < kids.length; k++) {
      const x = FU.x0 - FU.w * 2 + k * FU.w + travel.current;
      const el = kids[k] as SVGRectElement;
      el.setAttribute('x', x.toFixed(1));
      const p = (x - FU.x0) / (FU.x1 - FU.x0);
      const cls = x < FU.x0 - 2 ? 'fuel-bundle' : x > FU.x1 - FU.w + 2 ? 'fuel-bundle spent' : p > 0.55 ? 'fuel-bundle used' : 'fuel-bundle';
      if (el.getAttribute('class') !== cls) el.setAttribute('class', cls);
    }
  });
  return (
    <svg viewBox="0 0 720 400" className="detail-svg" role="img" aria-label="Yakıt değiştirme ilkesi: iki uçtaki makineler kanala kenetlenir, yeni demetler eklenir, kullanılmış demetler alınır">
      <defs>
        <MaterialDefs prefix="cdd4" />
        <clipPath id="cdd4-view">
          <rect x="40" y="150" width="640" height="140" />
        </clipPath>
      </defs>
      <rect x={FU.x0} y="160" width={FU.x1 - FU.x0} height="120" fill="url(#cdd4-d2o)" stroke="#3b3b40" />
      <rect x={FU.x0 - 30} y="150" width="30" height="140" className="end-shield" />
      <rect x={FU.x1} y="150" width="30" height="140" className="end-shield" />
      <rect x={FU.x0 - 50} y={FU.y - 24} width={FU.x1 - FU.x0 + 100} height="48" className="pressure-tube" />
      <g clipPath="url(#cdd4-view)">
        <g ref={ref} style={{ display: showFlow ? undefined : 'none' }}>
          {Array.from({ length: FU.n + 2 }, (_, k) => (
            <rect key={k} x={FU.x0 + k * FU.w} y={FU.y - 16} width={FU.w - 3} height={32} rx={4} className="fuel-bundle" />
          ))}
        </g>
      </g>
      {!showFlow &&
        Array.from({ length: 12 }, (_, k) => (
          <rect key={k} x={FU.x0 + 8 + k * 32} y={FU.y - 16} width={29} height={32} rx={4} className={k > 7 ? 'fuel-bundle used' : 'fuel-bundle'} />
        ))}
      {/* Yakıt değiştirme makineleri (temsili) */}
      <rect x="20" y={FU.y - 40} width="80" height="80" rx="8" className="fm-machine" />
      <rect x="96" y={FU.y - 12} width="24" height="24" className="fm-ram" />
      <rect x="620" y={FU.y - 40} width="80" height="80" rx="8" className="fm-machine" />
      <rect x="600" y={FU.y - 12} width="24" height="24" className="fm-ram" />
      <text x="60" y={FU.y + 62} textAnchor="middle" className="detail-caption small">
        yeni demet
      </text>
      <text x="660" y={FU.y + 62} textAnchor="middle" className="detail-caption small">
        kullanılmış demet
      </text>
      <g className="labels">
        <Label x={60} y={FU.y - 40} tx={20} ty={90} text="Yakıt değiştirme makinesi" sub="uç bağlantısına kenetlenir" anchor="start" />
        <Label x={660} y={FU.y - 40} tx={700} ty={90} text="Karşı uçtaki makine" sub="çıkan demetleri alır" anchor="end" />
        <Label x={360} y={FU.y - 16} tx={290} ty={110} text="Demetler uç uca dizili" sub="CANDU 6: kanal başına 12" anchor="start" />
        <Label x={350} y={276} tx={300} ty={300} text="Moderatör (D₂O)" anchor="start" />
      </g>
      <text x="20" y="352" className="detail-note">
        Kavramsal gösterim: reaktör çalışırken iki uçtaki makine kanala kenetlenir, belirlenen sayıda yeni demet eklenir ve
      </text>
      <text x="20" y="370" className="detail-note">
        kullanılmış demetler alınır (Qinshan III CANDU 6; CANDU Fundamentals Bölüm 11). Sıra, sayı ve yön tesise ve işletme
      </text>
      <text x="20" y="388" className="detail-note">
        planına göre belirlenir; bu çizim gerçek prosedürü göstermez. Kayma hızı temsilidir.
      </text>
    </svg>
  );
}

export function CanduDetails({ detailKey, showFlow }: DetailProps) {
  if (detailKey === 'channel') return <ChannelLayers showFlow={showFlow} />;
  if (detailKey === 'separation') return <SeparationView showFlow={showFlow} />;
  if (detailKey === 'sg') return <SgView showFlow={showFlow} />;
  if (detailKey === 'fuelling') return <FuellingView showFlow={showFlow} />;
  return <CanduCoreDetail showFlow={showFlow} />;
}
