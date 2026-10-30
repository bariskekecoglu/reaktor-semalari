import type { Pt } from '../geometry/route';

/**
 * Gerçek bir bağlantı (T-birleşimi) noktası: iki hat burada birleşir.
 * Bağlantı olmayan kesişimlerde bu işaret kullanılmaz; böylece "birleşik mi, üstünden mi geçiyor?" ayrımı görünür olur.
 */
export function Junction({ at, r = 4 }: { at: Pt; r?: number }) {
  return <circle className="pipe-junction" cx={at[0]} cy={at[1]} r={r} aria-hidden="true" />;
}

/**
 * Koruma yapısı geçişi (penetrasyon kovanı): boru duvarı deler ama duvarla birleşmez.
 * `orient` borunun yönüdür ('h' = yatay boru).
 */
export function Penetration({ at, orient, pipe }: { at: Pt; orient: 'h' | 'v'; pipe: number }) {
  const along = 22;
  const across = pipe + 11;
  const w = orient === 'h' ? along : across;
  const h = orient === 'h' ? across : along;
  return <rect className="penetration" x={at[0] - w / 2} y={at[1] - h / 2} width={w} height={h} rx={2} aria-hidden="true" />;
}
