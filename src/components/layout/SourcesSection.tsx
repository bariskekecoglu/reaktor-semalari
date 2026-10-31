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
              <li>
                RBMK: IAEA INSAG-7 (1992) §2.2, 2.6, 2.8–2.10 —{' '}
                <a href="https://www-pub.iaea.org/MTCD/publications/PDF/Pub913e_web.pdf" target="_blank" rel="noreferrer">
                  www-pub.iaea.org
                </a>
                ; OECD NEA, Chernobyl Bölüm I —{' '}
                <a href="https://oecd-nea.org/jcms/pl_28271/chernobyl-chapter-i-the-site-and-accident-sequence" target="_blank" rel="noreferrer">
                  oecd-nea.org
                </a>
                ; IAEA BPTC Modül IV, s. 12–13 —{' '}
                <a href="https://gnssn.iaea.org/main/bptc/BPTC%20Module%20Documents/Module04%20Design%20of%20a%20nuclear%20reactor.pdf" target="_blank" rel="noreferrer">
                  gnssn.iaea.org
                </a>
                .
              </li>
              <li>
                CANDU: Zhang &amp; Shalaby (AECL), Qinshan Phase III CANDU 6 —{' '}
                <a href="https://ww.nuceng.ca/canteach-rev2/library/20054402.pdf" target="_blank" rel="noreferrer">
                  CANTEACH
                </a>
                ; CANDU Fundamentals Bölüm 11 ve 14 —{' '}
                <a href="https://ww.nuceng.ca/canteach-rev2/library/20040711.pdf" target="_blank" rel="noreferrer">
                  Bölüm 11
                </a>
                ,{' '}
                <a href="https://ww.nuceng.ca/canteach-rev2/library/20040714.pdf" target="_blank" rel="noreferrer">
                  Bölüm 14
                </a>
                ; CNSC “Pressure tubes” —{' '}
                <a href="https://www.cnsc-ccsn.gc.ca/eng/resources/fact-sheets/pressure-tubes.cfm" target="_blank" rel="noreferrer">
                  cnsc-ccsn.gc.ca
                </a>
                .
              </li>
            </ul>
          </section>
          <section>
            <h3>Kullanılan sayılar ve kaynakları</h3>
            <ul>
              <li>PWR birincil basıncı ≈ 2250 psia (~155 bar) ve BWR basıncı ≈ 1050 psia (~70 bar): Nuc E 430 Bölüm 2.</li>
              <li>Basınçlandırıcı ≈ %60 su / %40 buhar: Nuc E 430 Bölüm 2.</li>
              <li>LWR ısı çevrimi verimi ≈ %33: Nuc E 430 Bölüm 2. Uygulamadaki tek verim varsayımıdır ve her güçte sabit tutulmuştur.</li>
              <li>VVER-1000 dört çevrimli, VVER-440/213 altı çevrimli; sıcak ve soğuk kollar kaba farklı kotlarda bağlanır; yakıt üçgen adımlı (altıgen demet): Nuc E 430 Bölüm 2.</li>
              <li>
                RBMK-1000 (INSAG-7, 1986 durumu): iki bağımsız çevrim, her biri çekirdeğin yarısını soğutur; çevrim başına 4 pompa (3 çalışır + 1 yedek) ve 2 yatay ayırıcı tambur;
                çekirdek ~7 m yükseklik, ~11,8 m çap; 24 kısaltılmış çubuk alttan girer. NEA: 211 kontrol çubuğu; yakıt ~%2 zenginleştirilmiş UO₂ (IAEA BPTC de ~%2 verir).
              </li>
              <li>
                CANDU 6 (Qinshan III, AECL): 380 yatay kanal, kanal başına 12 demet, 37 elemanlı doğal UO₂ demeti; iki halka, her halkada 2 buhar üreteci, 2 pompa, 2 giriş + 2 çıkış
                kolektörü; komşu kanallarda ters akış, “sekiz” biçimli halka. Gaz halkası CO₂ (CANDU Fundamentals Bölüm 11).
              </li>
              <li>3000 dev/dk: 50 Hz şebekede iki kutuplu senkron jeneratör için f × 60 / kutup çifti bağıntısından. Bazı büyük nükleer türbinler dört kutuplu jeneratörle 1500 dev/dk çalışır.</li>
            </ul>
          </section>
          <section>
            <h3>Eğitim modeli varsayımları</h3>
            <ul>
              <li>Tüm göstergeler nominal ısıl güce göre normalize edilmiş temsili değerlerdir; MW, sıcaklık veya basınç hesabı yapılmaz.</li>
              <li>Isıl güç hedefe birinci dereceden gecikmeyle (τ ≈ 5 s), buhar/elektrik ek gecikmeyle (τ ≈ 2 s) yaklaşır. Bu, doğrulanmış bir nötron kinetiği veya termal-hidrolik model değildir.</li>
              <li>
                Enerji hesabı (temsili): elektrik = buhar × %33; kondenserde atılan ısı = buhar − elektrik; depolama hızı = ısıl − buhar. Böylece her an buhar = elektrik + atılan ısı ve ısıl
                = elektrik + atılan ısı + depolama hızı. Depolama hızı bir enerji miktarı değil, nominal güce göre değişim hızıdır: pozitifse sistemde enerji birikir (güç artışı), negatifse
                depolanmış enerji geri verilir (güç düşüşü); kararlı durumda sıfırdır.
              </li>
              <li>Kontrol çubuğu konumu güçle doğrusal eşlenmez: dengedeki konum güce zayıf ve doğrusal olmayan biçimde bağlıdır; güç değişirken geçici bir sapma eklenir.</li>
              <li>Akış işaretlerinin hızı, nötronların hareketi ve çizim boyutları ölçekli değildir. PWR/VVER birincil debisi sabit gösterilir; buhar ve besleme suyu debisi güçle artar.</li>
              <li>
                RBMK ve CANDU şemaları temsili sadeleştirmedir: RBMK’de iki çevrimden biri, 5 yakıt + 2 kontrol kanalı, tek tambur ve tek pompa; CANDU’da iki halkadan biri ve 4 kanal
                çizildi. CANDU kolektörleri yan görünüşte daire (uç görünüş) olarak gösterilir; besleyicilerin üst üste geçtiği yerler köprüyle çizilir ve birleşme değildir.
                Basınçlandırıcının ve moderatör sisteminin bağlantı yerleri temsilidir. CANDU 6’da birincil ağır suda sınırlı kaynama olabilir; animasyon bu iki fazlı davranışı modellemez
                (CANTEACH, Heat Transport System Thermalhydraulics, §3.3). Türbine giden buhar ayrı ikincil devrede oluşur. Aynı normalize eğitim modeli kullanılır; RBMK veya CANDU fiziği (ör. boşluk katsayısı) modellenmez.
              </li>
              <li>Kapsam normal çalışmadır; kaza senaryoları, güvenlik sistemleri ve işletme prosedürleri içermez. RBMK’nin tarihsel güvenlik özellikleri yalnız dönem ve kaynak belirtilerek anılır.</li>
            </ul>
          </section>
        </div>
      </details>
    </footer>
  );
}
