# Nükleer Santral Şemaları — PWR · BWR · VVER

PWR, BWR ve VVER reaktörlerini **ayrı tasarlanmış**, animasyonlu teknik kesit şemalarıyla anlatan Türkçe eğitim uygulaması. React + TypeScript + SVG; backend ve çalışma zamanında internet gerektirmez.

## Kurulum ve komutlar

```bash
npm install
npm run dev        # geliştirme sunucusu (http://localhost:5173)
npm run typecheck  # TypeScript strict tür kontrolü
npm test           # Vitest birim testleri
npm run build      # tür kontrolü + production build (dist/)
npm run preview    # build çıktısını yerelde sun
```

Bağımlılıklar yalnızca `react`, `react-dom` ve geliştirme araçlarıdır (`vite`, `@vitejs/plugin-react`, `typescript`, `vitest`, tip paketleri).

## Özellikler

- **Üç ayrı sahne** (her biri kendi geometrisi, boru bağlantıları, akış yolları, etkileşim noktaları ve dersleriyle):
  - **PWR** — koruma yapısı içinde kap, basınçlandırıcı, dikey U borulu buhar üreteci (ayırıcı/kurutucu, boru levhası, bölme plakası), sıcak/soğuk kol, birincil pompa; ayrı ikincil devre ve soğutma suyu çevrimi.
  - **BWR** — büyük kap odaklı tek çevrim: çekirdekte kaynama, standpipe + siklon ayırıcılar, şevron kurutucular, buhar kubbesi, downcomer, jet pompaları, dış devridaim döngüsü, alttan giren haç kesitli çubuklar, korumalı türbin binası. Buhar üreteci ve basınçlandırıcı yoktur.
  - **VVER** — PWR ailesinden; dar/uzun kap ve yüksek üst blok, farklı kotlarda sıcak/soğuk kol, sıcak/soğuk kolektörlü **yatay buhar üreteci**, ana sirkülasyon pompası; görünür “temsili şema / tek çevrim sadeleştirmesi” notu.
- **Yakın planlar**: PWR buhar üreteci ve basınçlandırıcı; BWR ayırıcı-kurutucu ve kap içi bölgeler; VVER yatay buhar üreteci ve dikey/yatay üreteç karşılaştırması; her reaktöre ayrı çekirdek yakın planı (VVER’de altıgen, üçgen adımlı demetler; BWR’de kanal kutuları + haç kesitli çubuk) ve temsili nötronlar (fisyon / soğurulma).
- **Etkileşim**: ekipmana tıklama veya Tab + Enter ile seçim; görev, bu reaktörde çalışma biçimi, bağlantılı hatların vurgusu, yakın plan. Vurgu renge ek olarak kesikli çerçeve ve kalın çizgiyle gösterilir.
- **Reaktöre özgü odaklar** (ör. “Buhar nerede oluşuyor?”, “İki devre neden ayrı?”, “Kolektör ve boru demeti”).
- **Adım adım anlatım**: her reaktör için ayrı ders akışı, önceki/sonraki.
- **Karşılaştırma görünümü**: üç farklı mini şema + karşılaştırma tablosu.
- **Kontroller**: oynat/duraklat, sıfırla, 0.5×/1×/2× hız, %20–100 “Eğitim senaryosu: göreli güç”, etiketleri/akış işaretlerini göster-gizle, çekirdek yakın planı, yakınlaştırma/sığdırma/sürükleyerek kaydırma.
- **Grafikler**: enerji dönüşümü (nükleer → ısı → buhar → mekanik → elektrik; buhar ayrıca kondenserde atılan ısıya ayrılır; güç değişirken ayrı, işaretli “depolama hızı” göstergesi) ve son 60 simülasyon saniyesinin zaman grafiği.
- **Yakın plan penceresi**: yerel `<dialog>` + `showModal()`; arka plan fare ve klavyeye kapalı, Tab/Shift+Tab pencere içinde döner, Esc ve Kapat ile kapanır, odak açan kontrole döner, sayfa kaydırması konumu korunarak kilitlenir.
- **VVER boruları**: yatay buhar üretecindeki her U borusu sıcak kolektörden çıkıp soğuk kolektörde biter; boru çizimi ve parçacık yolu aynı tanımdan (`src/reactors/vver/hsgGeometry.ts`) üretilir. Yan görünüşte borunun öteki kolektörün arkasından geçtiği kısım kesikli çizilir (temsili sadeleştirme).
- **Arayüzde “Kaynaklar ve varsayımlar”** bölümü (sayfa altı).
- Mobilde yan panel alta iner, şema kendi alanında kaydırılır; sayfada yatay taşma yoktur. `prefers-reduced-motion` açıksa animasyon duraklatılmış başlar.

