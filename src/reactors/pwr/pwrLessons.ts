import type { LessonStep } from '../shared/types';

export const pwrLessons: LessonStep[] = [
  {
    id: 'pwr.tour.core',
    title: '1. Çekirdek',
    text: 'Uranyum-235 çekirdekleri nötronla bölünür; açığa çıkan enerji yakıt çubuklarında ısıya dönüşür. Kontrol çubukları üstten girer ve nötron soğurarak reaksiyonu ayarlar. Su hem soğutucu hem yavaşlatıcıdır.',
    highlight: ['vessel', 'rods', 'f-core-up', 'f-vessel-down'],
  },
  {
    id: 'pwr.tour.primary',
    title: '2. Birincil devre',
    text: 'Birincil su yüksek basınç altında tutulur; çekirdekte ısınır ama normal çalışmada toplu olarak kaynamaz. Pompa suyu kapalı çevrimde dolaştırır, basınçlandırıcı basıncı ayarlar.',
    highlight: ['hotleg', 'coldleg', 'rcp', 'pressurizer', 'surge', 'f-hotleg', 'f-crossleg', 'f-coldleg'],
  },
  {
    id: 'pwr.tour.sg',
    title: '3. Buhar üreteci',
    text: 'Sıcak birincil su U borularının içinden geçer. Isı boru duvarından ikincil tarafa aktarılır ve borular dışındaki ikincil su kaynar. Akışkanlar karışmaz; yalnız enerji geçer.',
    highlight: ['sg', 'f-sg-tubes', 'f-sg-steam'],
  },
  {
    id: 'pwr.tour.turbine',
    title: '4. Türbin ve jeneratör',
    text: 'İkincil devrenin buharı ana buhar hattıyla YB türbinine, oradan AB türbinine gider. Türbinler ve jeneratör aynı mili döndürür; mekanik enerji elektriğe çevrilir.',
    highlight: ['steamline', 'hp', 'lp', 'gen', 'f-steamline', 'f-crossover'],
  },
  {
    id: 'pwr.tour.condenser',
    title: '5. Kondenser',
    text: 'Türbinden çıkan buhar, içinden soğutma suyu geçen boruların üzerinde yoğuşur. Bu ısı ayrı soğutma suyu çevrimiyle çevreye atılır; soğutma suyu ikincil su ile karışmaz.',
    highlight: ['condenser', 'coolsource', 'f-lp-l', 'f-lp-r', 'f-cool'],
  },
  {
    id: 'pwr.tour.return',
    title: '6. Dönüş',
    text: 'Yoğuşan su besleme pompası ve ön ısıtıcı üzerinden buhar üretecinin ikincil tarafına geri döner; ikincil çevrim tamamlanır. Birincil çevrim ise kendi içinde reaktöre döner.',
    highlight: ['feedpump', 'heater', 'f-feed1', 'f-feed2', 'sg'],
  },
];
