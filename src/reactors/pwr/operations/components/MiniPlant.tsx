import type { PlantPart, PlantView } from '../types';

interface Props {
  view: PlantView;
  highlight?: PlantPart[];
  /** Erişilebilir açıklama. */
  label: string;
}

/**
 * İşletme modülü için sade, temsili PWR şeması (santral sahnesinden bağımsız çizim).
 * Durum bilgisi yalnız `view` alanlarından gelir; metin ile şema aynı veriyi kullanır.
 */
export function MiniPlant({ view, highlight = [], label }: Props) {
  const hl = (p: PlantPart) => (highlight.includes(p) ? ' mp-hl' : '');
  const primaryOn = view.rcpRunning;
  // Çubuk alt ucu: çekilmişken çekirdeğin üstünde (y=104), tamamen içeride çekirdek tabanında (y=212).
  const rodBottom = 104 + view.rodInsertion * 108;
  const pzrTop = 44;
  const pzrH = 104;
  const waterTop = pzrTop + pzrH * (1 - view.pzrWater);
  return (
    <svg viewBox="0 0 660 360" className="mini-plant" role="img" aria-label={label}>
      {/* Birincil döngü */}
      <path className={`mp-pipe ${primaryOn ? 'hot' : 'idle'}`} d="M150 112 H250 V96" />
      <path className={`mp-pipe ${primaryOn ? 'cold' : 'idle'}`} d="M290 222 V262 H222" />
      <path className={`mp-pipe ${primaryOn ? 'cold' : 'idle'}`} d="M178 262 H162 V212 H150" />
      {/* RHR döngüsü */}
      <g className={`mp-rhr${view.rhrRunning ? ' on' : ''}${hl('rhr')}`}>
        <path className={`mp-pipe ${view.rhrRunning ? 'hot' : 'idle'} thin`} d="M70 190 H44 V322 H96" />
        <path className={`mp-pipe ${view.rhrRunning ? 'cold' : 'idle'} thin`} d="M182 322 H300 V270" />
        <circle className="mp-pump" cx="110" cy="322" r="12" />
        <rect className={`mp-hx${view.rhrRunning && !view.rhrHxBypassed ? ' active' : ''}`} x="136" y="310" width="42" height="24" rx="3" />
        {view.rhrHxBypassed && <path className="mp-bypass" d="M124 322 Q157 292 182 322" />}
        <text className="mp-label" x="44" y="352">
          RHR {view.rhrRunning ? (view.rhrHxBypassed ? '· ısı değiştirici atlatıldı (ısı atılmıyor)' : '· çalışıyor, ısı değiştiriciden ısı atılıyor') : '· durdu'}
        </text>
      </g>
      {/* Reaktör kabı */}
      <g className={`mp-vessel${hl('core')}`}>
        <rect className="mp-wall" x="70" y="70" width="80" height="170" rx="30" />
        <rect className={`mp-core${view.fission ? ' fission' : ''}`} x="88" y="150" width="44" height="66" />
        <text className="mp-label small" x="110" y="232" textAnchor="middle">
          {view.fission ? 'fisyon var' : 'fisyon yok'}
        </text>
        <text className="mp-label small" x="110" y="270" textAnchor="middle">
          {view.fission ? '' : 'artık ısı sürüyor'}
        </text>
      </g>
      <g className={`mp-head${view.headOn ? '' : ' off'}${hl('head')}`}>
        <path className="mp-wall" d={view.headOn ? 'M70 80 Q110 40 150 80 Z' : 'M70 34 Q110 -6 150 34 Z'} />
        {!view.headOn && (
          <text className="mp-label" x="160" y="22">
            kapak kaldırıldı
          </text>
        )}
      </g>
      <g className={`mp-rods${hl('rods')}`}>
        {[94, 106, 118, 128].map((x) => (
          <rect key={x} className="mp-rod" x={x} y={rodBottom - 100} width="4" height="100" />
        ))}
        <text className="mp-label" x="40" y="60" textAnchor="middle">
          çubuklar
        </text>
        <text className="mp-label small" x="40" y="74" textAnchor="middle">
          %{Math.round(view.rodInsertion * 100)} içeride
        </text>
      </g>
      {/* Basınçlandırıcı */}
      <g className={`mp-pzr${hl('pzr')}`}>
        <rect className="mp-wall" x="186" y={pzrTop} width="30" height={pzrH} rx="14" />
        <rect className="mp-steam" x="189" y={pzrTop + 3} width="24" height={Math.max(0, waterTop - pzrTop - 3)} />
        <rect className="mp-water" x="189" y={waterTop} width="24" height={pzrTop + pzrH - waterTop - 3} />
        <path className="mp-pipe idle thin" d="M201 148 V112" />
        <text className="mp-label" x="201" y="34" textAnchor="middle">
          basınçlandırıcı
        </text>
        <text className="mp-label small" x="182" y={pzrTop + 20} textAnchor="end">
          {view.pzrWater >= 0.99 ? 'su dolu' : 'buhar'}
        </text>
      </g>
      <path className={`mp-heaters${view.pzrHeaters ? ' on' : ''}${hl('pzr-heaters')}`} d="M192 140 l3 -6 l3 6 l3 -6 l3 6 l3 -6 l3 6 l3 -6" />
      {/* Buhar üreteci */}
      <g className={`mp-sg${view.sgActive ? ' active' : ''}${hl('sg')}`}>
        <rect className="mp-wall" x="250" y="40" width="40" height="190" rx="18" />
        <rect className={`mp-sec${hl('sg-level')}`} x="254" y="96" width="32" height="124" />
        <path className="mp-utube" d="M262 222 V120 A8 8 0 0 1 278 120 V222" />
        <text className="mp-label" x="298" y="150">
          buhar
        </text>
        <text className="mp-label" x="298" y="166">
          üreteci
        </text>
      </g>
      {/* Pompa */}
      <g className={`mp-rcp${view.rcpRunning ? ' on' : ''}${hl('rcp')}`}>
        <circle className="mp-pump" cx="200" cy="262" r="16" />
        <text className="mp-label" x="200" y="294" textAnchor="middle">
          birincil pompa
        </text>
        <text className="mp-label small" x="200" y="307" textAnchor="middle">
          {view.rcpRunning ? 'çalışıyor' : 'durdu'}
        </text>
      </g>
      {/* İkincil: buhar hattı, türbin, jeneratör, steam dump, kondenser */}
      <path className={`mp-pipe ${view.sgActive ? 'steam' : 'idle'}`} d="M270 40 V20 H420 V58" />
      <path className={`mp-pipe ${view.steamDump ? 'steam' : 'idle'} thin${hl('dump')}`} d="M380 20 V190 H420" />
      <text className={`mp-label${view.steamDump ? '' : ' muted'}`} x="374" y="176" textAnchor="end">
        steam dump{view.steamDump ? ' · açık' : ''}
      </text>
      <g className={`mp-turbine${hl('turbine')}`}>
        <path className="mp-casing" d="M420 58 L490 44 V120 L420 106 Z" />
        <text className="mp-label" x="455" y="138" textAnchor="middle">
          türbin
        </text>
      </g>
      <g className={`mp-gen${view.turbine === 'generating' ? ' on' : ''}${hl('generator')}`}>
        <rect className="mp-wall" x="510" y="60" width="64" height="44" rx="5" />
        <line className="mp-shaft" x1="490" x2="510" y1="82" y2="82" />
        <text className="mp-label" x="542" y="124" textAnchor="middle">
          jeneratör
        </text>
        <text className={`mp-state ${view.turbine === 'generating' ? 'on' : 'off'}`} x="542" y="88" textAnchor="middle">
          {view.turbine === 'generating' ? 'üretim var' : 'üretim yok'}
        </text>
      </g>
      <g className={`mp-cond${hl('condenser')}`}>
        <rect className="mp-wall" x="420" y="160" width="120" height="56" rx="6" />
        <text className="mp-label" x="480" y="234" textAnchor="middle">
          kondenser
        </text>
      </g>
      <path className={`mp-pipe ${view.sgActive ? 'feed' : 'idle'} thin`} d="M440 216 V262 H330 V206 H290" />
    </svg>
  );
}
