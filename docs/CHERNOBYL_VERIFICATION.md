# Çernobil bölümü doğrulama kaydı · 2026-10-31

## Kaynak incelemesi

Ana kaynak [IAEA INSAG-7 (1992)](https://www-pub.iaea.org/MTCD/publications/PDF/Pub913e_web.pdf): §2.1–2.3 s. 3–5; §3–6 s. 10–25; güvenlik değişiklikleri eki s. 27–28; Ek I Tablo I-I s. 53–55; §I-4.3–I-4.4 s. 51–59; §I-4.6–I-4.7 s. 64–78. Sayfalar belgenin basılı sayfa numarasıdır, PDF görüntüleyici sıra numarası değildir.

İkinci kaynak [OECD NEA, 2002 değerlendirmesi Bölüm I](https://oecd-nea.org/jcms/pl_28271/chernobyl-chapter-i-the-site-and-accident-sequence): The RBMK-1000 reactor; Events leading to the accident; The accident. NEA'nın özetindeki bazı sayısal/sorumluluk ifadeleri INSAG-7 Ek I ile aynı değildir; aşağıdaki tercihler açıkça belirtilmiştir.

PWR/BWR karşılaştırmasının moderasyon açıklaması için ek dayanak: [BME Void coefficient measurement (2017), IAEA eğitim arşivi](https://nucleus.iaea.org/sites/connect/RRIHpublic/CompendiumDB/Shared%20Documents/Hungary-BME/Protocols%20in%20PDF/Hungary%20BME%2008%20Void%20Coefficient.pdf), §1–2, s. 1–3. Katsayının işareti moderasyon derecesine ve çekirdek düzenine bağlıdır; su moderatörlü her olası tasarıma koşulsuz genellenmez.

## Prompt taslağının doğrulanması / düzeltmeler

| Taslak satırı | Uygulanan karar ve kaynak |
| --- | --- |
| 25 Nisan 01:06 azaltma | Korundu; INSAG-7 Tablo I-I, s. 53. Başlangıç gücü için kaynakta bu saate ait olmayan bir sayı üretilmedi. |
| 13:05, yaklaşık 1600 MW ve türbinin ayrılması | Türbin 7'nin ayrılma saati korundu. 1600 MW noktası kronolojideki **03:47** saatine taşındı; 13:05'e ikinci bir ölçüm atanmıyor (s. 53). |
| 14:00 ECCS ayrılması | Korundu; testin şebeke talebiyle ertelenmesi de aynı saatte. ECCS ayrılması kazanın başlatıcısı olarak gösterilmiyor (s. 53; Ek I §I-4.7.2, s. 72–73). |
| 23:10'a kadar gecikme / ksenon | Tablo I-I'deki 23:10 korundu. NEA yaklaşık 23:00 der. Ksenon için monoton bir birikim eğrisi, miktar veya tek başına nedensellik üretilmedi; sonraki düşük güç ve çubuk çekilmesi bağlamı verildi (§3; Ek I §I-4.7.3, s. 73–74). |
| 00:28 çok düşük güç | Yaklaşık 30 MW, düşük güçte ölçüm belirsizliğiyle sunuldu. Nötron göstergesindeki sıfır ısıl sıfır sayılmadı. Kesin operatör hatası denmedi (Tablo I-I, s. 53; Ek I §I-4.7.3, s. 73–74). |
| Yaklaşık 01:00, 200 MW | Tablo I-I'nin **01:03** kaydı güç noktasında esas alındı (s. 54). Ek I §I-4.7.6 s. 76 ve NEA yaklaşık 01:00 verir. 700–1000 MW test aralığı ile düşük güçte çalışmanın tek başına yasak olması birbirine karıştırılmadı (§3, s. 10–11). |
| 01:03 / 01:07 ek pompalar | Korundu (Tablo I-I, s. 54). Pompa çizgisi bütün pompaların aynı davranışı gibi sunulmuyor; yalnız testte serbest dönen türbinin beslediği pompaların nitel eğilimi (§I-4.6.2, s. 65). |
| 01:22:30 ORM | 8 **eşdeğer** manuel çubuk; kaza sonrası hesaplanan durum. Fiziksel çubuk sayısı ve operatörün o anda gördüğü değer değildir. Alt sınır için INSAG-7'deki 15 kullanıldı; NEA özetindeki 30 / 6–8 anlatımı aktarılmadı (Tablo I-I, s. 54; §4.2, s. 14–15). |
| 01:23:04 test | Korundu (Tablo I-I, s. 54; §I-4.6.2, s. 65). |
| 01:23:40 AZ-5 | Korundu; teleşeritte 01:23:39 alternatifi açıklandı. Basılma nedeni bilinmiyor (Tablo I-I, s. 55; §I-4.6.3, s. 66). |
| Son saniyeler, güç ve patlamalar | 01:23:43'te **530 MW eşiğinin aşılması** tepe ölçümü değildir. 01:23:47 ölçüm arızası ve 01:23:49 kanal hasarı sinyali korundu. 01:24 günlük kaydı son duraktır; patlamalara ayrı kesin saniye eklenmedi. NEA'nın tek tepe tahmini kesin ölçüm olarak aktarılmadı (Tablo I-I, s. 55; §4.1, s. 13; NEA The accident). |

## Teknik doğrulama

- `npm run typecheck`, `npm test`, `npm run build`, `npm run guide:export`, `npm run kb:export`: tamamlandı. 19 dosyada 762 test; bunların 20'si yeni kaza bölümünün kaynak, zaman, gezinme, ilerleme, rehber ve azaltılmış hareket kontrolleridir.
- Rehber: 474 cevap / 3486 soru ifadesi; bilgi tabanı: 189 girdi. Kiril `Чорнобиль`, İngilizce `Chernobyl` ve Türkçe `Çernobil` aynı terime normalize edilir.
- Üretim derlemesinde ana JS parçası için Vite'ın 500 kB uyarısı var; derleme başarılıdır. Kaza görünümü ayrı JS/CSS parçasıdır; yeni bağımlılık eklenmedi.
- Tarayıcıda **1440×1000 / 768×1000 / 390×1000**: her genişlikte beş aşama açıldı. Belge genişliği pencere genişliğini aşmadı; bölümün bütün HTML düğmeleri en az 44 px yükseklikte. Grafik kendi alanında yatay kaydırılır; uzun eksen yazıları küçültülerek okunmaz hale getirilmedi.
- Üç genişlikte oynat/duraklat, önceki/sonraki olay, hız seçimi, kaydırıcının klavyeyle sonuna gitmesi, olay düğmesi, durağan inceleme ve koyu tema denendi. Grafik içindeki AZ-5 işaretine tıklama ayrıca doğrulandı; açıklama ve kaydırıcı 01:23:40'a gitti.
- PWR/BWR/VVER/CANDU'ya geçişte bölüm kayboldu; RBMK'ye dönüş santral şemasını açtı. AZ-5 aşaması yenilemeden sonra bağlantıyla açıldı; Öğrenme panelindeki “Kaldığım yerden devam et” aynı aşamaya döndü. Otomatik/Mobil/Masaüstü geçişlerinde aşama ve 01:23:40 zamanı korundu. Moderatör karşılaştırması doğru konuyu açtı; tarayıcı konsolunda uyarı/hata görülmedi.
- Sistem `prefers-reduced-motion` eşlemesi bileşen testinde doğrulandı; tarayıcıda aynı durağan davranış bölümün “Durağan karelerle incele” seçeneğiyle denendi. İşletim sisteminin hareket ayarı elle değiştirilmedi.
- Gerçek dokunmatik cihaz ve gerçek ekran okuyucu testi yapılmadı. `aria-live` yalnız olay açıklamasında; saat her karede canlı bölgeye okunmaz.
- Görseller: [1440 açık](screenshots/chernobyl/1440-light.jpg), [768 açık](screenshots/chernobyl/768-light.jpg), [390 açık](screenshots/chernobyl/390-light.jpg), [1440 koyu](screenshots/chernobyl/1440-dark.jpg), [768 koyu](screenshots/chernobyl/768-dark.jpg), [390 koyu](screenshots/chernobyl/390-dark.jpg).

## Model sınırları

`stateAt(t)` tarihsel saatten çizim koordinatları üretir; diferansiyel reaktör fiziği çözmez. Debi, boşluk ve çubuk çizimi mühendislik niceliklerine çevrilemez. 01:23:43 sonrası güç ölçeksizdir; 01:23:47 sonrası nitel debi/boşluk/çubuk konumları bilinmiyor olarak kesilir. Çubuk yakın planında bu noktadan sonra yalnız başlangıç geometrisi gösterildiği açıkça yazar.

Saatler ölçeğinde 1× oynatma bir gerçek saniyede bir tarihsel saat, saniyeler ölçeğinde bir gerçek saniyede bir tarihsel saniyedir. 100 ms sunum zamanlayıcısı yalnız bölüm açıkken çalışır; ayrı rAF döngüsü veya ortak eğitim modeline müdahale yoktur. Arka planda zaman atlamasını önlemek için kare adımı sınırlıdır; gerçek zamanlı mühendislik simülasyonu değildir.