## PWR · İşletme ve Reaktör Davranışı modülü

PWR seçiliyken başlığın altındaki **Santral şeması / İşletme ve davranış** düğmeleriyle açılır. BWR ve VVER’de görünmez; reaktör veya görünüm değişince santral şemasına döner. Ayrı bir JS parçası olarak yüklenir (`PwrOperations-*.js`); yeni rota veya yönlendirme yoktur, GitHub Pages yapılandırması aynıdır.

Ana kaynak: Nuc E 430 ders notları, Bölüm 2, **“2.5 PWR Reactor Operations”, s. 2-88 – 2-101** (BWR bölümü 2-102’de başlar ve dahil edilmedi). Bu aralıkta PDF sayfa sırası basılı numarayla aynıdır (PDF s. 88 = 2-88). PDF ve sayfa görüntüleri depoya ya da yayımlanan siteye eklenmedi; şekiller özgün SVG olarak yeniden çizildi.

| Bölüm | İçerik | Kaynak |
| --- | --- | --- |
| 1. İşletme modları | Altı mod; temsili PWR görünümü, fisyon gücü ve artık ısı ayrı, türbin durumu, soğutma yolu (RCP + buhar üreteci ya da RHR), çubuk ve kap kapağı | Tablo 2-14 (s. 2-88), s. 2-88 – 2-89 |
| 2. Isınma ve ısı uzaklaştırma | Altı kavramsal aşama; ısı kaynakları/alıcıları, basınçlandırıcıda buhar hacmi (çekirdekte kaynama değil), pompa ısısı, steam dump | s. 2-89 – 2-93 |
| 3. Bor ve yakıt çevrimi | Yanma ekseninde bor eğrisi; imleç/klavye ile gezinme, bölgeye göre açıklama | Şekil 2-39 (s. 2-94), s. 2-93 |
| 4. Yük takibi ve ksenon | Sabit yük + beş profil (24 sa) ve %25/50/75/100’den kapatma (100 sa); güç, I-135/Xe-135, ksenon etkisi; oynat/duraklat/sıfırla, zaman çizgisi, olay işaretleri | Şekil 2-40 (s. 2-95), Şekil 2-41 (s. 2-96), s. 2-94 |
| 5. Eksenel güç dağılımı | Çekirdek kesiti, güç/ksenon profilleri, üst/alt dedektör, ΔI ve AO, güç–ΔI düzlemi; 0/3/9/12/18/24 sa durakları ve aynı güçte farklı dağılım | Şekil 2-42 (s. 2-100), Şekil 2-43 (s. 2-101), s. 2-96 – 2-98 |
| 6. Otomatik kontrol ilişkileri | Beş eşleşme + eksenel dağılımın tek bir otomatik değişkene indirgenemeyişi | s. 2-96 – 2-98 |

### Bilgi kategorileri (arayüzde rozet olarak)

1. **PDF’de doğrudan verilen**: Tablo 2-14 hücreleri, soğutma yolları, ısınma anlatımı, ΔI tanımı, kontrol listesi.
2. **Şekilden yaklaşık okunmuş** (`src/reactors/pwr/operations/data/figures.ts`):
   - Şekil 2-39: PDF’teki **vektör çizimin** koordinatlarından eksen ölçeğine çevrilen 32 nokta.
   - Şekil 2-40: raster görüntüden piksel ölçümüyle dönüm noktaları (±~0,1 sa). **12-3-6-3 dışındaki profillerde çizim isimdeki sürelerle tam örtüşmüyor** (ör. “18-6” çiziminde %50 güç yalnız ~11–13. saatler arasında ve dikey çizgiyle). Talimat gereği isim değil çizim esas alındı; fark arayüzde belirtiliyor. Dikey geçişler idealize gösterimdir.
   - Şekil 2-41: renklerden sayısallaştırılan dört eğri. Y ekseni “Worth”, **birimi kaynakta yok** (pcm varsayılmadı); alt sınır etiketsiz, ölçekten ~0 okundu.
   - Şekil 2-42: altı panelde 10 yükseklikte güç ve ksenon eğrilerinin yatay mesafesi (birimsiz, yalnız biçim). “D” ve “C” etiketli çubukların anlamı kaynakta açıklanmıyor; yalnız göreli uzunlukları metin olarak gösteriliyor, kontrol çubuğu konumuna çevrilmiyor. Çekirdek görünümünde çubuklar yalnız üstten giriş yönüyle (konumu belirsiz) çizilir.
   - Şekil 2-43: hedef ΔI ≈ −0,02 × güç(%) (100%’de ~−2, 0%’da 0), bant hedef ±6; dış kesik-noktalı çizgi (−35,50)→(−10,90)→(15,90)→(35,50) kaynakta adlandırılmamış.
