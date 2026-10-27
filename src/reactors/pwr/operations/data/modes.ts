import type { CoolingPath, PlantView, SourceRef } from '../types';

export interface OperatingMode {
  mode: number;
  name: string;
  /** Tablo 2-14’ün İngilizce adı. */
  sourceName: string;
  /** Tablodaki hücreler kaynakta göründüğü gibi; okunamayan/eksik hücreler null. */
  keff: string | null;
  thermalPower: string | null;
  avgTempF: string | null;
  /** Hücre hakkında not (eksik/kesik görünüyor vb.). */
  cellNote?: string;
  /** Temsili fisyon gücü (% nominal). Artık ısı hariç. */
  fissionPct: number;
  /** Artık ısı gösterilsin mi (kapatma sonrası). */
  decayHeat: 'running' | 'after-shutdown';
  cooling: CoolingPath;
  coolingText: string;
  turbineText: string;
  rodsText: string;
  view: PlantView;
  whatWhy: string;
  sources: SourceRef[];
}

const base: PlantView = {
  rodInsertion: 1,
  headOn: true,
  pzrWater: 0.6,
  pzrHeaters: true,
  rcpRunning: true,
  rhrRunning: false,
  sgActive: true,
  steamDump: false,
  turbine: 'off',
  fission: false,
};

const T2_14: SourceRef = { kind: 'pdf', ref: 'Tablo 2-14, s. 2-88' };
const TXT_288: SourceRef = { kind: 'pdf', ref: 's. 2-88 (soğutma yolları)' };

