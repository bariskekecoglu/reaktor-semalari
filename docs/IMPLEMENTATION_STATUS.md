# Uygulama durumu (devir notu)

Son güncelleme: 2026-10-31 · RBMK Çernobil kaza analizi eklendi ve doğrulandı. Aşağıdaki aşama notları uygulama sırasındaki tarihsel kayıtları da içerir.


## RBMK · Çernobil 1986 — Kaza analizi (2026-10-31)

- Beş aşamalı kaynaklı tarihsel canlandırma eklendi. Yeni modül: `src/reactors/rbmk/chernobyl/`; ortak santral fiziği ve mevcut RBMK sahnesi değişmedi.
- Reducer'da `rbmkView` ve `chernobylStage`; reaktör/görünüm korumaları, asistan gezinme geri dönüşü, aşama hash bağlantısı ve sürüm 1 ile geriye uyumlu isteğe bağlı ilerleme alanı.
- Ayrık belgelenmiş MW noktaları, temsili bağlantılar, ölçeksiz son saniyeler ve bilinmeyen tepe güç ayrı sunulur. Kanal/pompa/çubuk çizimleri tek sunum zamanına bağlıdır. Oynat/duraklat, olay adımı, hız, kaydırıcı ve tıklanabilir grafik işaretleri; durağan inceleme ve Sistem/Açık/Koyu bölüm teması.
- Yerel rehbere altı cevap, bilgi tabanına beş aşama girdisi; Türkçe/İngilizce/Kiril eş anlamları. Dışa aktarımlar: 474 cevap, 3486 soru ifadesi; 189 bilgi girdisi.
- Doğrulama: typecheck, 19 dosyada 762 test, build ve iki dışa aktarım geçti. 1440/768/390 px'te beş aşama, oynatma kontrolleri, kaydırıcı, olay seçimi ve iki tema denendi; sayfa genelinde yatay taşma yok. Vite ana paket için 500 kB boyut uyarısı veriyor; derleme başarılı.
- Kaynak taslağındaki saat/sayı farkları, kaynak konumları, görüntüler ve ayrıntılı sonuçlar: [CHERNOBYL_VERIFICATION.md](CHERNOBYL_VERIFICATION.md).
- Sınırlar: gerçek ekran okuyucu/dokunmatik cihaz denenmedi. Sistem hareket azaltma davranışı bileşen testinde, durağan kare davranışı tarayıcıda doğrulandı; OS ayarı elle değiştirilmedi. Sayısal RBMK fiziği, kesin son güç zirvesi ve güncel santral güvenlik değerlendirmesi yoktur.

## Kod denetimi ve düzeltmeler (2026-10-31)

- CANDU 6 için kesin “birincil ağır su kaynamaz” anlatımı düzeltildi. CANTEACH, Heat Transport System Thermalhydraulics §3.3, s. 3-2–3-3 sınırlı birincil buharı ve buhar üretecinde yoğuşmasını açıklar. Yeni `canteach-thermal` kaynağı karşılaştırma, ders, bilgi tabanı ve yerel rehbere eklendi. Türbin buharının ayrı ikincil devreden geldiği korundu; iki fazlı davranış animasyonda modellenmez.
- Grafit desenini örten CSS dolgu kuralı düzeltildi; SVG `fill` ile verilen desenler korunur.
- CANDU ana sahnesindeki U borusu animasyonu dış hatlarla ortak bağlantı noktalarına bağlandı ve çizilmiş boru bükülmesiyle eşleştirildi. Yakın plandaki giriş/çıkış kopuklukları ve akışı örten kanal başlığı çizim sırası düzeltildi.
- Yeni regresyon kontrolleri: ana sahnede ve yakın planda gerçek çizilmiş akış uçlarının sürekliliği; yerel rehberde sınırlı kaynama ayrımı ve kaynağı.
- Doğrulama: TypeScript, 18 dosyada 736 test, üretim derlemesi ve her iki içerik dışa aktarımı geçti.
- Bu denetimde görsel kontrol tamamlanamadı: in-app tarayıcı yerel sunucuya bağlanamadı; Windows tarayıcı aracı güncel URL’yi güvenilir doğrulayamadığı için bilgisayar kullanımını durdurdu. Aşağıdaki önceki tarayıcı kontrol kayıtları bu denetimde yeniden doğrulanmadı.

