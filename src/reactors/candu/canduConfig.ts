import type { ReactorConfig } from '../shared/types';
import { CH_FLOW_IDS, FEEDER_L_IDS, FEEDER_R_IDS } from './canduLayout';

const CH = CH_FLOW_IDS;
const FL = FEEDER_L_IDS;
const FR = FEEDER_R_IDS;
const LOOP_L = ['f-out2-sg1', 'f-sg1-tubes', 'f-sg1-p1', 'f-p1-in1'];
const LOOP_R = ['f-out1-sg2', 'f-sg2-tubes', 'f-sg2-p2', 'f-p2-in2'];
const MODSYS = ['f-mod-out', 'f-mod-hx', 'f-mod-in'];

/**
 * Temsili CANDU 6. Kaynaklar: Zhang & Shalaby (AECL), “Introduction to the Qinshan Phase III CANDU Nuclear Power Plant”
 * (CANTEACH); CANDU Fundamentals Bölüm 11 (reaktör yapısı) ve Bölüm 14 (ısı taşıma sistemi), CANTEACH;
 * CNSC “Pressure tubes” bilgi notu; IAEA BPTC Modül IV, s. 12 (PHWR).
 */
export const canduConfig: ReactorConfig = {
  id: 'candu',
  shortName: 'CANDU',
  fullName: 'CANDU 6 — basınçlı ağır su reaktörü (PHWR), yatay basınç tüplü (temsili)',
  family: 'Basınçlı ağır su reaktörü (PHWR) · basınç tüplü, iki devreli',
  summary:
    'Yakıt, yatay bir calandria tankından geçen yüzlerce basınç tüpünün içindedir. Tüplerdeki basınçlı ağır su soğutucu ısıyı buhar üreteçlerine taşır; türbine giden buhar, buhar üretecinin ikincil tarafındaki hafif sudan oluşur. Calandria’daki ağır su moderatör ise düşük basınçlı, daha soğuk ve soğutucudan tamamen ayrı bir sistemdir. Yakıt işletme sırasında değiştirilir.',
  notes: [
    'Temsili CANDU 6 (ölçeksiz): iki ısı taşıma halkasından biri ve 380 kanal yerine dört temsili kanal çizildi.',
    'Kolektörler yan görünüşte daire olarak (uç görünüş) çizildi; kesişen besleyiciler birleşmez, birleşmeler ● ile işaretli.',
    'CANDU 6’da birincil ağır suda sınırlı kaynama olabilir; animasyon iki fazlı davranışı modellemez. Türbine yalnız ikincil hafif suyun buharı gider (CANTEACH, §3.3).',
  ],
  components: [
    {
      id: 'calandria',
      name: 'Calandria',
      role: 'Ağır su moderatörünü tutan, kanalların içinden geçtiği yatay silindirik tank.',
      how: 'CANDU 6’da 380 yakıt kanalı yatay silindirik calandria içinde, kare kafeste yer alır (Qinshan III CANDU 6, AECL). Uçları calandria boru plakalarıyla kapalıdır; kanallar uçtan uca geçer. Calandria bir basınç kabı değildir: moderatör kaynamayacak şekilde soğutulur ve aşırı basınca karşı patlama diskleri vardır (CANDU Fundamentals, Bölüm 11). Yüksek basınç kanalların içindedir.',
      related: ['moderator', 'channels', 'endshields'],
      detail: 'separation',
    },
    {
      id: 'moderator',
      name: 'Ağır su moderatörü',
      role: 'Nötronları yavaşlatır.',
      how: 'Calandria’daki yüksek saflıkta ağır su; düşük basınçlı, düşük sıcaklıklı ve ısı taşıma sisteminin basınçlı ağır su soğutucusundan tamamen bağımsızdır (Qinshan III CANDU 6). Şemada mor tonlu, noktalı desen ve “D₂O · moderatör” etiketiyle gösterilir. Soğutucuyla aynı madde olsa da ayrı bir sistemdir; karışmaz.',
      related: ['calandria', 'modsys', ...MODSYS],
      detail: 'separation',
    },
    {
      id: 'channels',
      name: 'Yakıt kanalları (basınç tüpü + calandria tüpü)',
      role: 'Yakıtı ve basınçlı ağır su soğutucuyu taşır; basınç sınırı basınç tüpüdür.',
      how: 'Her kanalda 1 basınç tüpü, 1 calandria tüpü, uç bağlantıları ve aralayıcılar vardır (CNSC). Basınç tüpü yakıtı ve soğutucuyu içerir; dıştaki calandria tüpü moderatörle temas eder. Aradaki gaz dolu halka sıcak tüpü soğuk moderatörden yalıtır ve sızıntıyı algılamaya yarar (CANTEACH). Komşu kanallarda soğutucu ters yönde akar; şemada iki kanal soldan sağa, ikisi sağdan sola akar.',
      related: [...CH, ...FL, ...FR, 'fuel', 'calandria'],
      detail: 'channel',
    },
    {
      id: 'fuel',
      name: 'Yakıt demetleri',
      role: 'Fisyon ısısının üretildiği yer.',
      how: 'CANDU 6’da her kanalda 12 demet vardır; demet 37 elemanlıdır ve doğal uranyum dioksit kullanır (Qinshan III CANDU 6). Bu, CANDU 6 için tipik yakıttır; aynı kaynak işletmede yakıt değiştirme sayesinde geri kazanılmış uranyum, az zenginleştirilmiş uranyum ve toryum gibi başka yakıtların da kullanılabileceğini belirtir. Demetler yatay kanalda uç uca dizilidir.',
      related: [...CH, 'channels'],
      detail: 'fuelling',
    },
    {
      id: 'endshields',
      name: 'Uç kalkanları ve uç bağlantıları',
      role: 'Kanalları uçlarından taşır; kapatma sırasında zırh sağlar.',
      how: 'Calandria’nın iki ucundaki uç kalkanları kanalları taşır (CANDU Fundamentals, Bölüm 11). Basınç tüpünün iki ucundaki uç bağlantıları besleyicilere bağlanır ve yakıt değiştirme makinesinin sızdırmaz biçimde kenetlendiği yerdir (CNSC; CANTEACH).',
      related: ['channels', 'calandria', 'feeders-l', 'feeders-r'],
      detail: 'fuelling',
    },
    {
      id: 'feeders-l',
      name: 'Sol yüz besleyicileri',
      role: 'Kanal uçlarını sol yüzdeki kolektörlere bağlar.',
      how: 'Besleyiciler her kanalın giriş ucunu giriş kolektörüne, çıkış ucunu çıkış kolektörüne bağlar (Qinshan III CANDU 6). Sol yüzde A kanallarının girişleri ve B kanallarının çıkışları vardır. Yan görünüşte bir besleyicinin ötekinin üzerinden geçtiği yer köprüyle (boşluk) çizildi; orada birleşme yoktur.',
      related: [...FL, 'headers-l'],
    },
    {
      id: 'feeders-r',
      name: 'Sağ yüz besleyicileri',
      role: 'Kanal uçlarını sağ yüzdeki kolektörlere bağlar.',
      how: 'Sağ yüzde A kanallarının çıkışları ve B kanallarının girişleri vardır. Böylece giriş ve çıkışlar reaktörün iki yüzüne dağılır; CANTEACH’e göre bu iki yönlü akış iki yüzün sıcaklığını benzer tutar.',
      related: [...FR, 'headers-r'],
    },
    {
      id: 'headers-l',
      name: 'Sol kolektörler (giriş + çıkış)',
      role: 'Pompadan gelen soğutucuyu kanallara dağıtır; kanallardan çıkan soğutucuyu toplar.',
      how: 'Kolektörler reaktör yüzeyine dik uzanan kalın borulardır; yan görünüşte daire olarak çizildi. Sol giriş kolektörü pompa P-1’den gelen daha soğuk ağır suyu A kanallarına dağıtır; sol çıkış kolektörü B kanallarından gelen sıcak ağır suyu toplayıp buhar üreteci BÜ-1’e gönderir. Kolektörler ve buhar üreteçleri çekirdekten yüksektedir (CANDU Fundamentals, Bölüm 14).',
      related: ['f-p1-in1', 'f-out2-sg1', ...FL],
    },
    {
      id: 'headers-r',
      name: 'Sağ kolektörler (giriş + çıkış)',
      role: 'Sağ yüzde soğutucuyu dağıtır ve toplar.',
      how: 'Sağ çıkış kolektörü A kanallarından gelen sıcak ağır suyu buhar üreteci BÜ-2’ye gönderir; sağ giriş kolektörü pompa P-2’den gelen suyu B kanallarına dağıtır. Basınçlandırıcının dalgalanma hattı bu çizimde sağ çıkış kolektörüne bağlanır (temsili).',
      related: ['f-out1-sg2', 'f-p2-in2', 'f-surge', ...FR],
    },
    {
      id: 'sg1',
      name: 'Buhar üreteci BÜ-1 (sol)',
      role: 'Birincil ağır sudan ikincil hafif suya ısı aktarır; buhar ikincil tarafta oluşur.',
      how: 'CANDU 6 buhar üreteci dikey U borulu, tümleşik buhar tamburlu ve ön ısıtıcılıdır (Qinshan III CANDU 6). Sıcak ağır su boruların içinden geçer; borunun dışındaki ikincil hafif su kaynar. İki akışkan karışmaz. Türbine giden buhar bu ikincil taraftan çıkar.',
      related: [...LOOP_L, 'f-steamline', 'f-feed3'],
      detail: 'sg',
    },
    {
      id: 'sg2',
      name: 'Buhar üreteci BÜ-2 (sağ)',
      role: 'Aynı halkanın ikinci buhar üreteci.',
      how: 'Sekiz biçimli halkada soğutucu iki buhar üretecinden sırayla geçer: sağ çıkış kolektörü → BÜ-2 → P-2 → sağ giriş kolektörü → B kanalları → sol çıkış kolektörü → BÜ-1 → P-1. Her halkada iki buhar üreteci ve iki pompa vardır (Qinshan III CANDU 6).',
      related: [...LOOP_R, 'f-steam-2', 'f-feed2'],
      detail: 'sg',
    },
    {
      id: 'htp1',
      name: 'Ana ısı taşıma pompası P-1',
      role: 'Ağır su soğutucuyu kanallara basar.',
      how: 'Pompa buhar üretecinin çıkışında, devrenin en soğuk noktasındadır; bu konum kavitasyona karşı en büyük payı verir (CANDU Fundamentals, Bölüm 14). Pompalar akış sağlar; yüksek basıncı pompa değil basınç kontrol sistemi sağlar. Elektrik üretmez.',
      related: ['f-sg1-p1', 'f-p1-in1'],
    },
    {
      id: 'htp2',
      name: 'Ana ısı taşıma pompası P-2',
      role: 'Halkanın ikinci pompası; P-1 ile seri çalışır.',
      how: 'Sekiz biçimli halkada iki pompa seridir (Qinshan III CANDU 6). Şemada debi temsili olarak sabit gösterilir.',
      related: ['f-sg2-p2', 'f-p2-in2'],
    },
    {
      id: 'pressurizer',
      name: 'Basınçlandırıcı',
      role: 'Birincil ağır su devresinin basıncını kontrol eder.',
      how: 'Birincil ağır suyun kaynamaması için devre yüksek basınçta tutulur; pompalar bu basıncı üretmez (CANDU Fundamentals, Bölüm 14). IAEA BPTC Modül IV’ün CANDU şemasında basınçlandırıcı gösterilir. Bağlantı yeri burada temsilidir.',
      related: ['f-surge', 'headers-r'],
    },
    {
      id: 'rods',
      name: 'Reaktivite kontrol düzenekleri',
      role: 'Nötron soğurarak reaktiviteyi ayarlar.',
      how: 'Yatay ve dikey reaktivite kontrol düzenekleri calandria’da kanalların arasından, düşük basınçlı moderatörün içinden geçer (Qinshan III CANDU 6). Şemada iki dikey düzenek temsili olarak çizildi; yan görünüşte kanalların önünden geçiyormuş gibi görünürler ama aslında aralarındadır. Konumları güçle birebir eşlenmez.',
      related: ['moderator', 'calandria'],
      detail: 'core',
    },
    {
      id: 'modsys',
      name: 'Moderatör soğutma sistemi',
      role: 'Moderatörde oluşan ısıyı uzaklaştırır.',
      how: 'Moderatörde gama ışınımı ve nötronların yavaşlamasıyla ısı oluşur; kanallardan da az miktarda ısı geçer. Moderatör sistemi ağır suyu ısı değiştiricilerden dolaştırır ve ısıyı soğutma suyu sistemine atar (Qinshan III CANDU 6). Şemada tek pompa ve tek ısı değiştiriciyle sadeleştirildi; birincil devreyle bağlantısı yoktur.',
      related: [...MODSYS, 'f-modcool', 'moderator'],
      detail: 'separation',
    },
    {
      id: 'steamline',
      name: 'Ana buhar hattı',
      role: 'İkincil devre buharını türbine götürür.',
      how: 'Buhar üreteçlerinin ikincil tarafında oluşan hafif su buharı ortak başlıkta toplanıp koruma binasının dışındaki türbine gider. Ağır su türbine gitmez.',
      related: ['f-steamline', 'f-steam-2', 'hp'],
    },
    {
      id: 'hp',
      name: 'Yüksek basınç (YB) türbini',
      role: 'Buhar enerjisinin bir kısmını mil işine çevirir.',
      how: 'İkincil devre buharı YB türbininde genişler, geçiş borusuyla AB türbinine gider.',
      related: ['f-steamline', 'f-crossover', 'lp', 'gen'],
    },
    {
      id: 'lp',
      name: 'Alçak basınç (AB) türbini',
      role: 'Buhar enerjisinin kalanını mekanik enerjiye çevirir.',
      how: 'Çift akışlı türbinden çıkan buhar kondensere boşalır.',
      related: ['f-crossover', 'f-lp-l', 'f-lp-r', 'condenser'],
    },
    {
      id: 'gen',
      name: 'Jeneratör',
      role: 'Mil işini elektriğe dönüştürür.',
      how: 'Türbinle aynı mil üzerindedir; şebekeye senkron bağlıdır.',
      related: ['hp', 'lp'],
    },
    {
      id: 'condenser',
      name: 'Kondenser',
      role: 'Türbin çıkış buharını yoğuşturur.',
      how: 'Buhar soğutma suyu borularının dışında yoğuşur; soğutma suyu ayrı çevrimdir ve karışmaz.',
      related: ['f-lp-l', 'f-lp-r', 'f-cool', 'f-feed1'],
    },
    {
      id: 'feedpump',
      name: 'Besleme suyu pompası',
      role: 'Yoğuşan hafif suyu buhar üreteçlerine geri basar.',
      how: 'Besleme hattı iki buhar üretecine ayrılır; sol buhar üretecine giden kol çizimde reaktörün altından dolaşır. Ön ısıtıcılar çizilmedi (sadeleştirme).',
      related: ['f-feed1', 'f-feed2', 'f-feed3'],
    },
    {
      id: 'coolsource',
      name: 'Soğutma suyu çevrimi',
      role: 'Kondenser ısısını çevreye atar.',
      how: 'Ayrı üçüncü çevrim; turkuaz ve kesik-noktalı çizgi.',
      related: ['f-cool', 'condenser'],
    },
    {
      id: 'containment',
      name: 'Koruma binası (containment)',
      role: 'Reaktörü ve birincil devreyi çevreleyen yapı.',
      how: 'CANDU 6’nın dört özel güvenlik sisteminden biri koruma sistemidir (reaktör binası ve yalıtma sistemi; Qinshan III CANDU 6). Calandria burada bir basınç kabı gibi değil, binanın içindeki düşük basınçlı tank olarak yer alır. Çizim sadeleştirilmiş dış hattır.',
      related: ['calandria', 'sg1', 'sg2', 'htp1', 'htp2'],
    },
  ],
  focusActions: [
    {
      id: 'two-d2o',
      label: 'İki ağır su sistemi neden ayrıdır?',
      text: 'Kanallardaki soğutucu sıcak ve yüksek basınçlıdır; calandria’daki moderatör düşük basınçlı ve daha soğuktur. Aralarında basınç tüpü, gaz halkası ve calandria tüpü vardır; iki sistem karışmaz. Bu ayrım büyük bir yüksek basınç kabı gerektirmeden ağır su moderatörü kullanmayı sağlar.',
      highlight: ['moderator', 'modsys', 'channels', ...MODSYS, ...CH],
      detail: 'separation',
    },
    {
      id: 'calandria-vs-tube',
      label: 'Calandria ile basınç tüpü arasındaki fark nedir?',
      text: 'Calandria moderatörü tutan büyük, düşük basınçlı tanktır. Basınç tüpü ise her kanaldaki yakıtı ve yüksek basınçlı soğutucuyu taşıyan boru — basınç sınırıdır. Calandria tüpü ikisinin arasında, moderatör tarafındaki ayrı borudur.',
      highlight: ['calandria', 'channels', ...CH],
      detail: 'channel',
    },
    {
      id: 'turbine-steam',
      label: 'Türbine hangi devrenin buharı gider?',
      text: 'İkincil devrenin: buhar üretecinin gövde tarafındaki hafif su kaynar. Birincil ağır su boruların içinde kalır ve türbine gitmez.',
      highlight: ['sg1', 'sg2', 'steamline', 'f-steamline', 'f-steam-2', 'hp'],
      detail: 'sg',
    },
    {
      id: 'fuel-horizontal',
      label: 'Yatay kanallarda yakıt nasıl konumlanır?',
      text: 'Demetler yatay basınç tüpünde uç uca dizilir (CANDU 6’da kanal başına 12). İki uçtaki yakıt değiştirme makineleri kanala kenetlenip işletme sırasında yeni demet ekler ve kullanılmış demetleri alır (kavramsal gösterim).',
      highlight: ['fuel', 'channels', 'endshields', ...CH],
      detail: 'fuelling',
    },
    {
      id: 'figure-eight',
      label: 'Sekiz biçimli halka',
      text: 'Soğutucu bir halkada iki buhar üreteci ve iki pompadan sırayla geçer; komşu kanallarda ters yönde akar. Takip edin: sağ çıkış → BÜ-2 → P-2 → sağ giriş → B kanalları (←) → sol çıkış → BÜ-1 → P-1 → sol giriş → A kanalları (→).',
      highlight: [...CH, ...FL, ...FR, ...LOOP_L, ...LOOP_R, 'headers-l', 'headers-r'],
    },
  ],
  details: [
    { key: 'core', title: 'CANDU çekirdek yakın planı — kafes ve iki yönlü akış' },
    { key: 'channel', title: 'Yakıt kanalı katmanları' },
    { key: 'separation', title: 'Moderatör ve ana ısı taşıma sisteminin ayrılığı' },
    { key: 'sg', title: 'Buhar üretecinde birincil / ikincil ayrımı' },
    { key: 'fuelling', title: 'İşletme sırasında yakıt değiştirme (kavramsal)' },
  ],
};
