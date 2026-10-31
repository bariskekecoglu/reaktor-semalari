import type { ReactorId } from '../reactors/shared/types';

export const SAFETY_TOPICS = [
  { id: 'shutdown', title: 'Reaktörü durdurma', question: 'Reaktör koruma sistemi ne işe yarar?',
    aliases: ['reaktör koruma sistemi', 'reaktör trip', 'scram', 'acil durdurma', 'reaktörü durdurma'],
    summary: 'Koruma sistemi, izlenen koşullar gerektiğinde zincirleme fisyon tepkimesinin durdurulmasını başlatır. Durdurma, yakıttaki artık ısıyı ortadan kaldırmaz.',
    distinction: 'Güç ayarı ile koruyucu durdurma farklı işlevlerdir. Buradaki çubuk hareketi gerçek bir koruma sisteminin tepki hesabı değildir.',
    steps: ['Koşulların algılanması', 'Koruma sinyali', 'Negatif reaktivite eklenmesi', 'Soğutmanın sürdürülmesi'],
    sourceIds: ['iaea-safety-functions'] },
  { id: 'heat', title: 'Artık ısıyı uzaklaştırma', question: 'Artık ısı uzaklaştırma sistemi neden gerekir?',
    aliases: ['artık ısı uzaklaştırma sistemi', 'rhr', 'kapatma soğutması', 'durdurma sonrası soğutma'],
    summary: 'Fisyon durdurulduktan sonra radyoaktif bozunmalar yakıtta ısı üretmeyi sürdürür. Bu ısı, uygun bir soğutma yolu üzerinden nihai ısı alıcısına aktarılmalıdır.',
    distinction: 'Elektrik üretiminin bitmesi, soğutma ihtiyacının bitmesi anlamına gelmez. Kullanılabilir soğutma yolu santral tasarımına ve koşullara bağlıdır.',
    steps: ['Yakıtta artık ısı', 'Soğutucuya aktarım', 'Isı değişimi', 'Nihai ısı alıcısı'],
    sourceIds: ['iaea-safety-functions'] },
  { id: 'eccs', title: 'Acil çekirdek soğutma', question: 'Acil çekirdek soğutma sistemi ECCS nedir?',
    aliases: ['acil çekirdek soğutma', 'eccs', 'acil soğutma', 'acil enjeksiyon'],
    summary: 'Acil çekirdek soğutma sistemleri, normal çekirdek soğutmasının kaybı gibi koşullarda yakıtın soğutulmasını destekleyen özel sistemlerdir. Pompa, vana, tank ve borulama düzeni tasarıma göre değişir.',
    distinction: 'Ana dolaşım pompası ECCS ile aynı şey değildir. Aşağıdaki kavram zinciri, belirli bir santralin bağlantı veya devreye girme sırasını göstermez.',
    steps: ['Soğutma ihtiyacı', 'Uygun su kaynağı', 'Yakıtın soğutulması', 'Uzun süreli ısı uzaklaştırma'],
    sourceIds: ['nrc-eccs'] },
  { id: 'barriers', title: 'Radyoaktif maddeyi tutma', question: 'Güvenlik bariyerleri ve derinliğine savunma nedir?',
    aliases: ['güvenlik bariyerleri', 'derinliğine savunma', 'radyoaktif maddeyi tutma', 'fiziksel bariyerler'],
    summary: 'Yakıt ve çevresindeki fiziksel bariyerler radyoaktif maddelerin yayılmasını sınırlar. Derinliğine savunma, bu bariyerlerin yanında önleme, izleme ve sonuçları azaltma katmanlarını da kapsar.',
    distinction: 'Biyolojik zırhın ışınlamayı azaltması ile sızdırmaz bir bariyerin madde salımını sınırlaması farklı görevlerdir. Her reaktör binası eşdeğer bir containment değildir.',
    steps: ['Yakıt matrisi', 'Yakıt zarfı', 'Soğutucu basınç sınırı', 'Tasarıma özgü tutma yapıları'],
    sourceIds: ['iaea-safety-functions'] },
  { id: 'support', title: 'Elektrik ve destek sistemleri', question: 'Güvenlik sistemlerinde yedek elektrik neden gerekir?',
    aliases: ['yedek elektrik', 'güvenlik destek sistemleri', 'acil güç kaynağı', 'dizel jeneratör', 'bataryalar'],
    summary: 'Güvenlik işlevleri, ilgili tasarıma göre elektrik, ölçüm, kontrol ve yardımcı soğutma gibi desteklere ihtiyaç duyar. Birden fazla güç kaynağı, tek bir kaynağın kaybına karşı korumayı destekler.',
    distinction: 'Yedek kaynakların bulunması bütün işlevlerin sınırsız süre çalışacağı anlamına gelmez. Kapasite, bağımsızlık ve ortak nedenli arızalar ayrıca değerlendirilir.',
    steps: ['Güç kaynakları', 'Ölçüm ve kontrol', 'Gerekli ekipman', 'Güvenlik işlevi'],
    sourceIds: ['iaea-safety-functions'] },
] as const;