3. **Temsili eğitim modeli** (`models/`):
   - **İyot/ksenon**: `dI/dt = a·P − λI·I`, `dX/dt = b·P + λI·I − λX·X − κ·P·X` (saat, %100 denge X = 1). λI, λX: I-135 (6,57 sa) ve Xe-135 (9,14 sa) yarı ömürleri (genel nükleer veri, kaynakta yok). **κ = 3·λX**, Şekil 2-41’in tepe zamanlarına (~4–8 sa) yaklaşık uyacak şekilde seçilmiş temsili katsayıdır; %100 kapatmada model tepe/denge oranı ~1,66, kaynakta ~1,51. Ksenon etkisi −X ile orantılı. Sabit adımlı RK4 (0,02 sa); yörüngeler önceden hesaplanır, aynı zaman aynı sonucu verir.
   - **Gerçekleşen güç**: istenen güce τ = 0,25 sa ile yaklaşır (temsili).
   - **Artık ısı**: Way–Wigner yaklaşık bağıntısı `0,0622·[t^−0,2 − (t+T)^−0,2]` (t, T saniye; T = 1 yıl). Genel yaklaşık bağıntıdır, kaynakta yoktur; fisyon gücünden ayrı tutulur. Bağıntı kapatma öncesi güce oranı verir; arayüz hem bu oranı hem nominal güce göre değeri ayrı etiketle gösterir (ör. %25’ten 1 sa sonra: önceki gücün ~%1,01’i = nominalin ~%0,25’i).
   - **ΔI ve AO**: `ΔI = üst − alt` (tam gücün %’si; pozitif = üst yarı fazla). `AO = (üst − alt)/(üst + alt)` ayrı bir büyüklüktür; sıfır güçte NaN yerine “—”. Dedektör sinyallerinin yarı çekirdek gücüyle orantılı olduğu varsayılmıştır. Toplam güç Şekil 2-42 duraklarından **bağımsız** bir kaydırıcıyla seçilir: kaynak, Şekil 2-42’nin saatlerinin Şekil 2-40’taki 12-3-6-3 profiliyle aynı başlangıçtan sayıldığını belirtmez; şekil yalnız dağılım biçimini verir. Bant içinde olmak güvenlik onayı değildir.
   - Şema durumları (çubuk konumu, basınçlandırıcı seviyesi) temsilidir. Küçük PWR şemasında sıcak kol buhar üreteci kanal başlığının giriş tarafına, soğuk kol çıkış tarafından pompaya bağlanır; RHR dönüşü pompa ile kap arasındaki soğuk kola, türbin çıkışı kondensere bağlıdır.

Kapsam dışı bırakılanlar: kaynaktaki vana/pompa işlem sıraları, güvenlik sistemi devre dışı bırakma adımları, kritiklik için sayısal bor reçeteleri, tarihsel ülke oranları ve mevzuat ayrıntıları.

Zamanlar: **senaryo saati** (fiziksel, saat), **gösterim hızı** (senaryo saati / simülasyon saniyesi) ve uygulamanın **ortak simülasyon saati** ayrıdır. Laboratuvar ortak saate abone olur; ayrı bir rAF döngüsü açmaz. Sayfadaki 60 saniyelik grafik kullanılmaz.

## Mimari

