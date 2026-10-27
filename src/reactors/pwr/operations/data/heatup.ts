import type { PlantView, SourceRef } from '../types';

export interface HeatupStage {
  id: string;
  title: string;
  /** Kaynakta verilen yaklaşık koşul (varsa). */
  condition: string;
  heatSources: string[];
  heatSinks: string[];
  view: PlantView;
  /** Basınçlandırıcı durumu için kısa etiket. */
  pzrLabel: string;
  whatWhy: string;
  sources: SourceRef[];
}

const cold: PlantView = {
  rodInsertion: 1,
  headOn: true,
  pzrWater: 1,
  pzrHeaters: false,
  rcpRunning: false,
  rhrRunning: true,
  sgActive: false,
  steamDump: false,
  turbine: 'off',
  fission: false,
};

/**
 * Kavramsal ısınma aşamaları (2-89 – 2-93). Operatör prosedürü değildir; vana/pompa işlem sıraları,
 * güvenlik sistemi işlemleri ve sayısal devreye alma reçeteleri bilinçli olarak dahil edilmedi.
 */
export const HEATUP: HeatupStage[] = [
  {
    id: 'rhr',
    title: '1. Düşük sıcaklıkta artık ısının alınması',
    condition: 'Kaynakta Mod 6’dan başlangıç örneği: ~140 °F (60 °C), 50–100 psig.',
    heatSources: ['Artık ısı (fisyon yok)'],
    heatSinks: ['RHR ısı değiştiricisi'],
    view: cold,
    pzrLabel: 'Tamamen su dolu (“solid”), ısıtıcılar kapalı',
    whatWhy:
      'Çekirdek alt kritik ve çubuklar içeride; fisyon yok ama artık ısı var. Bu ısıyı RHR pompaları ve ısı değiştiricisi alır. Ana soğutucu pompaları çalışmıyor; buhar üreteçleri dolu ve ısı alıcısı değil.',
    sources: [{ kind: 'pdf', ref: 's. 2-89 (başlangıç koşulları)' }],
  },
  {
    id: 'warm',
    title: '2. Isı girdileri ve sistemin ısınması',
    condition: 'Basınç 400–425 psig bandına yükseltilir (kaynak).',
    heatSources: ['Artık ısı'],
    heatSinks: ['RHR ısı değiştiricisi atlatıldı → ısı alınmıyor', 'Çevreye kayıplar'],
    view: { ...cold, rhrRunning: true, rhrHxBypassed: true },
    pzrLabel: 'Hâlâ su dolu',
    whatWhy:
      'RHR akışı ısı değiştiricinin etrafından dolaştırıldığında artık ısı artık dışarı atılmaz ve birincil devrenin sıcaklığı yükselmeye başlar. Isı üretimi değişmedi; değişen, ısının nereye gittiğidir.',
    sources: [{ kind: 'pdf', ref: 's. 2-89' }],
  },
  {
    id: 'bubble',
    title: '3. Basınçlandırıcıda buhar hacmi',
    condition: 'Basınçlandırıcı seviyesi ~%60’a indirilir (kaynak).',
    heatSources: ['Artık ısı', 'Basınçlandırıcı ısıtıcıları'],
    heatSinks: ['RHR ısı değiştiricisi atlatıldı → ısı alınmıyor', 'Çevreye kayıplar'],
    view: { ...cold, pzrHeaters: true, pzrWater: 0.6, rhrHxBypassed: true },
    pzrLabel: 'Üstte buhar hacmi, ~%60 su',
    whatWhy:
      'Isıtıcılar basınçlandırıcıyı birincil devreden daha sıcak tutar; böylece buhar kabarcığı çekirdeğin üstünde değil, basınçlandırıcının üst kısmında oluşur. Bu buhar hacmi basınç kontrolü içindir; çekirdekte kaynama değildir.',
    sources: [{ kind: 'pdf', ref: 's. 2-90' }],
  },
  {
    id: 'rcp',
    title: '4. Birincil dolaşım ve buhar üretecine ısı aktarımı',
    condition: 'Her ana soğutucu pompası birincil devreye ~4,5 MWt ısı ekleyebilir (kaynak). 200 °F (93 °C) aşılmadan kapatma çubuk grupları çekilir; çekirdek yüksek borlu kalır ve alt kritiktir.',
    heatSources: ['Ana soğutucu pompalarının işi (sürtünme → ısı)', 'Artık ısı', 'Basınçlandırıcı ısıtıcıları'],
    heatSinks: ['Buhar üreteçlerindeki suyun ısınması', 'Çevreye kayıplar (sıcaklıkla artar)'],
    view: { ...cold, pzrHeaters: true, pzrWater: 0.6, rcpRunning: true, rhrRunning: false, sgActive: true, rodInsertion: 0.75 },
    pzrLabel: 'Buhar hacmi korunuyor, ~%60 su',
    whatWhy:
      'Isınmanın başlıca kaynağı pompaların suya kattığı enerjidir. Pompalar çalışınca RHR durdurulur. Sıcaklık arttıkça çevreye kayıplar da artar ve ısınma hızı yavaşlar. Buhar üreteçlerinin ikincil tarafı da ısınır.',
    sources: [{ kind: 'pdf', ref: 's. 2-90 – 2-92' }],
  },
  {
    id: 'standby',
    title: '5. Sıcak bekleme',
    condition: 'Yüksüz ortalama sıcaklığa (no-load Tavg) yaklaşılır; basınç 2235 psig’e doğru yükseltilir (kaynak).',
    heatSources: ['Ana soğutucu pompalarının işi', 'Artık ısı', 'Basınçlandırıcı ısıtıcıları (basınç kontrolü)'],
    heatSinks: ['Buhar üreteçleri → steam dump → kondenser', 'Çevreye kayıplar'],
    view: { ...cold, pzrHeaters: true, pzrWater: 0.6, rcpRunning: true, rhrRunning: false, sgActive: true, steamDump: true, rodInsertion: 0.75 },
    pzrLabel: 'Buhar hacmi, temsili program seviyesi',
    whatWhy:
      'Steam dump kontrol sistemi artan buhar basıncına tepki vererek fazla ısıyı kondensere atar ve yüksüz ortalama sıcaklığı yaklaşık sabit tutar. Türbin elektrik üretmediği hâlde ısı sistemden uzaklaştırılabilir.',
    sources: [{ kind: 'pdf', ref: 's. 2-92' }],
  },
  {
    id: 'critical',
    title: '6. Düşük fisyon gücünden güç işletmesine (kavramsal)',
    condition: 'Kritiklik: k_eff = 1. Güç artışında ksenon birikimi ve güç katsayısı (power defect) hesaba katılır (kaynak).',
    heatSources: ['Fisyon (düşükten artan)', 'Pompaların işi', 'Artık ısı', 'Basınçlandırıcı ısıtıcıları (basınç kontrolü)'],
    heatSinks: ['Buhar üreteçleri → türbin (güç düşükken ısı, önceki aşamadaki gibi kondensere atılır)'],
    view: { ...cold, pzrHeaters: true, pzrWater: 0.6, rcpRunning: true, rhrRunning: false, sgActive: true, steamDump: false, turbine: 'generating', rodInsertion: 0.35, fission: true },
    pzrLabel: 'Buhar hacmi, temsili program seviyesi',
    whatWhy:
      'Bor seyreltmesi ve çubuk hareketiyle reaktör kritik olur (k_eff = 1) ve fisyon gücü artar. Kaynağa göre kritiklik noktasını tam belirlemek zordur; reaktör hafifçe süperkritik yapılıp sonra kritikliğe döndürülür. Güç arttıkça buhar türbine yönlendirilir ve elektrik üretimi başlar.',
    sources: [{ kind: 'pdf', ref: 's. 2-92 – 2-93' }],
  },
];
