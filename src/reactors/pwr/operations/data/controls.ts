import type { PlantPart } from '../types';

export interface ControlRelation {
  id: string;
  /** Kaynak 2-96’daki eşleşme. */
  measured: string;
  system: string;
  parts: PlantPart[];
  effect: string;
  feedback: string;
}

/** Kaynak 2-96: normal güç işletmesinde otomatik kontrol edilen büyüklükler ve sistemleri. */
export const CONTROL_RELATIONS: ControlRelation[] = [
  {
    id: 'turbine',
    measured: 'Türbin gücü',
    system: 'Türbin kontrol sistemi',
    parts: ['turbine', 'generator'],
    effect: 'Türbine giden buhar akışını ayarlayarak türbin gücünü istenen değere getirir.',
    feedback: 'Türbin daha fazla buhar çekerse birincil devreden daha fazla ısı alınır; bu, birincil sıcaklıkları ve dolayısıyla diğer kontrol döngülerini etkiler.',
  },
  {
    id: 'temp',
    measured: 'Reaktör soğutucu sıcaklıkları',
    system: 'Çubuk kontrol sistemi',
    parts: ['rods', 'core'],
    effect: 'Ölçülen sıcaklık hedeften saparsa kontrol çubuklarını hareket ettirerek reaktiviteyi ve reaktör gücünü değiştirir.',
    feedback: 'Kaynak 2-97: bor konsantrasyonu değişince birincil sıcaklıklar değişir; otomatik çubuk kontrolü sıcaklığı geri getirirken çubukları hareket ettirir ve bu da eksenel güç dağılımını değiştirir.',
  },
  {
    id: 'pressure',
    measured: 'Birincil devre basıncı',
    system: 'Basınçlandırıcı basınç kontrolü',
    parts: ['pzr', 'pzr-heaters'],
    effect: 'Basınç düşerse ısıtıcılar buhar üretip basıncı artırır; basınç yükselirse püskürtme buharı yoğuşturur.',
    feedback: 'Basınç, birincil suyun kaynamadan sıvı kalmasını sağlar; basınçlandırıcıdaki buhar hacmi bu kontrolün aracıdır.',
  },
  {
    id: 'inventory',
    measured: 'Birincil taraf su envanteri',
    system: 'Basınçlandırıcı seviye kontrolü',
    parts: ['pzr'],
    effect: 'Basınçlandırıcı seviyesini izleyerek birincil devredeki su miktarını ayarlar.',
    feedback: 'Sıcaklık değişince su genleşir veya büzülür ve basınçlandırıcı seviyesi değişir; seviye kontrolü bu değişimi karşılar.',
  },
  {
    id: 'sglevel',
    measured: 'Buhar üreteci su envanteri',
    system: 'Buhar üreteci seviye kontrolü',
    parts: ['sg', 'sg-level'],
    effect: 'Besleme suyu akışını ayarlayarak buhar üretecinin ikincil tarafındaki su seviyesini korur.',
    feedback: 'Buhar çekişi arttığında ikincil taraftaki su daha hızlı buharlaşır; seviye kontrolü besleme suyunu artırarak dengeyi sağlar.',
  },
];

export const AXIAL_NOT_AUTO =
  'Kaynak 2-96: önemli bir çekirdek parametresi olan eksenel güç dağılımı otomatik olarak kontrol edilmez. Bu dağılım soğutucu sıcaklığı, çubuk konumu ve yerel ksenon gibi birden çok etkinin birleşimidir; yukarıdaki listedeki gibi tek bir ölçülen değişken ve tek bir kontrol sistemiyle eşlenemez. Bunun yerine eksenel akı farkı (ΔI) hesaplanmış bir hedef bandı içinde tutulur (2-98).';