```
src/
  app/            App.tsx (kabuk, tek saat/model), appState.ts (reducer)
  components/     layout (Header, SceneViewport, SidePanel, Legend, SourcesSection),
                  controls (ControlBar), charts (EnergyFlow, TimeChart),
                  educational (LessonPanel, DetailDialog, CompareView)
  reactors/
    pwr/ bwr/ vver/   <Tip>Scene.tsx, <Tip>CoreDetail.tsx, <Tip>Details.tsx, config, lessons
    shared/           types, SceneContext (Hotspot/Label/SceneNote),
                      flow (Flow parçacıkları + flowMath), equipment (türbin-jeneratör,
                      kondenser, pompa, kabarcık, ısı nabzı, çubuk hareketi, nötron katmanı)
    registry.ts       reaktör → bağımsız modül eşlemesi
  simulation/     clock.ts (tek rAF döngüsü), educationalModel.ts
  hooks/          useSimulation.ts (useTick, useModelSnapshot, usePlayback)
  styles/         global.css
```

- **Tek animasyon saati**: `SimClock` uygulama boyunca bir `requestAnimationFrame` döngüsü çalıştırır. Sahneler, grafikler ve çekirdek animasyonları `useTick` ile abone olur; bileşen kaldırılınca abonelik silinir. Duraklatıldığında model, parçacıklar, kabarcıklar, türbin, nötronlar ve grafik zamanı birlikte durur; devam edince ilk kare `dt = 0` ile başlar (zaman sıçraması yok). Kare başına süre 0,1 s ile sınırlıdır.
- **Performans**: kare başına React render yapılmaz; parçacık konumları önceden örneklenmiş yol tablosundan (LUT) okunup doğrudan SVG özniteliklerine yazılır. Sayısal göstergeler ~5–6 Hz ile güncellenir. Parçacık havuzları ve grafik geçmişi sabit boyutludur.
- **Sahne bağımsızlığı**: her reaktör kendi sahne bileşenine sahiptir; yalnızca fiziksel olarak ortak küçük parçalar (türbin-jeneratör, kondenser, pompa) paylaşılır. Reaktör değişince sahne yeniden bağlanır, model ve saat başlangıca döner; seçim/vurgu/ders adımı taşınmaz. Oynatma durumu, hız ve etiket/akış tercihleri korunur.

## Eğitim modeli varsayımları

- Değerler **nominal ısıl güce göre normalize** edilmiş temsili oranlardır; MW, sıcaklık veya basınç hesabı yapılmaz.
- Isıl güç hedefe birinci dereceden gecikmeyle (τ ≈ 5 s), buhar/elektrik ek gecikmeyle (τ ≈ 2 s) yaklaşır. Doğrulanmış bir nötron kinetiği veya termal-hidrolik model **değildir**.
- Çevrim verimi sabit **%33** (ders notları: LWR ısı çevrimi ≈ %33): `elektrik = buhar × 0,33`.
- Enerji hesabı (temsili, doğrulanmış bir termodinamik model değildir):
  - `atılan ısı (kondenser) = buhar − elektrik`
  - `depolama hızı = ısıl − buhar`
  - Her adımda `buhar = elektrik + atılan ısı` ve `ısıl = elektrik + atılan ısı + depolama hızı`.
  - Depolama hızı bir enerji miktarı değil, nominal güce göre değişim hızıdır. **Pozitif**: sistemde enerji birikiyor (güç artışı). **Negatif**: depolanmış enerji geri veriliyor (güç düşüşü). Kararlı durumda ≈ 0. Bu nedenle `ısıl = elektrik + atılan ısı` yalnız kararlı durumda geçerlidir.
- Kontrol çubuğu konumu güçle doğrusal eşlenmez: dengedeki konum güce zayıf/doğrusal olmayan biçimde bağlıdır, güç değişirken geçici sapma eklenir.
- Türbin mili şebekeye senkron kabul edilir; elektrik gücü devirle eşlenmez, mil animasyonu sabit hızdadır.
- PWR/VVER birincil debisi sabit; buhar ve besleme suyu debisi güçle artar. BWR’de çekirdek akışı güçle değişir (devridaim ile güç ayarı).
- Animasyon hızları, nötron hareketleri ve çizim boyutları ölçekli değildir.

Kullanılan sayılar ve kaynakları: PWR ~155 bar ve BWR ~70 bar, basınçlandırıcıda ~%60 su / %40 buhar, LWR verimi ≈ %33, VVER-1000 dört / VVER-440/213 altı çevrim, VVER’de sıcak/soğuk kolların farklı kotlarda olması ve üçgen adımlı yakıt — Nuc E 430 Bölüm 2 ders notları. PWR/BWR temel farkları ve BWR akışı — U.S. NRC sayfaları. VVER tasarım özellikleri — IAEA (Trunov ve ark.). Referans görseldeki sayılar kullanılmadı.

