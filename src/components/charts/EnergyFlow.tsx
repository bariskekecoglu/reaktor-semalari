import { useModelSnapshot } from '../../hooks/useSimulation';
import { CYCLE_EFFICIENCY } from '../../simulation/educationalModel';
import type { ReactorId } from '../../reactors/shared/types';

const W = 680;
const H = 300;
const MAXH = 150;
const TOP = 44;
const COL_W = 82;
/** Depolama göstergesinde %1'lik değişim hızının yatay uzunluğu (px). */
const STORE_SCALE = 4;
const STORE_MAX = 150;

const pct = (v: number) => Math.round(v * 100);
const signedPct = (v: number) => {
  const n = pct(v);
  return n > 0 ? `+%${n}` : n < 0 ? `−%${Math.abs(n)}` : '%0';
};

/**
 * Enerji dönüşümü: nükleer → ısı → buhar → mekanik → elektrik; buhar ayrıca kondenserde atılan ısıya ayrılır.
 * Tüm sütunlar aynı ölçektedir (nominal ısıl güce göre %). Dallar buhar sütunundan ayrılır:
 * buhar = elektrik + atılan ısı. Isı ile buhar arasındaki fark ayrı, işaretli depolama göstergesinde verilir:
 * ısıl = elektrik + atılan ısı + depolama hızı.
 */
