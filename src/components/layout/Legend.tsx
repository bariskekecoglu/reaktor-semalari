import type { ReactorId } from '../../reactors/shared/types';

interface Item {
  key: string;
  label: string;
  dash?: string;
  swatch: string;
  marker: 'dot' | 'ring' | 'mixed' | 'block';
}

const BASE: Item[] = [
  { key: 'hot', label: 'Sıcak su', swatch: 'var(--hot)', marker: 'dot' },
  { key: 'cold', label: 'Daha soğuk su', swatch: 'var(--cold)', marker: 'dot' },
  { key: 'steam', label: 'Buhar', dash: '8 5', swatch: 'var(--steam)', marker: 'ring' },
  { key: 'feed', label: 'Kondensat / besleme suyu', dash: '2 4', swatch: 'var(--feed)', marker: 'dot' },
  { key: 'cool', label: 'Kondenser soğutma suyu (ayrı çevrim)', dash: '12 4 3 4', swatch: 'var(--cool)', marker: 'dot' },
];

const MIX: Item = { key: 'mix', label: 'Su–buhar karışımı (kaynama)', dash: '3 5', swatch: 'var(--hot)', marker: 'mixed' };
const GRAPHITE: Item = { key: 'graphite', label: 'Grafit (moderatör, katı)', swatch: 'var(--graphite)', marker: 'block' };
const MOD: Item = { key: 'mod', label: 'Moderatör: ağır su (D₂O), düşük basınçlı, ayrı sistem', dash: '9 3 2 3', swatch: 'var(--mod)', marker: 'dot' };

function itemsFor(reactor: ReactorId): Item[] {
  if (reactor === 'bwr') return [BASE[0], BASE[1], MIX, ...BASE.slice(2)];
  if (reactor === 'rbmk') return [GRAPHITE, { ...BASE[1], label: 'Kanallara giden hafif su (H₂O)' }, MIX, ...BASE.slice(2)];
  if (reactor === 'candu')
    return [
      { ...BASE[0], label: 'Birincil ağır su (D₂O), basınçlı — sıcak' },
      { ...BASE[1], label: 'Birincil ağır su (D₂O) — daha soğuk' },
      MOD,
      { ...BASE[2], label: 'İkincil buhar (hafif su)' },
      { ...BASE[3], label: 'İkincil besleme suyu (hafif su, H₂O)' },
      BASE[4],
    ];
  return BASE;
}

const NOTE: Partial<Record<ReactorId, string>> = {
  bwr: 'BWR’de tek çevrim vardır: reaktör suyu kapta kaynar, buhar doğrudan türbine gider.',
  rbmk: 'RBMK’de tek çevrim vardır: hafif su kanallarda kaynar, buhar ayırıcı tamburdan doğrudan türbine gider. Grafit soğutucu değildir.',
  candu: 'CANDU’da birincil ağır su ile moderatör ağır suyu ayrı sistemlerdir; türbine ikincil devrenin hafif su buharı gider.',
};

export function Legend({ reactor }: { reactor: ReactorId }) {
  const items = itemsFor(reactor);
  const primaryNote = NOTE[reactor] ?? 'Birincil devre: düz çizgi (sıcak/soğuk kol) · İkincil devre: kesikli (buhar) ve noktalı (besleme suyu).';
  return (
    <div className="legend" aria-label="Renk ve akış lejantı">
      <ul>
        {items.map((it) => (
          <li key={it.key}>
            <svg width="54" height="16" aria-hidden="true">
              {it.marker === 'block' ? (
                <>
                  <rect x="2" y="1" width="50" height="14" fill={it.swatch} stroke="#3c3d41" />
                  <path d="M2 8 H52 M14 1 V8 M38 1 V8 M26 8 V15" stroke="#8d8f95" strokeWidth="0.9" />
                </>
              ) : (
                <line x1="2" x2="52" y1="8" y2="8" stroke={it.swatch} strokeWidth="4" strokeDasharray={it.dash} />
              )}
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
        Renkler sıcaklık ve faz için anlatım aracıdır, ölçek değildir. Malzemeler ayrıca şema üzerinde metinle etiketlenir. {primaryNote} İşaretlerin hızı görseldir; gerçek akış hızını
        göstermez.
      </p>
    </div>
  );
}
