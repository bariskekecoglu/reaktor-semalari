# Nükleer Santral Şemaları — PWR · BWR · VVER · RBMK · CANDU

PWR, BWR, VVER, RBMK ve CANDU reaktörlerini **ayrı tasarlanmış**, animasyonlu teknik kesit şemalarıyla anlatan Türkçe eğitim uygulaması. React + TypeScript + SVG; backend ve çalışma zamanında internet gerektirmez.

## Kurulum ve komutlar

```bash
npm install
npm run dev        # geliştirme sunucusu (http://localhost:5173)
npm run typecheck  # TypeScript strict tür kontrolü
npm test           # Vitest birim testleri
npm run build      # tür kontrolü + production build (dist/)
npm run preview    # build çıktısını yerelde sun
npm run kb:export  # bilgi tabanını sunucu kopyasına aktar (server/knowledge.json)
npm run guide:export  # yerel soru-cevap kataloğunu docs/LOCAL_GUIDE_QUESTIONS.md dosyasına aktar
```

Ön yüz bağımlılıkları yalnızca `react`, `react-dom` ve geliştirme araçlarıdır (`vite`, `@vitejs/plugin-react`, `typescript`, `vitest`, tip paketleri). Yerel rehber için API anahtarı, ücretli servis veya ayrı sunucu gerekmez. Önceki `server/` denemesi korunmuştur ancak siteye bağlı değildir.

## Asistan, tahmin dersi ve öğrenme ilerlemesi

Ayrıntılı durum ve doğrulama kayıtları: [`docs/IMPLEMENTATION_STATUS.md`](docs/IMPLEMENTATION_STATUS.md).

### Asistan (başlıktaki “✦ Asistan”)

- Soruyu proje bilgi tabanında (`src/knowledge/`) arar; kısa, **kaynaklı** açıklama verir ve ilgili bölümü açabilir (ekipman seçme, akış vurgulama, yakın plan, ders, işletme bölümü, grafik olayı).
- Yalnız tiplenmiş ve doğrulanmış işlemler çalışır (`src/assistant/actions.ts`); bilinmeyen kimlik, serbest kod, DOM seçicisi veya URL çalıştırılmaz. Reaktör değiştiren işlemler (simülasyonu başa alır) yalnız kullanıcı tıklayınca çalışır. “Vurguyu temizle” ve “Önceki konuma dön” vardır.
- **Yalnız yerel rehber:** hazırlanmış cevapları tarayıcıda eşleştirir; model eğitimi veya üretken yapay zekâ değildir. Sorular için ağ isteği yapmaz. Önceki `VITE_ASSISTANT_ENDPOINT` ayarı kullanılmaz.
- **474 cevap, 3486 farklı soru ifadesi:** beş reaktörün ekipmanları, dersler, PWR işletme modları ve ısınma aşamaları, otomatik kontrol ilişkileri, ksenon/bor/eksenel güç, reaktör karşılaştırmaları, Çernobil kaza analizi, sık karıştırılan parçalar ve site kullanımı. Bunlar tüm olası soruları kapsama iddiası taşımaz.
- Panelde **Hazır sorular** kitaplığı: konu ve metin filtresi; seçilen soru kaynaklı cevabı açar. Türkçe karakter yazılmadan yazılan sorular, bazı ekler, yaygın terim eş anlamları ve uzun kelimelerde tek harflik yazım hataları desteklenir. Belirsiz soruda seçenek sunulur; bilinmeyen soru için cevap üretilmez.
- Kısa takipler: “Bunu göster”, “Daha ayrıntılı”; reaktöre özgü karşılaştırma cevabından sonra “Peki PWR’de?” gibi sorular. Bu sınırlı takip desteği genel sohbet belleği değildir.
- Sohbetler kaydedilmez (yalnız açık sekmede, bellekte).

### Yerel rehber içeriğini geliştirme

İncelenebilir soru-cevap listesi: [`docs/LOCAL_GUIDE_QUESTIONS.md`](docs/LOCAL_GUIDE_QUESTIONS.md). `npm run guide:export` ile yeniden üretin. Yeni özel cevap, soru varyantı ve kaynak/şema hedefleri `src/assistant/guideCatalog.ts` içinde tanımlanır. Ekipman ve ders cevapları mevcut içerikten türetilir; bu metinleri asıl kaynak dosyasında düzenleyin. Eşleştirme `guideSearch.ts`, bağlam ve açıklayıcı sorular `localGuide.ts` içindedir.

Doğrulama: bütün katalog soruları, tüm alternatif ifadelerin tanınması, kaynak/hedef kimlikleri, ayrı doğal dil örnekleri, kapsam dışı sorular, takip soruları ve panelin yerel gösterimi `src/assistant/guide.test.ts` ile denetlenir. Bir varyant eklemek, benzer ama ilgisiz sorulara yanlış cevap verilip verilmediğini de kontrol etmeyi gerektirir.

