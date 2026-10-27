/** PWR “İşletme ve Reaktör Davranışı” modülü türleri. */

/** Bilginin kaynağa göre kategorisi (arayüzde rozet olarak gösterilir). */
export type SourceKind = 'pdf' | 'figure' | 'model';

export interface SourceRef {
  kind: SourceKind;
  /** Ör. "Tablo 2-14, s. 2-88" */
  ref: string;
}

export type OpsSectionId = 'modes' | 'heatup' | 'boron' | 'xenon' | 'axial' | 'controls';

/** Küçük PWR şemasında vurgulanabilen parçalar. */
export type PlantPart =
  | 'core'
  | 'rods'
  | 'head'
  | 'rcp'
  | 'sg'
  | 'pzr'
  | 'pzr-heaters'
  | 'rhr'
  | 'turbine'
  | 'generator'
  | 'dump'
  | 'condenser'
  | 'sg-level';

export type CoolingPath = 'rhr' | 'rcp-sg' | 'rhr-to-rcp';
export type TurbineState = 'generating' | 'no-load' | 'off';

/** Küçük şemanın durumu (bir mod ya da ısınma aşaması tarafından belirlenir). */
export interface PlantView {
  /** Kontrol çubuklarının temsili sokulma oranı 0–1 (1 = tamamen içeride). */
  rodInsertion: number;
  /** Reaktör kabı kapağı yerinde mi? */
  headOn: boolean;
  /** Basınçlandırıcıdaki su oranı 0–1 (1 = tamamen su dolu, “solid”). */
  pzrWater: number;
  pzrHeaters: boolean;
  rcpRunning: boolean;
  rhrRunning: boolean;
  /** RHR akışı ısı değiştiricisinin etrafından dolaştırılıyor (ısı dışarı atılmıyor). */
  rhrHxBypassed?: boolean;
  /** Buhar üreteçleri ısı alıcısı olarak etkin mi? */
  sgActive: boolean;
  /** Türbin atlatma (steam dump) yoluyla kondensere buhar. */
  steamDump: boolean;
  turbine: TurbineState;
  /** Çekirdekte fisyon var mı (temsili gösterim). */
  fission: boolean;
}

/** Yük takibi profili: (saat, güç %) dönüm noktaları; aralarda doğrusal geçiş. */
export interface PowerProfile {
  id: string;
  label: string;
  /** Profil noktaları. Aynı saatte iki nokta = şekildeki dikey (idealize) geçiş. */
  points: [number, number][];
  note?: string;
}