## RBMK ve CANDU (2026-10-31) · TAMAMLANDI

- Yeni modüller: `src/reactors/rbmk/` (RbmkScene, RbmkCoreDetail, RbmkDetails, rbmkConfig, rbmkLessons, rbmkLayout) ve `src/reactors/candu/` (CanduScene, CanduCoreDetail, CanduDetails, canduConfig, canduLessons, canduLayout). Temsili RBMK-1000 ve CANDU 6; kaynaklar ve sadeleştirmeler README’nin “RBMK ve CANDU modülleri” bölümünde.
- Ortak meta veri: `src/reactors/meta.ts` (sıra, kısa ad, ipucu, anlatım kimliği çözümleme). Başlık, karşılaştırma, ilerleme paneli, ilerleme deposu, derin bağlantılar, asistan işlem doğrulaması ve yürütme bu listeyi kullanır; sabitlenmiş üçlü listeler kaldırıldı.
- Ortak çizim: `FlowKind` → `mod` (CANDU moderatörü), `Flow` için `invert` (kanal boyunca ısınma) ve `boilAt` (kaynama başlangıcı); `shared/equipment/materials.tsx` (grafit/ağır su desenleri, akışkan etiketi, kesişme köprüsü); `styles/channel-reactors.css`.
- Karşılaştırma 12 konuya ve beş reaktöre genişledi; `TopicSide.absent` ile “Bu tasarımda bulunmaz” (başka ekipmana yönlendirme yok). Geniş ekranda 3 + 2 kart ve reaktör filtresi; tablo seçili sütunlar.
- Bilgi tabanı: RBMK/CANDU ekipman eş anlamlıları, reaktör takma adları, 8 kaynaklı konu girdisi; 7 yeni kaynak kimliği. Yerel rehber: RBMK/CANDU kategorileri, Türkçe bitişik ekler (ye/ya/ler/lerde…), 6 karışıklık kartı, tüm ikili karşılaştırmalar ve beşli karşılaştırma. 468 cevap, 3463 soru ifadesi.
- PWR işletme modülü ve tahmin dersi RBMK/CANDU’da açılmaz (reducer korumaları değişmedi, testle doğrulandı). Kayıtlı ilerleme sürümü değişmedi; eski kayıtlar aynen okunur.
- Doğrulama: typecheck, 18 dosyada 733 test, build, `guide:export`, `kb:export` geçti. Tarayıcıda 1440/768/390 px genişliklerde sahneler, yakın planlar, karşılaştırma, ders, seçim, duraklatma ve reaktör geçişleri denendi (ayrıntı README).
- Bilinen sınırlar: gerçek dokunmatik cihaz ve ekran okuyucu ile denenmedi; tarayıcı paneli zaman zaman gizli kaldığı için bazı ekran görüntüleri betikle oluşturulan büyütülmüş kopyalardan alındı. CANTEACH belgeleri `ww.nuceng.ca` arşivinden okundu.

## Güncel karar: yalnız yerel rehber (2026-10-30)

Kullanıcı isteğiyle yapay zekâ entegrasyonundan vazgeçildi. Aşağıdaki eski sunucu ve “iki mod” notları tarihsel kayıttır; güncel arayüz model/API çağırmaz, sağlık kontrolü yapmaz ve `VITE_ASSISTANT_ENDPOINT` kullanmaz. Vite vekili ve ana paketteki sunucu başlatma komutu kaldırıldı; önceki sunucu dosyaları korunuyor.

