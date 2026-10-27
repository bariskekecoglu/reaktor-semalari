/**
 * Nuc E 430 Bölüm 2, “2.5 PWR Reactor Operations” (s. 2-88 – 2-101) şekillerinden çıkarılan veriler.
 * PDF sayfa sırası bu aralıkta basılı numarayla aynıdır (PDF s. 88 = 2-88).
 *
 * Kategori: “Şekilden yaklaşık okunmuş”. Kaynakta sayısal tablo yoktur.
 * - Şekil 2-39 PDF içinde vektör çizimdir; noktalar çizim koordinatlarından eksen ölçeğine dönüştürüldü.
 * - Şekil 2-40, 2-41, 2-42, 2-43 raster görüntüdür; değerler piksel ölçümüyle okundu.
 */
import type { PowerProfile } from '../types';

/** Şekil 2-39 “Boron Letdown Curve at 100% Power” — [yanma MWD/MTU, bor ppm]. */
export const FIG_2_39: [number, number][] = [
  [0, 1974],
  [49, 1729],
  [99, 1617],
  [147, 1579],
  [197, 1560],
  [297, 1551],
  [396, 1541],
  [496, 1551],
  [745, 1560],
  [993, 1570],
  [1192, 1579],
  [1441, 1588],
  [1690, 1598],
  [2437, 1598],
  [2934, 1588],
  [3431, 1579],
  [3978, 1570],
  [4476, 1551],
  [4974, 1523],
  [6019, 1466],
  [7013, 1400],
  [8009, 1325],
  [9998, 1165],
  [11989, 987],
  [13979, 799],
  [15968, 611],
  [18009, 423],
  [19999, 235],
  [20944, 141],
  [21540, 84],
  [21988, 47],
  [22387, 9],
];

/**
 * Şekil 2-40 “Load Follow Patterns”. Dönüm noktaları piksel ölçümüyle okundu (±~0,1 sa).
 * Not: 12-3-6-3 dışındaki profillerde çizim, isimdeki rampa/düşük güç süreleriyle tam örtüşmüyor.
 * Talimata uygun olarak isim değil çizim esas alındı.
 */
export const FIG_2_40: PowerProfile[] = [
  {
    id: 'base',
    label: 'Sabit yük (temel yük)',
    points: [
      [0, 100],
      [24, 100],
    ],
    note: 'Kaynak 2-94: “base load” işletmede güç yakıt çevrimi boyunca esasen sabit tutulur. Şekil 2-40’ta ayrı bir eğri olarak yoktur.',
  },
  {
    id: '18-6',
    label: '18-6',
    points: [
      [0, 100],
      [11, 100],
      [11, 50],
      [13, 50],
      [13, 100],
      [24, 100],
    ],
    note: 'Şekilde %50 güç yalnızca ~11–13. saatler arasında ve dikey çizgilerle çizilmiş; isimdeki “6” ile örtüşmüyor. Dikey geçiş şeklin idealize gösterimidir, gerçek bir anlık güç değişimi iddiası değildir.',
  },
  {
    id: '16-1-6-1',
    label: '16-1-6-1',
    points: [
      [0, 100],
      [8, 100],
      [10, 50],
      [14, 50],
      [16, 100],
      [24, 100],
    ],
    note: 'Şekilde rampalar ~2 sa, düşük güç ~4 sa ölçüldü (isimde 1-6-1). Tam güç toplamı 16 sa.',
  },
  {
    id: '14-2-6-2',
    label: '14-2-6-2',
    points: [
      [0, 100],
      [7, 100],
      [10, 50],
      [14, 50],
      [17, 100],
      [24, 100],
    ],
    note: 'Şekilde rampalar ~3 sa, düşük güç ~4 sa ölçüldü (isimde 2-6-2). Tam güç toplamı 14 sa.',
  },
  {
    id: '12-3-6-3',
    label: '12-3-6-3',
    points: [
      [0, 100],
      [6, 100],
      [9, 50],
      [15, 50],
      [18, 100],
      [24, 100],
    ],
    note: 'Şekil isimle örtüşüyor: 12 sa tam güç, 3 sa rampa, 6 sa %50, 3 sa rampa. Şekil 2-42 bu şema için verilmiştir.',
  },
  {
    id: '10-4-6-4',
    label: '10-4-6-4',
    points: [
      [0, 100],
      [5, 100],
      [8, 50],
      [16, 50],
      [19, 100],
      [24, 100],
    ],
    note: 'Şekilde rampalar ~3 sa, düşük güç ~8 sa ölçüldü (isimde 4-6-4). Tam güç toplamı 10 sa.',
  },
];

