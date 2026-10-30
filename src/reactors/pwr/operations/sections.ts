import type { OpsSectionId } from './types';

/** İşletme modülü bölümleri (sekmeler, asistan ve bilgi tabanı aynı listeyi kullanır). */
export const OPS_SECTIONS: { id: OpsSectionId; label: string; ref: string; summary: string; sourceIds: string[]; aliases: string[] }[] = [
  {
    id: 'modes',
    label: '1. İşletme modları',
    ref: 'Tablo 2-14',
    summary: 'PWR’nin altı işletme modu: güçte çalışmadan yakıt değişimine kadar fisyon gücü, türbin, soğutma yolu (birincil pompa + buhar üreteci ya da RHR), çubuklar ve kap kapağının durumu.',
    sourceIds: ['tab-2-14', 'nuce-2-5'],
    aliases: ['işletme modları', 'modlar', 'mod', 'yakıt değişimi', 'sıcak bekleme', 'soğuk kapatma', 'rhr'],
  },
  {
    id: 'heatup',
    label: '2. Isınma ve ısı uzaklaştırma',
    ref: 's. 2-89 – 2-93',
    summary: 'Soğuk durumdan çalışma sıcaklığına ısınmanın kavramsal aşamaları: ısı kaynakları ve alıcıları, basınçlandırıcıda buhar hacmi oluşturma, pompa ısısı, buhar boşaltma (steam dump).',
    sourceIds: ['p-2-89'],
    aliases: ['ısınma', 'ısıtma', 'pompa ısısı', 'steam dump', 'buhar boşaltma', 'ısı uzaklaştırma'],
  },
  {
    id: 'boron',
    label: '3. Bor ve yakıt çevrimi',
    ref: 'Şekil 2-39',
    summary: 'Yakıt çevrimi boyunca soğutucudaki bor derişiminin azaltılması (bor azaltma eğrisi).',
    sourceIds: ['fig-2-39', 'p-2-94'],
    aliases: ['bor', 'boron', 'yakıt çevrimi', 'bor eğrisi', 'ppm', 'yanma'],
  },
  {
    id: 'xenon',
    label: '4. Yük takibi ve ksenon',
    ref: 'Şekil 2-40, 2-41',
    summary: 'Yük takibi profilleri ve kapatma sonrası iyot-135 / ksenon-135 davranışı; ksenonun reaktivite etkisi.',
    sourceIds: ['fig-2-40', 'fig-2-41', 'p-2-94', 'model-xenon'],
    aliases: ['yük takibi', 'ksenon', 'xenon', 'iyot', 'xe-135', 'i-135', 'zehirlenme'],
  },
  {
    id: 'axial',
    label: '5. Eksenel güç dağılımı',
    ref: 'Şekil 2-42, 2-43',
    summary: 'Çekirdekte üst/alt güç dağılımı, ΔI ve eksenel ofset (AO); aynı toplam güçte farklı dağılımlar.',
    sourceIds: ['fig-2-42', 'fig-2-43', 'p-2-96'],
    aliases: ['eksenel', 'delta i', 'δi', 'eksenel ofset', 'ao', 'güç dağılımı', 'eksenel güç'],
  },
  {
    id: 'controls',
    label: '6. Otomatik kontrol ilişkileri',
    ref: 's. 2-96',
    summary: 'Otomatik kontrol sistemlerinin hangi büyüklüğü hangi ekipmanla ayarladığı ve eksenel dağılımın neden tek bir otomatik değişkene indirgenemediği.',
    sourceIds: ['p-2-96'],
    aliases: ['otomatik kontrol', 'kontrol sistemi', 'kontrol ilişkileri'],
  },
];