### Tahmin et → dene → açıkla (PWR pilot dersi)

Öğrenme → “Tahmin et → dene → açıkla”: *Kapatmadan sonra ksenon ne yapar?* Hedef, başlangıç durumu, tahmin, kontrollü deney (değiştirilen değişken görünür: fisyon gücü %100 → %0), gözlem, kaynaklı açıklama (s. 2-94, Şekil 2-41), kısa değerlendirme. Tahmin yapılmadan sonraki adımlar açılmaz; “Atla ve açıklamayı gör” ayrıdır. Yanlış seçeneklerin neden makul görünebildiği açıklanır. Canlandırma mevcut temsili iyot/ksenon modelini kullanır; tepe yüksekliği kaynaktan farklı olduğu için sayısal büyüklük sorulmaz.

### Grafik olayları (PWR işletme · ksenon)

Olaylar türüne göre ayrı işaretlenir: ■ kaynakta tanımlı, ◆ şekilden okunan, ● modelden hesaplanan. İşaretler tıklama, dokunma ve klavyeyle seçilir; açıklama grafiğin altında gösterilir. Seçmek senaryo saatini değiştirmez; “Senaryo saatini bu olaya götür” ayrı düğmedir.

### Karşılaştırma konuları

On iki konu (buharın oluştuğu yer, ısı yolu, devre ilişkisi, basınçlandırıcı, buhar üreteci düzeni, kontrol çubukları, moderatör, soğutucu, basınç sınırı, kanal yönü, buhar üreteci/ayırıcı tambur, yakıt ve yakıt değiştirme). Konu seçince beş mini şemada ilgili parçalar kalın çizgi + kesikli çerçeveyle vurgulanır, diğerleri geri plana alınır; her reaktör için kısa açıklama, kapsam etiketi (“Reaktör ailesi geneli” / “Çizilen temsili tasarım”), kaynaklar ve “… şemasında ayrıntılı incele”. Konu bir tasarımda uygulanmıyorsa “Bu tasarımda bulunmaz” yazar; başka bir ekipman vurgulanmaz ve inceleme düğmesi gösterilmez. Geniş ekranda beş kart 3 + 2 düzende (orta ekranda 2 sütun) ve “Göster” seçimiyle istenen reaktörler karşılaştırılır; dar ekranda tek reaktör ve beş düğmeli reaktör geçişi; seçili konu korunur. Tablo seçili reaktörlerin sütunlarını gösterir ve kendi alanında yatay kayar.

### Etiket ayrıntısı

Şema araç çubuğunda **Temel / Ayrıntılı**. Temel’de alt bileşen etiketleri %150 ve üstü yakınlaştırmada açılır; seçili ekipmanın etiketi her zaman görünür, şemanın üstünde “Seçili: …” satırı vardır.

### Öğrenme ilerlemesi (yalnız bu cihaz)

Tamamlanan dersler, son kalınan ders/adım, tahmin sonuçları (yalnız seçenek kimlikleri) ve son öğrenme bölümü `localStorage` anahtarı `reaktor-semalari:learning-progress` altında, sürümlü şemayla saklanır. Bozuk/eski veri güvenli başlangıca döner; depolama engelliyse bellekte çalışır. Öğrenme görünümünde “Kaldığım yerden devam et” ve “İlerlemeyi sıfırla” (görünüm tercihini silmez). Doğrudan ders bağlantısı: `#ders=pwr.tour.sg`, `#ders=pwr.predict.xenon-shutdown&adim=experiment`.

## Özellikler