/**
 * Şekil 2-41 “Xe Worth after Shutdown at different Power Levels” — [saat, worth].
 * Y ekseni “Worth”; birim kaynakta belirtilmemiş. Eksen yukarı doğru daha negatif.
 * Alt sınır etiketlenmemiş; −600 ızgara çizgisinden ölçekle ~0 olarak okundu.
 */
export const FIG_2_41: Record<'25' | '50' | '75' | '100', [number, number][]> = {
  '25': [[0, -1836], [1, -1909], [2, -1974], [3, -2012], [4, -2024], [5, -2024], [6, -2020], [8, -1949], [10, -1861], [12, -1752], [14, -1617], [16, -1466], [18, -1353], [20, -1215], [24, -1001], [28, -787], [32, -631], [36, -485], [40, -376], [45, -262], [50, -195], [60, -94], [70, -42], [80, -21]],
  '50': [[0, -2461], [1, -2654], [2, -2847], [3, -2969], [4, -3037], [7, -3121], [8, -3103], [9, -3052], [10, -3000], [12, -2839], [14, -2654], [16, -2444], [20, -2050], [24, -1692], [28, -1336], [32, -1038], [36, -839], [40, -650], [45, -464], [50, -338], [60, -174], [70, -73], [80, -42]],
  '75': [[0, -2806], [1, -3114], [2, -3430], [3, -3655], [4, -3780], [5, -3893], [6, -3967], [7, -3997], [8, -3984], [9, -3938], [10, -3887], [12, -3727], [14, -3510], [16, -3252], [18, -3031], [20, -2744], [24, -2260], [28, -1794], [32, -1420], [36, -1110], [40, -871], [45, -627], [50, -451], [60, -221], [70, -105], [90, -21]],
  '100': [[0, -2998], [1, -3372], [2, -3766], [3, -4047], [4, -4171], [5, -4401], [6, -4475], [7, -4521], [8, -4534], [9, -4496], [10, -4441], [14, -4013], [16, -3676], [18, -3466], [20, -3077], [24, -2612], [28, -2077], [32, -1647], [36, -1311], [40, -1001], [45, -720], [50, -524], [60, -262], [70, -136], [80, -61], [90, -52], [100, -31]],
};

export interface AxialStop {
  hour: number;
  label: string;
  /** Alttan üste 10 yükseklikte (5%, 15%, … 95%) göreli güç profili (şekildeki yatay mesafe, birimsiz). */
  power: number[];
  /** Aynı yüksekliklerde göreli ksenon profili. */
  xenon: number[];
  /** Şekildeki “D” ve “C” etiketli koyu çubukların göreli uzunluğu (0–1); anlamları kaynakta açıklanmamış. */
  barD: number | null;
  barC: number | null;
  /** Kısa açıklama (ne değişti, neden). */
  why: string;
}

/**
 * Şekil 2-42 “Axial Power and Xenon Distribution” (12-3-6-3 yük takibi).
 * Değerler: her panelde sol kenardan eğriye yatay mesafe (piksel) / 130. Yalnız biçim karşılaştırması içindir.
 */