- `guideCatalog.ts`: mevcut 106 bilgi girdisi, karşılaştırmalar, kavramsal ayrımlar, işletme modları/ısınma aşamaları/kontrol ilişkileri ve site kullanımından 205 hazır cevap, 1723 soru ifadesi.
- `guideSearch.ts`: Türkçe sadeleştirme, terim eş anlamları, sınırlı yazım/ek toleransı, açık reaktör filtreleme ve sorunun anahtar sözcüklerini kapsama koşulu. Kapsam dışı cevap üretilmez; tam kapsama iddiası yoktur.
- `GuideLibrary.tsx`: konulara göre hazır sorular, arama ve daha fazla gösterme. Cevaplar kaynak ve doğrulanmış uygulama hedefleri taşır.
- Kısa takip soruları ve belirsiz grafik seçenekleri desteklenir; seçenekler tekrar aynı açıklayıcı soruya dönmez.
- Düzenlenebilir içerik kaynağı: `src/assistant/guideCatalog.ts`; inceleme çıktısı: `docs/LOCAL_GUIDE_QUESTIONS.md` (`npm run guide:export`).
- Doğrulama: 15 dosyada 387 test ve üretim derlemesi (tür kontrolü dahil) geçti. Tarayıcıda soru/cevap, BWR → PWR takip sorusu, konu ve metin filtresi, hazır soru seçimi denendi. 390×844 görünümde kitaplık açıkken sayfa yatay taşmadı ve soru girişi görünür kaldı. Gerçek telefon klavyesi denenmedi.

## Denetim sonrası düzeltme (2026-10-30)

- Tahmin dersinde doğrudan bağlantı ve kayıtlı ilerlemeden açılış, gezinme düğmeleriyle aynı ön koşulları kullanıyor (`predictState.ts`). Kilitli hedef yerine ilk eksik aşama açılır; kendiliğinden atlama yapılmaz.
- Açıklama/değerlendirme için tahmin, tamamlanmış deney ve gözlem gerekir; kullanıcının açık “Atla ve açıklamayı gör” seçimi korunur. Bileşen ilk açılışında da adımı doğrular.
- Yeni regresyon kontrolleri: dört kilitli bağlantı, eksik deney/gözlem, geçerli ilerleme, açık atlama ve tutarsız kayıtla açıklamanın render edilmemesi.
- Son kontrol: 14 dosyada 146 test geçti; `npm run build` (tür kontrolü dahil) geçti.
- Kullanıcı isteğiyle yapay zekâ işleri ertelendi. Denetimde bulunan sağlık kontrolünün kendi isteğini iptal etmesi, eşzamanlılık sınırının gövde okunurken aşılabilmesi ve toplam API bütçesi/kullanıcı kotası eksikleri henüz düzeltilmedi. Bu not önceki “tamamlandı” ifadelerinin yayına hazır olma anlamına gelmediğini belirtir.

## Başlangıç durumu

- `npm test`: 6 dosya, 77 test geçiyordu. Uygulama `npm run dev` ile açılıyor, konsol hatası yok.
- Kullanıcıya ait izlenmeyen dosyalar (`MOBILE_REFINEMENT_PROMPT.md`, `tmp/`) korunuyor; dokunulmadı.
- AGENTS.md / CLAUDE.md yok; proje kuralları README’de.

## Aşama 1 — Şema geometrisi · TAMAMLANDI

Düzeltilen somut sorunlar:

| Reaktör | Sorun | Düzeltme |
| --- | --- | --- |
| PWR | Sıcak kol ve ara bacak uçları (472,562)/(518,562) kanal başlığı yarım elipsinin **dışında** kalıyordu (elips o x’te y≈549). | Giriş/çıkış portları elips üzerinde hesaplanıyor (`ellipseBottom`), bölme plakasının iki yanında. U boru akış yolu girişten başlayıp çıkışta bitiyor. |
| PWR, BWR, VVER | Besleme suyu pompasının yan motoru, kondenserden gelen emme hattının **üzerine** çiziliyordu (boru motorun içinden geçiyor gibi). | Pompa motoru üste alındı; emme sağdan, basma soldan. |
| PWR, BWR, VVER | Kondenser çıkışı ile besleme hattı arasında 6 birimlik **boşluk** vardı. | Hat, kondenser tabanındaki sıcak kuyu çıkış portundan başlıyor. |
| BWR | Devridaim dönüş hattı kap duvarını **nozulsuz** geçiyordu. | Kap duvarına dönüş nozulu eklendi; hat jet pompası sürücü noktasında bitiyor. |
| Üçü | Borunun koruma yapısını delmesi ile duvarla birleşmesi ayırt edilmiyordu. | Geçiş kovanı (penetrasyon) çiziliyor; gerçek T-birleşimlerinde (dalgalanma hattı → sıcak kol, VVER buhar nozulları → başlık) birleşim noktası işareti var. |