- **Beş ayrı sahne** (her biri kendi geometrisi, boru bağlantıları, akış yolları, etkileşim noktaları ve dersleriyle):
  - **PWR** — koruma yapısı içinde kap, basınçlandırıcı, dikey U borulu buhar üreteci (ayırıcı/kurutucu, boru levhası, bölme plakası), sıcak/soğuk kol, birincil pompa; ayrı ikincil devre ve soğutma suyu çevrimi.
  - **BWR** — büyük kap odaklı tek çevrim: çekirdekte kaynama, standpipe + siklon ayırıcılar, şevron kurutucular, buhar kubbesi, downcomer, jet pompaları, dış devridaim döngüsü, alttan giren haç kesitli çubuklar, korumalı türbin binası. Buhar üreteci ve basınçlandırıcı yoktur.
  - **VVER** — PWR ailesinden; dar/uzun kap ve yüksek üst blok, farklı kotlarda sıcak/soğuk kol, sıcak/soğuk kolektörlü **yatay buhar üreteci**, ana sirkülasyon pompası; görünür “temsili şema / tek çevrim sadeleştirmesi” notu.
  - **RBMK** — temsili RBMK-1000: grafit yığını içinden geçen dikey basınç kanalları (5 temsili yakıt + 2 ayrı kontrol/koruma kanalı), kanalda alttan girip yukarı akarken kaynayan hafif su, her kanalın kendi buhar–su borusuyla gittiği kap dışındaki ayırıcı tambur, buharın doğrudan türbine gidişi, iniş borusu → ana sirkülasyon pompası → grup dağıtım kolektörü → alt su boruları dönüşü; biyolojik zırh/plakalar ve bina ayrı ekipman olarak. BWR sahnesinden türetilmedi.
  - **CANDU** — temsili CANDU 6: yatay calandria ve ağır su moderatörü, dört temsili yatay kanal (basınç tüpü + gaz halkası + calandria tüpü, 12 demet), komşu kanallarda ters akış, uç görünüşte kolektörler ve besleyiciler, “sekiz” biçimli halkada iki buhar üreteci ve iki pompa, basınçlandırıcı, ayrı moderatör soğutma sistemi, ayrı ikincil hafif su devresi. PWR kabından türetilmedi.
- **Yakın planlar**: PWR buhar üreteci ve basınçlandırıcı; BWR ayırıcı-kurutucu ve kap içi bölgeler; VVER yatay buhar üreteci ve dikey/yatay üreteç karşılaştırması; RBMK grafit–basınç kanalı–yakıt ilişkisi, kanalda kaynama ve ayırıcı tambur; CANDU yakıt kanalı katmanları (demet → basınç tüpü → gaz aralığı → calandria tüpü → moderatör), moderatör ile ana ısı taşıma sisteminin ayrılığı, buhar üretecinde birincil/ikincil ayrımı ve işletmede yakıt değiştirme ilkesi; her reaktöre ayrı çekirdek yakın planı (VVER’de altıgen, üçgen adımlı demetler; BWR’de kanal kutuları + haç kesitli çubuk; RBMK’de grafit kolon kafesi; CANDU’da kare kafes ve iki yönlü akış) ve temsili nötronlar (fisyon / soğurulma).
- **Etkileşim**: ekipmana tıklama veya Tab + Enter ile seçim; görev, bu reaktörde çalışma biçimi, bağlantılı hatların vurgusu, yakın plan. Vurgu renge ek olarak kesikli çerçeve ve kalın çizgiyle gösterilir.
- **Reaktöre özgü odaklar** (ör. “Buhar nerede oluşuyor?”, “İki devre neden ayrı?”, “Kolektör ve boru demeti”).
- **Adım adım anlatım**: her reaktör için ayrı ders akışı, önceki/sonraki.
- **Karşılaştırma görünümü**: beş farklı mini şema, 12 konu + karşılaştırma tablosu.
- **Kontroller**: oynat/duraklat, sıfırla, 0.5×/1×/2× hız, %20–100 “Eğitim senaryosu: göreli güç”, etiketleri/akış işaretlerini göster-gizle, çekirdek yakın planı, yakınlaştırma/sığdırma/sürükleyerek kaydırma.
- **Grafikler**: enerji dönüşümü (nükleer → ısı → buhar → mekanik → elektrik; buhar ayrıca kondenserde atılan ısıya ayrılır; güç değişirken ayrı, işaretli “depolama hızı” göstergesi) ve son 60 simülasyon saniyesinin zaman grafiği.
- **Yakın plan penceresi**: yerel `<dialog>` + `showModal()`; arka plan fare ve klavyeye kapalı, Tab/Shift+Tab pencere içinde döner, Esc ve Kapat ile kapanır, odak açan kontrole döner, sayfa kaydırması konumu korunarak kilitlenir.
- **VVER boruları**: yatay buhar üretecindeki her U borusu sıcak kolektörden çıkıp soğuk kolektörde biter; boru çizimi ve parçacık yolu aynı tanımdan (`src/reactors/vver/hsgGeometry.ts`) üretilir. Yan görünüşte borunun öteki kolektörün arkasından geçtiği kısım kesikli çizilir (temsili sadeleştirme).
- **Arayüzde “Kaynaklar ve varsayımlar”** bölümü (sayfa altı).
- Mobilde yan panel alta iner, şema kendi alanında kaydırılır; sayfada yatay taşma yoktur. `prefers-reduced-motion` açıksa animasyon duraklatılmış başlar.

## PWR · İşletme ve Reaktör Davranışı modülü

