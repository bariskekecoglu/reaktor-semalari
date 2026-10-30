import type { LessonStep } from '../shared/types';
import { HSG_FLOW_IDS } from './hsgGeometry';

export const vverLessons: LessonStep[] = [
  {
    id: 'vver.tour.core',
    title: '1. Çekirdek',
    text: 'Altıgen yakıt demetlerinde fisyon ısısı üretilir. Kontrol çubuğu kümeleri üst bloktan aşağı girer. Su hem soğutucu hem yavaşlatıcıdır.',
    highlight: ['vessel', 'rods', 'f-core-up', 'f-vessel-down'],
  },
  {
    id: 'vver.tour.primary',
    title: '2. Birincil çevrim',
    text: 'Birincil su basınç altında sıvı kalır. Isınan su üst kottaki sıcak koldan çıkar, pompa ile alt kottaki soğuk koldan geri döner. Basınçlandırıcı basıncı ayarlar.',
    highlight: ['hotleg', 'coldleg', 'mcp', 'pressurizer', 'surge', 'f-hotleg', 'f-crossleg', 'f-coldleg'],
  },
  {
    id: 'vver.tour.hsg',
    title: '3. Yatay buhar üreteci',
    text: 'Sıcak kolektörden yatay U borularına dağılan birincil su ısısını boru duvarından verir ve soğuk kolektörde toplanır. Gövde tarafındaki ikincil su kaynar; akışkanlar karışmaz.',
    highlight: ['hsg', 'collector-hot', 'collector-cold', ...HSG_FLOW_IDS],
  },
  {
    id: 'vver.tour.secondary',
    title: '4. İkincil çevrim',
    text: 'Gövdenin üst bölümünde ayrılan buhar nozullardan toplanır ve ana buhar hattıyla koruma yapısının dışına çıkar.',
    highlight: ['steamline', 'f-sg-steam-1', 'f-sg-steam-2', 'f-sg-steam-3', 'f-steamline'],
  },
  {
    id: 'vver.tour.turbine',
    title: '5. Türbin ve kondenser',
    text: 'Buhar YB ve AB türbinlerinde genişleyerek jeneratörü döndürür, ardından kondenserde ayrı soğutma suyu çevrimiyle yoğuşturulur.',
    highlight: ['hp', 'lp', 'gen', 'condenser', 'coolsource', 'f-crossover', 'f-lp-l', 'f-lp-r', 'f-cool'],
  },
  {
    id: 'vver.tour.return',
    title: '6. Dönüş',
    text: 'Yoğuşan su besleme pompası ve ön ısıtıcıdan geçerek yatay buhar üretecindeki dağıtıcıya geri döner.',
    highlight: ['feedpump', 'heater', 'f-feed1', 'f-feed2', 'f-feed-int', 'hsg'],
  },
];
