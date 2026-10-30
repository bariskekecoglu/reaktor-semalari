import type { ComponentType } from 'react';

export type ReactorId = 'pwr' | 'bwr' | 'vver';

/** Bir sahnedeki tıklanabilir ekipman. */
export interface ComponentInfo {
  id: string;
  name: string;
  /** Kısa görev tanımı. */
  role: string;
  /** Bu reaktörde nasıl çalıştığı. */
  how: string;
  /** Vurgulanacak bağlantılı hatlar / ekipmanlar (Flow ve Hotspot kimlikleri). */
  related: string[];
  /** Açılabilecek yakın plan anahtarı. */
  detail?: string;
}

/** Reaktöre özgü hızlı etkileşim (ör. "Buhar nerede oluşuyor?"). */
export interface FocusAction {
  id: string;
  label: string;
  text: string;
  highlight: string[];
  detail?: string;
}

export interface LessonStep {
  /** Kararlı kimlik (ör. 'pwr.tour.sg'); ilerleme kaydı ve asistan bağlantıları bunu kullanır. */
  id: string;
  title: string;
  text: string;
  highlight: string[];
}

export interface DetailDef {
  key: string;
  title: string;
}

export interface ReactorConfig {
  id: ReactorId;
  shortName: string;
  fullName: string;
  family: string;
  summary: string;
  components: ComponentInfo[];
  focusActions: FocusAction[];
  details: DetailDef[];
  /** Sahnede her zaman görünecek not(lar). */
  notes: string[];
}

export interface SceneProps {
  showLabels: boolean;
  showFlow: boolean;
}

export interface DetailProps {
  detailKey: string;
  showFlow: boolean;
}

export interface ReactorModule {
  config: ReactorConfig;
  lessons: LessonStep[];
  Scene: ComponentType<SceneProps>;
  CoreDetail: ComponentType<{ showFlow: boolean }>;
  Details: ComponentType<DetailProps>;
}

export type FlowKind = 'hot' | 'cold' | 'steam' | 'feed' | 'cool' | 'mix' | 'grad';