export function EnergyFlow({ reactor }: { reactor: ReactorId }) {
  const s = useModelSnapshot(6);
  const cols = [
    { label: 'Nükleer', sub: 'fisyon', v: s.thermal, cls: 'ef-nuc' },
    { label: 'Isı', sub: 'yakıt → su', v: s.thermal, cls: 'ef-heat' },
    { label: 'Buhar', sub: reactor === 'bwr' ? 'reaktörden' : 'ikincil devre', v: s.steam, cls: 'ef-steam' },
    { label: 'Mekanik', sub: 'türbin mili', v: s.electric, cls: 'ef-mech' },
    { label: 'Elektrik', sub: 'şebekeye', v: s.electric, cls: 'ef-elec' },
    { label: 'Atılan ısı', sub: 'kondenser → su', v: s.rejected, cls: 'ef-reject' },
  ];
  const gap = (W - 20 - cols.length * COL_W) / (cols.length - 1);
  const xs = cols.map((_, i) => 10 + i * (COL_W + gap));
  const h = (v: number) => Math.max(2, Math.max(0, v) * MAXH);
  const link = (i: number, j: number, y0a: number, y1a: number, y0b: number, y1b: number) => {
    const xa = xs[i] + COL_W;
    const xb = xs[j];
    const mx = (xa + xb) / 2;
    return `M${xa} ${y0a} C${mx} ${y0a} ${mx} ${y0b} ${xb} ${y0b} V${y1b} C${mx} ${y1b} ${mx} ${y1a} ${xa} ${y1a} Z`;
  };
  // Buhar sütunu tam olarak elektrik (üst) + atılan ısı (alt) dallarına ayrılır.
  const steamSplit = TOP + Math.max(0, s.electric) * MAXH;
  const steamBottom = TOP + h(s.steam);

  // Depolama göstergesi: sıfır çizgisinden sağa (+, birikim) ya da sola (−, geri verme). Genişlik hep pozitif.
  const store = s.storageRate;
  const storeW = Math.min(STORE_MAX, Math.abs(store) * 100 * STORE_SCALE);
  const zeroX = 340;
  const storeY = TOP + MAXH + 46;
  const storeText = Math.abs(store) < 0.005 ? 'kararlı: ≈ 0' : store > 0 ? 'birikim (güç artışı)' : 'geri verme (güç düşüşü)';

  return (
    <div className="energy">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={`Enerji dönüşümü: ısıl güç yüzde ${pct(s.thermal)}, buhar yüzde ${pct(s.steam)}, elektrik yüzde ${pct(s.electric)}, kondenserde atılan ısı yüzde ${pct(s.rejected)}, depolama hızı ${signedPct(store)}`}
      >
        {/* Bağlantı bantları */}
        <path className="ef-link" d={link(0, 1, TOP, TOP + h(s.thermal), TOP, TOP + h(s.thermal))} />
        <path className="ef-link" d={link(1, 2, TOP, TOP + h(s.thermal), TOP, steamBottom)} />
        <path className="ef-link" d={link(2, 3, TOP, steamSplit, TOP, TOP + h(s.electric))} />
        <path className="ef-link" d={link(3, 4, TOP, TOP + h(s.electric), TOP, TOP + h(s.electric))} />
        <path className="ef-link reject" d={link(2, 5, steamSplit, steamBottom, TOP, TOP + h(s.rejected))} />
        {cols.map((c, i) => (
          <g key={c.label}>
            <rect className={`ef-bar ${c.cls}`} x={xs[i]} y={TOP} width={COL_W} height={h(c.v)} rx={3} />
            <text className="ef-label" x={xs[i] + COL_W / 2} y={16} textAnchor="middle">
              {c.label}
            </text>
            <text className="ef-sub" x={xs[i] + COL_W / 2} y={32} textAnchor="middle">
              {c.sub}
            </text>
            <text className="ef-val" x={xs[i] + COL_W / 2} y={TOP + Math.max(18, h(c.v) / 2 + 5)} textAnchor="middle">
              %{pct(c.v)}
            </text>
          </g>
        ))}
        {/* Buhar sütununda dal sınırı */}
        <line className="ef-split" x1={xs[2]} x2={xs[2] + COL_W} y1={steamSplit} y2={steamSplit} />

        {/* Depolama / boşalma hızı göstergesi */}
        <g className="ef-store" aria-hidden="true">
          <text className="ef-label" x={10} y={storeY + 5}>
            Depolama hızı (ısıl − buhar)
          </text>
          <line className="ef-store-axis" x1={zeroX - STORE_MAX} x2={zeroX + STORE_MAX} y1={storeY} y2={storeY} />
          <line className="ef-store-zero" x1={zeroX} x2={zeroX} y1={storeY - 12} y2={storeY + 12} />
          <text className="ef-sub" x={zeroX - STORE_MAX} y={storeY + 24}>
            − geri verme
          </text>
          <text className="ef-sub" x={zeroX + STORE_MAX} y={storeY + 24} textAnchor="end">
            birikim +
          </text>
          {storeW > 0.5 && <rect className={store > 0 ? 'ef-store-pos' : 'ef-store-neg'} x={store > 0 ? zeroX : zeroX - storeW} y={storeY - 8} width={storeW} height={16} rx={2} />}
          <text className="ef-val" x={zeroX + STORE_MAX + 12} y={storeY + 5}>
            {signedPct(store)}
          </text>
          <text className="ef-sub" x={zeroX + STORE_MAX + 12} y={storeY + 22}>
            {storeText}
          </text>
        </g>
        <text className="ef-sub" x={10} y={H - 6}>
          Buhar %{pct(s.steam)} = elektrik %{pct(s.electric)} + atılan ısı %{pct(s.rejected)} · Isıl %{pct(s.thermal)} = elektrik + atılan ısı + depolama ({signedPct(store)})
        </text>
      </svg>
      <p className="chart-note">
        Temsili eğitim modeli; doğrulanmış bir termodinamik model değildir. Çevrim verimi %{Math.round(CYCLE_EFFICIENCY * 100)} varsayıldı (ders notları: LWR ısı çevrimi ≈ %33); jeneratör
        kayıpları ve iç tüketim ihmal edildi. Buhar ısıl güce gecikmeyle uyduğundan güç değişirken aradaki fark “depolama hızı” olarak ayrı gösterilir: pozitif değer sistemde enerji
        birikmesi, negatif değer depolanmış enerjinin geri verilmesidir. Bu bir enerji miktarı değil, nominal güce göre değişim hızıdır; kararlı durumda sıfıra iner.
      </p>
    </div>
  );
}
