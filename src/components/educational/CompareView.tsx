/** Etkileşimli karşılaştırma: konu seçici, üç reaktörün mini şemalarında vurgu ve karşılaştırılabilir açıklamalar. */
import { useState } from 'react';
import type { ReactorId } from '../../reactors/shared/types';
import { useViewLayout } from '../../hooks/useViewLayout';
import { formatSource, getSource, SOURCE_KIND_LABEL } from '../../knowledge/sources';
import { COMPARE_TOPICS, getCompareTopic, type CompareTopic, type MiniPart } from './compareTopics';

type Active = ReadonlySet<MiniPart> | null;

/** Parça sınıfı: konu seçiliyken ilgili parçalar vurgulanır (kalın çizgi + kesikli çerçeve), diğerleri geri plana alınır. */
const P = (part: MiniPart, active: Active) => (active ? (active.has(part) ? 'mp on' : 'mp off') : 'mp');

function Arrow({ d, cls, m }: { d: string; cls: string; m: string }) {
  return <path d={d} className={`mini-flow ${cls}`} markerEnd={`url(#${m})`} />;
}

function MiniDefs({ id }: { id: string }) {
  return (
    <defs>
      <marker id={id} viewBox="0 0 10 10" refX="8" refY="5" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="10" orient="auto-start-reverse">
        <path d="M0 0 L10 5 L0 10 z" fill="#333" />
      </marker>
    </defs>
  );
}

/** Türbin, jeneratör ve kondenser üç mini şemada aynı düzendedir. */
function MiniTurbine({ a, m }: { a: Active; m: string }) {
  return (
    <>
      <g data-part="turbine" className={P('turbine', a)}>
        <path d="M215 70 L245 62 V98 L215 90 Z" className="casing" />
      </g>
      <g data-part="gen" className={P('gen', a)}>
        <rect x="255" y="68" width="40" height="24" className="generator" />
      </g>
      <g data-part="condenser" className={P('condenser', a)}>
        <rect x="210" y="120" width="60" height="34" className="shell" fill="#eef0f2" stroke="#333" />
        <Arrow d="M240 100 V118" cls="steam" m={m} />
      </g>
    </>
  );
}

function MiniPwr({ a }: { a: Active }) {
  const m = 'mini-arrow-pwr';
  return (
    <svg viewBox="0 0 320 210" className="mini" role="img" aria-label="PWR mini şema: reaktör, basınçlandırıcı, dikey buhar üreteci, ayrı ikincil devre ve türbin">
      <MiniDefs id={m} />
      <g data-part="containment" className={P('containment', a)}>
        <path d="M10 200 V80 A90 60 0 0 1 190 80 V200" className="containment" strokeWidth={6} />
      </g>
      <g data-part="vessel" className={P('vessel', a)}>
        <rect x="30" y="100" width="40" height="80" rx="16" className="vessel-wall" />
      </g>
      <g data-part="core" className={P('core', a)}>
        <rect x="38" y="130" width="24" height="40" className="core-zone" />
      </g>
      <g data-part="rods" className={P('rods', a)}>
        <rect x="44" y="84" width="4" height="40" className="control-rod" />
        <rect x="54" y="84" width="4" height="40" className="control-rod" />
      </g>
      {/* Basınçlandırıcı sıcak kolun üstünde ve dalgalanma hattıyla birleşik (eski çizimde sıcak kol gövdenin içinden geçiyordu). */}
      <g data-part="pzr" className={P('pzr', a)}>
        <rect x="85" y="56" width="18" height="40" rx="9" className="vessel-wall" />
        <path d="M94 96 V117" className="mini-surge" />
        <circle cx="94" cy="120" r="2.4" className="mini-junction" />
      </g>
      <g data-part="sg" className={P('sg', a)}>
        <path d="M130 180 V100 L122 88 V60 A18 10 0 0 1 158 60 V88 L150 100 V180 Z" className="sg-shell" />
        <path d="M134 178 V112 A6 6 0 0 1 146 112 V178" className="u-tube" />
      </g>
      <g data-part="hot" className={P('hot', a)}>
        <Arrow d="M70 120 H120 V170 H130" cls="hot" m={m} />
      </g>
      <g data-part="cold" className={P('cold', a)}>
        <Arrow d="M150 185 V195 H60 V180" cls="cold" m={m} />
      </g>
      <g data-part="steam" className={P('steam', a)}>
        <Arrow d="M140 50 V30 H230 V70" cls="steam" m={m} />
      </g>
      <MiniTurbine a={a} m={m} />
      <g data-part="feed" className={P('feed', a)}>
        <Arrow d="M220 156 V170 H175 V120 H150" cls="feed" m={m} />
      </g>
      <text x="100" y="206">birincil</text>
      <text x="220" y="175">ikincil</text>
    </svg>
  );
}