- Yeni: `src/reactors/shared/geometry/route.ts` (rota üretimi, port yardımcıları, `pathEnds`), `src/reactors/shared/equipment/PipeMarks.tsx`, `src/reactors/{pwr,bwr,vver}/{pwr,bwr,vver}Layout.ts`.
- Dış hatlar adlandırılmış portlardan üretilen rotaları kullanıyor; Flow bileşeni çizim ve parçacık için aynı `d`’yi kullanmaya devam ediyor.
- Doğrulama: `src/reactors/shared/geometry/geometry.test.ts` (16 test: rota uçları = portlar, portlar ekipman yüzeyinde, VVER sıcak kol kotu, geçişler duvar üzerinde). Tarayıcıda `isPointInStroke` ile 754 parçacığın (PWR 183, BWR 275, VVER 296) tamamı boru/akış hattı içinde. Yakınlaştırılmış ekran görüntüleriyle incelendi.
- Karşılaştırma mini şemalarındaki iki sorun (PWR sıcak kolu basınçlandırıcının içinden geçiyor; VVER sıcak kolu yatay buhar üreteci gövdesinin içinden geçiyor) Aşama 5’te düzeltilecek.

## Aşama 2 — Kaynaklı asistan ve tahmin dersi · TAMAMLANDI (gerçek model çağrısı denenmedi)

- Bilgi tabanı: `src/knowledge/kb.ts` (106 girdi; reaktör, ekipman, odak, anlatım adımı, işletme bölümü, ksenon konusu, tahmin dersi, grafik olayı), `src/knowledge/sources.ts` (kapalı kaynak listesi). Erişim `KnowledgeSource` arayüzü arkasında; vektör veritabanı eklenmedi.
- Kararlı kimlikler: anlatım adımları `pwr.tour.sg` vb.; grafik olayları `xenon:<senaryo>:<anahtar>`; tahmin dersi `pwr.predict.xenon-shutdown`.
- Tiplenmiş işlemler + çalışma zamanı doğrulaması: `src/assistant/actions.ts`; model yanıtı doğrulaması: `src/assistant/modelReply.ts` (uydurma/ilgisiz kaynaklar atılır, kaynaksız yanıt reddedilir).
- Gezinme mevcut reducer’a bağlı (`src/assistant/execute.ts` → `appReducer`); reaktör değiştiren işlemler yalnız kullanıcı tıklamasıyla çalışır ve “simülasyon başa döner” uyarısı taşır. “Vurguyu temizle” ve “Önceki konuma dön” var.
- Yerel rehber (`src/assistant/localGuide.ts`): yapay zekâ değildir; arayüzde öyle adlandırılır. Belirsiz soruda tek açıklayıcı soru, kapsam dışında açık “karşılamıyor” yanıtı.
- Sunucu: `server/assistant-server.mjs` (resmî `@anthropic-ai/sdk`, yalnız `server/` klasöründe). Anahtar yalnız sunucu ortamında; istemci yalnız soru + kısa bağlam + aday içerik kimlikleri gönderir, sunucu metni kendi `server/knowledge.json` kopyasından okur. Zaman aşımı, iptal (istemci kopunca), 8 KB gövde sınırı, 500 karakter soru sınırı, IP başına dakikalık sınır, eşzamanlılık sınırı, çıktı sınırı; soru metni loglanmaz, sohbet saklanmaz.
- Panel: `src/assistant/AssistantPanel.tsx` — geniş ekranda sağ yan panel (içerik sola kayar), orta/dar ekranda alt panel; Esc, odak dönüşü, tek istek kilidi, iptal, sohbeti temizle.
- Tahmin dersi: `src/lessons/predict/` — PWR kapatma sonrası ksenon. Tahminsiz ileri adımlar kilitli; “Atla ve açıklamayı gör” var; yanlış seçeneklerin neden makul göründüğü yazılı; değişken (fisyon gücü %100 → %0) görünür; canlandırma mevcut temsili ksenon modelinden.
- Kontroller: 29 asistan/gezinme testi; tarayıcıda “VVER’in buhar üretecini göster” (onayla VVER’e geçiş + seçim), “Önceki konuma dön”, ksenon sorusu → işletme modülünde olay seçimi (senaryo saati değişmedi); sunucu anahtarsız 503, bozuk JSON 400, 9 KB gövde 413, sınır aşımı 429, geçersiz anahtarla 502 (yalnız hata türü loglandı).

