/** Seconds since 25 April 1986 00:00, plant local historical time; no timezone conversion. */
export type EvidenceLevel = 'documented' | 'representative' | 'uncertain';
export interface AccidentEvent {
  id: string; t: number; clock: string; label: string; detail: string;
  level: EvidenceLevel; sourceIds: string[]; locator: string; thermalMW?: number;
}
export const TEST_START = 86400 + 4984;
export const AZ5_TIME = TEST_START + 36;
export const END_TIME = TEST_START + 56;
export const EVIDENCE_LABELS: Record<EvidenceLevel, string> = {
  documented: '■ Kayıtlı / belgelenmiş', representative: '◇ Temsili — ölçüm değildir', uncertain: '? Bilinmiyor / tahminler farklı',
};
const event = (id: string, t: number, clock: string, label: string, detail: string, locator: string, thermalMW?: number, level: EvidenceLevel = 'documented'): AccidentEvent =>
  ({ id, t, clock, label, detail, locator, thermalMW, level, sourceIds: ['iaea-insag7'] });
export const TIMELINE: readonly AccidentEvent[] = [
  event('reduction', 3960, '25 Nisan · 01:06', 'Güç azaltma başlıyor', 'Ünite planlı duruş ve türbin serbest dönüş testi için hazırlanıyor.', 'Ek I, Tablo I-I, s. 53'),
  event('half-power', 13620, '25 Nisan · 03:47', '1600 MW ısıl', 'Kronolojideki 1600 MW kaydı bu saate aittir.', 'Ek I, Tablo I-I, s. 53', 1600),
  event('generator', 47100, '25 Nisan · 13:05', 'Türbin jeneratörü 7 ayrılıyor', 'Bu olaya ayrıca 1600 MW ölçümü atanmamıştır.', 'Ek I, Tablo I-I, s. 53'),
  event('delay', 50400, '25 Nisan · 14:00', 'ECCS ayrılıyor; test erteleniyor', 'ECCS devre dışı bırakılıyor; şebeke dispeçeri testin ertelenmesini istiyor. INSAG-7, ECCS ayrılmasının kazayı başlatmadığını belirtir.', 'Ek I, Tablo I-I, s. 53; §I-4.7.2, s. 72–73'),
  event('resume', 83400, '25 Nisan · 23:10', 'Güç azaltma sürüyor', 'Şebeke kaynaklı beklemeden sonra güç yeniden azaltılıyor.', 'Ek I, Tablo I-I, s. 53'),
  event('720mw', 86700, '26 Nisan · 00:05', '720 MW ısıl', 'Kronolojide bu saat için verilen güç noktası.', 'Ek I, Tablo I-I, s. 53', 720),
  event('drop', 88080, '26 Nisan · 00:28', 'Beklenmeyen güç düşüşü', 'Kontrol sistemi geçişinde ısıl güç yaklaşık 30 MW’a düşüyor. Düşük güçte ölçüm doğruluğu sınırlıdır; düşüşün nedeni kesin belirlenememiştir. Nötron göstergesindeki sıfır, sıfır ısıl güç demek değildir.', 'Ek I, Tablo I-I, s. 53; §I-4.7.3, s. 73–74', 30),
  event('pump7', 90180, '26 Nisan · 01:03', '200 MW ve ek pompa', 'Güç 200 MW civarında kararlı hale geliyor; yedinci ana sirkülasyon pompası devreye alınıyor. Testte öngörülen 700–1000 MW aralığının altında kalınıyor.', 'Ek I, Tablo I-I, s. 54; §3, s. 10–11', 200),
  event('pump8', 90420, '26 Nisan · 01:07', 'Sekizinci pompa', 'İkinci ek pompa devreye alınıyor. Yüksek dolaşım ve az giriş alt soğutması, buhar oluşumuna duyarlılığı artıran koşullardandır.', 'Ek I, Tablo I-I, s. 54; §2.8, s. 7'),
  event('orm', 91350, '26 Nisan · 01:22:30', 'Düşük reaktivite marjı', 'Bu anda kaydedilen durumdan kaza sonrası hesaplanan ORM, 8 eşdeğer manuel kontrol çubuğudur; işletme alt sınırı 15’tir. Bu, fiziksel olarak yalnız sekiz çubuğun içeride olduğu anlamına gelmez ve operatöre o anda verilmiş bir okuma değildir.', 'Ek I, Tablo I-I, s. 54; §4.2, s. 14–15'),
  event('test', TEST_START, '26 Nisan · 01:23:04', 'Türbin serbest dönüş testi', 'Türbin 8’in buhar giriş vanaları kapanıyor. Serbest dönen türbinin beslediği dört pompanın debisi azalırken diğer pompalar aynı şekilde davranmıyor.', 'Ek I, Tablo I-I, s. 54; §I-4.6.2, s. 65'),
  event('az5', AZ5_TIME, '26 Nisan · 01:23:40', 'AZ-5 / EPS-5', 'Acil kapatma düğmesine basılıyor; çubuklar inmeye başlıyor. Komisyon düğmeye neden basıldığını belirleyememiştir; teleşerit kaydı 01:23:39 gösterir.', 'Ek I, Tablo I-I, s. 55; §I-4.6.3, s. 66'),
  event('excursion', TEST_START + 39, '26 Nisan · 01:23:43', 'Güç artışı koruma sinyalleri', 'Kronoloji güç artış hızı korumasını ve 530 MW ısıl eşiğinin aşılmasını kaydeder. Bu eşik tepe güç ölçümü değildir.', 'Ek I, Tablo I-I, s. 55'),
  event('instruments', TEST_START + 43, '26 Nisan · 01:23:47', 'Debi okumaları güvenilirliğini yitiriyor', 'Testteki pompaların okumaları güvenilmez hale geliyor; diğer pompalarda ani debi değişimleri ve ölçüm arızası sinyalleri kaydediliyor.', 'Ek I, Tablo I-I, s. 55'),
  event('rupture', TEST_START + 45, '26 Nisan · 01:23:49', 'Kanal hasarı sinyali', 'Reaktör boşluğunda basınç artışı, kanal kopmasıyla ilişkilendirilen koruma sinyalini tetikliyor.', 'Ek I, Tablo I-I, s. 55'),
  event('destruction', END_TIME, '26 Nisan · 01:24 (günlük)', 'Çekirdeğin tahribi', 'Günlükte şiddetli sarsıntılar ve çubuk hareketinin durması belirtilir. Patlamalara ayrı kesin saniyeler ve tek bir tepe güç değeri atanmıyor; kaynaklarda tahminler farklıdır.', 'Ek I, Tablo I-I, s. 55; §4.1, s. 13; OECD NEA Bölüm I, The accident', undefined, 'uncertain'),
];
export function clampTime(t: number, min = TEST_START, max = END_TIME): number {
  return Number.isFinite(t) ? Math.max(min, Math.min(max, t)) : min;
}
export function eventAt(t: number): AccidentEvent {
  return [...TIMELINE].reverse().find(e => e.t <= t) ?? TIMELINE[0];
}
export function accidentClock(t: number): string {
  const s = Math.round(clampTime(t, TIMELINE[0].t, END_TIME)) % 86400;
  return `${t >= 86400 ? '26' : '25'} Nisan · ${[Math.floor(s / 3600), Math.floor(s / 60) % 60, s % 60].map(v => String(v).padStart(2, '0')).join(':')}`;
}
