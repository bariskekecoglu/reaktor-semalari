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
  { id: 'iaea-bme-void', kind: 'web', title: 'BME — Void coefficient measurement (2017), IAEA eğitim arşivi', locator: '§1–2, s. 1–3: moderasyon, boşluk ve reaktivite ilişkisi', url: 'https://nucleus.iaea.org/sites/connect/RRIHpublic/CompendiumDB/Shared%20Documents/Hungary-BME/Protocols%20in%20PDF/Hungary%20BME%2008%20Void%20Coefficient.pdf' },
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
  {
    id: 'iaea-bptc-m4',
    kind: 'web',
    title: 'IAEA BPTC — Module IV: Design of a nuclear reactor',
    locator: 'Bölüm 1.3–1.7, s. 8–13 (PWR, BWR, PHWR/CANDU, LWGR/RBMK)',
    url: 'https://gnssn.iaea.org/main/bptc/BPTC%20Module%20Documents/Module04%20Design%20of%20a%20nuclear%20reactor.pdf',
  },
  {
    id: 'iaea-insag7',
    kind: 'web',
    title: 'IAEA INSAG-7, The Chernobyl Accident: Updating of INSAG-1 (1992)',
    locator: '§2, s. 3–8; §3–6, s. 10–25; Ek, s. 27–28; Ek I Tablo I-I, s. 53–55; §I-4.6–I-4.7, s. 64–83 (1986 tasarımı ve tarihsel kaza analizi)',
    url: 'https://www-pub.iaea.org/MTCD/publications/PDF/Pub913e_web.pdf',
  },
  {
    id: 'nea-chernobyl',
    kind: 'web',
    title: 'OECD NEA — Chernobyl, Chapter I: The site and accident sequence',
    locator: '2002 değerlendirmesi, Bölüm I: The RBMK-1000 reactor; Events leading to the accident; The accident',
    url: 'https://oecd-nea.org/jcms/pl_28271/chernobyl-chapter-i-the-site-and-accident-sequence',
  },
  {
    id: 'cnsc-pt',
    kind: 'web',
    title: 'CNSC — Pressure tubes (bilgi notu)',
    locator: 'Yakıt kanalı: basınç tüpü, calandria tüpü, uç bağlantıları, aralayıcılar',
    url: 'https://www.cnsc-ccsn.gc.ca/eng/resources/fact-sheets/pressure-tubes.cfm',
  },
  {
    id: 'canteach-c6',
    kind: 'web',
    title: 'Zhang Yanfa, B. A. Shalaby (AECL) — Introduction to the Qinshan Phase III CANDU Nuclear Power Plant (CANTEACH)',
    locator: '§3.2–3.7 ve CANDU 6 birim verileri',
    url: 'https://ww.nuceng.ca/canteach-rev2/library/20054402.pdf',
  },
  {
    id: 'canteach-constr',
    kind: 'web',
    title: 'CANDU Fundamentals, Bölüm 11: CANDU Reactor Construction (CANTEACH)',
    locator: 'Calandria, kanal katmanları, gaz halkası, uç bağlantıları',
    url: 'https://ww.nuceng.ca/canteach-rev2/library/20040711.pdf',
  },
  {
    id: 'canteach-hts',
    kind: 'web',
    title: 'CANDU Fundamentals, Bölüm 14: Heat Transport System (CANTEACH)',
    locator: 'Sekiz biçimli halka, iki yönlü akış, pompaların ve kolektörlerin konumu',
    url: 'https://ww.nuceng.ca/canteach-rev2/library/20040714.pdf',
  },
  {
    id: 'canteach-thermal',
    kind: 'web',
    title: 'CANTEACH — Heat Transport System Thermalhydraulics, Chapter 3',
    locator: '§3.3, s. 3-2–3-3 (birincil tarafta sınırlı buhar ve buhar üretecinde yoğuşma; tek faz yaklaşımı bir sadeleştirmedir)',
    url: 'https://canteach.candu.org/Content%20Library/20043705.pdf',
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