## Aşama 3 — Etiketler ve ayrıntı düzeyi · TAMAMLANDI

- `Label` bileşenine `level` (ana/ayrıntı), `for` (ait olduğu ekipman) ve çok satırlı metin eklendi. Kılavuz çizgiler ince ve kesikli.
- Şema araç çubuğunda “Temel / Ayrıntılı”. Temel’de alt bileşen etiketleri %150 ve üstü yakınlaştırmada kendiliğinden açılır; seçili ekipmanın etiketi her düzeyde görünür ve vurgulanır; şemanın üstünde “Seçili: …” satırı.
- PWR’de iki kılavuz çizgi kesişmesi giderildi (“Buhar üreteci” besleme hattını, “Birincil pompa” ara bacağı kesiyordu). Yeni ayrıntı etiketleri: PWR püskürtme, ısıtıcılar, dalgalanma hattı, ayırıcı/kurutucular, U boruları; BWR jet pompası sürücü nozulu; VVER nem ayırıcı, altıgen yakıt.

## Aşama 4 — Grafik olayları · TAMAMLANDI

- `src/reactors/pwr/operations/models/xenonScenarios.ts`: olaylar kimlik, başlık, zaman, neden-sonuç metni, tür (kaynakta tanımlı ■ / şekilden okunan ◆ / modelden hesaplanan ●), kaynak ve ilgili ekipman taşır. Kapatma senaryolarında Şekil 2-41 tepe zamanı ile model tepe zamanı ayrı olaylardır.
- `components/ChartEvents.tsx`: grafik üzerinde klavye/dokunma ile seçilebilen işaretler; açıklama grafiğin altında; “Senaryo saatini bu olaya götür” ayrı düğme. Asistan aynı olayı açabilir.
- Testler: `xenonScenarios.test.ts` (kimlik biçimi, benzersizlik, kaynak/ekipman geçerliliği, tür ayrımı, şekil–model tepe uyumu, uydurma kimliğin reddi).

## Aşama 5 — Etkileşimli karşılaştırma · TAMAMLANDI

- `src/components/educational/compareTopics.ts`: altı konu (buharın oluştuğu yer, ısının türbine aktarılması, birincil/ikincil ilişkisi, basınçlandırıcı, buhar üreteci düzeni, kontrol çubukları). Her reaktör için açıklama, kapsam (“Reaktör ailesi geneli” / “Çizilen temsili tasarım”), mini şema parçaları, ana şema vurgu kimlikleri, kaynaklar.
- `CompareView.tsx`: konu seçici; vurgulanan parçalar kalın + kesikli çerçeve, diğerleri soluk (yalnız renge bağlı değil); “… şemasında ayrıntılı incele” ana şemaya geçip vurgular. Dar ekranda tek reaktör + reaktör seçici; konu durumda (`compareTopic`) tutulur.
- Mini şema geometrisi düzeltildi: PWR sıcak kolu basınçlandırıcının içinden geçiyordu → basınçlandırıcı üste alındı, dalgalanma hattı ve birleşim noktası eklendi; VVER sıcak kolu yatay buhar üreteci gövdesinin içinden geçiyordu → gövdenin altından sıcak kolektöre, soğuk koldan yüksek kotta. VVER mini şemasına basınçlandırıcı eklendi.
- Test: `compareTopics.test.ts` (ana şema vurgu kimlikleri gerçekten var, kaynaklar kayıtlı, BWR’de basınçlandırıcı/buhar üreteci vurgulanmıyor).

## Aşama 6 — Öğrenme ilerlemesi · TAMAMLANDI

- `src/progress/progressStore.ts`: sürümlü şema (`version: 1`), okurken doğrulama, bozuk/eski/bilinmeyen sürüm → boş başlangıç, kaldırılmış ders/adım kimlikleri atılır ya da ilk adıma düşer, depolama engelliyse bellek arka ucu, serbest metin yok. `ProgressBackend` arayüzü ileride hesap eşitlemesine izin verir (hesap sistemi kurulmadı).
- `ProgressPanel.tsx`: öğrenme görünümünde ilerleme, “Kaldığım yerden devam et”, “İlerlemeyi sıfırla” (onaylı; görünüm tercihini silmez), “yalnız bu cihaz/tarayıcı” notu.
- `deepLink.ts`: `#ders=…&adim=…` doğrudan ders bağlantısı; bilinmeyen kimlik yok sayılır.
- Testler: `progressStore.test.ts` (7), `deepLink.test.ts` (2).

