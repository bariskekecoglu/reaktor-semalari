# Kaynaklar — tanıtım videosu

Videodaki teknik ifadeler projenin kendi içeriğinden (uygulama metinleri, `README.md`, `docs/IMPLEMENTATION_STATUS.md`, `docs/CHERNOBYL_VERIFICATION.md`, `src/knowledge/sources.ts`) alınmıştır. Video yeni bir teknik iddia veya sayı eklemez; görüntülerin tamamı çalışan uygulamanın üretim derlemesinden yakalanmıştır.

## Teknik içerik (projenin kaynak listesinden)

| Videodaki anlatım | Projedeki dayanak |
| --- | --- |
| PWR: birincil devre yüksek basınçta, çekirdekte toplu kaynama yok; ısı U borularında ikincil devreye geçer; türbine yalnız ikincil buhar gider; basınçlandırıcı basıncı denetler | Uygulamanın PWR özeti ve şema notları; Nuc E 430 ders notları Bölüm 2; [U.S. NRC Student Corner, Unit 3](https://www.nrc.gov/education-regulatory-research/the-student-corner/unit-3-nuclear-reactorsenergy-generation); [IAEA BPTC Modül IV](https://gnssn.iaea.org/main/bptc/BPTC%20Module%20Documents/Module04%20Design%20of%20a%20nuclear%20reactor.pdf) |
| BWR: ayrı buhar üreteci ve basınçlandırıcı yok; kaynama çekirdekte; ayırıcı/kurutucu üzerinden doğrudan türbin; çubuklar alttan; devridaim çekirdek debisini belirler | [U.S. NRC — Boiling Water Reactors](https://www.nrc.gov/reactors/power/bwrs); [NRC Reactor Concepts (R-100)](https://www.nrc.gov/sites/default/files/doc_library/cdn/legacy/reading-rm/training/reactor-concepts-training-course.pdf) |
| VVER: PWR ailesi; yatay buhar üreteci, sıcak/soğuk kolektör, kolların farklı kotları, altıgen yakıt | [N. Trunov ve ark., VVER tasarım özellikleri (IAEA P1500)](https://www-pub.iaea.org/MTCD/Publications/PDF/P1500_CD_Web/htm/pdf/plenary/10KS_N.%20Trunov_PM.pdf); IAEA BPTC Modül IV |
| RBMK: grafit moderatör yığını, dikey basınç kanallarında kaynama, kanal başına buhar–su borusu, ayırıcı tambur, tek basınç kabı yok | [IAEA INSAG-7 (1992)](https://www-pub.iaea.org/MTCD/publications/PDF/Pub913e_web.pdf) §2; [OECD NEA — Chernobyl, Chapter I](https://oecd-nea.org/jcms/pl_28271/chernobyl-chapter-i-the-site-and-accident-sequence) |
| CANDU: yatay calandria ve basınç tüpleri; basınçlı ağır su ısıyı buhar üreteçlerine taşır; düşük basınçlı ayrı moderatör; türbin buharı ayrı ikincil hafif su devresinden; işletmede yakıt değiştirme | CANTEACH: [Qinshan III CANDU](https://ww.nuceng.ca/canteach-rev2/library/20054402.pdf), [Fundamentals Bölüm 11](https://ww.nuceng.ca/canteach-rev2/library/20040711.pdf), [Bölüm 14](https://ww.nuceng.ca/canteach-rev2/library/20040714.pdf), [HTS Thermalhydraulics Ch. 3](https://canteach.candu.org/Content%20Library/20043705.pdf); [CNSC — Pressure tubes](https://www.cnsc-ccsn.gc.ca/eng/resources/fact-sheets/pressure-tubes.cfm). Not: birincil sistem için koşulsuz “hiç kaynama olmaz” denmez (proje kaydı, CANTEACH §3.3); video bu konuda iddia kurmaz. |
| PWR ksenon tahmin dersi (kapatma sonrası ksenon önce artar, saatler sonra azalır) | Nuc E 430 ders notları s. 2-94, Şekil 2-41; uygulamanın temsili iyot/ksenon modeli (`src/lessons/predict/pwrXenonShutdown.ts`) |
| BWR debi dersi (debi ↑ → boşluk ↓ → moderasyon ↑ → güç ↑; boyutsuz neden–sonuç çizimi) | NRC R-100 BWR devridaim açıklaması; `src/lessons/predict/bwrFlow.ts` |
| PWR işletme ve davranış modülü (modlar, ısınma, bor, yük takibi ve ksenon, eksenel güç, otomatik kontrol; olay türleri ■ ◆ ●) | Nuc E 430 ders notları “2.5 PWR Reactor Operations”, s. 2-88 – 2-101 |
| Çernobil 1986 kaza analizi: beş aşama, kaynaklı saatler, temsili bağlantılar, bilinmeyen değerlerin ayrı gösterimi | IAEA INSAG-7 Tablo I-I ve Ek I; OECD NEA Chapter I; ayrıntılı doğrulama: `docs/CHERNOBYL_VERIFICATION.md`. Videoda tarihsel sayı, tepe güç veya neden anlatılmaz; yalnız ekranda uygulamanın kendi kaynaklı zaman çizelgesi görünür. |
| Yerel rehber: hazırlanmış kaynaklı cevapları tarayıcıda eşleştirir, üretken yapay zekâ değildir, kapsam dışı soruda cevap uydurmaz | `README.md` “Asistan” bölümü; `src/assistant/`; videoda kapsam dışı soru gerçekten sorularak gösterildi |
| Öğrenme ilerlemesi yalnız bu cihazda; SVG/PNG indirme; çevrimdışı çalışma | `README.md`; bu video çalışmasında ayrıca doğrulandı (bkz. `qc-report.md`, “Uygulama iddialarının doğrulanması”) |

## Araçlar ve varlıklar

| Araç / varlık | Kullanım | Lisans / not |
| --- | --- | --- |
| Uygulamanın kendisi (`src/`, üretim derlemesi `C:/vidwork/appdist`) | Bütün görüntüler gerçek uygulamadan, sahte saatle kare kare yakalandı | Proje kodu; uygulamada değişiklik yapılmadı |
| [VoxCPM2 Türkçe ses tasarımı](https://github.com/alexturkey/voxcpm2-turkce-ses-tasarimi) (commit `22fca2e`), motor audio.cpp v0.7.2 + yama, model VoxCPM2 Q8_0 GGUF | Türkçe seslendirme, hazır sentetik ses `hazir/belgesel_hanim` | Apache-2.0; ses metin tarifinden tasarlanmış sentetik sestir, kimseden klonlanmamıştır. Videoda “Türkçe seslendirme yapay zekâ ile üretilmiştir.” notu vardır. |
| [ffmpeg-skill](https://github.com/kajisho5/ffmpeg-skill) 3.1.1 | Kare dizisi → video, ses değiştirme, birleştirme, ses düzeyi, altyazı işleme, ölçüm ve kontrol | Repo lisansına göre; FFmpeg 9.0.2 (gyan.dev full build) |
| Playwright 1.48.2 + kurulu Google Chrome | Uygulamayı sahte saatle sürmek ve kare yakalamak | Apache-2.0 |
| faster-whisper 1.1.0, `large-v3-turbo` | Seslendirmenin anlaşılırlık kontrolü ve uzun cümlelerde altyazı bölme zamanı | MIT; yalnız yerelde, CPU üzerinde |
| Yazı tipi: Segoe UI (Windows sistem yazı tipi) | Kompozisyon katmanı ve altyazı | Uygulamanın kendi `--font-ui` değişkeniyle aynı aile |
| Müzik | Kullanılmadı | Kullanım hakkı belli bir müzik eklenmedi; video müziksizdir |

## Proje adresi

Kapanışta gösterilen adres `bariskekecoglu.github.io/reaktor-semalari` 2026-11-03'te HTTP 200 ve uygulamanın başlığıyla (“Reaktör Şemaları — PWR, BWR, VVER, RBMK, CANDU”) doğrulandı. Kaynak depo: `github.com/bariskekecoglu/reaktor-semalari` (herkese açık). QR kod kullanılmadı.
