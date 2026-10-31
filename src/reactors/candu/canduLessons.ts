import type { LessonStep } from '../shared/types';
import { CH_FLOW_IDS, FEEDER_L_IDS, FEEDER_R_IDS } from './canduLayout';

export const canduLessons: LessonStep[] = [
  {
    id: 'candu.tour.calandria',
    title: '1. Calandria ve moderatör',
    text: 'Yatay silindirik calandria, ağır su moderatörünü tutar. Moderatör nötronları yavaşlatır; düşük basınçlı ve daha soğuktur. Calandria yüksek basınçlı bir reaktör kabı değildir.',
    highlight: ['calandria', 'moderator'],
  },
  {
    id: 'candu.tour.channels',
    title: '2. Yatay yakıt kanalları',
    text: 'Calandria’dan uçtan uca yüzlerce yatay kanal geçer (CANDU 6’da 380; çizimde dört temsili kanal). Her kanalda basınç tüpü yakıt demetlerini ve basınçlı ağır su soğutucuyu taşır; dışındaki calandria tüpü moderatörle temas eder.',
    highlight: ['channels', 'fuel', ...CH_FLOW_IDS],
  },
  {
    id: 'candu.tour.bidirectional',
    title: '3. Komşu kanallarda ters akış',
    text: 'Soğutucu bazı kanallarda soldan sağa, komşu kanallarda sağdan sola akar. Böylece giriş ve çıkış uçları reaktörün iki yüzüne dağılır. Akış kanal boyunca ısınır (soğuk uçtan sıcak uca).',
    highlight: [...CH_FLOW_IDS, ...FEEDER_L_IDS, ...FEEDER_R_IDS],
  },
  {
    id: 'candu.tour.figure8',
    title: '4. Kolektörler ve sekiz biçimli halka',
    text: 'Besleyiciler kanalları kolektörlere bağlar. Soğutucu bir halkada iki buhar üreteci ve iki pompadan sırayla geçer: sağ çıkış → BÜ-2 → P-2 → sağ giriş → B kanalları → sol çıkış → BÜ-1 → P-1 → sol giriş → A kanalları.',
    highlight: ['headers-l', 'headers-r', 'feeders-l', 'feeders-r', 'f-out1-sg2', 'f-sg2-p2', 'f-p2-in2', 'f-out2-sg1', 'f-sg1-p1', 'f-p1-in1'],
  },
  {
    id: 'candu.tour.sg',
    title: '5. Buhar üreteci: iki ayrı akışkan',
    text: 'Sıcak ağır su buhar üretecinin U borularının içinden geçer ve ısısını boru duvarından verir. Birincil ağır suda oluşabilen sınırlı buhar burada yoğuşur; animasyon bu iki fazlı davranışı modellemez. Borunun dışındaki ikincil hafif su kaynar. Türbine giden buhar bu ikincil taraftan çıkar; ağır su türbine gitmez.',
    highlight: ['sg1', 'sg2', 'f-sg1-tubes', 'f-sg2-tubes', 'steamline', 'f-steamline', 'f-steam-2'],
  },
  {
    id: 'candu.tour.turbine',
    title: '6. Türbin, kondenser, besleme',
    text: 'Buhar türbinde genişleyip jeneratörü döndürür, kondenserde ayrı soğutma suyu çevrimiyle yoğuşur. Besleme pompası yoğuşan hafif suyu iki buhar üretecine geri gönderir.',
    highlight: ['hp', 'lp', 'gen', 'condenser', 'coolsource', 'feedpump', 'f-crossover', 'f-lp-l', 'f-lp-r', 'f-cool', 'f-feed1', 'f-feed2', 'f-feed3'],
  },
  {
    id: 'candu.tour.moderator',
    title: '7. Moderatörün ayrı soğutması',
    text: 'Moderatörde de ısı oluşur. Ayrı bir moderatör sistemi ağır suyu pompa ve ısı değiştiriciden dolaştırır. Bu sistemin birincil devreyle bağlantısı yoktur: iki ağır su sistemi karışmaz.',
    highlight: ['modsys', 'moderator', 'f-mod-out', 'f-mod-hx', 'f-mod-in', 'f-modcool'],
  },
  {
    id: 'candu.tour.fuelling',
    title: '8. İşletme sırasında yakıt değiştirme',
    text: 'Yakıt değiştirme makineleri kanalın iki ucundaki uç bağlantılarına kenetlenir; reaktör çalışırken yeni demetler eklenir, kullanılmış demetler alınır. Yakın plan yalnız ilkeyi gösterir; gerçek işletme prosedürü değildir.',
    highlight: ['endshields', 'fuel', 'channels'],
  },
];