## Son doğrulama (2026-10-30)

| Kontrol | Sonuç |
| --- | --- |
| `npm run typecheck` | Geçti |
| `npm test` | 13 dosya, 138 test geçti (başlangıçta 77) |
| `npm run build` | Geçti |
| Tarayıcı 320×640, 390×844, 844×390 (yatay), 768×1024, 1440×900 | Şema (3 reaktör), işletme/ksenon, karşılaştırma (konu seçili), öğrenme, tahmin dersi ve asistan açıkken sayfa genelinde yatay taşma yok (ölçümle) |
| Sığdır / yakınlaştırma | 390 px’te çizim genişliği 364 → 1300 → 364 px |
| Akış parçacıkları | 754 parçacığın tamamı boru/akış hattı içinde (`isPointInStroke`) |
| Aktif sekme | Dar ekranda işletme sekmesi satırında görünür |
| Görünüm değişimi | Mobil↔Otomatik geçişinde tahmin dersi adımı korunuyor |
| Asistan paneli | Açılınca odak giriş alanında; Esc kapatıyor, odak “Asistan” düğmesine dönüyor; dar/yatay ekranda giriş alanı görünür |
| API hatası | Sunucu yokken “servise ulaşılamadı” notu + yerel rehber yanıtı; site kullanılabilir |
| İlerleme | Yeniden yüklemeden sonra geri geliyor; “Kaldığım yerden devam et” doğru adımı açıyor; bozuk JSON güvenli başlangıç |
| Konsol | Tam akışta (ders, reaktör değişimi, 6 işletme bölümü, 6 karşılaştırma konusu) hata yok. Not: geliştirmede asistan sunucusu çalışmıyorsa vite vekilinin `/api/assistant/health` için verdiği 500 ağ hatası görünür (beklenen; yerel rehbere geçilir). |

## Bilinen sorunlar / sınırlar

- Gerçek model çağrısı **denenmedi** (API anahtarı yok). Sunucu yalnız anahtarsız (503), geçersiz anahtarla (502), bozuk istek (400), büyük gövde (413) ve istek sınırı (429) durumlarında denendi.
- Mobil klavye gerçek cihazda denenmedi; yatay telefonda panel ekranın ~%78’ini kaplıyor (kapatma düğmesi ve üst gezinme görünür kalır).
- Tarayıcı paneli arka plandayken animasyon kareleri kısıldığı için tahmin dersi canlandırmasının gerçek zamanlı hızı ölçülemedi (oynatma ilerliyor; “Sona atla” ile akış doğrulandı).
- Görüntü emülatörü boyut değişiminde `resize` olayı göndermiyor; yerleşim kovası sayfa yenilenince ya da gerçek yeniden boyutlandırmada güncelleniyor (uygulama hatası değil).
- Dar ekranda şema araç çubuğu “Temel / Ayrıntılı” ile üç satıra çıkıyor.
- Ekran okuyucuyla elle test yapılmadı.

## Eksik harici yapılandırma

- `server/.env`: `ANTHROPIC_API_KEY` (ve isteğe bağlı model/sınırlar). Ayrı yayında ön yüz için `VITE_ASSISTANT_ENDPOINT`, sunucu için `ASSISTANT_ALLOWED_ORIGINS`.
- Sunucunun barındırılacağı yer seçilmedi (herhangi bir Node ≥ 20 ortamı).

## Sıradaki somut işlem

1. API anahtarıyla `cd server && npm install && npm start`, `npm run dev` → asistanda örnek soruları gerçek modelle dene; yanıtların doğrulamadan geçtiğini ve reddedilen öneri notlarını kontrol et.
2. Gerçek telefonda klavye açıkken asistan panelini dene.
3. Diğer reaktörler için tahmin dersi ekle (`src/lessons/predict/`, katalog otomatik güncellenir).
