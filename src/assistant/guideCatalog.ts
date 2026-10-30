/** Editörlü cevaplar ve mevcut ders metinlerinden türetilen soru havuzu. Ağ/model kullanmaz. */
import type { KnowledgeSource } from '../knowledge/kb';
import type { ReactorId } from '../reactors/shared/types';
import { COMPARE_TOPICS } from '../components/educational/compareTopics';
import { MODES } from '../reactors/pwr/operations/data/modes';
import { HEATUP } from '../reactors/pwr/operations/data/heatup';
import { AXIAL_NOT_AUTO, CONTROL_RELATIONS } from '../reactors/pwr/operations/data/controls';
import type { AssistantAction } from './actions';

export const GUIDE_CATEGORIES = ['PWR', 'BWR', 'VVER', 'Karşılaştırma', 'İşletme', 'Site kullanımı'] as const;
export type GuideCategory = typeof GUIDE_CATEGORIES[number];
export interface GuideCard {
  id: string;
  category: GuideCategory;
  reactors: ReactorId[];
  question: string;
  variants: string[];
  answer: string;
  detail?: string;
  sourceIds: string[];
  entryIds: string[];
  actions: AssistantAction[];
}

export function buildGuideCatalog(kb: KnowledgeSource): GuideCard[] {
  const cards: GuideCard[] = [];
  const add = (id: string, question: string, variants: string[], answer: string, entries: string[], extra: Partial<GuideCard> = {}) => {
    const refs = entries.map((e) => kb.get(e)).filter((e) => !!e);
    cards.push({ id, category: 'İşletme', reactors: ['pwr'], question, variants, answer,
      sourceIds: [...new Set(refs.flatMap((e) => e.sourceIds))], entryIds: entries,
      actions: refs.flatMap((e) => e.targets).slice(0, 3), ...extra });
  };

  // Sık karıştırılan parçalar: cevap metinleri ekipman tanımlarından birlikte okunur.
  for (const r of ['pwr', 'bwr', 'vver'] as const) {
    const prefix = r.toUpperCase();
    const pairs = [
      ['vessel-containment', 'vessel', 'containment', 'Reaktör kabı ve koruma yapısı aynı şey mi?', ['reaktör kabı koruma binası farkı', 'kap ve containment farkı']],
      ['turbine-generator', 'hp', 'gen', 'Türbin ve jeneratör arasındaki fark nedir?', ['elektrik türbinde mi jeneratörde mi üretilir', 'elektrik nerede üretilir']],
      ['pump-generator', r === 'vver' ? 'mcp' : r === 'bwr' ? 'recirc' : 'rcp', 'gen', 'Pompa elektrik üretir mi?', ['pompa jeneratör aynı mı', 'pompa türbin gibi mi']],
      ['condenser-feed', 'condenser', 'feedpump', 'Kondenserden çıkan su nereye gider?', ['besleme suyu nereden gelir', 'yoğuşan su tekrar kullanılır mı']],
      ['rods-fuel', 'rods', 'vessel', 'Kontrol çubukları ile çekirdek arasındaki ilişki nedir?', ['kontrol çubukları yakıt mı', 'kontrol çubukları neyi soğurur']],
    ] as const;
    for (const [key, first, second, q, variants] of pairs) {
      const a = kb.get(`${r}.${first}`), b = kb.get(`${r}.${second}`);
      if (!a || !b) continue;
      const lead = {
        'vessel-containment': 'Aynı parça değildir; reaktör kabı ve onu çevreleyen koruma yapısının görevleri farklıdır.',
        'turbine-generator': 'Türbin mekanik dönme hareketi sağlar; elektrik jeneratörde üretilir.',
        'pump-generator': 'Pompa elektrik üretmez; akışkanı dolaştırır. Elektrik jeneratörde üretilir.',
        'condenser-feed': 'Yoğuşan su, besleme suyu yolu üzerinden çevrime geri gönderilir.',
        'rods-fuel': 'Kontrol çubukları yakıt değildir; nötron soğurarak zincirleme tepkimeyi etkiler.',
      }[key];
      add(`concept:${r}:${key}`, `${prefix} ${q}`, variants.map((v) => `${prefix} ${v}`),
        lead, [a.id, b.id],
        { category: prefix as GuideCategory, reactors: [r], detail: `${a.name}: ${a.summary}\n\n${b.name}: ${b.summary}` });
    }
    if (r !== 'bwr') {
      const sg = kb.get(`${r}.${r === 'vver' ? 'hsg' : 'sg'}`)!, cond = kb.get(`${r}.condenser`)!;
      add(`concept:${r}:sg-condenser`, `${prefix} Buhar üreteci ile kondenser arasındaki fark nedir?`,
        [`${prefix} kondenser buhar üreteci aynı mı`, `${prefix} buhar üreteci yoğuşturucu farkı`],
        'Buhar üreteci ikincil suya ısı aktararak buhar üretir; kondenser ise türbin çıkışındaki buharı soğutarak yoğuşturur.', [sg.id, cond.id],
        { category: prefix as GuideCategory, reactors: [r], detail: `${sg.name}: ${sg.summary}\n\n${cond.name}: ${cond.summary}` });
    }
  }

  // Cevaplar tek kaynaktan okunur: ekipman/ders metni değişirse rehber de güncellenir.
  for (const e of kb.all()) {
    const r = e.reactorId;
    const name = e.name.replace(/^\d+\.\s*/, '');
    const prefix = r ? r.toUpperCase() : '';
    const aliases = [...new Set([name, ...e.aliases])];
    const questions = aliases.flatMap((a) => [`${prefix} ${a} nedir?`, `${prefix} ${a} açıkla`, `${prefix} ${a} göster`]);
    if (e.kind === 'equipment') questions.push(...aliases.flatMap((a) => [`${prefix} ${a} ne işe yarar?`, `${prefix} ${a} nasıl çalışır?`]));
    cards.push({ id: `entry:${e.id}`, category: e.kind === 'ops' || e.kind === 'chartEvent' || e.id.includes('.topic.xenon') ? 'İşletme' : (prefix || 'İşletme') as GuideCategory,
      reactors: r ? [r] : [], question: e.kind === 'reactor' ? `${prefix} nedir?` : e.kind === 'equipment' ? `${prefix} ${name} ne işe yarar?` : `${prefix} ${name} açıkla`,
      variants: questions, answer: e.summary, detail: e.body, sourceIds: e.sourceIds, entryIds: [e.id], actions: e.targets.slice(0, 3) });
  }

  // Karşılaştırmalar aile geneli ile çizilen temsili tasarımı ayıran mevcut metinleri kullanır.
  const compareAliases: Record<string, string[]> = {
    'steam-where': ['buhar nerede oluşur', 'buhar nerede oluşuyor', 'su nerede kaynar'],
    'heat-path': ['ısı türbine nasıl ulaşır', 'enerji türbine nasıl aktarılır'],
    loops: ['reaktör suyu türbine gider mi', 'birincil ve ikincil su karışır mı', 'iki devre neden ayrı', 'kaç devre var', 'reaktör suyu türbin suyu aynı mı'],
    pressurizer: ['basınçlandırıcı var mı', 'basınç nasıl kontrol edilir'],
    'sg-layout': ['buhar üreteci yatay mı dikey mi'],
    rods: ['kontrol çubukları nereden girer', 'kontrol çubukları alttan mı üstten mi'],
  };
  for (const topic of COMPARE_TOPICS) {
    for (const r of ['pwr', 'bwr', 'vver'] as const) {
      const side = topic.sides[r];
      cards.push({ id: `compare:${topic.id}:${r}`, category: r.toUpperCase() as GuideCategory, reactors: [r],
        question: `${r.toUpperCase()} ${topic.question}`, variants: (compareAliases[topic.id] ?? [topic.label]).map((q) => `${r.toUpperCase()} ${q}`),
        answer: side.text, detail: side.scope === 'drawn' ? 'Bu açıklama çizilen temsili tasarıma aittir; gerçek tesislerin ayrıntıları değişebilir.' : undefined,
        sourceIds: side.sourceIds, entryIds: [topic.id === 'steam-where' ? (r === 'bwr' ? 'bwr.topic.no-sg' : `${r}.topic.steam-where`) : r], actions: [{ type: 'highlightFlow', reactor: r, ids: side.main, label: topic.label }] });
    }
    for (const rs of [['pwr', 'bwr'], ['pwr', 'vver'], ['bwr', 'vver'], ['pwr', 'bwr', 'vver']] as ReactorId[][]) {
      cards.push({ id: `compare:${topic.id}:${rs.join('-')}`, category: 'Karşılaştırma', reactors: rs,
        question: `${rs.map((r) => r.toUpperCase()).join(' ve ')}: ${topic.question}`,
        variants: (compareAliases[topic.id] ?? [topic.label]).map((q) => `${rs.join(' ')} ${q} karşılaştır`),
        answer: rs.map((r) => `${r.toUpperCase()}: ${topic.sides[r].text}`).join('\n\n'),
        detail: topic.sides[rs[0]].scope === 'drawn' ? 'Çizilen temsili tasarımlar karşılaştırılıyor; bu ayrıntılar bütün tesislere genellenemez.' : undefined,
        sourceIds: [...new Set(rs.flatMap((r) => topic.sides[r].sourceIds))], entryIds: rs,
        actions: rs.map((r) => ({ type: 'highlightFlow', reactor: r, ids: topic.sides[r].main, label: topic.label })) });
    }
  }
  for (const rs of [['pwr', 'bwr'], ['pwr', 'vver'], ['bwr', 'vver'], ['pwr', 'bwr', 'vver']] as ReactorId[][]) {
    add(`families:${rs.join('-')}`, `${rs.join(' ve ').toUpperCase()} arasındaki fark nedir?`,
      [`${rs.join(' ')} karşılaştır`, `${rs.join(' ')} farkları`, `${rs.join(' ')} aynı mı`],
      rs.map((r) => `${r.toUpperCase()}: ${kb.get(r)!.summary}`).join('\n\n'), rs,
      { category: 'Karşılaştırma', reactors: rs });
  }

  for (const mode of MODES) {
    add(`mode:${mode.mode}`, `PWR Mod ${mode.mode} ${mode.name} nedir?`,
      [`mod ${mode.mode}`, mode.name, mode.sourceName, `${mode.name} soğutma nasıl olur`], mode.whatWhy,
      ['pwr.ops.modes'], { detail: `Soğutma: ${mode.coolingText} Türbin: ${mode.turbineText}` });
  }
  for (const stage of HEATUP) {
    add(`heatup:${stage.id}`, `PWR ${stage.title.replace(/^\d+\.\s*/, '')} nasıl olur?`,
      [stage.title.replace(/^\d+\.\s*/, '')], stage.whatWhy, ['pwr.ops.heatup'],
      { detail: `Isı kaynakları: ${stage.heatSources.join('; ')}. Isı alıcıları: ${stage.heatSinks.join('; ')}. ${stage.pzrLabel}. Kavramsal eğitim anlatımıdır.` });
  }
  for (const c of CONTROL_RELATIONS) {
    add(`control:${c.id}`, `PWR ${c.measured} nasıl kontrol edilir?`,
      [c.system, `${c.measured} hangi sistem ayarlar`], `${c.system}: ${c.effect}`, ['pwr.ops.controls'], { detail: c.feedback });
  }
  add('axial-auto', 'Eksenel güç dağılımı otomatik kontrol edilir mi?', ['eksenel dağılım neden otomatik değil'], AXIAL_NOT_AUTO, ['pwr.ops.axial', 'pwr.ops.controls']);
  add('xenon-growth', 'Ksenon neden kapatmadan sonra artar?', ['ksenon neden artıyor', 'kapatınca ksenon neden yükselir', 'reaktör durunca ksenon biter mi', 'kapatma sonrası ksenon zehirlenmesi', 'xenon neden kapatmadan sonra artabiliyor'],
    kb.get('pwr.topic.xenon-shutdown')!.summary, ['pwr.topic.xenon-shutdown']);
  add('xenon-peak', 'Ksenon tepesi kaç saatte oluşur?', ['ksenon ne zaman tepe yapar', 'ksenon zirvesi kaç saat sonra', 'ksenon maksimum zamanı'],
    'Tepe zamanı kapatma öncesindeki duruma ve kullanılan modele bağlıdır. Kaynaktaki şekilden okunan tepe ile uygulamanın modelinden hesaplanan tepe ayrı işaretlenir; tek bir zamanı bütün durumlar için kesin değer olarak vermiyoruz.',
    ['pwr.ops.xenon'], { detail: 'Grafikte ◆ şekilden okunan, ● modelden hesaplanan olaydır. Olayı seçmek açıklamasını açar; senaryo saatini taşımak ayrı düğmeyle yapılır.' });
  add('boron-decrease', 'Yakıt çevriminde bor neden azaltılır?', ['bor neden düşer', 'bor derişimi neden azalır', 'bor konsantrasyonu neden azaltılıyor'],
    'Yakıt tükendikçe eklenen negatif reaktiviteyi karşılamak için soğutucudaki bor azaltılır. Çevrim başındaki ilk keskin düşüşte ksenon birikimi de etkilidir.',
    ['pwr.ops.boron'], { detail: 'Eğrideki küçük toparlanmanın açıklaması uygulamada yorum olarak ayrılır; şeklin tamamı tek bir etkiye bağlanmaz.' });
  add('decay-heat', 'Reaktör kapatılınca soğutma neden sürer?', ['fisyon durunca ısı biter mi', 'artık ısı nedir', 'kapatma sonrası artık ısı', 'reaktör kapalıyken neden soğutulur', 'rhr ne işe yarar'],
    'Fisyon durduğunda artık ısı hemen sıfırlanmaz. Bu nedenle kapatma sonrasında da ısı uzaklaştırılır; uygulamanın PWR işletme bölümünde düşük sıcaklık koşullarında RHR ile soğutma gösterilir.', ['pwr.ops.modes', 'pwr.ops.heatup']);
  add('axial-meaning', 'ΔI ve AO ne demek?', ['delta i nedir', 'eksenel ofset nedir', 'ao nedir', 'aynı toplam güç farklı dağılım olabilir mi'],
    'Toplam güç tek başına çekirdeğin üst ve alt yarılarındaki dağılımı göstermez. ΔI üst ve alt güç katkılarının farkını, AO ise bu farkın toplam güce oranını anlatır. Aynı toplam güçte farklı eksenel dağılımlar olabilir.', ['pwr.ops.axial']);

  const site = (id: string, q: string, variants: string[], answer: string, detail?: string) => add(`site:${id}`, q, variants, answer, [],
    { category: 'Site kullanımı', reactors: [], sourceIds: ['app-guide'], actions: [], detail });
  site('help', 'Bu rehbere ne sorabilirim?', ['yardım', 'neler biliyorsun', 'hangi soruları cevaplıyorsun', 'merhaba', 'selam'],
    'PWR, BWR ve VVER ekipmanları, devreleri, karşılaştırmaları, PWR işletme konuları ve site kullanımı hakkında hazırlanmış cevaplar sunuyorum. Hazır sorular bölümünden konu seçebilir veya kendi sorunuzu yazabilirsiniz.',
    'Belirsiz soruda seçenek sunarım; hazırlanmış içerikte olmayan bir cevabı uydurmam. Genel sohbet modeli değilim.');
  site('local', 'Asistan internet veya API kullanıyor mu?', ['yapay zeka mısın', 'token harcıyor musun', 'ücretli misin', 'internet gerekiyor mu', 'çevrimdışı çalışır mı'],
    'Rehber, bu sayfayla yüklenen hazır soru-cevapları cihazınızda eşleştirir. Sorular bir model sunucusuna gönderilmez; API anahtarı veya token ücreti yoktur.',
    'Sayfayı ilk açmak için site dosyalarının yüklenmesi gerekir; dış kaynak bağlantılarını açmak ayrıca internet ister.');
  site('progress', 'Ders ilerlemem nerede saklanıyor?', ['ilerlemem kaydediliyor mu', 'kaldığım yerden nasıl devam ederim', 'başka cihazda ilerleme gelir mi'],
    'Ders ilerlemesi bu tarayıcıda saklanır. Öğrenme bölümündeki “Kaldığım yerden devam et” ile kayıtlı adıma dönersiniz; başka cihazlarla eşitlenmez.',
    'Tarayıcı verilerini silmek kaydı kaldırabilir. Depolama engelliyse ilerleme yalnız açık oturumda tutulur.');
  site('reset', 'İlerlemeyi nasıl sıfırlarım?', ['ders kaydını sil', 'ilerlemeyi sıfırla', 'simülasyonu sıfırlamak dersi siler mi'],
    'Öğrenme bölümündeki “İlerlemeyi sıfırla” ders kaydını siler ve onay ister. Simülasyondaki “Sıfırla” ise modeli, grafiği ve sahneyi başa alır; ders kaydını silmez.');
  site('labels', 'Küçük ekipman etiketlerini nasıl görürüm?', ['etiketler görünmüyor', 'temel ayrıntılı farkı', 'etiketleri aç', 'yazıları nasıl büyütürüm'],
    'Şema araç çubuğunda “Ayrıntılı” seçin veya yakınlaştırın. Temel görünümde alt bileşen etiketleri %150 yakınlaştırmadan itibaren açılır; seçili ekipmanın etiketi her düzeyde görünür.');
  site('zoom', 'Şemayı nasıl yakınlaştırırım?', ['şema küçük', 'yakınlaştırma nasıl yapılır', 'şemayı sığdır', 'şema nasıl kaydırılır'],
    'Şema araç çubuğundaki yakınlaştırma ve “Sığdır” kontrollerini kullanın. Büyütülmüş şemada sürükleyerek gezinebilirsiniz; “Sığdır” çizimi tekrar görünür alana getirir.');
  site('predict', 'Tahmin dersinde neden sonraki adım kilitli?', ['tahmin dersi nasıl kullanılır', 'açıklamaya geçemiyorum', 'deneyden sonra ne yapacağım'],
    'Önce tahmin seçin, deneyi tamamlayın ve gözleminizi seçin. Sonra açıklama açılır. Tahmin yapmadan okumak isterseniz “Atla ve açıklamayı gör” seçeneğini kullanabilirsiniz.');
  site('model', 'Grafikteki değerler gerçek santral ölçümü mü?', ['bu gerçek simülasyon mu', 'temsili model ne demek', 'grafik neden kaynakla aynı değil', 'model güvenilir mi'],
    'Grafikler gerçek tesis ölçümü değildir. Uygulama kavramları göstermek için sadeleştirilmiş eğitim modelleri ve kaynak şekillerinden okunan veriler kullanır; bu ikisi ayrı etiketlenir.',
    'Özellikle ksenon modelindeki tepe yüksekliği kaynak şekliyle aynı değildir. Gerçek tesis ayarı veya işletme hesabı olarak kullanılamaz.');
  site('markers', 'Grafikte kare elmas ve daire ne anlama geliyor?', ['grafik işaretleri nedir', 'kaynak şekil model farkı', 'grafik olayını seçince zaman değişir mi'],
    '■ kaynakta tanımlı, ◆ şekilden yaklaşık okunan, ● modelden hesaplanan olayı gösterir. İşareti seçmek açıklamayı açar; zamanı değiştirmek için “Senaryo saatini bu olaya götür” düğmesi ayrıdır.');
  site('switch', 'Reaktör değiştirince simülasyon neden başa dönüyor?', ['pwr bwr geçince sıfırlanıyor', 'önceki konuma dön nasıl çalışır'],
    'Her reaktör ayrı sahne ve başlangıç durumuyla açılır. Reaktör değiştirmek simülasyonu başa alır. Rehber başka reaktöre geçişi kendiliğinden yapmaz; ilgili düğmeye sizin basmanız gerekir.');
  site('speed', 'Animasyonu nasıl durdururum veya hızlandırırım?', ['oynat duraklat', 'animasyon hızı', 'akış hareket etmiyor'],
    'Kontrol çubuğunda “Oynat / Duraklat” ve 0.5×, 1×, 2× hız seçenekleri vardır. Cihazda hareket azaltma tercihi açıksa animasyon başlangıçta duraklatılabilir.');
  site('power', 'Göreli güç sürgüsü neyi değiştiriyor?', ['güç yüzdesi gerçek mi', 'eğitim senaryosu göreli güç', 'çubuk konumu neden güçle aynı değil'],
    'Sürgü temsili santral modelinin hedef gücünü değiştirir. Isıl güç ve elektrik tepkileri gecikmeli gelişir; çubuk hareketi güç yüzdesiyle birebir eşlenmez. Gerçek tesis kumandası değildir.');
  site('chat', 'Sohbetim kaydediliyor mu?', ['sorularım saklanıyor mu', 'sohbeti nasıl temizlerim'],
    'Sohbet yalnız açık sekmenin belleğinde tutulur. “Sohbeti temizle” ile silebilirsiniz; sayfa yenilendiğinde sohbet gider. Ders ilerlemesi bundan ayrı saklanır.');
  return cards;
}