PWR seçiliyken başlığın altındaki **Santral şeması / İşletme ve davranış** düğmeleriyle açılır. BWR, VVER, RBMK ve CANDU’da görünmez; reaktör veya görünüm değişince santral şemasına döner. Ayrı bir JS parçası olarak yüklenir (`PwrOperations-*.js`); yeni rota veya yönlendirme yoktur, GitHub Pages yapılandırması aynıdır.

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

## Görünüm: Otomatik / Mobil / Masaüstü

Başlıktaki **Görünüm** seçicisi yalnız yerleşimi değiştirir; reaktörü, içerik görünümünü (Şema / Karşılaştırma / Öğrenme), PWR alt görünümünü, ders bölümünü, senaryoyu, senaryo saatini, gücü veya oynatma durumunu değiştirmez. İlk ziyarette zorunlu bir seçim ekranı yoktur; site **Otomatik** açılır.

- **Tercih ve etkili yerleşim ayrıdır** (`src/app/viewPreference.ts`, `src/hooks/useViewLayout.ts`): `viewPreference` = `auto | mobile | desktop` (yalnız bu saklanır), `effectiveLayout` = `narrow | medium | wide` (her an hesaplanır). Kök öğede `data-view-preference` ve `data-layout` öznitelikleri vardır; CSS yerleşim kuralları bu özniteliklere bağlıdır, böylece medya sorguları elle seçilen tercihi ezmez.
- **Otomatik eşikler** (kaydırma çubuğu dahil pencere genişliği; cihaz türü/user-agent tahmini yok):
  - `< 768 px` → **dar**: santral sahnesi (viewBox 1400) ile 340 px yan panel yan yana sığmaz; bölüm sekmeleri ve kontroller tek satırda okunmaz. Tek sütun, kompakt gezinme, ≥ 44 px dokunma alanları.
  - `768–1199 px` → **orta**: sahne ≥ 640 px ve yan panel ≥ 300 px sığıyorsa iki sütun (ör. 1280 px), sığmıyorsa esnek kutu paneli alta indirir (ör. 768 ve 1024 px).
  - `≥ 1200 px` → **geniş**: büyük şema, yan panel ve yan yana grafikler.
  Pencere boyutu veya ekran yönü değişince yerleşim yenilemesiz güncellenir; yalnız eşik geçilince yeniden çizim olur.
- **Mobil**: her genişlikte kompakt, tek sütun; geniş ekranda içerik en fazla 640 px genişlikte ortalanır. Fare ve klavye de çalışır.
- **Masaüstü**: her genişlikte yoğun düzen. Dar telefonda seçildiğinde ana alan ve PWR bölümleri esnek kutularla sarılır/alta iner; büyük görseller kendi alanlarında kayar, sayfa taşmaz.
- **Dokunma alanı** yerleşimden bağımsızdır: `@media (pointer: coarse)` düğme, seçim kutusu ve kaydırıcılara 44 px yükseklik verir.
- **Saklama**: `localStorage` anahtarı `reaktor-semalari:view-preference:v1`. Geçersiz/eski değerler `auto`ya düşer; depolama engellenirse tercih o oturumda bellekte tutulur. `index.html`’deki küçük betik kaydedilmiş tercihi ilk çizimden önce uygular (sıçrama olmaz).

### Mobil ve tablet düzenlemeleri

- PWR işletme modülü: 520 px’lik toplu en küçük genişlik kaldırıldı. Grafikler dar ekranda kendi daraltılmış çizim alanını (420 birim), seyreltilmiş eksen işaretlerini ve daha büyük yazıları kullanır; başlıklar SVG dışında HTML başlığıdır. Sayılar, birimler, işaretler ve çizgi desenleri değişmedi.
- Bölüm sekmeleri dar ekranda tek satırda yatay kayar; seçili sekme otomatik görünür kalır, ok tuşları çalışır. Giriş metni, model varsayımları ve kaynak listeleri dar ekranda açılır bölümlerdedir; “Ne değişti, neden?” her zaman görünür.
- Küçük PWR şeması: genel görünüm + “Büyüt” (kendi alanında kayan büyük görünüm); kısa ekranlarda yükseklik görünür alanla sınırlı.
- Eksenel bölüm: çekirdek profili ve güç–ΔI grafiği dar ekranda alt alta; çakışan etiketler ayrıldı.
- Bor eğrisi: dokunmatikte yalnız kısa dokunuş değer seçer, sürükleme sayfayı kaydırır; kaydırıcı ve klavye alternatif girişlerdir.
- Ksenon zaman kontrolleri dar ekranda düzenli satırlarda; dört grafik bağımsız ve aynı senaryo saatine bağlı.
- Santral şeması: “Görünümü sıfırla” düğmesi; alan dışında bırakılan veya iptal edilen sürükleme takılı kalmaz. Dar ekranda seçili ekipman şemanın hemen altında özetlenir (“Ayrıntılar ↓”).
- Yakın plan penceresi: dar ekranda tam ekran, yükseklik `100dvh`; içerik kendi içinde kayar, çizim okunaklı boyutta yana kaydırılır. Odak tuzağı, Esc, odak dönüşü ve kaydırma kilidi korunur.

