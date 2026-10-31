import type { ReactorConfig } from '../shared/types';
import { RBMK_CHANNEL_IDS, RBMK_LOWER_IDS, RBMK_RISER_IDS } from './rbmkLayout';

const CH = RBMK_CHANNEL_IDS;
const LOW = RBMK_LOWER_IDS;
const RISE = RBMK_RISER_IDS;

/**
 * Temsili RBMK-1000. Kaynaklar: IAEA INSAG-7 (1992) §2.2, 2.6, 2.9, 2.10; OECD NEA “Chernobyl — Chapter I”;
 * IAEA BPTC Modül IV, s. 13 (LWGR). Dönem bilgisi: INSAG-7’nin tasarım anlatımı 1986 kazası anındaki durumu verir;
 * kazadan sonra çubuk tasarımı dahil değişiklikler yapılmıştır (INSAG-7 Şekil 1; IAEA BPTC Modül IV).
 */
export const rbmkConfig: ReactorConfig = {
  id: 'rbmk',
  shortName: 'RBMK',
  fullName: 'RBMK-1000 — grafit moderatörlü, kaynayan hafif su soğutmalı kanal reaktörü (temsili)',
  family: 'Grafit moderatörlü hafif su reaktörü (LWGR) · basınç kanallı, doğrudan çevrim',
  summary:
    'Nötronlar esas olarak büyük bir grafit yığınında yavaşlar; soğutucu hafif sudur. Su, grafitin içinden geçen dikey basınç kanallarında yakıtın çevresinde yukarı akarken kaynar. Buhar–su karışımı çekirdek dışındaki ayırıcı tamburlara gider; ayrılan buhar arada buhar üreteci olmadan türbine, ayrılan su pompalarla kanallara döner. Çekirdeği saran tek bir PWR tipi basınç kabı yoktur.',
  notes: [
    'Temsili RBMK-1000: iki çevrimden biri, beş yakıt kanalı ve iki kontrol/koruma kanalıyla sadeleştirildi (gerçek çekirdekte çok sayıda kanal vardır).',
    'Her kanalın buhar–su borusu tambura ayrı gider; çizimde de birleştirilmedi.',
  ],
  components: [
    {
      id: 'graphite',
      name: 'Grafit moderatör yığını',
      role: 'Fisyon nötronlarını yavaşlatır (moderatör).',
      how: 'Çekirdek, dikey delikli grafit bloklardan oluşan büyük bir yığındır (INSAG-7: yükseklik ~7 m, çap ~11,8 m). Kanallar bu deliklerden geçer. Grafit soğutucu değildir ve basınç sınırı değildir: bloklar arasında grafitin oksitlenmesini önleyen ve ısısını kanallara taşıyan azot–helyum karışımı dolaşır (NEA). Şemada grafit koyu gri + tuğla dokusuyla gösterilir.',
      related: ['channels', 'fuel', 'rods'],
      detail: 'channel',
    },
    {
      id: 'channels',
      name: 'Yakıt / basınç kanalları',
      role: 'Yakıtı ve basınç altındaki kaynayan soğutucuyu taşır; basınç sınırıdır.',
      how: 'Grafitten geçen dikey basınç tüpleri (zirkonyum alaşımı). Su kanalın altından girer, yakıtın çevresinde yukarı akarken ısınır ve bir noktadan sonra kaynar; üstten buhar–su karışımı çıkar (NEA, INSAG-7 §2.8). Şemada beş temsili kanal çizildi; her kanalın kendi alt su borusu ve üst buhar–su borusu vardır.',
      related: [...CH, ...LOW, ...RISE, 'fuel', 'graphite'],
      detail: 'boiling',
    },
    {
      id: 'fuel',
      name: 'Yakıt demeti',
      role: 'Fisyon ısısının üretildiği yer.',
      how: 'Zirkonyum alaşımı kaplı uranyum dioksit yakıt çubukları; kaynaklara göre yaklaşık %2 zenginleştirilmiş (NEA, IAEA BPTC Modül IV). Yakıt kanalın içindedir ve doğrudan hafif suyla soğutulur. Yakıt işletme sırasında değiştirilebilir (NEA); bu uygulama yakıt değiştirme makinesini çizmez.',
      related: [...CH, 'channels'],
      detail: 'channel',
    },
    {
      id: 'rods',
      name: 'Kontrol / koruma kanalları ve çubuklar',
      role: 'Nötron soğurarak reaktiviteyi ve gücü ayarlar.',
      how: 'Yakıt kanallarından ayrı kanallarda hareket eder (şemada kesikli çerçeveli, içinde yakıt olmayan borular). NEA: güç, 211 kontrol çubuğu indirilip kaldırılarak ayarlanır. INSAG-7 (1986 durumu): çubuklar üstten girer; güç dağılımını düzleştiren 24 kısaltılmış çubuk alttan girer. O dönemde çubukların ucunda grafit “yer değiştiriciler” vardı ve tasarım kazadan sonra değiştirildi (INSAG-7 Şekil 1). Çizim yalnız üstten giren temsili çubukları gösterir; çubuk konumu güçle birebir eşlenmez.',
      related: ['graphite', 'fuel'],
      detail: 'core',
    },
    {
      id: 'dgh',
      name: 'Basma ve grup dağıtım kolektörleri',
      role: 'Pompa basmasını kanalların alt su borularına dağıtır.',
      how: 'INSAG-7 §2.9: pompaların bastığı su ortak bir kolektöre, oradan çekirdek yarısı başına çok sayıda grup dağıtım kolektörüne gider; her kanalın kendi su borusu ve debi ayar vanası vardır. Şemada tek kolektör ve beş alt su borusu çizildi; ● işaretleri gerçek bağlantı noktalarıdır.',
      related: ['f-pressure', 'f-dgh', ...LOW, 'mcp'],
    },
    {
      id: 'risers',
      name: 'Buhar–su boruları (kanal çıkışları)',
      role: 'Her kanaldaki buhar–su karışımını ayırıcı tambura taşır.',
      how: 'INSAG-7: kanallardan çıkan buhar–su karışımı ayrı borularla tamburlara gider. Bu yüzden çizimde borular birleştirilmedi ve birbirini kesmeyecek biçimde iç içe çizildi. Borulardaki karışım kesikli çizgi ve kabarcık işaretleriyle gösterilir.',
      related: [...RISE, 'drum', 'channels'],
      detail: 'boiling',
    },
    {
      id: 'drum',
      name: 'Ayırıcı tambur (buhar ayırıcı)',
      role: 'Buhar–su karışımını buhar ve suya ayırır.',
      how: 'Yatay, büyük bir tambur. Kanallardan gelen karışım burada ayrılır: buhar üstten buhar hatlarına ve türbine, su alttan iniş borularına gider. Ayırıcı tambur ısı aktarmaz ve iki ayrı devreyi ayırmaz; dolayısıyla buhar üreteci değildir — buhar zaten kanallarda oluşmuştur. INSAG-7: her çevrimde iki paralel yatay tambur vardır; şemada biri çizildi.',
      related: ['f-drum-steam', 'f-drum-water', ...RISE, 'f-downcomer', 'f-steamline', 'f-feed2'],
      detail: 'drum',
    },
    {
      id: 'downcomer',
      name: 'İniş boruları',
      role: 'Tamburda ayrılan suyu pompa emişine indirir.',
      how: 'Ayrılan su, türbinden dönen besleme suyuyla karışarak pompaların emişine gider (INSAG-7 §2.9). Böylece su çekirdek, tambur ve pompalar arasında zorlanmış dolaşımla döner.',
      related: ['f-downcomer', 'drum', 'mcp'],
    },
    {
      id: 'mcp',
      name: 'Ana sirkülasyon pompası',
      role: 'Suyu kanallara basar (zorlanmış dolaşım).',
      how: 'INSAG-7 §2.9: her çevrimde dört pompa vardır; normalde üçü çalışır, biri yedektir. Şemada tek pompa çizildi. Pompa elektrik üretmez; suyu dolaştırır. Debi temsili olarak sabit gösterilir.',
      related: ['f-downcomer', 'f-pressure', 'f-dgh'],
    },
    {
      id: 'steamline',
      name: 'Ana buhar hattı',
      role: 'Tamburda ayrılan buharı türbine götürür.',
      how: 'Buhar tamburun üstünden çıkar ve doğrudan türbine gider; arada ısı değiştirici (buhar üreteci) yoktur (NEA). Bu nedenle türbine giden buhar çekirdekten geçen suyun buharıdır.',
      related: ['f-steamline', 'f-drum-steam', 'hp'],
    },
    {
      id: 'hp',
      name: 'Yüksek basınç (YB) türbini',
      role: 'Buhar enerjisinin bir kısmını mil işine çevirir.',
      how: 'NEA: RBMK-1000 buharı iki 500 MWe türbini besler; şemada tek türbin grubu çizildi. YB türbininde genişleyen buhar AB türbinine geçer.',
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
      how: 'Buhar soğutma suyu borularının dışında yoğuşur; soğutma suyu ayrı çevrimdir ve karışmaz. Yoğuşan su besleme suyu olarak tambura döner.',
      related: ['f-lp-l', 'f-lp-r', 'f-cool', 'f-feed1'],
    },
    {
      id: 'feedpump',
      name: 'Besleme suyu pompası',
      role: 'Yoğuşan suyu ayırıcı tambura geri basar.',
      how: 'Besleme suyu tamburdaki ayrılmış suyla karışır ve pompa emişine giden dolaşıma katılır (INSAG-7 §2.9). Ön ısıtıcılar çizilmedi (sadeleştirme).',
      related: ['f-feed1', 'f-feed2', 'drum'],
    },
    {
      id: 'coolsource',
      name: 'Soğutma suyu çevrimi',
      role: 'Kondenser ısısını çevreye atar.',
      how: 'Ayrı üçüncü çevrim; turkuaz ve kesik-noktalı çizgi.',
      related: ['f-cool', 'condenser'],
    },
    {
      id: 'shield',
      name: 'Biyolojik zırh ve reaktör boşluğu',
      role: 'Radyasyonu zayıflatır; çekirdeği taşıyan ve örten yapıdır.',
      how: 'INSAG-7 §2.10: çekirdek, yan duvarları zırh görevi gören bir bölmede durur; altta çekirdeğin oturduğu ağır plaka, üstte büyük bir kapak plakası vardır ve kanal uzantıları bu plakalardan geçip kaynaklanır. Bu yapı bir basınç kabı değildir: basınç sınırı kanalların kendisidir. Grafit (moderatör), kanal (basınç sınırı), zırh ve bina dört ayrı şeydir.',
      related: ['graphite', 'channels', 'building'],
    },
    {
      id: 'building',
      name: 'Reaktör binası ve yerel koruma hacimleri',
      role: 'Reaktörü ve devreyi çevreleyen yapılar.',
      how: 'INSAG-7 §2.10: RBMK’lerde “yerelleştirilmiş” koruma vardır; reaktör ve soğutma devresinin bölümleri ayrı kapalı hacimlerde bulunur. Çernobil 4’te bütün sistemi saran bir koruma kabuğu yoktu (INSAG-7). Çizimde bina yalnız kesikli dış hatla, yapısı ayrıntılandırılmadan gösterildi; kazadan sonraki değişiklikler tesise göre farklıdır.',
      related: ['shield', 'drum', 'mcp'],
    },
  ],
  focusActions: [
    {
      id: 'graphite-role',
      label: 'Grafit ne yapar?',
      text: 'Grafit moderatördür: nötronları yavaşlatır. Soğutucu değildir, basınç altında da değildir. Isıyı taşıyan, kanallardaki hafif sudur.',
      highlight: ['graphite', 'channels', ...CH],
      detail: 'channel',
    },
    {
      id: 'steam-where',
      label: 'Buhar nerede oluşur?',
      text: 'Yakıt kanallarının içinde: su alttan girer, yukarı akarken kaynar. Tambur buharı üretmez, yalnız ayırır.',
      highlight: ['channels', ...CH, ...RISE],
      detail: 'boiling',
    },
    {
      id: 'drum-role',
      label: 'Ayırıcı tambur neyi ayırır?',
      text: 'Kanallardan gelen buhar–su karışımını: buhar üstten türbine, su alttan iniş borularıyla pompalara. Isı aktarmadığı için buhar üreteci değildir.',
      highlight: ['drum', 'f-drum-steam', 'f-drum-water', 'f-steamline', 'f-downcomer'],
      detail: 'drum',
    },
    {
      id: 'vs-bwr',
      label: 'BWR’den temel farkı nedir?',
      text: 'İkisinde de su kaynar ve buhar doğrudan türbine gider. Ancak BWR’de moderatör de sudur ve kaynama büyük bir basınç kabının içinde olur; RBMK’de moderatör grafittir, kaynama çok sayıda ayrı basınç kanalında olur ve buhar kap dışındaki tamburlarda ayrılır.',
      highlight: ['graphite', 'channels', 'drum', ...CH, 'f-steamline'],
    },
    {
      id: 'boundaries',
      label: 'Grafit, kanal, zırh, bina',
      text: 'Dört ayrı şey: grafit moderatördür; kanal borusu basınç sınırıdır; çevredeki yapı biyolojik zırhtır; bina ve yerel koruma hacimleri en dıştadır.',
      highlight: ['graphite', 'channels', 'shield', 'building'],
    },
  ],
  details: [
    { key: 'core', title: 'RBMK çekirdek yakın planı — grafit kafes ve kanallar' },
    { key: 'channel', title: 'Grafit – basınç kanalı – yakıt ilişkisi' },
    { key: 'boiling', title: 'Kanal içinde kaynama ve akış' },
    { key: 'drum', title: 'Ayırıcı tamburda su / buhar ayrılması' },
  ],
};