function MiniBwr({ a }: { a: Active }) {
  const m = 'mini-arrow-bwr';
  return (
    <svg viewBox="0 0 320 210" className="mini" role="img" aria-label="BWR mini şema: büyük reaktör kabında kaynama, buhar doğrudan türbine">
      <MiniDefs id={m} />
      <g data-part="vessel" className={P('vessel', a)}>
        <rect x="40" y="30" width="80" height="165" rx="26" className="vessel-wall" />
        <rect x="44" y="40" width="72" height="40" className="steam-zone" />
        <rect x="44" y="80" width="72" height="105" className="water-zone" />
      </g>
      <g data-part="core" className={P('core', a)}>
        <rect x="58" y="110" width="44" height="50" className="core-zone" />
        {[64, 76, 88].map((x) => (
          <circle key={x} cx={x + 4} cy={98} r={3} className="p p-bubble" />
        ))}
      </g>
      <g data-part="rods" className={P('rods', a)}>
        <rect x="62" y="160" width="4" height="45" className="control-rod" />
        <rect x="92" y="160" width="4" height="45" className="control-rod" />
      </g>
      <g data-part="separators" className={P('separators', a)}>
        <path d="M50 68 h60" className="dryer" />
      </g>
      <g data-part="steam" className={P('steam', a)}>
        <Arrow d="M120 50 H230 V70" cls="steam" m={m} />
      </g>
      <MiniTurbine a={a} m={m} />
      <g data-part="feed" className={P('feed', a)}>
        <Arrow d="M220 156 V172 H140 V100 H122" cls="feed" m={m} />
      </g>
      <text x="128" y="44">buhar doğrudan türbine</text>
      <text x="150" y="200">tek çevrim · alttan çubuk</text>
    </svg>
  );
}

function MiniVver({ a }: { a: Active }) {
  const m = 'mini-arrow-vver';
  return (
    <svg viewBox="0 0 320 210" className="mini" role="img" aria-label="VVER mini şema: reaktör, basınçlandırıcı, yatay buhar üreteci ve kolektörler, ayrı ikincil devre">
      <MiniDefs id={m} />
      <g data-part="containment" className={P('containment', a)}>
        <path d="M10 200 V80 A95 60 0 0 1 200 80 V200" className="containment" strokeWidth={6} />
      </g>
      <g data-part="vessel" className={P('vessel', a)}>
        <rect x="30" y="100" width="30" height="85" rx="12" className="vessel-wall" />
      </g>
      <g data-part="core" className={P('core', a)}>
        <rect x="35" y="135" width="20" height="40" className="core-zone" />
      </g>
      <g data-part="rods" className={P('rods', a)}>
        <rect x="40" y="70" width="3" height="40" className="control-rod" />
        <rect x="48" y="70" width="3" height="40" className="control-rod" />
      </g>
      <g data-part="pzr" className={P('pzr', a)}>
        <rect x="63" y="60" width="14" height="36" rx="7" className="vessel-wall" />
        <path d="M70 96 V162" className="mini-surge" />
        <circle cx="70" cy="165" r="2.4" className="mini-junction" />
      </g>
      <g data-part="sg" className={P('sg', a)}>
        <path d="M95 110 H165 A18 18 0 0 1 165 146 H95 A18 18 0 0 1 95 110 Z" className="sg-shell" />
        {/* Temsili U boruları: sıcak kolektörden çıkar, soğuk kolektöre döner */}
        <path d="M112 128 H92 A7 7 0 0 0 92 142 H140" className="h-tube-wall" strokeWidth={2.5} />
        <path d="M120 131 H164 A5.5 5.5 0 0 1 164 142 H148" className="h-tube-wall" strokeWidth={2.5} />
      </g>
      <g data-part="collectors" className={P('collectors', a)}>
        <rect x="112" y="116" width="8" height="40" className="collector" />
        <rect x="140" y="116" width="8" height="40" className="collector cold" />
      </g>
      {/* Sıcak kol gövdenin altından sıcak kolektöre girer (eski çizimde gövdenin içinden geçiyordu); soğuk koldan yüksek kotta. */}
      <g data-part="hot" className={P('hot', a)}>
        <Arrow d="M60 165 H116 V158" cls="hot" m={m} />
      </g>
      <g data-part="cold" className={P('cold', a)}>
        <Arrow d="M144 158 V180 H60" cls="cold" m={m} />
      </g>
      <g data-part="steam" className={P('steam', a)}>
        <Arrow d="M130 108 V40 H230 V70" cls="steam" m={m} />
      </g>
      <MiniTurbine a={a} m={m} />
      <g data-part="feed" className={P('feed', a)}>
        <Arrow d="M220 156 V170 H190 V128 H184" cls="feed" m={m} />
      </g>
      <text x="70" y="206">yatay buhar üreteci</text>
    </svg>
  );
}