## RBMK ve CANDU modülleri

Çizilen tasarımlar arayüzde açıkça yazılır: **temsili RBMK-1000** ve **temsili CANDU 6**. Aile geneli ilkeler ile çizilen modele özgü bilgiler karşılaştırmada “Reaktör ailesi geneli” / “Çizilen temsili tasarım” etiketleriyle ayrılır. PWR’ye özgü İşletme ve Davranış modülü ile tahmin dersi bu reaktörlerde açılmaz.

### Kaynaklar (uygulama sırasında okunup iddiayı desteklediği kontrol edildi)

| Kaynak | Kullanıldığı iddialar |
| --- | --- |
| IAEA INSAG-7, *The Chernobyl Accident: Updating of INSAG-1* (1992), §2.2, 2.6, 2.8–2.10 | RBMK-1000: iki bağımsız çevrim (her biri çekirdeğin yarısı), çevrim başına 4 pompa (3 + 1 yedek), ortak kolektör → grup dağıtım kolektörleri → kanallar, kanal başına ayrı buhar–su boruları, çevrim başına 2 yatay ayırıcı tambur, besleme suyunun ayrılmış suyla karışıp pompa emişine gitmesi, alt-soğutulmuş girişten sonra kanalda kaynama, çekirdek ~7 m × ~11,8 m, 1986 durumunda çubukların çoğu üstten / 24 kısa çubuk alttan ve grafit yer değiştiriciler, “yerelleştirilmiş” koruma hacimleri, üst kapak ve alt plaka |
| OECD NEA, *Chernobyl — Chapter I* | Grafit moderatörlü basınç tüplü tasarım, dikey basınç tüpleri, zirkonyum alaşımı kaplı ~%2 zenginleştirilmiş UO₂, alttan girip kaynayan su, ara ısı değiştiricisiz doğrudan türbin, 211 kontrol çubuğu, işletmede yakıt değiştirme, bloklar arasında N₂–He gazı |
| IAEA BPTC Modül IV, s. 8–13 | PWR/BWR/VVER genel özellikleri (karşılaştırmadaki moderatör/soğutucu/basınç sınırı satırları), PHWR: basınç tüplerinde basınçlı ağır su, basınçsız moderatör tankı, ağır su → hafif su buhar üreteci, basınçlandırıcı şeması; LWGR/RBMK: basınç tüplerinde kaynama, büyük grafit yapı, buhar ayırıcılar |
| Zhang & Shalaby (AECL), *Introduction to the Qinshan Phase III CANDU NPP* (CANTEACH) | CANDU 6: 380 yatay kanal, kare kafes, 12 demet/kanal, 37 elemanlı doğal UO₂ demeti, iki halka (her birinde 2 buhar üreteci, 2 pompa, 2 giriş + 2 çıkış kolektörü), komşu kanallarda ters akış ve “sekiz” biçimi, düşük basınçlı/düşük sıcaklıklı ve bağımsız moderatör, moderatör ısı değiştiricileri, dikey U borulu tümleşik buhar tamburlu ve ön ısıtıcılı buhar üreteci, iki uçta işletmede yakıt değiştirme ve başka yakıt seçenekleri, kanallar arasından geçen reaktivite düzenekleri |
| CANDU Fundamentals Bölüm 11 ve 14 (CANTEACH) | Calandria’nın basınç kabı olmaması ve patlama diskleri, CO₂ gaz halkası ve aralayıcılar, uç bağlantıları ve yakıt değiştirme makinesinin kenetlenmesi; kolektör ve buhar üreteçlerinin çekirdekten yüksekte olması, pompanın buhar üreteci çıkışında olması, pompaların basınç değil akış sağlaması |
| CNSC, *Pressure tubes* bilgi notu | Kanal başına 1 basınç tüpü + 1 calandria tüpü + uç bağlantıları + aralayıcılar; basınç tüpünde yakıt ve soğutucu |

Kaynakta bulunmayan sıcaklık, basınç veya performans değeri kullanılmadı. RBMK’nin tarihsel güvenlik özellikleri (1986 çubuk tasarımı, yerelleştirilmiş koruma) yalnız dönem ve kaynak belirtilerek anlatılır; bütün RBMK’lere genellenmez. RBMK kaza üzerinden değil, tasarım ve çalışma prensibi üzerinden anlatılır.

### Sadeleştirmeler