export type SafetyTopicId = typeof SAFETY_TOPICS[number]['id'];
export function isSafetyTopic(id: unknown): id is SafetyTopicId {
  return SAFETY_TOPICS.some(t => t.id === id);
}
export function safetyTopic(id: SafetyTopicId) {
  return SAFETY_TOPICS.find(t => t.id === id)!;
}

/** Kaynak kapsamını tasarım özelindeki ekipman iddialarından ayırır. */
export const REACTOR_SAFETY_NOTES: Record<ReactorId, { text: string; sourceIds: string[] }> = {
  pwr: { text: 'Bu şemadaki kontrol çubukları, reaktör kabı ve koruma yapısı ilgili parçaları incelemek içindir. ECCS, yardımcı besleme ve RHR borulaması bu normal çalışma şemasında çizilmemiştir.', sourceIds: ['nuce-ch2', 'nuce-2-5'] },
  bwr: { text: 'Bu şemada kontrol çubukları alttan girer. Normal devridaim ve besleme yolları gösterilir; acil soğutma sistemlerinin ayrı devreleri çizilmemiştir.', sourceIds: ['nuce-ch2', 'nrc-bwr'] },
  vver: { text: 'Bu çizim yatay buhar üreteçli temsili bir VVER çevrimidir. VVER modellerinin güvenlik sistemleri aynı değildir; modele özgü acil soğutma borulaması bu çizimde yoktur.', sourceIds: ['iaea-vver'] },
  rbmk: { text: 'Buradaki RBMK-1000 bina ve biyolojik zırhı, PWR tipi tam basınç containment ile eşdeğer değildir. Çernobil bölümü 1986 tasarımı ve tarihsel koşulları ele alır; bu katman güncel RBMK güvenlik değerlendirmesi değildir.', sourceIds: ['iaea-insag7', 'nea-chernobyl'] },
  candu: { text: 'Kanada CANDU reaktörlerinde iki bağımsız hızlı durdurma sistemi bulunur: durdurma çubukları ve nötron soğurucu sıvı enjeksiyonu. Mevcut şema ikinci sistemin borulamasını çizmez.', sourceIds: ['cnsc-safety'] },
};

/** Yalnız mevcut çizimdeki ilişkili parçalar; çizilmeyen güvenlik ekipmanı yerine kullanılmaz. */
export function safetyEquipment(reactor: ReactorId, topic: SafetyTopicId): string[] {
  if (topic === 'shutdown') return ['rods'];
  if (topic !== 'barriers') return [];
  if (reactor === 'rbmk') return ['fuel', 'channels', 'building'];
  if (reactor === 'candu') return ['fuel', 'channels', 'containment'];
  return ['vessel', 'containment'];
}
