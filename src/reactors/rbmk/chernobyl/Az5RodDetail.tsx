import { AZ5_TIME } from './timeline';
import { stateAt } from './curves';
export function Az5RodDetail({ time }: { time: number }) {
  const s = stateAt(time);
  const dy = (s.rodDrawing ?? 0) * 210;
  return <section className="acc-card"><h3>1986 çubuk tasarımı · {time < AZ5_TIME ? 'başlangıç konumu' : 'girişin ilk bölümü'}</h3>
    <svg viewBox="0 0 500 320" role="img" aria-label="Soğurucu üstte, arada su dolu teleskop bölgesi, grafit yer değiştirici çekirdek ortasında ve altında su. Girişte grafit alt su bölgesine ilerler.">
      <rect x="60" y="65" width="180" height="220" fill="var(--metal-light)" stroke="currentColor" strokeDasharray="5 4" />
      <rect x="125" y="65" width="45" height="220" fill="var(--feed)" stroke="currentColor" />
      <g transform={`translate(0 ${dy})`}>
        <rect x="128" y="5" width="39" height="60" fill="var(--rod)" stroke="var(--metal-dark)" />
        <path d="M147 65 V104" stroke="currentColor" strokeWidth="3" strokeDasharray="4 3" />
        <rect x="128" y="104" width="39" height="142" fill="var(--metal-dark)" stroke="currentColor" />
      </g>
      <path d="M188 25 V60 l-6-8 m6 8 l6-8" fill="none" stroke="currentColor" strokeWidth="2" />
      <text x="260" y="35">Soğurucu bölüm</text><text x="260" y="85">Su dolu ara bölge</text><text x="260" y="155">Grafit yer değiştirici</text><text x="260" y="260">Alt su bölgesi</text>
      <text x="60" y="310">Kesikli sınır: aktif çekirdek · ölçüler temsili</text>
    </svg>
    <p>{s.rodDrawing === null ? 'Bu noktadan sonra gerçek çubuk konumu çizilmiyor; başlangıç geometrisi gösteriliyor.' : time < AZ5_TIME ? 'Tamamen çekilmiş konum: grafitin iki ucunda su bulunur.' : 'Grafit aşağı inerken alt bölgedeki suyun yerini alır; soğurucu üstten girerken alt bölgede yerel pozitif reaktivite oluşabilir.'}</p>
    <p>Bu çizim yalnız girişin başlangıcını açıklar; tam kapatma hareketi veya gerçek çubuk konumu ölçümü değildir.</p>
  </section>;
}