## Doğrulama sonuçları

Bu sürümde yapılan kontroller:

| Kontrol | Sonuç |
| --- | --- |
| `npm run typecheck` (strict) | Geçti |
| `npm run build` | Geçti |
| `npm test` — 70 birim testi (saat, enerji dengesi, reducer, yapılandırmalar, akış yardımcıları, VVER boru geometrisi, PWR işletme modülü modelleri ve verileri) | Geçti |
| PWR işletme modülü (tarayıcı): altı bölüm açıldı; 6 mod; 6 ısınma aşaması; bor eğrisinde klavye gezinmesi; ksenon laboratuvarında duraklatma, sıfırlama, senaryo değişiminde sıfırlanma, aynı saatte aynı değer; 0/3/9/12/18/24 sa durakları; aynı güçte üst pay %40 → ΔI −20, %60 → +20; sıfır güçte AO “—”; BWR/VVER’de modül görünmüyor; mobilde sayfa taşması yok; konsol hatası yok | Doğrulandı |
| Saat: duraklatma, devamda sıçrama olmaması, hız, tek döngü | Birim testinde sahte rAF kareleriyle doğrulandı |
| Tarayıcıda animasyonun ilerlemesi (güç değişiminde model ve grafik güncelleniyor) | Doğrulandı |
| 20 kez reaktör değişimi sonrası saat abone sayısı aynı (25 → 25), tek döngü | Doğrulandı |
| Sıfırla: zaman 0, grafik geçmişi tek nokta, güç %100 | Doğrulandı |
| Güç %100 → %20 → %100 (tarayıcıda, gerçek zamanlı): buhar = elektrik + atılan ısı; düşüşte depolama hızı negatif (sola çubuk), artışta pozitif (sağa çubuk); negatif boyutlu SVG öğesi yok | Doğrulandı |
| VVER ana sahne, yatay buhar üreteci yakın planı ve karşılaştırma çizimi: tüm akış parçacıkları boru çizgisinin ya da kolektörün içinde (`isPointInStroke` ile ölçüldü; 122 / 262 / 46 parçacık, dışarıda 0) | Doğrulandı |
| Yakın plan modalı (PWR ve VVER gerçek tuşlarla, BWR betikle): açılınca odak Kapat'ta, Tab/Shift+Tab içeride kalıyor, arka plan tıklanamıyor, Esc ve Kapat kapatıyor, odak açan düğmeye dönüyor, sayfa kaydırması korunuyor; mobilde pencere ekrana sığıyor | Doğrulandı |
| Ekipman seçimi (fare ve Tab + Enter), vurgulama/soluklaştırma, Esc ile yakın planı kapatma | Doğrulandı |
| Üç sahne, tüm yakın planlar, ders akışı, karşılaştırma görünümü | Ekran görüntüleriyle incelendi |
| Mobil (375 px): sayfada yatay taşma yok, yan panel altta | Doğrulandı |
| Konsol hatası | Görülmedi |

Doğrulanamayanlar: ilk sürümde tarayıcı paneli arka plana alındığı için duraklat/devam/hız davranışı tarayıcıda gerçek zamanlı ölçülemedi; bu davranış birim testinde sahte kare zamanlarıyla doğrulandı. Yakın plan açıkken açan kontrolün sayfadan kaldırılması durumu (yedek odak noktası) tarayıcıda denenmedi; arayüzde bu durumu oluşturan bir akış yok. Ekran okuyucu ile manuel test yapılmadı. PWR işletme modülünde tarayıcı paneli gizliyken kare hızı kısıldığından ksenon laboratuvarının gerçek zamanlı oynatma hızı ölçülemedi (oynatmanın ilerlediği ve duraklatmanın durdurduğu görüldü; hız birim testleriyle doğrulandı). Şekillerden okunan değerler gözle ve piksel ölçümüyle elde edildi; ±birkaç piksel belirsizlik içerir. Modelin fiziksel doğruluğu testlerle kanıtlanmış sayılmamalıdır; testler yalnız tutarlılık ve beklenen eğilimleri kontrol eder.
