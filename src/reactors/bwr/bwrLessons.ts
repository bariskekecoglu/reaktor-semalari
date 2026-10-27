import type { LessonStep } from '../shared/types';

export const bwrLessons: LessonStep[] = [
  {
    title: '1. Çekirdekte kaynama',
    text: 'Fisyon ısısıyla su, yakıt demetleri arasında yukarı akarken doğrudan kaynar. Kabarcıklar çekirdeğin üst kısmına doğru çoğalır. Kontrol çubukları alttan girer.',
    highlight: ['core', 'rods', 'f-core-1', 'f-core-2', 'f-core-3'],
  },
  {
    title: '2. Buhar ayırma ve kurutma',
    text: 'Su-buhar karışımı ayırıcılarda dönerek ayrışır; su aşağı döner. Buhar kurutuculardan geçerken kalan nem tutulur ve kuru buhar kubbede toplanır.',
    highlight: ['separators', 'dryers', 'f-steam-1', 'f-steam-2', 'f-steam-3', 'f-moist-L', 'f-moist-R'],
  },
  {
    title: '3. Doğrudan türbine',
    text: 'Buhar ana buhar hattıyla reaktörden doğrudan türbine gider; ara buhar üreteci yoktur. Bu yüzden türbin binası da korumalı bölgedir.',
    highlight: ['steamline', 'hp', 'lp', 'gen', 'turbinebldg', 'f-steamline', 'f-crossover'],
  },
  {
    title: '4. Kondenser',
    text: 'Türbinden çıkan buhar soğutma suyu boruları üzerinde yoğuşur. Soğutma suyu ayrı çevrimdir ve reaktör suyuyla karışmaz.',
    highlight: ['condenser', 'coolsource', 'f-lp-l', 'f-lp-r', 'f-cool'],
  },
  {
    title: '5. Besleme suyu dönüşü',
    text: 'Yoğuşan su ön ısıtılıp kaba geri basılır, ayrılan suyla downcomer’da karışır. Jet pompaları ve devridaim pompası suyu tekrar çekirdeğe yönlendirir.',
    highlight: ['feedpump', 'heater', 'jetpumps', 'recirc', 'f-feed1', 'f-feed2', 'f-down-L', 'f-down-R', 'f-recirc-out', 'f-recirc-in'],
  },
];
