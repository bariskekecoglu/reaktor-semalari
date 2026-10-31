import type { PredictLesson } from './types';

export const BWR_FLOW: PredictLesson = {
  id: 'bwr.predict.flow-control', reactorId: 'bwr',
  title: 'Devridaim debisi artarsa güç ne yapar?',
  goal: 'Negatif boşluk katsayılı bir BWR’de debi, moderasyon ve güç ilişkisini açıklayabilmek.',
  initialState: 'BWR kaynama olan kararlı bir güç düzeyinde. Kontrol çubukları sabit, basınç yaklaşık sabit. Yalnız devridaim debisi artırılıyor.',
  predict: { question: 'Devridaim debisi artırıldığında ilk tepkinin ardından güç hangi yönde değişir?', choices: [
    { id: 'rise', text: 'Güç yükselir.', correct: true, why: 'Artan debi başlangıçta buhar boşluklarını azaltır. Sıvı suyla moderasyon artar; negatif boşluk katsayısıyla pozitif reaktivite etkisi oluşur.' },
    { id: 'drop', text: 'Güç azalır.', correct: false, why: 'Daha fazla soğutma tek başına fisyon gücünün azalacağı anlamına gelmez. Burada azalan boşluklar moderasyonu artırır.' },
    { id: 'flat', text: 'Çubuklar sabitken güç değişemez.', correct: false, why: 'Çubuklar reaktiviteyi değiştirmenin tek yolu değildir; suyun yoğunluğu ve buhar boşlukları da etkilidir.' },
  ] },
  experiment: { kind: 'bwr-flow', variable: 'Devridaim debisi (normalize)', from: '1,00', to: '1,15', hours: 0,
    note: 'Boyutsuz, temsili neden–sonuç animasyonu. Eğriler ölçüm veya doğrulanmış kinetik model değildir. Basınç ve çubuk konumu sabit kabul edilir; işletme sınırları ve kararlılık modellenmez.' },
  observe: { question: 'Animasyonda hangi neden–sonuç sırası gösterildi?', choices: [
    { id: 'chain', text: 'Debi ↑ → başlangıçta boşluk ↓ → moderasyon ↑ → güç ↑', correct: true, why: 'Negatif boşluk katsayısı, boşluk azalmasının pozitif reaktivite etkisi yaratması demektir. Güç artışı daha sonra kaynamayı da artırarak geri besleme sağlar.' },
    { id: 'opposite', text: 'Debi ↑ → boşluk ↑ → güç ↑', correct: false, why: 'Debi artışının ilk etkisi boşluğu azaltmaktır. Sonraki güç artışının kaynamaya etkisiyle bunu karıştırmayın.' },
    { id: 'rods', text: 'Debi ↑ → çubuklar çekilir → güç ↑', correct: false, why: 'Bu deneyde çubuklar hareket etmiyor.' },
  ] },
  explain: { text: 'Kaynama olan bir BWR’de su hem soğutucu hem moderatördür. Devridaim debisinin artırılması başlangıçta çekirdekteki buhar boşluklarını azaltır. Sıvı su payı ve moderasyon artar; negatif boşluk katsayısı nedeniyle güç artma eğilimi gösterir. Artan güç yeniden daha çok kaynama üretir: ilk tepki ile son denge aynı şey değildir. Bu ilişki tüm reaktör tiplerine ve tüm güç düzeylerine genellenemez.', sourceIds: ['nrc-bwr-flow'] },
  assess: { question: 'Kaynama yok denecek kadar azken aynı debi değişikliğinden aynı güç tepkisini beklemek doğru mu?', choices: [
    { id: 'no', text: 'Hayır; boşluk geri beslemesinin etkisi çalışma koşuluna bağlıdır.', correct: true, why: 'Az boşluk varsa bu mekanizma daha zayıftır. Bu ders kaynama olan bir güç düzeyini ele alır.' },
    { id: 'yes', text: 'Evet; debi ile güç her durumda aynı oranda değişir.', correct: false, why: 'Debi–güç ilişkisi evrensel bir doğrusal yasa değildir; başlangıç koşulları ve geri beslemeler önemlidir.' },
  ] },
  hints: ['Sıvı su ile buharın nötron yavaşlatma etkisini karşılaştırın.', 'Negatif boşluk katsayısı: boşluk artarsa reaktivite azalır. Tersi ne olur?'],
};

/** Qualitative staging only: these normalized values are illustration coordinates, not plant predictions. */
export function flowIllustration(progress: number) {
  const p = Math.max(0, Math.min(1, progress));
  const ramp = (start: number, end: number) => Math.max(0, Math.min(1, (p - start) / (end - start)));
  return { flow: 1 + 0.15 * ramp(0, 0.2), voids: 1 - 0.18 * ramp(0.2, 0.5) + 0.08 * ramp(0.65, 1), power: 1 + 0.12 * ramp(0.5, 0.9) };
}
