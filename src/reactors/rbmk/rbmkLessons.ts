import type { LessonStep } from '../shared/types';
import { RBMK_CHANNEL_IDS, RBMK_LOWER_IDS, RBMK_RISER_IDS } from './rbmkLayout';

export const rbmkLessons: LessonStep[] = [
  {
    id: 'rbmk.tour.graphite',
    title: '1. Grafit ve kanallar',
    text: 'Çekirdek büyük bir grafit yığınıdır. Grafit nötronları yavaşlatır (moderatör). Yakıt, grafitin deliklerinden geçen dikey basınç kanallarının içindedir. Grafit soğutucu ya da basınç sınırı değildir.',
    highlight: ['graphite', 'channels', 'fuel'],
  },
  {
    id: 'rbmk.tour.boiling',
    title: '2. Kanalda kaynama',
    text: 'Hafif su her kanala alttan girer, yakıtın çevresinde yukarı akarken ısınır ve kaynamaya başlar. Kanalın üstünden buhar–su karışımı çıkar. Buhar burada, kanallarda oluşur.',
    highlight: ['channels', 'fuel', ...RBMK_CHANNEL_IDS],
  },
  {
    id: 'rbmk.tour.risers',
    title: '3. Buhar–su boruları ve tambur',
    text: 'Her kanalın karışımı kendi borusuyla çekirdek dışındaki ayırıcı tambura gider. Tambur karışımı ayırır: buhar üstte, su altta toplanır. Tambur ısı aktarmaz; bu yüzden buhar üreteci değildir.',
    highlight: ['risers', 'drum', ...RBMK_RISER_IDS, 'f-drum-steam', 'f-drum-water'],
  },
  {
    id: 'rbmk.tour.turbine',
    title: '4. Doğrudan türbine',
    text: 'Ayrılan buhar ana buhar hattıyla doğrudan türbine gider; arada ikinci bir devre yoktur. Türbin jeneratörü döndürür; çıkış buharı kondenserde ayrı soğutma suyu çevrimiyle yoğuşur.',
    highlight: ['steamline', 'hp', 'lp', 'gen', 'condenser', 'coolsource', 'f-steamline', 'f-crossover', 'f-lp-l', 'f-lp-r', 'f-cool'],
  },
  {
    id: 'rbmk.tour.return',
    title: '5. Besleme ve dolaşım',
    text: 'Yoğuşan su besleme pompasıyla tambura döner ve ayrılmış suyla karışır. Bu su iniş borularından ana sirkülasyon pompasına, oradan kolektörler ve alt su borularıyla yeniden kanallara gider.',
    highlight: ['feedpump', 'drum', 'downcomer', 'mcp', 'dgh', 'f-feed1', 'f-feed2', 'f-downcomer', 'f-pressure', 'f-dgh', ...RBMK_LOWER_IDS],
  },
  {
    id: 'rbmk.tour.rods',
    title: '6. Kontrol / koruma kanalları',
    text: 'Çubuklar yakıt kanallarından ayrı kanallarda hareket eder. Çizimde üstten giren temsili çubuklar var; çubukların tasarımı döneme göre değişmiştir (kazadan sonra değiştirildi). Çubuk konumu göreli güçle birebir eşlenmez.',
    highlight: ['rods', 'graphite'],
  },
  {
    id: 'rbmk.tour.boundaries',
    title: '7. Sınırları ayırt et',
    text: 'Grafit (moderatör), kanal borusu (basınç sınırı), biyolojik zırh ve bina aynı şey değildir. Çekirdeği saran tek bir PWR tipi basınç kabı yoktur; basınç, çok sayıda ayrı kanalın içinde tutulur.',
    highlight: ['graphite', 'channels', 'shield', 'building'],
  },
  {
    id: 'rbmk.tour.vs-bwr',
    title: '8. BWR ile karşılaştır',
    text: 'BWR ile ortak nokta: su kaynar ve buhar doğrudan türbine gider. Fark: BWR’de moderatör sudur ve kaynama tek büyük kapta olur; RBMK’de moderatör grafittir, kaynama ayrı kanallarda olur ve ayırma kap dışındaki tamburlarda yapılır.',
    highlight: ['graphite', 'channels', 'drum', 'steamline', 'f-steamline'],
  },
];
