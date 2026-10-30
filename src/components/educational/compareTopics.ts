/**
 * Etkileşimli karşılaştırma konuları. Her konu aynı soruya üç kısa, karşılaştırılabilir açıklama verir.
 * `scope`: 'family' = reaktör ailesi için genel ilke; 'drawn' = uygulamada çizilen temsili tasarıma özgü
 * (gerçek tesisler arasında değişebilir). Metinler mevcut karşılaştırma tablosu ve reaktör yapılandırmalarından alınmıştır.
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
  | 'containment';

export interface TopicSide {
  text: string;
  scope: 'family' | 'drawn';
  /** Mini şemada vurgulanacak parçalar. */
  mini: MiniPart[];
  /** Ana şemada vurgulanacak kimlikler (“Bu reaktörde ayrıntılı incele”). */
  main: string[];
  sourceIds: string[];
}

export interface CompareTopic {
  id: string;
  label: string;
  question: string;
  sides: Record<ReactorId, TopicSide>;
}

const SRC = { pwr: ['nuce-ch2', 'nrc-unit3'], bwr: ['nuce-ch2', 'nrc-bwr'], vver: ['nuce-ch2', 'iaea-vver'] };

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
    },
  },
];

export const getCompareTopic = (id: string | null) => COMPARE_TOPICS.find((t) => t.id === id) ?? null;
