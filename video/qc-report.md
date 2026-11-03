# Kalite kontrol raporu

Tarih: 2026-11-04. Ölçümler FFmpeg skill (`probe.py`, `check.py --content`, `look.py`), faster-whisper ve ses dosyası üzerinde düzey analiziyle yapıldı. **Seslendirme insan kulağıyla dinlenmedi:** bu çalışma ortamında ses çalınamadığı için “dinleme” kontrolleri aşağıdaki nesnel ölçümlerle yerine getirildi; insan dinlemesi önerilir (bkz. son bölüm).

## Teslim dosyaları

| Dosya | Süre | Görüntü | Ses | Boyut |
| --- | --- | --- | --- | --- |
| `final/proje-tanitim-tr-1080p.mp4` | 354,20 sn (05:54.20) | 1920×1080, 16:9, 30 fps sabit, H.264 High, yuv420p, BT.709 sınırlı aralık | AAC stereo 48 kHz | 103,7 MB |
| `final/proje-tanitim-tr-1080p-altyazili.mp4` | 354,20 sn | aynı + işlenmiş tam Türkçe altyazı | AAC stereo 48 kHz | 101,4 MB |
| `final/proje-tanitim-tr.srt` | 83 altyazı, son 00:05:50,177 | UTF-8 | — | 8 KB |

Her iki MP4'te `moov` kutusu `mdat`'tan önce (faststart): `ftyp, moov, free, mdat`.

## `check.py --platform youtube --lufs -16 --tp -1 --content` (her iki dosya)

18 kontrol, **0 başarısız**, 3 uyarı.

| Kontrol | Ana video | Altyazılı |
| --- | --- | --- |
| Süre / en-boy / çözünürlük / fps / VFR / codec / renk etiketi | PASS | PASS |
| Ses akışı | PASS (aac 2ch 48 kHz) | PASS |
| Ses düzeyi (integrated) | PASS −16,0 LUFS | PASS −16,0 LUFS |
| True peak | PASS −2,0 dBTP | PASS −2,3 dBTP |
| Siyah kare | PASS %0 | PASS %0 |
| Donmuş görüntü | PASS en uzun 7,7 sn (eşik 106 sn) | PASS en uzun 5,2 sn |
| Tek karelik sıçrama (flash) | PASS 0 | PASS 0 |
| Sessizlik oranı | PASS %19 | PASS %19 |
| UYARI: altyazı izi yok | Ana videoda altyazı bilerek yok; tam altyazı ayrı SRT ve işlenmiş sürümde | aynı |
| UYARI: ilk kare düz renk | Video bilinçli olarak siyahtan açılıyor (0,8 sn) | aynı |
| UYARI: “dropout” (1 sn altı dijital sessizlik) 50 adet | Cümle aralarındaki planlı duraklar (0,42–1,35 sn); ilk beşi 3,69 / 15,05 / 19,97 / 33,54 / 41,08 sn, hepsi cümle sonu ile sonraki cümle arasına düşüyor. Ses kaybı değil. | aynı |

Ayrıca `loudness.py` sonucu: hedef −16 LUFS, ölçülen −16,01 LUFS, true peak tavanı −1 dBTP. `check.py --content` dosyanın tamamını çözdü (siyah/donma/flash geçişleri tüm kareler üzerinden); çözme hatası raporlanmadı.

İlk tam üretimde bulunan ve düzeltilen hatalar:

1. Sahne sınırlarında tek karelik sıçrama (6 yer) — geçiş örtüsü son karede tam kapanmıyordu; formül düzeltildi, flash = 0.
2. Piksel biçimi `yuvj420p`/tam aralık — JPEG karelerden geliyordu; kareler PNG olarak yeniden yakalandı, sonuç `yuv420p`/sınırlı aralık.
3. Altyazılı sürümde alt vurgu kutularının altyazıyla çakışması (7 yer) — kutular üst bölgeye taşındı; çakışan anlar kare kare kontrol edildi.
4. Uzun cümle altyazılarının bölme zamanı — ilk yöntem (kelime sayımı) bazı yerlerde 0,6–0,9 sn kaydı; bölme artık ses dosyasındaki gerçek duraklardan ölçülüyor.

## Seslendirme kontrolleri

- Motor: VoxCPM2 (audio.cpp v0.7.2 + yama, Q8_0), `hazir/belgesel_hanim`, okuma tohumu 2692139539, 16 adım / CFG 2.0. RTX 4060'ta sorunsuz çalıştı (VRAM tepe ≈ 4,3–4,7 GB).
- Kısa ses denemesi istenen metinle yapıldı. Ham yazımda VVER “VWR” olarak tanındı; fonetik denemede “bi dabılyu ar” PWR ile karıştı. Sonuç: PWR/BWR/RBMK/calandria yazıldığı gibi, VVER → “Ve Ve E Er”, CANDU → “Kandu” (ham hali “Çandu” tanındı), SVG/PNG → harf okunuşları, 1986 → yazıyla. Bu yazımlar yalnız TTS girdisinde; ekranda ve SRT'de yok (SRT'de fonetik yazım sayısı: 0).
- Tam metin sahne sahne, cümle başına ayrı satırla üretildi; repo hız kapısı (`supheli_satirlar`) hiçbir cümleyi işaretlemedi.
- Konuşma tanıma (faster-whisper large-v3-turbo, CPU) ile 62 nihai cümle yazıya döküldü: **ortalama kelime hata oranı %3,9**. %12'nin üstündeki 9 cümlenin farkları rakam/yazım biçimi (“5 reaktör”, “%100'den”), “ikincil → ikinci”, “kollar da → kollarda”, “tarayıcıda → tarayıcı da”, “Çernobil → Çarnobil” türündendir. Ayrıntı: `audio/uretim_kayitlari/asr_rapor.json`.
- İlk üretimde cümle başında kısaltma bulunan 4 cümle bozuk tanındı (“BB Dürüyor”, “PB Biyozeite”, “BBUR”, “PBBury”). Bu cümleler “kaynar su reaktörü / basınçlı su reaktörü” biçiminde yeniden yazılıp aynı ses ve tohumla yeniden üretildi; yeni hata oranları 0,00 / 0,00 / 0,07 / 0,00.
- Ses tutarlılığı: tüm cümleler aynı referans kayıt ve aynı tohumla üretildi (repo yöntemi). Ses rengi tutarlılığı kulakla doğrulanmadı.
- Süre için sesi hızlandırma yapılmadı. Kelime sayısı: ilk taslak 634, nihai 595 (süre 360 sn sınırına sığsın diye 5 cümle çıkarıldı).

