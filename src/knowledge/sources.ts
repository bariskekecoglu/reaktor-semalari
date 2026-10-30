/**
 * Uygulamada atıf yapılan kaynakların kapalı listesi. Asistan yalnız bu kimliklere atıf yapabilir;
 * modelden gelen bilinmeyen kaynak kimlikleri reddedilir. Yeni kaynak eklemek için önce burada tanımlayın.
 *
 * Tür:
 * - 'pdf'    Nuc E 430 ders notlarında doğrudan verilen bilgi (sayfa/şekil numarasıyla).
 * - 'figure' Kaynaktaki bir şekilden yaklaşık okunan veri.
 * - 'web'    Dış kurumsal kaynak (NRC, IAEA).
 * - 'model'  Bu uygulamanın temsili eğitim modeli (doğrulanmış fizik modeli değildir).
 */
export type SourceKind = 'pdf' | 'figure' | 'web' | 'model' | 'app';

export interface SourceDef {
  id: string;
  kind: SourceKind;
  title: string;
  /** Bölüm / sayfa / şekil numarası. */
  locator?: string;
  url?: string;
}

const NUCE = 'Nuc E 430 ders notları, Bölüm 2';

export const SOURCES: readonly SourceDef[] = [
  { id: 'app-guide', kind: 'app', title: 'Uygulama kullanım rehberi', locator: 'Site kontrolleri, yerel rehber ve ders ilerlemesi' },
  { id: 'nuce-ch2', kind: 'pdf', title: NUCE, locator: 'PWR, BWR ve VVER sistemleri (genel)' },
  { id: 'nuce-2-5', kind: 'pdf', title: NUCE, locator: '2.5 PWR Reactor Operations, s. 2-88 – 2-101' },
  { id: 'tab-2-14', kind: 'pdf', title: NUCE, locator: 'Tablo 2-14, s. 2-88 (işletme modları)' },
  { id: 'p-2-89', kind: 'pdf', title: NUCE, locator: 's. 2-89 – 2-93 (ısınma ve ısı uzaklaştırma)' },
  { id: 'p-2-94', kind: 'pdf', title: NUCE, locator: 's. 2-94 (yük takibi ve ksenon)' },
  { id: 'p-2-96', kind: 'pdf', title: NUCE, locator: 's. 2-96 – 2-98 (eksenel güç, ΔI, otomatik kontrol)' },
  { id: 'fig-2-39', kind: 'figure', title: NUCE, locator: 'Şekil 2-39, s. 2-94 (bor azaltma eğrisi)' },
  { id: 'fig-2-40', kind: 'figure', title: NUCE, locator: 'Şekil 2-40, s. 2-95 (yük takibi profilleri)' },
  { id: 'fig-2-41', kind: 'figure', title: NUCE, locator: 'Şekil 2-41, s. 2-96 (kapatma sonrası Xe worth)' },
  { id: 'fig-2-42', kind: 'figure', title: NUCE, locator: 'Şekil 2-42, s. 2-100 (eksenel güç ve ksenon profilleri)' },
  { id: 'fig-2-43', kind: 'figure', title: NUCE, locator: 'Şekil 2-43, s. 2-101 (güç–ΔI düzlemi)' },
  {
    id: 'nrc-unit3',
    kind: 'web',
    title: 'U.S. NRC — Student Corner, Unit 3: Nuclear Reactors & Energy Generation',
    url: 'https://www.nrc.gov/education-regulatory-research/the-student-corner/unit-3-nuclear-reactorsenergy-generation',
  },
  { id: 'nrc-bwr', kind: 'web', title: 'U.S. NRC — Boiling Water Reactors', url: 'https://www.nrc.gov/reactors/power/bwrs' },
  {
    id: 'iaea-vver',
    kind: 'web',
    title: 'N. Trunov ve ark., VVER tasarım özellikleri (IAEA, P1500)',
    url: 'https://www-pub.iaea.org/MTCD/Publications/PDF/P1500_CD_Web/htm/pdf/plenary/10KS_N.%20Trunov_PM.pdf',
  },
  { id: 'model-plant', kind: 'model', title: 'Uygulamanın temsili santral modeli', locator: 'Normalize güç, sabit %33 verim, birinci dereceden gecikmeler' },
  { id: 'model-xenon', kind: 'model', title: 'Uygulamanın temsili iyot/ksenon modeli', locator: 'dI/dt, dX/dt; κ = 3·λX temsili katsayı' },
];

const BY_ID = new Map(SOURCES.map((s) => [s.id, s]));

export function getSource(id: string): SourceDef | undefined {
  return BY_ID.get(id);
}

export function isSourceId(id: unknown): id is string {
  return typeof id === 'string' && BY_ID.has(id);
}

export const SOURCE_KIND_LABEL: Record<SourceKind, string> = {
  app: 'Kullanım rehberi',
  pdf: 'Ders notu',
  figure: 'Şekilden okunmuş',
  web: 'Dış kaynak',
  model: 'Temsili model',
};

export function formatSource(s: SourceDef): string {
  return s.locator ? `${s.title} — ${s.locator}` : s.title;
}
