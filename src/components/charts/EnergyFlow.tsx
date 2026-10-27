import { useModelSnapshot } from '../../hooks/useSimulation';
import { CYCLE_EFFICIENCY } from '../../simulation/educationalModel';
import type { ReactorId } from '../../reactors/shared/types';

const W = 680;
const H = 250;
const MAXH = 150;
const TOP = 44;
const COL_W = 82;

/**
 * Enerji dönüşümü: nükleer → ısı → buhar → mekanik → elektrik; ayrıca soğutmaya atılan ısı.
 * Tüm sütunlar aynı ölçektedir (nominal ısıl güce göre %) ve modeldeki dengeye uyar:
 * ısıl = elektrik + soğutmaya atılan.
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
  const h = (v: number) => Math.max(2, v * MAXH);
  const link = (i: number, j: number, y0a: number, y1a: number, y0b: number, y1b: number) => {
    const xa = xs[i] + COL_W;
    const xb = xs[j];
    const mx = (xa + xb) / 2;
    return `M${xa} ${y0a} C${mx} ${y0a} ${mx} ${y0b} ${xb} ${y0b} V${y1b} C${mx} ${y1b} ${mx} ${y1a} ${xa} ${y1a} Z`;
  };
  const steamSplit = TOP + h(s.electric);

  return (
    <div className="energy">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={`Enerji dönüşümü: ısıl güç yüzde ${Math.round(s.thermal * 100)}, elektrik yüzde ${Math.round(s.electric * 100)}, soğutmaya atılan ısı yüzde ${Math.round(s.rejected * 100)}`}
      >
        {/* Bağlantı bantları */}
        <path className="ef-link" d={link(0, 1, TOP, TOP + h(cols[0].v), TOP, TOP + h(cols[1].v))} />
        <path className="ef-link" d={link(1, 2, TOP, TOP + h(cols[1].v), TOP, TOP + h(cols[2].v))} />
        <path className="ef-link" d={link(2, 3, TOP, steamSplit, TOP, TOP + h(cols[3].v))} />
        <path className="ef-link" d={link(3, 4, TOP, TOP + h(cols[3].v), TOP, TOP + h(cols[4].v))} />
        <path className="ef-link reject" d={link(2, 5, steamSplit, TOP + h(s.steam), TOP, TOP + h(s.rejected))} />
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
              %{Math.round(c.v * 100)}
            </text>
          </g>
        ))}
        <text className="ef-sub" x={10} y={H - 6}>
          Isıl %{Math.round(s.thermal * 100)} = elektrik %{Math.round(s.electric * 100)} + atılan ısı %{Math.round(s.rejected * 100)} (nominal ısıl güce göre)
        </text>
      </svg>
      <p className="chart-note">
        Temsili değerler. Çevrim verimi %{Math.round(CYCLE_EFFICIENCY * 100)} varsayıldı (ders notları: LWR ısı çevrimi ≈ %33). Jeneratör kayıpları ve iç tüketim ihmal edildi; güç değişimi sırasında
        ısıl güç ile elektrik arasındaki fark atılan/depolanan enerji olarak sayılır.
      </p>
    </div>
  );
}
