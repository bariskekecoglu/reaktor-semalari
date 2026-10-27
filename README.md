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
- **Grafikler**: enerji dönüşümü (nükleer → ısı → buhar → mekanik → elektrik + atılan ısı) ve son 60 simülasyon saniyesinin zaman grafiği.
- **Arayüzde “Kaynaklar ve varsayımlar”** bölümü (sayfa altı).
- Mobilde yan panel alta iner, şema kendi alanında kaydırılır; sayfada yatay taşma yoktur. `prefers-reduced-motion` açıksa animasyon duraklatılmış başlar.

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
- Çevrim verimi sabit **%33** (ders notları: LWR ısı çevrimi ≈ %33). Her an `ısıl = elektrik + atılan ısı`.
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
| `npm test` — 30 birim testi (saat, model, reducer, yapılandırmalar, akış yardımcıları) | Geçti |
| Saat: duraklatma, devamda sıçrama olmaması, hız, tek döngü | Birim testinde sahte rAF kareleriyle doğrulandı |
| Tarayıcıda animasyonun ilerlemesi (güç değişiminde model ve grafik güncelleniyor) | Doğrulandı |
| 20 kez reaktör değişimi sonrası saat abone sayısı aynı (25 → 25), tek döngü | Doğrulandı |
| Sıfırla: zaman 0, grafik geçmişi tek nokta, güç %100 | Doğrulandı |
| Güç %50: ısıl/elektrik gecikmeli düşüş, ısıl = elektrik + atılan ısı | Doğrulandı |
| Ekipman seçimi (fare ve Tab + Enter), vurgulama/soluklaştırma, Esc ile yakın planı kapatma | Doğrulandı |
| Üç sahne, tüm yakın planlar, ders akışı, karşılaştırma görünümü | Ekran görüntüleriyle incelendi |
| Mobil (375 px): sayfada yatay taşma yok, yan panel altta | Doğrulandı |
| Konsol hatası | Görülmedi |

Doğrulanamayanlar: tarayıcı paneli test sırasında arka plana alındığı için `requestAnimationFrame` durdu; bu yüzden duraklat/devam/hız davranışı tarayıcıda gerçek zamanlı ölçülemedi. Bu davranış birim testinde sahte kare zamanlarıyla doğrulandı. Ekran okuyucu ile manuel test yapılmadı.
