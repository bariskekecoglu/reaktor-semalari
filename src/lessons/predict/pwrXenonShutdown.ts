import type { PredictLesson } from './types';

/**
 * PWR pilot dersi: kapatmadan sonra ksenon-135.
 * Dayanak: Nuc E 430 Bölüm 2, s. 2-94 (ksenonun iyot bozunmasıyla oluşması, kapatma sonrası artış) ve
 * Şekil 2-41 (kapatma sonrası Xe worth eğrileri). Canlandırma uygulamanın temsili iyot/ksenon modelini kullanır;
 * modelin tepe/denge oranı kaynaktan farklıdır (README), bu yüzden derste sayı değil, yön ve yaklaşık zaman sorulur.
 */
export const PWR_XENON_SHUTDOWN: PredictLesson = {
  id: 'pwr.predict.xenon-shutdown',
  reactorId: 'pwr',
  title: 'Kapatmadan sonra ksenon ne yapar?',
  goal: 'Reaktör kapatıldıktan sonraki saatlerde ksenon-135’in neden önce artıp sonra azaldığını açıklayabilmek.',
  initialState: 'PWR uzun süre %100 güçte çalışmış; iyot-135 ve ksenon-135 bu güce ait dengede. Ardından reaktör kapatılıyor (fisyon gücü sıfıra iniyor).',
  predict: {
    question: 'Kapatmadan sonraki ilk birkaç saatte ksenon-135 miktarı ne yapar?',
    choices: [
      {
        id: 'drop',
        text: 'Hemen sıfıra düşer.',
        correct: false,
        why: 'Fisyon durunca ksenonun doğrudan fisyondan gelen küçük payı da durur; bu yüzden makul görünür. Ancak ksenonun büyük kısmı iyot-135’in bozunmasıyla oluşur ve iyot hâlâ ortamdadır.',
      },
      {
        id: 'rise',
        text: 'Bir süre artar, saatler sonra tepe yapar, sonra azalır.',
        correct: true,
        why: 'Önceki güçte birikmiş iyot bozunarak ksenon üretmeye devam eder; nötron akısı olmadığı için ksenon artık nötronla tüketilmez. Üretim bozunmayı geçtiği sürece ksenon artar.',
      },
      {
        id: 'flat',
        text: 'Değişmez; kapatma öncesindeki düzeyde kalır.',
        correct: false,
        why: 'Denge, üretim ve kaybın eşit olmasıdır. Kapatma bu dengeyi bozar: nötronla tüketim ortadan kalkar. Bu yüzden ksenon sabit kalamaz.',
      },
      {
        id: 'decay',
        text: 'Kendi bozunmasıyla yavaşça ve sürekli azalır.',
        correct: false,
        why: 'Ksenonun kendi bozunması gerçektir; uzun vadede azalma budur. Ama ilk saatlerde iyottan gelen üretim baskındır, bu yüzden önce artış görülür.',
      },
    ],
  },
  experiment: {
    variable: 'Fisyon gücü',
    from: '%100',
    to: '%0 (t = 0’da kapatma)',
    scenario: { lab: 'shutdown', key: '100' },
    hours: 48,
    note: 'Canlandırma uygulamanın temsili iyot/ksenon modelidir (doğrulanmış reaktör modeli değildir). Eğrinin yönü ve tepe zamanı Şekil 2-41 ile uyumludur; tepe yüksekliği kaynaktan farklıdır, bu yüzden sayısal büyüklük sorulmaz.',
  },
  observe: {
    question: 'Modelde ksenon en yüksek değerine yaklaşık ne zaman ulaştı?',
    choices: [
      { id: 'zero', text: 'Kapatma anında (0 sa).', correct: false, why: 'Kapatma anında ksenon dengedeydi; grafikte eğri bu noktadan sonra yükseliyor.' },
      { id: 'hours', text: 'Birkaç saat sonra (yaklaşık 5–12 sa).', correct: true, why: 'Modelde tepe ~7–8 sa; Şekil 2-41’de %100 güç eğrisinin en negatif noktası da yaklaşık 8 sa civarında okunuyor.' },
      { id: 'days', text: 'Yaklaşık iki gün sonra.', correct: false, why: 'İki gün sonra iyotun büyük kısmı bozunmuştur; ksenon o sırada azalma evresindedir.' },
      { id: 'never', text: 'Tepe yok; eğri sürekli azaldı.', correct: false, why: 'Grafikte ilk saatlerde açık bir yükseliş var; sürekli azalma tahmini ilk saatlerdeki iyot katkısını atlar.' },
    ],
  },
  explain: {
    text: 'Ksenon-135’in büyük kısmı doğrudan fisyondan değil, iyot-135’in bozunmasından gelir. İyot önceki güç düzeyinde birikmiştir. Güç düştüğünde veya fisyon durduğunda ksenonun nötronla tüketimi azalır ya da durur; iyot ise bozunmaya devam eder. Bu yüzden ksenon önce artar (negatif reaktivite büyür), saatler sonra tepe yapar ve iyot tükendikçe azalır (kaynak s. 2-94; Şekil 2-41). Daha yüksek güçten kapatmada birikmiş iyot fazla olduğundan etki daha büyüktür.',
    sourceIds: ['p-2-94', 'fig-2-41', 'model-xenon'],
  },
  assess: {
    question: 'Kapatmadan birkaç saat sonra reaktörü yeniden kritik yapmak neden zorlaşabilir?',
    choices: [
      {
        id: 'xe',
        text: 'Artmış ksenon ek negatif reaktivite getirir; bunu dengelemek gerekir.',
        correct: true,
        why: 'Ksenon güçlü bir nötron soğurucusudur. Tepe civarında ek negatif reaktivite en büyüktür.',
      },
      {
        id: 'cold',
        text: 'Birincil su soğuduğu için basınçlandırıcı çalışmaz.',
        correct: false,
        why: 'Sıcaklık ve basınç da işletmeyi etkiler, ama bu dersin gösterdiği etki ksenondur; basınçlandırıcı ile ilgili bir sonuç bu modelde yoktur.',
      },
      {
        id: 'decayheat',
        text: 'Artık ısı fisyonu durdurduğu için.',
        correct: false,
        why: 'Artık ısı kapatmadan sonra süren ısı üretimidir; fisyonu durdurmaz ve reaktiviteyi bu şekilde belirlemez.',
      },
    ],
  },
  hints: [
    'Ksenonun nereden geldiğini düşünün: fisyondan doğrudan mı, yoksa başka bir çekirdeğin bozunmasıyla mı?',
    'Kapatmadan sonra nötron akısı yoktur. Ksenonu ortadan kaldıran iki yoldan hangisi kaybolur?',
  ],
};

export const PREDICT_LESSONS = [PWR_XENON_SHUTDOWN] as const;

export function getPredictLesson(id: string) {
  return PREDICT_LESSONS.find((l) => l.id === id);
}
