/**
 * Etkileşimli karşılaştırma konuları. Her konu aynı soruya beş kısa, karşılaştırılabilir açıklama verir.
 * `scope`: 'family' = reaktör ailesi için genel ilke; 'drawn' = uygulamada çizilen temsili tasarıma özgü
 * (gerçek tesisler arasında değişebilir). `absent`: konu bu tasarımda uygulanmaz (“bu tasarımda bulunmaz”);
 * o zaman başka bir ekipman vurgulanmaz ve şemada inceleme düğmesi gösterilmez.
 */
import type { ReactorId } from '../../reactors/shared/types';

/** Mini şemalardaki parça kimlikleri. */
export type MiniPart =
  | 'vessel'
  | 'core'
  | 'rods'
  | 'pzr'
  | 'sg'
  | 'collectors'
  | 'separators'
  | 'hot'
  | 'cold'
  | 'steam'
  | 'turbine'
  | 'gen'
  | 'condenser'
  | 'feed'
  | 'containment'
  | 'graphite'
  | 'channels'
  | 'drum'
  | 'calandria'
  | 'moderator'
  | 'headers'
  | 'fuel';

export interface TopicSide {
  text: string;
  scope: 'family' | 'drawn';
  /** Mini şemada vurgulanacak parçalar (absent ise boş). */
  mini: MiniPart[];
  /** Ana şemada vurgulanacak kimlikler (“Bu reaktörde ayrıntılı incele”; absent ise boş). */
  main: string[];
  sourceIds: string[];
  /** Bu konu bu tasarımda bulunmaz. */
  absent?: boolean;
}

export interface CompareTopic {
  id: string;
  label: string;
  question: string;
  sides: Record<ReactorId, TopicSide>;
}

const SRC = {
  pwr: ['nuce-ch2', 'nrc-unit3'],
  bwr: ['nuce-ch2', 'nrc-bwr'],
  vver: ['nuce-ch2', 'iaea-vver'],
  rbmk: ['iaea-insag7', 'nea-chernobyl', 'iaea-bptc-m4'],
  candu: ['canteach-c6', 'canteach-constr', 'canteach-hts', 'canteach-thermal', 'cnsc-pt', 'iaea-bptc-m4'],
};
const LWR = ['iaea-bptc-m4'];
const RBMK_CH = ['f-ch-1', 'f-ch-2', 'f-ch-3', 'f-ch-4', 'f-ch-5'];
const RBMK_RISE = ['f-riser-1', 'f-riser-2', 'f-riser-3', 'f-riser-4', 'f-riser-5'];
const CANDU_CH = ['f-ch-1', 'f-ch-2', 'f-ch-3', 'f-ch-4'];

const absent = (text: string, sourceIds: string[], scope: TopicSide['scope'] = 'family'): TopicSide => ({ text, scope, mini: [], main: [], sourceIds, absent: true });

