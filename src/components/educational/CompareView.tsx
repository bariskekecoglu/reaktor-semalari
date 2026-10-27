/** Üç reaktörün sadeleştirilmiş, birbirinden farklı mini şemaları ve karşılaştırma tablosu. */

const Arrow = ({ d, cls }: { d: string; cls: string }) => <path d={d} className={`mini-flow ${cls}`} markerEnd="url(#mini-arrow)" />;

function MiniDefs() {
  return (
    <defs>
      <marker id="mini-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
        <path d="M0 0 L10 5 L0 10 z" fill="#333" />
      </marker>
    </defs>
  );
}

function MiniPwr() {
  return (
    <svg viewBox="0 0 320 210" className="mini" role="img" aria-label="PWR mini şema: reaktör, dikey buhar üreteci, ayrı ikincil devre ve türbin">
      <MiniDefs />
      <path d="M10 200 V80 A90 60 0 0 1 190 80 V200" className="containment" strokeWidth={6} />
      <rect x="30" y="100" width="40" height="80" rx="16" className="vessel-wall" />
      <rect x="38" y="130" width="24" height="40" className="core-zone" />
      <rect x="44" y="84" width="4" height="40" className="control-rod" />
      <rect x="54" y="84" width="4" height="40" className="control-rod" />
      <rect x="85" y="80" width="18" height="50" rx="9" className="vessel-wall" />
      <path d="M130 180 V100 L122 88 V60 A18 10 0 0 1 158 60 V88 L150 100 V180 Z" className="sg-shell" />
      <path d="M134 178 V112 A6 6 0 0 1 146 112 V178" className="u-tube" />
      <Arrow d="M70 120 H120 V170 H130" cls="hot" />
      <Arrow d="M150 185 V195 H60 V180" cls="cold" />
      <Arrow d="M140 50 V30 H230 V70" cls="steam" />
      <path d="M215 70 L245 62 V98 L215 90 Z" className="casing" />
      <rect x="255" y="68" width="40" height="24" className="generator" />
      <rect x="210" y="120" width="60" height="34" className="shell" fill="#eef0f2" stroke="#333" />
      <Arrow d="M240 100 V118" cls="steam" />
      <Arrow d="M220 156 V170 H175 V120 H158" cls="feed" />
      <text x="100" y="206">birincil</text>
      <text x="220" y="175">ikincil</text>
    </svg>
  );
}

function MiniBwr() {
  return (
    <svg viewBox="0 0 320 210" className="mini" role="img" aria-label="BWR mini şema: büyük reaktör kabında kaynama, buhar doğrudan türbine">
      <MiniDefs />
      <rect x="40" y="30" width="80" height="165" rx="26" className="vessel-wall" />
      <rect x="44" y="40" width="72" height="40" className="steam-zone" />
      <rect x="44" y="80" width="72" height="105" className="water-zone" />
      <rect x="58" y="110" width="44" height="50" className="core-zone" />
      {[64, 76, 88].map((x) => (
        <circle key={x} cx={x + 4} cy={98} r={3} className="p p-bubble" />
      ))}
      <rect x="62" y="160" width="4" height="45" className="control-rod" />
      <rect x="92" y="160" width="4" height="45" className="control-rod" />
      <path d="M50 68 h60" className="dryer" />
      <Arrow d="M120 50 H230 V70" cls="steam" />
      <path d="M215 70 L245 62 V98 L215 90 Z" className="casing" />
      <rect x="255" y="68" width="40" height="24" className="generator" />
      <rect x="210" y="120" width="60" height="34" fill="#eef0f2" stroke="#333" />
      <Arrow d="M240 100 V118" cls="steam" />
      <Arrow d="M220 156 V172 H140 V100 H122" cls="feed" />
      <text x="128" y="44">buhar doğrudan türbine</text>
      <text x="150" y="200">tek çevrim · alttan çubuk</text>
    </svg>
  );
}

function MiniVver() {
  return (
    <svg viewBox="0 0 320 210" className="mini" role="img" aria-label="VVER mini şema: reaktör, yatay buhar üreteci, ayrı ikincil devre">
      <MiniDefs />
      <path d="M10 200 V80 A95 60 0 0 1 200 80 V200" className="containment" strokeWidth={6} />
      <rect x="30" y="100" width="30" height="85" rx="12" className="vessel-wall" />
      <rect x="35" y="135" width="20" height="40" className="core-zone" />
      <rect x="40" y="70" width="3" height="40" className="control-rod" />
      <rect x="48" y="70" width="3" height="40" className="control-rod" />
      <path d="M95 110 H165 A18 18 0 0 1 165 146 H95 A18 18 0 0 1 95 110 Z" className="sg-shell" />
      <line x1="85" x2="175" y1="134" y2="134" className="h-tube" />
      <line x1="85" x2="175" y1="140" y2="140" className="h-tube" />
      <rect x="112" y="116" width="8" height="40" className="collector" />
      <rect x="140" y="116" width="8" height="40" className="collector cold" />
      <Arrow d="M60 120 H90 V160 H112" cls="hot" />
      <Arrow d="M148 160 V180 H60" cls="cold" />
      <Arrow d="M130 108 V40 H230 V70" cls="steam" />
      <path d="M215 70 L245 62 V98 L215 90 Z" className="casing" />
      <rect x="255" y="68" width="40" height="24" className="generator" />
      <rect x="210" y="120" width="60" height="34" fill="#eef0f2" stroke="#333" />
      <Arrow d="M240 100 V118" cls="steam" />
      <Arrow d="M220 156 V170 H190 V128 H184" cls="feed" />
      <text x="70" y="206">yatay buhar üreteci</text>
    </svg>
  );
}

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

export function CompareView() {
  return (
    <div className="compare">
      <h2>Karşılaştırma</h2>
      <p>
        VVER de PWR ailesindendir. Aşağıdaki mini şemalar temsili ve ölçeksizdir; her biri ilgili reaktörün ayırt edici düzenini gösterir. Oklarda renk + çizgi deseni aynıdır: kırmızı düz = sıcak
        su, mavi düz = soğuk su, gri kesikli = buhar, noktalı = besleme suyu.
      </p>
      <div className="compare-cards">
        <div className="compare-card">
          <h3>PWR — temsili dikey buhar üreteçli tasarım</h3>
          <MiniPwr />
        </div>
        <div className="compare-card">
          <h3>BWR — kaynar su reaktörü</h3>
          <MiniBwr />
        </div>
        <div className="compare-card">
          <h3>VVER — PWR ailesi, yatay buhar üreteçli</h3>
          <MiniVver />
        </div>
      </div>
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
    </div>
  );
}