- RBMK: iki çevrimden biri; çok sayıda kanal yerine 5 yakıt + 2 kontrol kanalı; iki tambur ve dört pompa yerine birer adet; tek grup kolektörü; yakıt değiştirme makinesi ve ön ısıtıcılar çizilmedi. Buhar–su boruları kanal başına ayrıdır ve birbirini kesmeyecek iç içe L biçiminde çizilir. Kontrol çubukları yalnız üstten giren temsili çubuklarla gösterilir.
- CANDU: iki halkadan biri; 380 kanal yerine 4 kanal; kolektörler yan görünüşte daire (uç görünüş). Aynı yüzde farklı kolektörlere giden besleyiciler yan görünüşte bir noktada üst üste geçer; bu nokta köprüyle (boşluk) çizilir, gerçek birleşmeler ● ile işaretlidir. Basınçlandırıcının ve moderatör sisteminin bağlantı yerleri ile sol buhar üretecine giden besleme kolunun reaktörün altından dolaşması temsilidir.
- Yakıt değiştirme yakın planı yalnız ilkeyi gösterir (iki uçta makine, yeni demet girer, kullanılmış demet çıkar); sıra, sayı ve yön gerçek prosedür değildir.
- Animasyonlar ortak normalize eğitim modelini kullanır; RBMK/CANDU için doğrulanmış reaktör fiziği (ör. boşluk katsayısı) modellenmez. Göreli güç kaydırıcısı kontrol çubuğu konumu, boşluk oranı veya reaktiviteyle doğrusal eşlenmez. Nötronlar temsilidir.

### Malzeme ve akışkan ayrımı

Renge ek olarak: grafit koyu gri + tuğla dokusu ve “GRAFİT” etiketi; ağır su moderatörü açık mor noktalı desen, kesik-nokta (mor) akış çizgisi ve “D₂O · moderatör” etiketi; birincil ağır su “D₂O · birincil · basınçlı”, ikincil hafif su “H₂O” etiketleri; buhar kesikli çizgi ve içi boş işaret; su–buhar karışımı kısa kesikli çizgi ve kabarcıklar.

## Mimari