const MINI: Record<ReactorId, (p: { a: Active }) => JSX.Element> = { pwr: MiniPwr, bwr: MiniBwr, vver: MiniVver };
const NAME: Record<ReactorId, string> = { pwr: 'PWR', bwr: 'BWR', vver: 'VVER' };
const SUBTITLE: Record<ReactorId, string> = {
  pwr: 'temsili dikey buhar üreteçli tasarım',
  bwr: 'kaynar su reaktörü',
  vver: 'PWR ailesi, yatay buhar üreteçli',
};
const REACTORS: ReactorId[] = ['pwr', 'bwr', 'vver'];

const ROWS: { label: string; pwr: string; bwr: string; vver: string }[] = [
  {
    label: 'Buharın oluştuğu yer',
    pwr: 'Buhar üretecinin ikincil (gövde) tarafında. Birincil devrede normal çalışmada toplu kaynama yok.',
    bwr: 'Doğrudan reaktör kabında, çekirdekte kaynama ile.',
    vver: 'Yatay buhar üretecinin ikincil (gövde) tarafında. Birincil su basınç altında sıvı kalır.',
  },
  {
    label: 'Ayrı buhar üreteci',
    pwr: 'Var — dikey, U borulu (çevrim başına bir adet).',
    bwr: 'Yok. Ayırıcılar ve kurutucular kabın içindedir.',
    vver: 'Var — yatay, kolektörlü.',
  },
  {
    label: 'Birincil ve ikincil çevrim ilişkisi',
    pwr: 'İki ayrı çevrim; aralarında yalnız ısı geçer, akışkan karışmaz. Türbine ikincil buhar gider.',
    bwr: 'Tek (doğrudan) çevrim: reaktör suyunun buharı türbine gider; türbin tarafı da korumalı bölgedir.',
    vver: 'İki ayrı çevrim; aralarında yalnız ısı geçer. Türbine ikincil buhar gider.',
  },
  {
    label: 'Ayırt edici ekipman geometrisi',
    pwr: 'Basınçlandırıcı; yüksek ve dar dikey buhar üreteci; kare adımlı yakıt demetleri.',
    bwr: 'Çok büyük, ince duvarlı kap; jet pompaları ve devridaim döngüsü; kanal kutulu demetler.',
    vver: 'Uzun yatay buhar üreteci; dar-uzun kap; farklı kotlarda sıcak/soğuk kol; altıgen, üçgen adımlı demetler.',
  },
  {
    label: 'Gösterilen temsili kontrol çubuğu yerleşimi',
    pwr: 'Üstten giren çubuk kümeleri.',
    bwr: 'Alttan giren haç (cruciform) kesitli çubuklar (geleneksel BWR).',
    vver: 'Üst bloktan giren çubuk kümeleri.',
  },
  {
    label: 'Tasarıma göre değişebilen özellikler',
    pwr: 'Çevrim sayısı (2–4), güç, koruma yapısı tipi, buhar üreteci modeli.',
    bwr: 'Koruma yapısı (Mark I/II/III), jet pompalı ya da iç pompalı (ABWR) devridaim, doğal dolaşımlı tasarımlar (ESBWR).',
    vver: 'Model (VVER-440/213: 6 çevrim, VVER-1000: 4 çevrim ve sonrası), koruma yapısı, yakıt kanalı (kutulu/kutusuz).',
  },
];

interface Props {
  topicId: string | null;
  onTopic: (id: string | null) => void;
  /** Ana şemaya geçip konunun parçalarını vurgular. */
  onExplore: (reactor: ReactorId, topic: CompareTopic) => void;
  currentReactor: ReactorId;
}