export const COMPARE_TOPICS: CompareTopic[] = [
  {
    id: 'steam-where',
    label: 'Buharın oluştuğu yer',
    question: 'Türbine giden buhar nerede oluşur?',
    sides: {
      pwr: {
        text: 'Buhar üretecinin ikincil (gövde) tarafında. Birincil devrede normal çalışmada toplu kaynama olmaz.',
        scope: 'family',
        mini: ['sg', 'steam'],
        main: ['sg', 'f-sg-steam', 'f-steamline'],
        sourceIds: SRC.pwr,
      },
      bwr: {
        text: 'Doğrudan reaktör kabında: su çekirdekte kaynar, buhar kabın üstünde ayrılır ve kurutulur.',
        scope: 'family',
        mini: ['core', 'separators', 'steam'],
        main: ['core', 'separators', 'dryers', 'f-core-1', 'f-core-2', 'f-core-3', 'f-steam-1', 'f-steam-2', 'f-steam-3', 'f-steamline'],
        sourceIds: SRC.bwr,
      },
      vver: {
        text: 'Yatay buhar üretecinin ikincil (gövde) tarafında. Birincil su basınç altında sıvı kalır.',
        scope: 'family',
        mini: ['sg', 'steam'],
        main: ['hsg', 'f-sg-steam-1', 'f-sg-steam-2', 'f-sg-steam-3', 'f-steamline'],
        sourceIds: SRC.vver,
      },
      rbmk: {
        text: 'Yakıt kanallarının içinde: hafif su kanalda yukarı akarken kaynar. Buhar–su karışımı çekirdek dışındaki ayırıcı tamburlarda ayrılır ve buhar doğrudan türbine gider.',
        scope: 'family',
        mini: ['channels', 'drum', 'steam'],
        main: ['channels', ...RBMK_CH, ...RBMK_RISE, 'drum', 'f-steamline'],
        sourceIds: SRC.rbmk,
      },
      candu: {
        text: 'Türbine giden buhar, buhar üreteçlerinin ikincil tarafındaki hafif sudan oluşur. CANDU 6’da birincil ağır suda sınırlı kaynama olabilir; bu ağır su buharı türbine gitmez, buhar üretecinde yoğuşur.',
        scope: 'family',
        mini: ['sg', 'steam'],
        main: ['sg1', 'sg2', 'f-steamline', 'f-steam-2'],
        sourceIds: SRC.candu,
      },
    },
  },
  {
    id: 'heat-path',
    label: 'Isının türbine aktarılması',
    question: 'Çekirdekte üretilen ısı türbine nasıl ulaşır?',
    sides: {
      pwr: {
        text: 'Çekirdek → sıcak kol → buhar üretecinin U boruları (ısı boru duvarından geçer) → ikincil buhar → türbin.',
        scope: 'family',
        mini: ['core', 'hot', 'sg', 'steam', 'turbine'],
        main: ['vessel', 'f-core-up', 'f-hotleg', 'sg', 'f-sg-tubes', 'f-sg-steam', 'f-steamline', 'hp'],
        sourceIds: SRC.pwr,
      },
      bwr: {
        text: 'Çekirdek → kaynayan reaktör suyu → ayırıcı/kurutucu → aynı akışkanın buharı doğrudan türbine. Arada ısı değiştirici yok.',
        scope: 'family',
        mini: ['core', 'separators', 'steam', 'turbine'],
        main: ['core', 'separators', 'dryers', 'f-core-1', 'f-core-2', 'f-core-3', 'f-steamline', 'hp'],
        sourceIds: SRC.bwr,
      },
      vver: {
        text: 'Çekirdek → sıcak kol → sıcak kolektör → yatay U boruları → ikincil buhar → türbin.',
        scope: 'family',
        mini: ['core', 'hot', 'collectors', 'sg', 'steam', 'turbine'],
        main: ['vessel', 'f-core-up', 'f-hotleg', 'collector-hot', 'hsg', 'f-steamline', 'hp'],
        sourceIds: SRC.vver,
      },
      rbmk: {
        text: 'Yakıt → kanalda kaynayan hafif su → her kanalın buhar–su borusu → ayırıcı tambur → buhar doğrudan türbine. Arada ısı değiştirici yok.',
        scope: 'family',
        mini: ['channels', 'drum', 'steam', 'turbine'],
        main: ['channels', ...RBMK_CH, ...RBMK_RISE, 'drum', 'f-steamline', 'hp'],
        sourceIds: SRC.rbmk,
      },
      candu: {
        text: 'Yakıt → kanaldaki basınçlı ağır su → çıkış besleyicisi ve kolektörü → buhar üretecinin U boruları → ikincil hafif su buharı → türbin.',
        scope: 'family',
        mini: ['channels', 'headers', 'sg', 'steam', 'turbine'],
        main: ['channels', ...CANDU_CH, 'f-out1-sg2', 'sg2', 'f-sg2-tubes', 'f-steamline', 'hp'],
        sourceIds: SRC.candu,
      },
    },
  },
  {
    id: 'loops',
    label: 'Birincil ve ikincil devre ilişkisi',
    question: 'Reaktör suyu ile türbin suyu aynı akışkan mı?',
    sides: {
      pwr: {
        text: 'Hayır. İki ayrı çevrim; aralarında yalnız ısı geçer, akışkan karışmaz. Türbine ikincil buhar gider.',
        scope: 'family',
        mini: ['hot', 'cold', 'sg', 'steam', 'feed'],
        main: ['sg', 'f-sg-tubes', 'f-hotleg', 'f-crossleg', 'f-coldleg', 'f-steamline', 'f-feed2'],
        sourceIds: SRC.pwr,
      },
      bwr: {
        text: 'Evet. Tek (doğrudan) çevrim: reaktör suyunun buharı türbine gider; bu yüzden türbin tarafı da korumalı bölgedir.',
        scope: 'family',
        mini: ['vessel', 'steam', 'turbine', 'condenser', 'feed'],
        main: ['vessel', 'f-steamline', 'hp', 'lp', 'condenser', 'f-feed1', 'f-feed2', 'turbinebldg'],
        sourceIds: SRC.bwr,
      },
      vver: {
        text: 'Hayır. İki ayrı çevrim; aralarında yalnız ısı geçer. Türbine ikincil buhar gider.',
        scope: 'family',
        mini: ['hot', 'cold', 'sg', 'steam', 'feed'],
        main: ['hsg', 'f-hotleg', 'f-crossleg', 'f-coldleg', 'f-steamline', 'f-feed2'],
        sourceIds: SRC.vver,
      },
      rbmk: {
        text: 'Evet. Tek (doğrudan) çevrim: kanallardan geçen hafif suyun buharı türbine gider; yoğuşan su tambura ve oradan kanallara döner.',
        scope: 'family',
        mini: ['channels', 'drum', 'steam', 'turbine', 'feed'],
        main: ['channels', 'drum', 'f-steamline', 'hp', 'condenser', 'f-feed1', 'f-feed2', 'f-downcomer'],
        sourceIds: SRC.rbmk,
      },
      candu: {
        text: 'Hayır. Birincil ağır su ve ikincil hafif su ayrı devrelerdir; aralarında yalnız ısı geçer. Moderatör ağır suyu da üçüncü, ayrı bir sistemdir.',
        scope: 'family',
        mini: ['hot', 'cold', 'sg', 'steam', 'feed', 'moderator'],
        main: ['sg1', 'sg2', 'f-sg1-tubes', 'f-sg2-tubes', 'f-steamline', 'f-feed2', 'f-feed3', 'moderator'],
        sourceIds: SRC.candu,
      },
    },
  },
  {
    id: 'pressurizer',
    label: 'Basınçlandırıcının rolü',
    question: 'Basınçlandırıcı var mı, ne işe yarar?',
    sides: {
      pwr: {
        text: 'Var. Birincil devrenin basıncını yüksek tutar (ders notları ~155 bar); ısıtıcılar basıncı artırır, püskürtme düşürür. Su/buhar ara yüzü yalnız burada bulunur.',
        scope: 'family',
        mini: ['pzr', 'hot'],
        main: ['pressurizer', 'surge', 'f-hotleg'],
        sourceIds: SRC.pwr,
      },
      bwr: {
        text: 'Yok. Su ve buhar zaten reaktör kabında birlikte bulunur (kabın üst bölümü buhardır).',
        scope: 'family',
        mini: ['vessel'],
        main: ['vessel'],
        sourceIds: SRC.bwr,
      },
      vver: {
        text: 'Var. PWR ailesinde olduğu gibi dalgalanma hattıyla sıcak kola bağlıdır ve birincil basıncı ayarlar.',
        scope: 'family',
        mini: ['pzr', 'hot'],
        main: ['pressurizer', 'surge', 'f-hotleg'],
        sourceIds: SRC.vver,
      },
      rbmk: absent('Bu tasarımda bulunmaz. Çizilen RBMK-1000 devresinde su ve buhar ayırıcı tamburlarda birlikte bulunur; INSAG-7’nin devre tanımında basınçlandırıcı yoktur.', SRC.rbmk, 'drawn'),
      candu: {
        text: 'Var. Birincil ağır suyun kaynamaması için devre yüksek basınçta tutulur; pompalar bu basıncı üretmez. Çizimde bağlantı yeri temsilidir.',
        scope: 'family',
        mini: ['pzr'],
        main: ['pressurizer', 'f-surge'],
        sourceIds: ['canteach-hts', 'iaea-bptc-m4'],
      },
    },
  },
  {
    id: 'sg-layout',
    label: 'Buhar üreteci düzeni',
    question: 'Buhar üreteci nasıl yerleşmiştir?',
    sides: {
      pwr: {
        text: 'Çizilen tasarımda dikey, U borulu buhar üreteci: yüksek ve dar; ayırıcı ve kurutucular üst bölümde.',
        scope: 'drawn',
        mini: ['sg'],
        main: ['sg', 'f-sg-tubes'],
        sourceIds: SRC.pwr,
      },
      bwr: {
        text: 'Ayrı buhar üreteci yok. Ayırıcılar ve kurutucular reaktör kabının içindedir.',
        scope: 'family',
        mini: ['separators'],
        main: ['separators', 'dryers'],
        sourceIds: SRC.bwr,
      },
      vver: {
        text: 'Uzun yatay buhar üreteci: birincil su sıcak kolektörden yatay U borularına dağılır, soğuk kolektörde toplanır.',
        scope: 'family',
        mini: ['sg', 'collectors'],
        main: ['hsg', 'collector-hot', 'collector-cold'],
        sourceIds: SRC.vver,
      },
      rbmk: absent('Bu tasarımda bulunmaz. Ayırıcı tambur buhar üreteci değildir: ısı aktarmaz, kanallarda oluşmuş buhar–su karışımını ayırır.', SRC.rbmk),
      candu: {
        text: 'CANDU 6: dikey U borulu, tümleşik buhar tamburlu ve ön ısıtıcılı; her halkada iki adet, kolektörlerin üstünde.',
        scope: 'drawn',
        mini: ['sg'],
        main: ['sg1', 'sg2', 'f-sg1-tubes', 'f-sg2-tubes'],
        sourceIds: ['canteach-c6', 'canteach-hts'],
      },
    },
  },
  {
    id: 'rods',
    label: 'Kontrol çubuklarının yerleşimi',
    question: 'Çizilen tasarımda kontrol çubukları nereden girer?',
    sides: {
      pwr: {
        text: 'Çizilen tasarımda kabın üst kapağındaki sürücülerden, üstten giren çubuk kümeleri.',
        scope: 'drawn',
        mini: ['rods', 'core'],
        main: ['rods', 'vessel'],
        sourceIds: SRC.pwr,
      },
      bwr: {
        text: 'Çizilen (geleneksel) tasarımda kabın altından giren haç kesitli çubuklar; ders notlarına göre alttan giren tek LWR tipi.',
        scope: 'drawn',
        mini: ['rods', 'core'],
        main: ['rods', 'core'],
        sourceIds: SRC.bwr,
      },
      vver: {
        text: 'Çizilen tasarımda yüksek üst bloktaki sürücülerden, üstten giren çubuk kümeleri.',
        scope: 'drawn',
        mini: ['rods', 'core'],
        main: ['rods', 'vessel'],
        sourceIds: SRC.vver,
      },
      rbmk: {
        text: 'Yakıt kanallarından ayrı kontrol/koruma kanallarında. INSAG-7 (1986 durumu): çoğu üstten, güç dağılımı için 24 kısaltılmış çubuk alttan; çubuk tasarımı kazadan sonra değiştirildi. Çizimde üstten giren temsili çubuklar var.',
        scope: 'drawn',
        mini: ['rods', 'graphite'],
        main: ['rods', 'graphite'],
        sourceIds: ['iaea-insag7', 'nea-chernobyl'],
      },
      candu: {
        text: 'Calandria’da kanalların arasından, düşük basınçlı moderatörün içinden geçen yatay ve dikey düzenekler (CANDU 6). Çizimde iki dikey düzenek temsili.',
        scope: 'drawn',
        mini: ['rods', 'moderator'],
        main: ['rods', 'moderator'],
        sourceIds: ['canteach-c6'],
      },
    },
  },
  {
    id: 'moderator',
    label: 'Moderatör',
    question: 'Nötronları ne yavaşlatır?',
    sides: {
      pwr: { text: 'Hafif su: soğutucu aynı zamanda moderatördür.', scope: 'family', mini: ['core'], main: ['vessel'], sourceIds: [...LWR, ...SRC.pwr] },
      bwr: { text: 'Hafif su: kaynayan reaktör suyu hem soğutur hem nötronları yavaşlatır.', scope: 'family', mini: ['core'], main: ['core'], sourceIds: [...LWR, ...SRC.bwr] },
      vver: { text: 'Hafif su (PWR ailesi): su hem soğutucu hem moderatördür.', scope: 'family', mini: ['core'], main: ['vessel'], sourceIds: [...LWR, ...SRC.vver] },
      rbmk: {
        text: 'Grafit: büyük, katı bir blok yığını. Soğutucu değildir; ısıyı kanallardaki hafif su taşır.',
        scope: 'family',
        mini: ['graphite'],
        main: ['graphite'],
        sourceIds: SRC.rbmk,
      },
      candu: {
        text: 'Ağır su: calandria’da, birincil soğutucudan ayrı, düşük basınçlı ve daha soğuk bir sistem.',
        scope: 'family',
        mini: ['moderator', 'calandria'],
        main: ['moderator', 'calandria'],
        sourceIds: SRC.candu,
      },
    },
  },
  {
    id: 'coolant',
    label: 'Soğutucu',
    question: 'Isıyı yakıttan ne taşır?',
    sides: {
      pwr: { text: 'Basınç altında sıvı kalan hafif su.', scope: 'family', mini: ['hot', 'cold'], main: ['f-hotleg', 'f-coldleg'], sourceIds: [...LWR, ...SRC.pwr] },
      bwr: { text: 'Hafif su; çekirdekte kaynar.', scope: 'family', mini: ['core'], main: ['core', 'f-core-1', 'f-core-2', 'f-core-3'], sourceIds: [...LWR, ...SRC.bwr] },
      vver: { text: 'Basınç altında sıvı kalan hafif su.', scope: 'family', mini: ['hot', 'cold'], main: ['f-hotleg', 'f-coldleg'], sourceIds: [...LWR, ...SRC.vver] },
      rbmk: { text: 'Hafif su; kanallarda kaynar. Grafit soğutucu değildir.', scope: 'family', mini: ['channels'], main: ['channels', ...RBMK_CH], sourceIds: SRC.rbmk },
      candu: {
        text: 'Basınçlı ağır su; basınç tüplerinde yakıtın üzerinden akar. CANDU 6’da sınırlı kaynama olabilir; şemada iki fazlı davranış modellenmez. Moderatörle aynı madde olsa da ayrı sistemdir.',
        scope: 'family',
        mini: ['channels', 'hot', 'cold'],
        main: ['channels', ...CANDU_CH],
        sourceIds: SRC.candu,
      },
    },
  },
  {
    id: 'boundary',
    label: 'Basınç sınırı: kap mı kanal mı?',
    question: 'Yüksek basınçlı soğutucuyu ne tutar?',
    sides: {
      pwr: { text: 'Büyük, kalın duvarlı reaktör basınç kabı (ve birincil devre boruları).', scope: 'family', mini: ['vessel'], main: ['vessel'], sourceIds: [...LWR, ...SRC.pwr] },
      bwr: { text: 'Reaktör basınç kabı; PWR’ye göre daha ince duvarlı ama daha büyük.', scope: 'family', mini: ['vessel'], main: ['vessel'], sourceIds: [...LWR, ...SRC.bwr] },
      vver: { text: 'Reaktör basınç kabı (çizilen tasarımda dar ve uzun).', scope: 'family', mini: ['vessel'], main: ['vessel'], sourceIds: SRC.vver },
      rbmk: {
        text: 'Çok sayıda ayrı basınç kanalı. Çekirdeği saran tek bir PWR tipi basınç kabı yoktur; grafit, biyolojik zırh ve bina basınç sınırı değildir.',
        scope: 'family',
        mini: ['channels'],
        main: ['channels', 'shield', 'graphite'],
        sourceIds: SRC.rbmk,
      },
      candu: {
        text: 'Yüzlerce basınç tüpü. Calandria düşük basınçlı bir tanktır, basınç kabı değildir (patlama diskleriyle korunur).',
        scope: 'family',
        mini: ['channels', 'calandria'],
        main: ['channels', 'calandria'],
        sourceIds: SRC.candu,
      },
    },
  },
  {
    id: 'channel-dir',
    label: 'Kanalların yönü',
    question: 'Yakıt ayrı basınç kanallarında mı, kanallar hangi yönde?',
    sides: {
      pwr: absent('Bu tasarımda ayrı basınç kanalları bulunmaz; yakıt demetleri tek basınç kabının içindedir.', SRC.pwr),
      bwr: absent('Bu tasarımda ayrı basınç kanalları bulunmaz. Demetlerin kanal kutuları akışı yönlendirir ama basınç sınırı değildir; hepsi kabın içindedir.', SRC.bwr),
      vver: absent('Bu tasarımda ayrı basınç kanalları bulunmaz; yakıt demetleri basınç kabının içindedir.', SRC.vver),
      rbmk: {
        text: 'Dikey: su kanalın altından girer, üstten buhar–su karışımı çıkar; her kanalın kendi alt ve üst borusu vardır.',
        scope: 'family',
        mini: ['channels'],
        main: ['channels', ...RBMK_CH, 'dgh', 'risers'],
        sourceIds: SRC.rbmk,
      },
      candu: {
        text: 'Yatay: calandria’dan uçtan uca geçer. Komşu kanallarda soğutucu ters yönde akar (CANDU 6, sekiz biçimli halka).',
        scope: 'family',
        mini: ['channels', 'headers'],
        main: ['channels', ...CANDU_CH, 'feeders-l', 'feeders-r'],
        sourceIds: SRC.candu,
      },
    },
  },
  {
    id: 'sg-vs-drum',
    label: 'Buhar üreteci ve ayırıcı tambur',
    question: 'Buhar üreteci ile ayırıcı tambur arasındaki fark nedir?',
    sides: {
      pwr: {
        text: 'Buhar üreteci var: iki ayrı devre arasında ısı aktarır ve buharı ikincil tarafta üretir. Üst bölümündeki ayırıcı/kurutucular yalnız nemi alır.',
        scope: 'family',
        mini: ['sg'],
        main: ['sg', 'f-sg-tubes'],
        sourceIds: SRC.pwr,
      },
      bwr: {
        text: 'Buhar üreteci yok. Kabın içindeki ayırıcı ve kurutucular çekirdekte oluşan karışımı ayırır; ısı aktarmazlar.',
        scope: 'family',
        mini: ['separators'],
        main: ['separators', 'dryers'],
        sourceIds: SRC.bwr,
      },
      vver: {
        text: 'Yatay buhar üreteci var: ısıyı borulardan ikincil suya aktarır. Gövdenin üstündeki ayırıcılar nemi alır.',
        scope: 'family',
        mini: ['sg'],
        main: ['hsg'],
        sourceIds: SRC.vver,
      },
      rbmk: {
        text: 'Buhar üreteci yok. Kap dışındaki ayırıcı tambur, kanallarda oluşan buhar–su karışımını ayırır; ısı aktarmaz, iki devreyi ayırmaz.',
        scope: 'family',
        mini: ['drum'],
        main: ['drum', 'f-drum-steam', 'f-drum-water'],
        sourceIds: SRC.rbmk,
      },
      candu: {
        text: 'Buhar üreteci var (ısı aktarır). Ayrı bir ayırıcı tambur yoktur; CANDU 6 buhar üretecinin kendi tümleşik buhar tamburu vardır.',
        scope: 'drawn',
        mini: ['sg'],
        main: ['sg1', 'sg2'],
        sourceIds: ['canteach-c6'],
      },
    },
  },
  {
    id: 'fuel',
    label: 'Yakıt ve yakıt değiştirme',
    question: 'Tipik yakıt nedir, yakıt nasıl değiştirilir?',
    sides: {
      pwr: {
        text: 'Az zenginleştirilmiş uranyum (IAEA: yaklaşık %3–5). Yakıt reaktör alt kritikken, kap kapağı kaldırılarak değiştirilir (işletme modu 6).',
        scope: 'family',
        mini: ['core'],
        main: ['vessel'],
        sourceIds: ['iaea-bptc-m4', 'tab-2-14'],
      },
      bwr: {
        text: 'Yakıt birçok bakımdan PWR yakıtına benzer (IAEA). Bu uygulama BWR yakıt değiştirme sürecini ayrıca ele almaz.',
        scope: 'family',
        mini: ['core'],
        main: ['core'],
        sourceIds: ['iaea-bptc-m4'],
      },
      vver: {
        text: 'PWR ailesinden; yakıt üçgen adımlı altıgen demetlerdedir. Yakıt değiştirme ayrıntısı bu uygulamada ele alınmaz.',
        scope: 'family',
        mini: ['core'],
        main: ['vessel'],
        sourceIds: SRC.vver,
      },
      rbmk: {
        text: 'Yaklaşık %2 zenginleştirilmiş UO₂, zirkonyum alaşımı kaplı. Yakıt reaktör çalışırken değiştirilebilir (NEA; IAEA).',
        scope: 'family',
        mini: ['fuel', 'channels'],
        main: ['fuel', 'channels'],
        sourceIds: ['nea-chernobyl', 'iaea-bptc-m4'],
      },
      candu: {
        text: 'CANDU 6’da tipik olarak doğal uranyum (37 elemanlı demet, kanal başına 12). İki uçtaki makinelerle işletme sırasında yakıt değiştirme. Aynı kaynak başka yakıtların (az zenginleştirilmiş, geri kazanılmış uranyum, toryum) da kullanılabileceğini belirtir.',
        scope: 'drawn',
        mini: ['fuel', 'channels'],
        main: ['fuel', 'endshields', 'channels'],
        sourceIds: ['canteach-c6', 'canteach-constr'],
      },
    },
  },
];

export const getCompareTopic = (id: string | null) => COMPARE_TOPICS.find((t) => t.id === id) ?? null;