```
src/
  app/            App.tsx (kabuk, tek saat/model), appState.ts (reducer)
  components/     layout (Header, SceneViewport, SidePanel, Legend, SourcesSection),
                  controls (ControlBar), charts (EnergyFlow, TimeChart),
                  educational (LessonPanel, DetailDialog, CompareView)
  reactors/
    pwr/ bwr/ vver/ rbmk/ candu/
                      <Tip>Scene.tsx, <Tip>CoreDetail.tsx, <Tip>Details.tsx, config, lessons,
                      <tip>Layout.ts (adlandırılmış bağlantı noktaları ve boru rotaları)
    meta.ts           beş reaktörün ortak sırası, kısa adı ve ipuçları; anlatım kimliği çözümleme
    shared/           types, SceneContext (Hotspot/Label/SceneNote),
                      flow (Flow parçacıkları + flowMath), equipment (türbin-jeneratör,
                      kondenser, pompa, kabarcık, ısı nabzı, çubuk hareketi, nötron katmanı)
    registry.ts       reaktör → bağımsız modül eşlemesi
    shared/equipment/materials.tsx  grafit ve ağır su desenleri, akışkan etiketi, kesişme köprüsü
  simulation/     clock.ts (tek rAF döngüsü), educationalModel.ts
  hooks/          useSimulation.ts (useTick, useModelSnapshot, usePlayback)
  styles/         global.css, lab.css, learning.css, channel-reactors.css (RBMK/CANDU çizim dili)
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

## Kod denetimi (2026-10-31)

CANDU 6’da birincil ağır suda sınırlı kaynama olabilir; türbine giden buhar ayrı ikincil hafif su devresinde oluşur. Tek fazlı görünen birincil akış animasyonu bir sadeleştirmedir (CANTEACH, [Heat Transport System Thermalhydraulics, §3.3, s. 3-2–3-3](https://canteach.candu.org/Content%20Library/20043705.pdf)). Karşılaştırma ve yerel rehberdeki kesin “kaynamaz” ifadeleri düzeltildi. Grafit dokusunun CSS tarafından örtülmesi, CANDU U borusu akış uçları ve yakın planda akışın örtülmesi giderildi.

Son kod denetiminde TypeScript kontrolü, 18 dosyada 736 test, üretim derlemesi ve iki içerik dışa aktarımı geçti. Görsel kontrol bu oturumda tamamlanamadı: in-app tarayıcı localhost bağlantısı zaman aşımına uğradı; Windows tarayıcı aracı URL doğrulaması yapılamadığı için durdu. Aşağıdaki tarayıcı kayıtları önceki uygulama çalışmasına aittir ve bu denetimde yeniden doğrulanmadı.

## Doğrulama sonuçları

Bu sürümde yapılan kontroller:

| Kontrol | Sonuç |
| --- | --- |
| `npm run typecheck` (strict) | Geçti |
| `npm run build` | Geçti |
| `npm test` — 77 birim testi (görünüm tercihi dahil) (saat, enerji dengesi, reducer, yapılandırmalar, akış yardımcıları, VVER boru geometrisi, PWR işletme modülü modelleri ve verileri) | Geçti |
| PWR işletme modülü (tarayıcı): altı bölüm açıldı; 6 mod; 6 ısınma aşaması; bor eğrisinde klavye gezinmesi; ksenon laboratuvarında duraklatma, sıfırlama, senaryo değişiminde sıfırlanma, aynı saatte aynı değer; 0/3/9/12/18/24 sa durakları; aynı güçte üst pay %40 → ΔI −20, %60 → +20; sıfır güçte AO “—”; BWR/VVER’de modül görünmüyor; mobilde sayfa taşması yok; konsol hatası yok | Doğrulandı |
| Görünüm/yerleşim (tarayıcı emülasyonu): 320×568, 360×800, 390×844, 430×932, 844×390, 768×1024, 1024×768, 1024×1366, 1280×800, 1440×900. Santral şeması ve PWR’nin altı bölümünde sayfa taşması yok, izin verilen kaydırma alanları dışında ekrandan taşan öğe yok, dar yerleşimde 44 px’ten küçük dokunma hedefi yok (ölçümle); 390 px’te ekran görüntüleriyle incelendi. Mobil/Masaüstü elle seçimi yeniden boyutlandırmada korunuyor; yenilemede tercih geri geliyor; bozuk değer Otomatik’e düşüyor; tercih değişiminde reaktör, bölüm, senaryo ve saat korunuyor; yakın plan açıkken dar→geniş geçişte pencere ve odak korunuyor, Esc ile kapanıp odak açan düğmeye dönüyor | Doğrulandı |
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
| RBMK ve CANDU (2026-10-31): `npm run typecheck`, `npm test` (18 dosya, 733 test), `npm run build`, `npm run guide:export` (468 cevap, 3463 soru ifadesi), `npm run kb:export` (184 girdi) | Geçti |
| Yeni testler: beş reaktörün kaydı ve meta verisi; her ekipmanın sahnede seçilebilir olması; ders/odak/ekipman vurgularının sahnedeki gerçek kimliklere bağlı olması (beş reaktörde); her yakın planın çizilmesi; RBMK buhar–su borularının kanaldan tambura gitmesi ve kesişmemesi; CANDU’da komşu kanalların ters akışı, besleyici yönleri, sekiz biçimli halka uçları, besleyici kesişmelerinin yalnız köprülü noktalar olması, moderatör sisteminin ayrılığı; 12 karşılaştırma konusu ve “bulunmaz” kuralı; RBMK/CANDU soru tanıma, Türkçe ekler, yanlış eşleşme ve kapsam dışı sorular; eski ilerleme kayıtlarıyla uyumluluk, derin bağlantılar ve reaktör geçişleri | Geçti |
| RBMK ve CANDU tarayıcı kontrolü: 1440×900’de iki sahne (Ayrıntılı etiketlerle), RBMK’nin 4 ve CANDU’nun 5 yakın planı, seçim/vurgu, odak soruları; karşılaştırmada 3 + 2 düzen, reaktör filtresi, “Bu tasarımda bulunmaz”; 768×1024’te CANDU dersi ve derin bağlantı, karşılaştırmada 2 sütun; 390×844’te iki sahne, seçim çubuğu, tam ekran yakın plan (odak Kapat’ta, Esc ile kapanır), tek reaktörlü karşılaştırma; sayfada yatay taşma yok; beş reaktör arasında geçişte konsol hatası yok; tek saatle duraklatma/devam | Doğrulandı |
| Konsol hatası | Görülmedi |

Doğrulanamayanlar: ilk sürümde tarayıcı paneli arka plana alındığı için duraklat/devam/hız davranışı tarayıcıda gerçek zamanlı ölçülemedi; bu davranış birim testinde sahte kare zamanlarıyla doğrulandı. Yakın plan açıkken açan kontrolün sayfadan kaldırılması durumu (yedek odak noktası) tarayıcıda denenmedi; arayüzde bu durumu oluşturan bir akış yok. Ekran okuyucu ile manuel test yapılmadı. PWR işletme modülünde tarayıcı paneli gizliyken kare hızı kısıldığından ksenon laboratuvarının gerçek zamanlı oynatma hızı ölçülemedi (oynatmanın ilerlediği ve duraklatmanın durdurduğu görüldü; hız birim testleriyle doğrulandı). Şekillerden okunan değerler gözle ve piksel ölçümüyle elde edildi; ±birkaç piksel belirsizlik içerir. Modelin fiziksel doğruluğu testlerle kanıtlanmış sayılmamalıdır; testler yalnız tutarlılık ve beklenen eğilimleri kontrol eder. Mobil/tablet davranışları yalnız masaüstü tarayıcıda viewport emülasyonuyla kontrol edildi; gerçek dokunmatik cihazda (dokunarak sürükleme, kıstırarak yakınlaştırma, ekran yönü döndürme, `pointer: coarse`) denenmedi. Depolama erişiminin tamamen engellendiği durum birim testinde doğrulandı, tarayıcıda denenmedi.

## RBMK · Çernobil 1986 — Kaza analizi

RBMK seçiliyken **Santral şeması / Çernobil 1986 — Kaza analizi** geçişinden açılır. Beş aşama: hazırlayan koşullar, pozitif boşluk geri beslemesi, 1986 AZ-5 geometrisi, son saniyeler, nedenler ve değişiklikler. Kanal/çubuk çizimleri, olay kaydı ve grafik tek tarihsel saatten beslenir. Kullanıcı oynatabilir, duraklatabilir, hız seçebilir, olaylara adım atabilir veya kaydırıcıyı kullanabilir. Grafik işaretleri tıklanabilir ve klavyeyle seçilebilir.

**Kaynak ve belirsizlik:** Ana dayanaklar IAEA INSAG-7 (1992) ve OECD NEA 2002 değerlendirmesi Bölüm I'dir. Her olay ve aşamada kaynak kimliği ve basılı bölüm/sayfa konumu görünür. Kare belgelenmiş güç noktasıdır; kesikli bağlantı ölçüm olmayan temsili geçiştir. Son saniyelerdeki debi/boşluk/güç eğilimleri ölçeksizdir; kesin tepe gücü verilmez. Grafikte 530 MW ifadesi yalnız belgelenmiş eşik aşımıdır. Geometri ve hareket temsilidir; fizik simülatörü, serbest kaza üretme aracı veya işletme prosedürü değildir. 1992 raporundaki değişiklikler güncel santraller için güvenlik garantisi sayılmaz.

Dosyalar `src/reactors/rbmk/chernobyl/` altında; zaman çizelgesi (`timeline.ts`), aşamalar (`stages.ts`), saf `stateAt(t)` ve oynatma zamanı (`curves.ts`), grafikler ve görseller ayrıdır. Küçük `Evidence.tsx` kaynak etiketini ortaklaştırır. `rbmkView` / `chernobylStage` reducer'da korunur; başka reaktörde açılmaz ve reaktör değişiminde varsayılana döner. Ortak `educationalModel.ts`, `TimeChart` ve mevcut RBMK santral sahnesi değiştirilmedi. Yeni kütüphane yoktur; görünüm ayrı JS/CSS parçası olarak yüklenir.

**Bağlantı ve ilerleme:** `#ders=rbmk.chernobyl&adim=az5` gibi bağlantılar beş aşamayı açar. Kimlikler: `conditions`, `void`, `az5`, `seconds`, `lessons`. Son aşama yerel öğrenme ilerlemesine, sürüm 1'e isteğe bağlı alan eklenerek kaydedilir; önceki kayıtlar aynen okunur. Öğrenme panelindeki devam düğmesi ve asistanın kaynaklı cevapları ilgili aşamayı açar.

**Erişilebilirlik:** Otomatik/Mobil/Masaüstü seçicisiyle uyumlu; dar görünümde tek sütun. Oynatma kontrolleri yapışkan, HTML düğmeleri en az 44 px; grafik dar alanda kendi içinde kaydırılır. Sistem hareket azaltma tercihi oynatmayı kapatır; aynı inceleme bölümün durağan kare seçeneğiyle de yapılabilir. Sistem/Açık/Koyu tema seçimi yalnız bu bölümü etkiler. Olay değişimi `aria-live="polite"` ile bildirilir.

**Taslak düzeltmeleri:** 1600 MW noktası 13:05'e değil 03:47'ye bağlandı. 200 MW için Tablo I-I'deki 01:03 esas alındı; yaklaşık 01:00 anlatımı ayrıca kaydedildi. ORM fiziksel çubuk sayısı olarak gösterilmedi. 00:28 güç düşüşü, AZ-5'in basılma nedeni ve patlama/tepe güç ayrıntılarındaki belirsizlikler korundu. Bütün satırların kaynak karşılaştırması, kontroller ve ekran görüntüleri: [Çernobil doğrulama kaydı](docs/CHERNOBYL_VERIFICATION.md).