import type { ReactorId } from '../../reactors/shared/types';

interface Item {
  key: string;
  label: string;
  dash?: string;
  swatch: string;
  marker: 'dot' | 'ring' | 'mixed';
}

const BASE: Item[] = [
  { key: 'hot', label: 'Sıcak su', swatch: 'var(--hot)', marker: 'dot' },
  { key: 'cold', label: 'Daha soğuk su', swatch: 'var(--cold)', marker: 'dot' },
  { key: 'steam', label: 'Buhar', dash: '8 5', swatch: 'var(--steam)', marker: 'ring' },
  { key: 'feed', label: 'Kondensat / besleme suyu', dash: '2 4', swatch: 'var(--feed)', marker: 'dot' },
  { key: 'cool', label: 'Kondenser soğutma suyu (ayrı çevrim)', dash: '12 4 3 4', swatch: 'var(--cool)', marker: 'dot' },
];

const MIX: Item = { key: 'mix', label: 'Su–buhar karışımı (kaynama)', dash: '3 5', swatch: 'var(--hot)', marker: 'mixed' };

export function Legend({ reactor }: { reactor: ReactorId }) {
  const items = reactor === 'bwr' ? [BASE[0], BASE[1], MIX, ...BASE.slice(2)] : BASE;
  const primaryNote =
    reactor === 'bwr'
      ? 'BWR’de tek çevrim vardır: reaktör suyu kapta kaynar, buhar doğrudan türbine gider.'
      : 'Birincil devre: düz çizgi (sıcak/soğuk kol) · İkincil devre: kesikli (buhar) ve noktalı (besleme suyu).';
  return (
    <div className="legend" aria-label="Renk ve akış lejantı">
      <ul>
        {items.map((it) => (
          <li key={it.key}>
            <svg width="54" height="16" aria-hidden="true">
              <line x1="2" x2="52" y1="8" y2="8" stroke={it.swatch} strokeWidth="4" strokeDasharray={it.dash} />
              {it.marker === 'ring' && <circle cx="27" cy="8" r="4.5" className="p p-steam" />}
              {it.marker === 'dot' && <circle cx="27" cy="8" r="4" fill={it.swatch} stroke="#333" strokeWidth="0.8" />}
              {it.marker === 'mixed' && (
                <>
                  <circle cx="18" cy="8" r="3.5" className="p p-hot" />
                  <circle cx="34" cy="8" r="4.5" className="p p-bubble" />
                </>
              )}
            </svg>
            {it.label}
          </li>
        ))}
      </ul>
      <p className="legend-note">
        Renkler sıcaklık ve faz için anlatım aracıdır, ölçek değildir. {primaryNote} İşaretlerin hızı görseldir; gerçek akış hızını göstermez.
      </p>
    </div>
  );
}