## Senkronizasyon

- Görüntü zamanlaması doğrudan ölçülen cümle sürelerinden kuruldu; her sahnenin videosu ve sesi aynı süreye (kare sınırına yuvarlanmış) sahiptir.
- 62 cümle başı altyazısının tamamı konuşmanın başlamasından **0,20–0,26 sn önce** görünür (medyan 0,24 sn; ses dosyası düzey analiziyle ölçüldü) — tutarlı ve olağan bir önden giriş.
- 21 bölünmüş uzun cümlenin 17'sinde geçiş gerçek bir durakta (−41…−50 dBFS); kesintisiz konuşulan 4 cümlede geçiş, son videonun kelime zamanlarından ikinci yarının ilk kelimesine konuldu.
- Görsel olaylar (vurgu, tıklama, yakınlaşma) cümle başlangıçlarına bağlı; sahne başına cümle ortası kareleriyle kontrol edildi.

## Görsel kontroller

- Her sahne için açılış, her cümlenin ortası ve kapanış kareleri; tüm video için 20 ve 36 karelik özet sayfaları (ana ve altyazılı) incelendi.
- Türkçe karakterler (ç, ğ, ı, İ, ö, ş, ü, â) kompozisyon katmanında, uygulamada ve işlenmiş altyazıda doğru görünüyor; altyazı yazı tipi Segoe UI Semibold, yedek yazı tipine düşmedi (`font_used.substituted: false`).
- Altyazı yüksekliği kare yüksekliğinin %6,25'i; en fazla iki satır, koyu kutu üzerinde. Açıklama etiketleri alt 160 px'in üstünde tutuluyor; vurgu kutuları üst bölgede.
- Eksik varlık yok: yakalama sırasında “bulunamadı”, sayfa hatası veya olay hatası kaydı yok (12 sahne, 10 626 kare, tüm sahnelerde beklenen kare sayısı).
- Kapanışta “Türkçe seslendirme yapay zekâ ile üretilmiştir.” notu ve doğrulanmış adres görünüyor.

## Uygulama iddialarının doğrulanması (bu çalışmada)

| Videodaki iddia | Doğrulama |
| --- | --- |
| Çevrimdışı çalışma | Üretim önizlemesinde “Çevrimdışı kullanıma hazır” göründü; ağ kapatılıp sayfa yenilendi, şema açıldı; daha önce açılmamış PWR işletme modülü ve Çernobil bölümü çevrimdışı açıldı (`tools/verify_offline.mjs`). PWA “yükleme” anlatılmadı (bu ortamda denenmedi). |
| SVG/PNG indirme | İki düğme gerçek dosya indirdi (`reactor-pwr-tr.svg`, `reactor-pwr-tr.png`); PNG tam şemayı ve Türkçe etiketleri içeriyor (`tools/verify_export.mjs`). |
| Yerel rehber kaynaklı cevap verir, kapsam dışında uydurmaz | Videoda gerçek soru (“BWR’de buhar nerede oluşuyor?”) ve kapsam dışı soru (“Yarın hava nasıl olacak?”) soruldu; ikincisine “güvenilir bir cevabım yok” yanıtı geldi. |
| Tahmin seçilmeden deney adımı açılmaz | Uygulamada “Tahminimle dene” düğmesi seçim yapılmadan pasif görünüyor (kayıtta görülüyor). |
| İngilizce desteği | Videoda anlatılmadı. |
| Sayısal test/performans iddiası | Kullanılmadı. |

## Kalan sınırlamalar

- Seslendirme ve geçişler insan kulağıyla dinlenmedi; değerlendirme konuşma tanıma, düzey ve zaman ölçümlerine dayanıyor. Özellikle “Ve Ve E Er” okunuşunun, “Çernobil” sesletiminin ve cümleler arası ton tutarlılığının bir kez dinlenmesi önerilir. Hatalı cümle çıkarsa `vo_pipeline.py regen <sahne> <no>` ile yalnız o cümle yeniden üretilip kurgu komutları tekrar çalıştırılabilir (`RENDER.md`).
- Süre 05:54.20; 05:30 hedefinden uzun ama 300–360 sn aralığında.
- Müzik kullanılmadı.
- Bazı arayüz planlarında (keşif, rehber) uygulama metinleri küçük puntoda kalıyor; ana bilgi ses, vurgu etiketi ve altyazıyla verildi.