function Sources({ ids }: { ids: string[] }) {
  return (
    <details className="cmp-sources">
      <summary>Kaynaklar ({ids.length})</summary>
      <ul>
        {ids.map((id) => {
          const s = getSource(id);
          return s ? (
            <li key={id}>
              <span className={`src-chip src-${s.kind}`}>{SOURCE_KIND_LABEL[s.kind]}</span> {formatSource(s)}
            </li>
          ) : null;
        })}
      </ul>
    </details>
  );
}

function ReactorCard({ r, topic, onExplore, currentReactor }: { r: ReactorId; topic: CompareTopic | null; onExplore: Props['onExplore']; currentReactor: ReactorId }) {
  const Mini = MINI[r];
  const side = topic?.sides[r];
  const active: Active = side ? new Set(side.mini) : null;
  return (
    <div className={`compare-card${topic ? ' has-topic' : ''}`}>
      <h3>
        {NAME[r]} — {SUBTITLE[r]}
      </h3>
      <Mini a={active} />
      {side && topic && (
        <div className="cmp-answer">
          <p className={`cmp-scope ${side.scope}`}>{side.scope === 'family' ? 'Reaktör ailesi geneli' : 'Çizilen temsili tasarım'}</p>
          <p>{side.text}</p>
          <Sources ids={side.sourceIds} />
          <button type="button" onClick={() => onExplore(r, topic)}>
            {NAME[r]} şemasında ayrıntılı incele
            {r !== currentReactor && <small> (reaktör değişir; simülasyon başa döner)</small>}
          </button>
        </div>
      )}
    </div>
  );
}

export function CompareView({ topicId, onTopic, onExplore, currentReactor }: Props) {
  const narrow = useViewLayout().layout === 'narrow';
  const topic = getCompareTopic(topicId);
  // Dar ekranda tek reaktör gösterilir (şemalar okunabilir boyutta); seçili konu reaktör geçişinde korunur.
  const [one, setOne] = useState<ReactorId>(currentReactor);
  const shown = narrow ? [one] : REACTORS;
  return (
    <div className="compare">
      <h2>Karşılaştırma</h2>
      <p>
        VVER de PWR ailesindendir. Mini şemalar temsili ve ölçeksizdir. Bir konu seçin: üç reaktörde ilgili parçalar kalın çizgi ve kesikli çerçeveyle vurgulanır, diğerleri geri plana alınır.
        Oklarda renk ve çizgi deseni birlikte kullanılır: düz = sıcak/soğuk su, kesikli = buhar, noktalı = besleme suyu.
      </p>
      <div className="cmp-topics" role="group" aria-label="Karşılaştırma konusu">
        {COMPARE_TOPICS.map((t) => (
          <button key={t.id} type="button" aria-pressed={topicId === t.id} onClick={() => onTopic(topicId === t.id ? null : t.id)}>
            {t.label}
          </button>
        ))}
      </div>
      {topic && (
        <p className="cmp-question" aria-live="polite">
          <strong>{topic.question}</strong> <span>“Reaktör ailesi geneli” ilkeyi, “Çizilen temsili tasarım” bu uygulamadaki şemaya özgü düzeni anlatır; gerçek tesisler arasında değişebilir.</span>
        </p>
      )}
      {narrow && (
        <div className="seg cmp-one" role="group" aria-label="Gösterilen reaktör">
          {REACTORS.map((r) => (
            <button key={r} type="button" aria-pressed={one === r} className={one === r ? 'on' : ''} onClick={() => setOne(r)}>
              {NAME[r]}
            </button>
          ))}
        </div>
      )}
      <div className="compare-cards">
        {shown.map((r) => (
          <ReactorCard key={r} r={r} topic={topic} onExplore={onExplore} currentReactor={currentReactor} />
        ))}
      </div>
      <details className="table-details" open={!topic}>
        <summary>Tüm farklar tablosu</summary>
        <div className="table-wrap">
          <table className="compare-table">
            <caption className="sr-only">PWR, BWR ve VVER karşılaştırma tablosu</caption>
            <thead>
              <tr>
                <th scope="col">Başlık</th>
                <th scope="col">PWR — temsili dikey buhar üreteçli tasarım</th>
                <th scope="col">BWR</th>
                <th scope="col">VVER (PWR ailesi)</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((r) => (
                <tr key={r.label}>
                  <th scope="row">{r.label}</th>
                  <td>{r.pwr}</td>
                  <td>{r.bwr}</td>
                  <td>{r.vver}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
}