export const FIG_2_42: AxialStop[] = [
  {
    hour: 0,
    label: 'a. 0 saat',
    power: [1.03, 0.98, 0.92, 0.91, 0.89, 0.91, 0.92, 0.92, 0.94, 0.83],
    xenon: [0.98, 0.95, 0.92, 0.9, 0.89, 0.91, 0.92, 0.98, 0.97, 0.86],
    barD: null,
    barC: null,
    why: 'Başlangıç: güç ve ksenon dağılımları birbirine yakın; ksenon güç dağılımıyla dengede. Alt bölgede güç biraz daha yüksek (alttan giren daha soğuk ve yoğun su).',
  },
  {
    hour: 3,
    label: 'b. 3 saat',
    power: [0.55, 0.54, 0.49, 0.46, 0.42, 0.4, 0.42, 0.45, 0.45, 0.29],
    xenon: [0.98, 1.0, 1.01, 1.0, 1.0, 1.02, 1.01, 1.0, 0.98, 0.93],
    barD: 0.9,
    barC: 0.05,
    why: 'Şekilde güç eğrisi orta bölgede içe çekilmiş, ksenon eğrisi dışarıda kalmış: ksenon dağılımı güç dağılımındaki değişimi hemen izlemiyor. Şekilde “D” göstergesi uzun.',
  },
  {
    hour: 9,
    label: 'c. 9 saat',
    power: [0.47, 0.47, 0.45, 0.42, 0.41, 0.44, 0.48, 0.53, 0.53, 0.35],
    xenon: [1.02, 1.01, 0.98, 0.99, 0.99, 0.98, 0.96, 0.95, 0.9, 0.59],
    barD: 1.0,
    barC: 0.17,
    why: 'Güç dağılımı üst bölgeye doğru biraz genişlemiş; ksenon hâlâ geniş. Kaynak 2-97: önceki saatlerde aşağıda oluşan fazla ksenon zamanla o bölgedeki akıyı düşürüp gücü yukarı itebilir.',
  },
  {
    hour: 12,
    label: 'd. 12 saat',
    power: [0.96, 1.21, 1.08, 0.97, 0.88, 0.84, 0.83, 0.87, 0.84, 0.69],
    xenon: [0.75, 0.74, 0.73, 0.73, 0.75, 0.77, 0.78, 0.78, 0.78, 0.55],
    barD: 0.18,
    barC: null,
    why: 'Güç alt bölgede belirgin biçimde yükselmiş (alt tepe); ksenon dağılımı daha düz ve içeride. Şekilde “D” göstergesi kısa.',
  },
  {
    hour: 18,
    label: 'e. 18 saat',
    power: [1.0, 1.15, 1.06, 0.96, 0.88, 0.86, 0.87, 0.86, 0.8, 0.75],
    xenon: [0.77, 0.75, 0.75, 0.74, 0.75, 0.76, 0.78, 0.79, 0.77, 0.5],
    barD: 0.25,
    barC: null,
    why: 'Alt bölgedeki güç fazlası sürüyor; ksenon dağılımı gücün gerisinde kalıyor. Toplam güç değişse de dağılımın biçimi ayrıca değişebilir.',
  },
  {
    hour: 24,
    label: 'f. 24 saat',
    power: [0.87, 0.94, 0.91, 0.9, 0.93, 0.93, 0.98, 0.95, 0.93, 0.67],
    xenon: [0.97, 0.92, 0.91, 0.98, 0.92, 0.97, 1.0, 1.0, 0.94, 0.77],
    barD: 0.3,
    barC: null,
    why: 'Güç ve ksenon dağılımları yeniden birbirine yaklaşmış; ksenon yerel güç değişimlerine saatler içinde uyum sağlıyor.',
  },
];

/** Şekil 2-43 “Axial Flux Difference Limits” — piksel ölçümüyle okunan doğrular. */
export const FIG_2_43 = {
  /** Hedef ΔI (Typical Target Value): 0% güçte ~0, 100% güçte ~−2. */
  targetAt: (powerPct: number) => -0.02 * powerPct,
  /** Hedef bandı (Typical Target Band) yarı genişliği: ~6. */
  bandHalfWidth: 6,
  /** Şekildeki dış kesik-noktalı çizgi; kaynak metinde adı verilmemiş. */
  outerEnvelope: [
    [-35, 50],
    [-10, 90],
    [15, 90],
    [35, 50],
  ] as [number, number][],
};
