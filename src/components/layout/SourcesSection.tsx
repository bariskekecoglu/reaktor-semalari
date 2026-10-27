export function SourcesSection() {
  return (
    <footer className="sources">
      <details>
        <summary>Kaynaklar ve varsayımlar</summary>
        <div className="sources-grid">
          <section>
            <h3>Teknik kaynaklar</h3>
            <ul>
              <li>
                U.S. NRC — Student Corner, Unit 3: Nuclear Reactors &amp; Energy Generation (PWR/BWR temel farkları):{' '}
                <a href="https://www.nrc.gov/education-regulatory-research/the-student-corner/unit-3-nuclear-reactorsenergy-generation" target="_blank" rel="noreferrer">
                  nrc.gov
                </a>
              </li>
              <li>
                U.S. NRC — Boiling Water Reactors (BWR çalışma akışı):{' '}
                <a href="https://www.nrc.gov/reactors/power/bwrs" target="_blank" rel="noreferrer">
                  nrc.gov/reactors/power/bwrs
                </a>
              </li>
              <li>
                N. Trunov ve ark., VVER tasarım özellikleri (IAEA yayını, P1500):{' '}
                <a href="https://www-pub.iaea.org/MTCD/Publications/PDF/P1500_CD_Web/htm/pdf/plenary/10KS_N.%20Trunov_PM.pdf" target="_blank" rel="noreferrer">
                  www-pub.iaea.org
                </a>
              </li>
              <li>Nuc E 430 ders notları, Bölüm 2 (PWR, BWR ve VVER sistemleri) — basınç değerleri, basınçlandırıcı, U borulu ve yatay buhar üreteçleri, alttan giren BWR çubukları, jet pompaları, VVER üçgen adımlı yakıt.</li>
            </ul>
          </section>
          <section>
            <h3>Kullanılan sayılar ve kaynakları</h3>
            <ul>
              <li>PWR birincil basıncı ≈ 2250 psia (~155 bar) ve BWR basıncı ≈ 1050 psia (~70 bar): Nuc E 430 Bölüm 2.</li>
              <li>Basınçlandırıcı ≈ %60 su / %40 buhar: Nuc E 430 Bölüm 2.</li>
              <li>LWR ısı çevrimi verimi ≈ %33: Nuc E 430 Bölüm 2. Uygulamadaki tek verim varsayımıdır ve her güçte sabit tutulmuştur.</li>
              <li>VVER-1000 dört çevrimli, VVER-440/213 altı çevrimli; sıcak ve soğuk kollar kaba farklı kotlarda bağlanır; yakıt üçgen adımlı (altıgen demet): Nuc E 430 Bölüm 2.</li>
              <li>3000 dev/dk: 50 Hz şebekede iki kutuplu senkron jeneratör için f × 60 / kutup çifti bağıntısından. Bazı büyük nükleer türbinler dört kutuplu jeneratörle 1500 dev/dk çalışır.</li>
            </ul>
          </section>
          <section>
            <h3>Eğitim modeli varsayımları</h3>
            <ul>
              <li>Tüm göstergeler nominal ısıl güce göre normalize edilmiş temsili değerlerdir; MW, sıcaklık veya basınç hesabı yapılmaz.</li>
              <li>Isıl güç hedefe birinci dereceden gecikmeyle (τ ≈ 5 s), buhar/elektrik ek gecikmeyle (τ ≈ 2 s) yaklaşır. Bu, doğrulanmış bir nötron kinetiği veya termal-hidrolik model değildir.</li>
              <li>Kontrol çubuğu konumu güçle doğrusal eşlenmez: dengedeki konum güce zayıf ve doğrusal olmayan biçimde bağlıdır; güç değişirken geçici bir sapma eklenir.</li>
              <li>Akış işaretlerinin hızı, nötronların hareketi ve çizim boyutları ölçekli değildir. PWR/VVER birincil debisi sabit gösterilir; buhar ve besleme suyu debisi güçle artar.</li>
              <li>Kapsam normal çalışmadır; kaza senaryoları, güvenlik sistemleri ve işletme prosedürleri içermez.</li>
            </ul>
          </section>
        </div>
      </details>
    </footer>
  );
}