export const MODES: OperatingMode[] = [
  {
    mode: 1,
    name: 'Güç işletmesi',
    sourceName: 'Power Operation',
    keff: '≥ 0,99',
    thermalPower: '> %5',
    avgTempF: '≥ 350 °F',
    fissionPct: 100,
    decayHeat: 'running',
    cooling: 'rcp-sg',
    coolingText: 'Ana soğutucu pompaları ve buhar üreteçleri (kaynak 2-88).',
    turbineText: 'Temsili %100 güçte türbin-jeneratör elektrik üretiyor.',
    rodsText: 'Kritik reaktör (k_eff = 1); kontrol çubukları büyük ölçüde dışarıda, otomatik sıcaklık kontrolüyle hareket edebilir.',
    view: { ...base, rodInsertion: 0.15, turbine: 'generating', fission: true },
    whatWhy:
      'Fisyon ısısı birincil devreden buhar üreteçlerine, oradan türbine gider. Tablodaki “% nominal ısıl güç” artık ısıyı hariç tutar; çalışan çekirdekte artık ısı fisyon ısısının içinde küçük bir paydır.',
    sources: [T2_14, TXT_288],
  },
  {
    mode: 2,
    name: 'Başlatma',
    sourceName: 'Startup',
    keff: '≥ 0,99',
    thermalPower: '≤ %5',
    avgTempF: '≥ 350 °F',
    fissionPct: 3,
    decayHeat: 'running',
    cooling: 'rcp-sg',
    coolingText:
      'Sıcak koşulda ısı birincil pompalar ve buhar üreteçleriyle alınır; buhar, türbin atlatma (steam dump) yoluyla kondensere gidebilir (2-92). Not: 2-88 metni “start-up” için RHR’den de söz eder; bu, soğuk durumdan başlayan başlatma sürecinin ilk aşamalarına karşılık gelir (bkz. Isınma bölümü).',
    turbineText: 'Temsili: düşük fisyon gücünde elektrik üretimi yok; ısı steam dump ile atılıyor.',
    rodsText: 'Bor seyreltme ve çubuk çekme ile reaktör kritikliğe getirilir; kritiklikte k_eff = 1 (2-92 – 2-93).',
    view: { ...base, rodInsertion: 0.45, steamDump: true, turbine: 'no-load', fission: true },
    whatWhy:
      'Tablodaki ≤%5 eşiği idari bir mod sınırıdır; kritiklik fiziksel olarak k_eff = 1 koşuludur. Düşük güçte üretilen ısı türbine değil, steam dump üzerinden kondensere aktarılabilir.',
    sources: [T2_14, { kind: 'pdf', ref: 's. 2-92 – 2-93 (kritikliğe yaklaşma)' }],
  },
  {
    mode: 3,
    name: 'Sıcak bekleme',
    sourceName: 'Hot Standby',
    keff: '< 0,99',
    thermalPower: '0',
    avgTempF: '≥ 350 °F',
    fissionPct: 0,
    decayHeat: 'after-shutdown',
    cooling: 'rcp-sg',
    coolingText: 'Ana soğutucu pompaları ve buhar üreteçleri (2-88); yüksüz ortalama sıcaklık steam dump kontrolüyle korunur (2-92).',
    turbineText: 'Elektrik üretimi yok.',
    rodsText: 'Çekirdek alt kritik (k_eff < 0,99). Çubuklar içeride gösterildi (temsili).',
    view: { ...base, rodInsertion: 1, steamDump: true, turbine: 'off' },
    whatWhy:
      'Fisyon gücü sıfır ama ısı üretimi sıfır değil: artık ısı sürüyor ve buhar üreteçleri üzerinden uzaklaştırılmalı. Kaynak 2-89: elektrik/enstrüman sorunu gibi durumlar yalnız Mod 3 kapatma gerektirebilir; dönüş süresi kısalır.',
    sources: [T2_14, TXT_288, { kind: 'pdf', ref: 's. 2-89 (kapatma modu seçimi)' }],
  },
  {
    mode: 4,
    name: 'Sıcak durdurma',
    sourceName: 'Hot Shutdown',
    keff: '< 0,99',
    thermalPower: '0',
    avgTempF: '200 < …',
    cellNote: 'Kaynak tablosunda bu hücre “200 <” olarak kesik görünüyor; üst sınır tahminle doldurulmadı.',
    fissionPct: 0,
    decayHeat: 'after-shutdown',
    cooling: 'rcp-sg',
    coolingText:
      'Kaynak 2-88: hot-shutdown modunda soğutma ana soğutucu pompaları ve buhar üreteçleriyle sağlanır. Sıcaklık düştükçe RHR’ye geçişin ne zaman yapıldığı tasarıma ve prosedüre bağlıdır; burada evrensel bir kural gösterilmez.',
    turbineText: 'Elektrik üretimi yok.',
    rodsText: 'Alt kritik çekirdek (k_eff < 0,99). Çubuklar içeride (temsili).',
    view: { ...base, rodInsertion: 1, steamDump: true, turbine: 'off' },
    whatWhy: 'Sıcaklık Mod 3’e göre daha düşük olabilir; artık ısı hâlâ vardır ve uzaklaştırılmalıdır.',
    sources: [T2_14, TXT_288],
  },
  {
    mode: 5,
    name: 'Soğuk durdurma',
    sourceName: 'Cold Shutdown',
    keff: '< 0,99',
    thermalPower: '0',
    avgTempF: null,
    cellNote: 'Kaynak tablosunun sayfa görüntüsünde bu hücre boş/okunamıyor; değer tahminle doldurulmadı.',
    fissionPct: 0,
    decayHeat: 'after-shutdown',
    cooling: 'rhr',
    coolingText: 'Artık ısı RHR pompaları ve ısı değiştiricileriyle uzaklaştırılır (2-88). Birincil devrenin açılmasını gerektiren bakımlar Mod 5 ister (2-89).',
    turbineText: 'Elektrik üretimi yok.',
    rodsText: 'Alt kritik çekirdek (k_eff < 0,99); çubuklar içeride.',
    view: { ...base, rodInsertion: 1, pzrWater: 1, pzrHeaters: false, rcpRunning: false, rhrRunning: true, sgActive: false, turbine: 'off' },
    whatWhy: 'Düşük sıcaklıkta buhar üreteçleri ısı alıcısı olarak kullanılmaz; artık ısıyı RHR sistemi alır.',
    sources: [T2_14, TXT_288, { kind: 'pdf', ref: 's. 2-89' }],
  },
  {
    mode: 6,
    name: 'Yakıt değiştirme',
    sourceName: 'Refueling',
    keff: '≤ 0,95',
    thermalPower: '0',
    avgTempF: '≤ 140 °F',
    fissionPct: 0,
    decayHeat: 'after-shutdown',
    cooling: 'rhr',
    coolingText: 'RHR sistemi artık ısıyı uzaklaştırır (2-88).',
    turbineText: 'Elektrik üretimi yok.',
    rodsText: 'Kap kapağı gevşetilmiş veya kaldırılmış, yakıt kapta (tablo dipnotu). Daha büyük alt kritiklik payı gerekir: k_eff ≤ 0,95.',
    view: { ...base, rodInsertion: 1, headOn: false, pzrWater: 1, pzrHeaters: false, rcpRunning: false, rhrRunning: true, sgActive: false, turbine: 'off' },
    whatWhy:
      'Kap açıldığında soğutucunun kaynayarak kaybolmaması için sıcaklık düşük tutulur ve daha büyük reaktivite payı istenir (2-89). Artık ısı yine RHR ile alınır.',
    sources: [T2_14, { kind: 'pdf', ref: 's. 2-89 (yakıt değiştirme gerekçesi)' }],
  },
];

/** °F → °C dönüşümü. */
export const fToC = (f: number) => ((f - 32) * 5) / 9;
