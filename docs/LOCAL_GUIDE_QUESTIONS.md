# Yerel rehber soru-cevap kataloğu

205 hazır cevap; 1723 farklı soru ifadesi.

Bu dosya `npm run guide:export` ile üretilir. Düzenleme yeri: `src/assistant/guideCatalog.ts` ve referans aldığı mevcut ders/ekipman verileri.

Kapsam: PWR, BWR, VVER, karşılaştırma, PWR işletme davranışı ve site kullanımı. Bütün olası soruları kapsadığı iddia edilmez. Kaynakta olmayan cevaplar üretilmez.

## PWR

### PWR Reaktör kabı ve koruma yapısı aynı şey mi?

Kimlik: `concept:pwr:vessel-containment`

Aynı parça değildir; reaktör kabı ve onu çevreleyen koruma yapısının görevleri farklıdır.

Reaktör basınç kabı: Çekirdeği ve birincil soğutucuyu yüksek basınç altında barındırır.

Koruma yapısı (containment): Birincil devreyi çevreleyen çelik astarlı beton yapı.

Kaynaklar: `nuce-ch2`, `nrc-unit3`

<details><summary>Alternatif soru ifadeleri</summary>

- PWR reaktör kabı koruma binası farkı
- PWR kap ve containment farkı

</details>

### PWR Türbin ve jeneratör arasındaki fark nedir?

Kimlik: `concept:pwr:turbine-generator`

Türbin mekanik dönme hareketi sağlar; elektrik jeneratörde üretilir.

Yüksek basınç (YB) türbini: Buharın enerjisinin bir kısmını mil işine dönüştürür.

Jeneratör: Mil işini elektriğe dönüştürür.

Kaynaklar: `nuce-ch2`, `nrc-unit3`

<details><summary>Alternatif soru ifadeleri</summary>

- PWR elektrik türbinde mi jeneratörde mi üretilir
- PWR elektrik nerede üretilir

</details>

### PWR Pompa elektrik üretir mi?

Kimlik: `concept:pwr:pump-generator`

Pompa elektrik üretmez; akışkanı dolaştırır. Elektrik jeneratörde üretilir.

Birincil soğutucu pompası: Birincil suyu kapalı çevrimde dolaştırır.

Jeneratör: Mil işini elektriğe dönüştürür.

Kaynaklar: `nuce-ch2`, `nrc-unit3`

<details><summary>Alternatif soru ifadeleri</summary>

- PWR pompa jeneratör aynı mı
- PWR pompa türbin gibi mi

</details>

### PWR Kondenserden çıkan su nereye gider?

Kimlik: `concept:pwr:condenser-feed`

Yoğuşan su, besleme suyu yolu üzerinden çevrime geri gönderilir.

Kondenser: Türbinden çıkan buharı yoğuşturarak suya çevirir.

Besleme suyu pompası: Yoğuşan suyu buhar üretecine geri basar.

Kaynaklar: `nuce-ch2`, `nrc-unit3`

<details><summary>Alternatif soru ifadeleri</summary>

- PWR besleme suyu nereden gelir
- PWR yoğuşan su tekrar kullanılır mı

</details>

### PWR Kontrol çubukları ile çekirdek arasındaki ilişki nedir?

Kimlik: `concept:pwr:rods-fuel`

Kontrol çubukları yakıt değildir; nötron soğurarak zincirleme tepkimeyi etkiler.

Kontrol çubukları (üstten): Nötron soğurarak zincir reaksiyonun hızını ayarlar.

Reaktör basınç kabı: Çekirdeği ve birincil soğutucuyu yüksek basınç altında barındırır.

Kaynaklar: `nuce-ch2`, `nrc-unit3`

<details><summary>Alternatif soru ifadeleri</summary>

- PWR kontrol çubukları yakıt mı
- PWR kontrol çubukları neyi soğurur

</details>

### PWR Buhar üreteci ile kondenser arasındaki fark nedir?

Kimlik: `concept:pwr:sg-condenser`

Buhar üreteci ikincil suya ısı aktararak buhar üretir; kondenser ise türbin çıkışındaki buharı soğutarak yoğuşturur.

Buhar üreteci (dikey, U borulu): Birincil devrenin ısısını ikincil devreye aktararak buhar üretir.

Kondenser: Türbinden çıkan buharı yoğuşturarak suya çevirir.

Kaynaklar: `nuce-ch2`, `nrc-unit3`

<details><summary>Alternatif soru ifadeleri</summary>

- PWR kondenser buhar üreteci aynı mı
- PWR buhar üreteci yoğuşturucu farkı

</details>

### PWR nedir?

Kimlik: `entry:pwr`

Birincil devredeki su yüksek basınç altında (ders notlarında ~155 bar) tutulduğu için çekirdekte toplu kaynama olmaz. Isı, dikey U borulu buhar üretecinde ayrı bir ikincil devreye aktarılır; türbine yalnız ikincil devrenin buharı gider.

Kaynaklar: `nuce-ch2`, `nrc-unit3`

<details><summary>Alternatif soru ifadeleri</summary>

- PWR Basınçlı Su Reaktörü (PWR) — temsili dikey buhar üreteçli tasarım nedir?
- PWR Basınçlı Su Reaktörü (PWR) — temsili dikey buhar üreteçli tasarım açıkla
- PWR Basınçlı Su Reaktörü (PWR) — temsili dikey buhar üreteçli tasarım göster
- PWR pwr nedir?
- PWR pwr açıkla
- PWR pwr göster
- PWR basınçlı su reaktörü nedir?
- PWR basınçlı su reaktörü açıkla
- PWR basınçlı su reaktörü göster

</details>

### PWR Reaktör basınç kabı ne işe yarar?

Kimlik: `entry:pwr.vessel`

Çekirdeği ve birincil soğutucuyu yüksek basınç altında barındırır.

Soğuk koldan gelen su kap duvarı ile çekirdek gömleği arasındaki halkasal boşluktan (downcomer) aşağı iner, alt plenumdan dönüp çekirdekten yukarı çıkarken ısınır ve sıcak koldan ayrılır. Yüksek basınç nedeniyle duvarlar kalındır.

Kaynaklar: `nuce-ch2`, `nrc-unit3`

<details><summary>Alternatif soru ifadeleri</summary>

- PWR Reaktör basınç kabı nedir?
- PWR Reaktör basınç kabı açıkla
- PWR Reaktör basınç kabı göster
- PWR reaktör kabı nedir?
- PWR reaktör kabı açıkla
- PWR reaktör kabı göster
- PWR basınç kabı nedir?
- PWR basınç kabı açıkla
- PWR basınç kabı göster
- PWR kap nedir?
- PWR kap açıkla
- PWR kap göster
- PWR rpv nedir?
- PWR rpv açıkla
- PWR rpv göster
- PWR Reaktör basınç kabı ne işe yarar?
- PWR Reaktör basınç kabı nasıl çalışır?
- PWR reaktör kabı ne işe yarar?
- PWR reaktör kabı nasıl çalışır?
- PWR basınç kabı ne işe yarar?
- PWR basınç kabı nasıl çalışır?
- PWR kap ne işe yarar?
- PWR kap nasıl çalışır?
- PWR rpv ne işe yarar?
- PWR rpv nasıl çalışır?

</details>

### PWR Kontrol çubukları (üstten) ne işe yarar?

Kimlik: `entry:pwr.rods`

Nötron soğurarak zincir reaksiyonun hızını ayarlar.

PWR’de çubuklar kabın üst kapağındaki sürücülerden aşağı doğru girer. Çubuk konumu gücün tek belirleyicisi değildir: sıcaklık geri beslemesi ve soğutucudaki çözünmüş bor da reaktiviteyi etkiler. Bu nedenle uygulamada çubuk konumu güçle birebir eşlenmez.

Kaynaklar: `nuce-ch2`, `nrc-unit3`

<details><summary>Alternatif soru ifadeleri</summary>

- PWR Kontrol çubukları (üstten) nedir?
- PWR Kontrol çubukları (üstten) açıkla
- PWR Kontrol çubukları (üstten) göster
- PWR kontrol çubuğu nedir?
- PWR kontrol çubuğu açıkla
- PWR kontrol çubuğu göster
- PWR kontrol çubukları nedir?
- PWR kontrol çubukları açıkla
- PWR kontrol çubukları göster
- PWR çubuk nedir?
- PWR çubuk açıkla
- PWR çubuk göster
- PWR Kontrol çubukları (üstten) ne işe yarar?
- PWR Kontrol çubukları (üstten) nasıl çalışır?
- PWR kontrol çubuğu ne işe yarar?
- PWR kontrol çubuğu nasıl çalışır?
- PWR kontrol çubukları ne işe yarar?
- PWR kontrol çubukları nasıl çalışır?
- PWR çubuk ne işe yarar?
- PWR çubuk nasıl çalışır?

</details>

### PWR Basınçlandırıcı ne işe yarar?

Kimlik: `entry:pwr.pressurizer`

Birincil devre basıncını kontrol eder ve hacim değişimlerini karşılar.

Ders notlarına göre içi kabaca %60 su, %40 buhardır. Basınç düşerse elektrikli ısıtıcılar suyun bir kısmını buharlaştırarak basıncı artırır; basınç yükselirse üstteki püskürtme (soğuk koldan beslenir) buharı yoğuşturur. Sıcak kola dalgalanma (surge) hattıyla bağlıdır.

Kaynaklar: `nuce-ch2`, `nrc-unit3`

<details><summary>Alternatif soru ifadeleri</summary>

- PWR Basınçlandırıcı nedir?
- PWR Basınçlandırıcı açıkla
- PWR Basınçlandırıcı göster
- PWR basınçlandırıcı nedir?
- PWR basınçlandırıcı açıkla
- PWR basınçlandırıcı göster
- PWR pressurizer nedir?
- PWR pressurizer açıkla
- PWR pressurizer göster
- PWR basınç kontrolü nedir?
- PWR basınç kontrolü açıkla
- PWR basınç kontrolü göster
- PWR Basınçlandırıcı ne işe yarar?
- PWR Basınçlandırıcı nasıl çalışır?
- PWR basınçlandırıcı ne işe yarar?
- PWR basınçlandırıcı nasıl çalışır?
- PWR pressurizer ne işe yarar?
- PWR pressurizer nasıl çalışır?
- PWR basınç kontrolü ne işe yarar?
- PWR basınç kontrolü nasıl çalışır?

</details>

### PWR Buhar üreteci (dikey, U borulu) ne işe yarar?

Kimlik: `entry:pwr.sg`

Birincil devrenin ısısını ikincil devreye aktararak buhar üretir.

Sıcak birincil su alt kanal başlığından U borularına girer, boruların içinde kalır ve soğuyarak çıkar. Isı boru duvarından geçer; boruların dışındaki ikincil su kaynar. Üst bölümdeki ayırıcılar ve kurutucular nemi alır; türbine kuru doymuş buhar gider.

Kaynaklar: `nuce-ch2`, `nrc-unit3`

<details><summary>Alternatif soru ifadeleri</summary>

- PWR Buhar üreteci (dikey, U borulu) nedir?
- PWR Buhar üreteci (dikey, U borulu) açıkla
- PWR Buhar üreteci (dikey, U borulu) göster
- PWR buhar üreteci nedir?
- PWR buhar üreteci açıkla
- PWR buhar üreteci göster
- PWR buhar jeneratörü nedir?
- PWR buhar jeneratörü açıkla
- PWR buhar jeneratörü göster
- PWR steam generator nedir?
- PWR steam generator açıkla
- PWR steam generator göster
- PWR u boru nedir?
- PWR u boru açıkla
- PWR u boru göster
- PWR dikey buhar üreteci nedir?
- PWR dikey buhar üreteci açıkla
- PWR dikey buhar üreteci göster
- PWR Buhar üreteci (dikey, U borulu) ne işe yarar?
- PWR Buhar üreteci (dikey, U borulu) nasıl çalışır?
- PWR buhar üreteci ne işe yarar?
- PWR buhar üreteci nasıl çalışır?
- PWR buhar jeneratörü ne işe yarar?
- PWR buhar jeneratörü nasıl çalışır?
- PWR steam generator ne işe yarar?
- PWR steam generator nasıl çalışır?
- PWR u boru ne işe yarar?
- PWR u boru nasıl çalışır?
- PWR dikey buhar üreteci ne işe yarar?
- PWR dikey buhar üreteci nasıl çalışır?

</details>

### PWR Sıcak kol ne işe yarar?

Kimlik: `entry:pwr.hotleg`

Çekirdekte ısınan birincil suyu buhar üretecine taşır.

Reaktör çıkış nozulundan buhar üretecinin giriş kanal başlığına uzanır. Su basınç altında sıvıdır; şemada turuncu-kırmızı ve düz çizgiyle gösterilir.

Kaynaklar: `nuce-ch2`, `nrc-unit3`

<details><summary>Alternatif soru ifadeleri</summary>

- PWR Sıcak kol nedir?
- PWR Sıcak kol açıkla
- PWR Sıcak kol göster
- PWR sıcak kol nedir?
- PWR sıcak kol açıkla
- PWR sıcak kol göster
- PWR hot leg nedir?
- PWR hot leg açıkla
- PWR hot leg göster
- PWR Sıcak kol ne işe yarar?
- PWR Sıcak kol nasıl çalışır?
- PWR sıcak kol ne işe yarar?
- PWR sıcak kol nasıl çalışır?
- PWR hot leg ne işe yarar?
- PWR hot leg nasıl çalışır?

</details>

### PWR Soğuk kol ne işe yarar?

Kimlik: `entry:pwr.coldleg`

Buhar üretecinde soğuyan birincil suyu pompa üzerinden reaktöre geri gönderir.

Buhar üreteci çıkışından pompaya giden ara bacak ve pompadan reaktör giriş nozuluna giden kısımdan oluşur. Şemada mavi ve düz çizgiyle gösterilir.

Kaynaklar: `nuce-ch2`, `nrc-unit3`

<details><summary>Alternatif soru ifadeleri</summary>

- PWR Soğuk kol nedir?
- PWR Soğuk kol açıkla
- PWR Soğuk kol göster
- PWR soğuk kol nedir?
- PWR soğuk kol açıkla
- PWR soğuk kol göster
- PWR cold leg nedir?
- PWR cold leg açıkla
- PWR cold leg göster
- PWR Soğuk kol ne işe yarar?
- PWR Soğuk kol nasıl çalışır?
- PWR soğuk kol ne işe yarar?
- PWR soğuk kol nasıl çalışır?
- PWR cold leg ne işe yarar?
- PWR cold leg nasıl çalışır?

</details>

### PWR Birincil soğutucu pompası ne işe yarar?

Kimlik: `entry:pwr.rcp`

Birincil suyu kapalı çevrimde dolaştırır.

Dikey motorlu santrifüj pompadır. Birincil debi büyük ölçüde sabit tutulur; güç değişince debiden çok çekirdek giriş-çıkış sıcaklık farkı değişir. Bu yüzden şemada birincil akış hızı güçle değişmez.

Kaynaklar: `nuce-ch2`, `nrc-unit3`

<details><summary>Alternatif soru ifadeleri</summary>

- PWR Birincil soğutucu pompası nedir?
- PWR Birincil soğutucu pompası açıkla
- PWR Birincil soğutucu pompası göster
- PWR birincil pompa nedir?
- PWR birincil pompa açıkla
- PWR birincil pompa göster
- PWR soğutucu pompası nedir?
- PWR soğutucu pompası açıkla
- PWR soğutucu pompası göster
- PWR reaktör soğutucu pompası nedir?
- PWR reaktör soğutucu pompası açıkla
- PWR reaktör soğutucu pompası göster
- PWR pompa nedir?
- PWR pompa açıkla
- PWR pompa göster
- PWR Birincil soğutucu pompası ne işe yarar?
- PWR Birincil soğutucu pompası nasıl çalışır?
- PWR birincil pompa ne işe yarar?
- PWR birincil pompa nasıl çalışır?
- PWR soğutucu pompası ne işe yarar?
- PWR soğutucu pompası nasıl çalışır?
- PWR reaktör soğutucu pompası ne işe yarar?
- PWR reaktör soğutucu pompası nasıl çalışır?
- PWR pompa ne işe yarar?
- PWR pompa nasıl çalışır?

</details>

### PWR Ana buhar hattı ne işe yarar?

Kimlik: `entry:pwr.steamline`

Buhar üretecinde oluşan ikincil buharı türbine götürür.

Bu hattaki buhar ikincil devreye aittir; birincil soğutucu türbine gitmez. Koruma yapısını bir geçişle terk eder.

Kaynaklar: `nuce-ch2`, `nrc-unit3`

<details><summary>Alternatif soru ifadeleri</summary>

- PWR Ana buhar hattı nedir?
- PWR Ana buhar hattı açıkla
- PWR Ana buhar hattı göster
- PWR ana buhar hattı nedir?
- PWR ana buhar hattı açıkla
- PWR ana buhar hattı göster
- PWR buhar hattı nedir?
- PWR buhar hattı açıkla
- PWR buhar hattı göster
- PWR Ana buhar hattı ne işe yarar?
- PWR Ana buhar hattı nasıl çalışır?
- PWR ana buhar hattı ne işe yarar?
- PWR ana buhar hattı nasıl çalışır?
- PWR buhar hattı ne işe yarar?
- PWR buhar hattı nasıl çalışır?

</details>

### PWR Yüksek basınç (YB) türbini ne işe yarar?

Kimlik: `entry:pwr.hp`

Buharın enerjisinin bir kısmını mil işine dönüştürür.

Doymuş buhar YB türbininde genişler; çıkışta geçiş borusuyla AB türbinine gider.

Kaynaklar: `nuce-ch2`, `nrc-unit3`

<details><summary>Alternatif soru ifadeleri</summary>

- PWR Yüksek basınç (YB) türbini nedir?
- PWR Yüksek basınç (YB) türbini açıkla
- PWR Yüksek basınç (YB) türbini göster
- PWR yüksek basınç türbini nedir?
- PWR yüksek basınç türbini açıkla
- PWR yüksek basınç türbini göster
- PWR yb türbini nedir?
- PWR yb türbini açıkla
- PWR yb türbini göster
- PWR türbin nedir?
- PWR türbin açıkla
- PWR türbin göster
- PWR Yüksek basınç (YB) türbini ne işe yarar?
- PWR Yüksek basınç (YB) türbini nasıl çalışır?
- PWR yüksek basınç türbini ne işe yarar?
- PWR yüksek basınç türbini nasıl çalışır?
- PWR yb türbini ne işe yarar?
- PWR yb türbini nasıl çalışır?
- PWR türbin ne işe yarar?
- PWR türbin nasıl çalışır?

</details>

### PWR Alçak basınç (AB) türbini ne işe yarar?

Kimlik: `entry:pwr.lp`

Buhar enerjisinin kalanını mekanik enerjiye çevirir.

Çift akışlıdır: buhar ortadan girip iki yöne genişler ve alttaki kondensere boşalır. Türbinler ve jeneratör aynı mil üzerindedir.

Kaynaklar: `nuce-ch2`, `nrc-unit3`

<details><summary>Alternatif soru ifadeleri</summary>

- PWR Alçak basınç (AB) türbini nedir?
- PWR Alçak basınç (AB) türbini açıkla
- PWR Alçak basınç (AB) türbini göster
- PWR alçak basınç türbini nedir?
- PWR alçak basınç türbini açıkla
- PWR alçak basınç türbini göster
- PWR ab türbini nedir?
- PWR ab türbini açıkla
- PWR ab türbini göster
- PWR türbin nedir?
- PWR türbin açıkla
- PWR türbin göster
- PWR Alçak basınç (AB) türbini ne işe yarar?
- PWR Alçak basınç (AB) türbini nasıl çalışır?
- PWR alçak basınç türbini ne işe yarar?
- PWR alçak basınç türbini nasıl çalışır?
- PWR ab türbini ne işe yarar?
- PWR ab türbini nasıl çalışır?
- PWR türbin ne işe yarar?
- PWR türbin nasıl çalışır?

</details>

### PWR Jeneratör ne işe yarar?

Kimlik: `entry:pwr.gen`

Mil işini elektriğe dönüştürür.

Şebekeye senkron bağlı olduğundan sabit hızda döner (50 Hz şebekede iki kutuplu makine için 3000 dev/dk). Güç değişince hız değil, mildeki tork ve akım değişir; şemadaki mil animasyonu bu nedenle güçten bağımsızdır.

Kaynaklar: `nuce-ch2`, `nrc-unit3`

<details><summary>Alternatif soru ifadeleri</summary>

- PWR Jeneratör nedir?
- PWR Jeneratör açıkla
- PWR Jeneratör göster
- PWR jeneratör nedir?
- PWR jeneratör açıkla
- PWR jeneratör göster
- PWR generatör nedir?
- PWR generatör açıkla
- PWR generatör göster
- PWR elektrik üretimi nedir?
- PWR elektrik üretimi açıkla
- PWR elektrik üretimi göster
- PWR Jeneratör ne işe yarar?
- PWR Jeneratör nasıl çalışır?
- PWR jeneratör ne işe yarar?
- PWR jeneratör nasıl çalışır?
- PWR generatör ne işe yarar?
- PWR generatör nasıl çalışır?
- PWR elektrik üretimi ne işe yarar?
- PWR elektrik üretimi nasıl çalışır?

</details>

### PWR Kondenser ne işe yarar?

Kimlik: `entry:pwr.condenser`

Türbinden çıkan buharı yoğuşturarak suya çevirir.

Buhar, içinden soğutma suyu geçen boruların dışında yoğuşur ve alttaki sıcak kuyuda (hotwell) toplanır. Gizli ısı soğutma suyuna aktarılır; soğutma suyu borular içinde kalır, ikincil su ile karışmaz.

Kaynaklar: `nuce-ch2`, `nrc-unit3`

<details><summary>Alternatif soru ifadeleri</summary>

- PWR Kondenser nedir?
- PWR Kondenser açıkla
- PWR Kondenser göster
- PWR kondenser nedir?
- PWR kondenser açıkla
- PWR kondenser göster
- PWR yoğuşturucu nedir?
- PWR yoğuşturucu açıkla
- PWR yoğuşturucu göster
- PWR yoğuşma nedir?
- PWR yoğuşma açıkla
- PWR yoğuşma göster
- PWR Kondenser ne işe yarar?
- PWR Kondenser nasıl çalışır?
- PWR kondenser ne işe yarar?
- PWR kondenser nasıl çalışır?
- PWR yoğuşturucu ne işe yarar?
- PWR yoğuşturucu nasıl çalışır?
- PWR yoğuşma ne işe yarar?
- PWR yoğuşma nasıl çalışır?

</details>

### PWR Besleme suyu pompası ne işe yarar?

Kimlik: `entry:pwr.feedpump`

Yoğuşan suyu buhar üretecine geri basar.

Kondenserden gelen su ön ısıtıcıdan geçirilerek buhar üretecinin ikincil tarafına (besleme halkasına) gönderilir.

Kaynaklar: `nuce-ch2`, `nrc-unit3`

<details><summary>Alternatif soru ifadeleri</summary>

- PWR Besleme suyu pompası nedir?
- PWR Besleme suyu pompası açıkla
- PWR Besleme suyu pompası göster
- PWR besleme suyu pompası nedir?
- PWR besleme suyu pompası açıkla
- PWR besleme suyu pompası göster
- PWR besleme pompası nedir?
- PWR besleme pompası açıkla
- PWR besleme pompası göster
- PWR Besleme suyu pompası ne işe yarar?
- PWR Besleme suyu pompası nasıl çalışır?
- PWR besleme suyu pompası ne işe yarar?
- PWR besleme suyu pompası nasıl çalışır?
- PWR besleme pompası ne işe yarar?
- PWR besleme pompası nasıl çalışır?

</details>

### PWR Besleme suyu ön ısıtıcısı ne işe yarar?

Kimlik: `entry:pwr.heater`

Besleme suyunu buhar üretecine girmeden önce ısıtır.

Gerçek tesislerde türbinden alınan ara buharla çalışan birden çok ısıtıcı bulunur; burada tek kutu ile sadeleştirildi.

Kaynaklar: `nuce-ch2`, `nrc-unit3`

<details><summary>Alternatif soru ifadeleri</summary>

- PWR Besleme suyu ön ısıtıcısı nedir?
- PWR Besleme suyu ön ısıtıcısı açıkla
- PWR Besleme suyu ön ısıtıcısı göster
- PWR ön ısıtıcı nedir?
- PWR ön ısıtıcı açıkla
- PWR ön ısıtıcı göster
- PWR besleme suyu ısıtıcısı nedir?
- PWR besleme suyu ısıtıcısı açıkla
- PWR besleme suyu ısıtıcısı göster
- PWR Besleme suyu ön ısıtıcısı ne işe yarar?
- PWR Besleme suyu ön ısıtıcısı nasıl çalışır?
- PWR ön ısıtıcı ne işe yarar?
- PWR ön ısıtıcı nasıl çalışır?
- PWR besleme suyu ısıtıcısı ne işe yarar?
- PWR besleme suyu ısıtıcısı nasıl çalışır?

</details>

### PWR Soğutma suyu çevrimi ne işe yarar?

Kimlik: `entry:pwr.coolsource`

Kondenserdeki ısıyı çevreye atar.

Ayrı bir üçüncü çevrimdir (deniz, nehir, göl veya soğutma kulesi). Şemada yeşil-turkuaz ve kesik-noktalı çizgiyle gösterilir.

Kaynaklar: `nuce-ch2`, `nrc-unit3`

<details><summary>Alternatif soru ifadeleri</summary>

- PWR Soğutma suyu çevrimi nedir?
- PWR Soğutma suyu çevrimi açıkla
- PWR Soğutma suyu çevrimi göster
- PWR soğutma suyu nedir?
- PWR soğutma suyu açıkla
- PWR soğutma suyu göster
- PWR soğutma kulesi nedir?
- PWR soğutma kulesi açıkla
- PWR soğutma kulesi göster
- PWR Soğutma suyu çevrimi ne işe yarar?
- PWR Soğutma suyu çevrimi nasıl çalışır?
- PWR soğutma suyu ne işe yarar?
- PWR soğutma suyu nasıl çalışır?
- PWR soğutma kulesi ne işe yarar?
- PWR soğutma kulesi nasıl çalışır?

</details>

### PWR Koruma yapısı (containment) ne işe yarar?

Kimlik: `entry:pwr.containment`

Birincil devreyi çevreleyen çelik astarlı beton yapı.

PWR’de radyoaktif birincil devre (kap, pompa, basınçlandırıcı, buhar üreteci) bu yapının içindedir; türbin tarafı dışarıdadır.

Kaynaklar: `nuce-ch2`, `nrc-unit3`

<details><summary>Alternatif soru ifadeleri</summary>

- PWR Koruma yapısı (containment) nedir?
- PWR Koruma yapısı (containment) açıkla
- PWR Koruma yapısı (containment) göster
- PWR koruma yapısı nedir?
- PWR koruma yapısı açıkla
- PWR koruma yapısı göster
- PWR containment nedir?
- PWR containment açıkla
- PWR containment göster
- PWR koruma binası nedir?
- PWR koruma binası açıkla
- PWR koruma binası göster
- PWR Koruma yapısı (containment) ne işe yarar?
- PWR Koruma yapısı (containment) nasıl çalışır?
- PWR koruma yapısı ne işe yarar?
- PWR koruma yapısı nasıl çalışır?
- PWR containment ne işe yarar?
- PWR containment nasıl çalışır?
- PWR koruma binası ne işe yarar?
- PWR koruma binası nasıl çalışır?

</details>

### PWR Dalgalanma (surge) hattı ne işe yarar?

Kimlik: `entry:pwr.surge`

Basınçlandırıcıyı sıcak kola bağlar.

Birincil sudaki ısıl genleşme/büzülme bu hat üzerinden basınçlandırıcıya girip çıkar.

Kaynaklar: `nuce-ch2`, `nrc-unit3`

<details><summary>Alternatif soru ifadeleri</summary>

- PWR Dalgalanma (surge) hattı nedir?
- PWR Dalgalanma (surge) hattı açıkla
- PWR Dalgalanma (surge) hattı göster
- PWR dalgalanma hattı nedir?
- PWR dalgalanma hattı açıkla
- PWR dalgalanma hattı göster
- PWR surge hattı nedir?
- PWR surge hattı açıkla
- PWR surge hattı göster
- PWR Dalgalanma (surge) hattı ne işe yarar?
- PWR Dalgalanma (surge) hattı nasıl çalışır?
- PWR dalgalanma hattı ne işe yarar?
- PWR dalgalanma hattı nasıl çalışır?
- PWR surge hattı ne işe yarar?
- PWR surge hattı nasıl çalışır?

</details>

### PWR Basınçlandırıcının görevi açıkla

Kimlik: `entry:pwr.focus.pzr`

Basınçlandırıcı, birincil suyun kaynamaması için basıncı yüksek tutar. Isıtıcılar basıncı yükseltir, püskürtme düşürür. Su/buhar ara yüzü yalnız burada, kontrollü olarak bulunur.

Kaynaklar: `nuce-ch2`, `nrc-unit3`

<details><summary>Alternatif soru ifadeleri</summary>

- PWR Basınçlandırıcının görevi nedir?
- PWR Basınçlandırıcının görevi açıkla
- PWR Basınçlandırıcının görevi göster

</details>

### PWR İki devre neden ayrı? açıkla

Kimlik: `entry:pwr.focus.loops`

Buhar üreteci birincil ve ikincil devreyi ayırır: radyoaktif maddeler büyük ölçüde birincil devrede ve koruma yapısında kalır, türbin bakımında doz azalır. İki devre arasında akışkan değil, yalnız ısı geçer.

Kaynaklar: `nuce-ch2`, `nrc-unit3`

<details><summary>Alternatif soru ifadeleri</summary>

- PWR İki devre neden ayrı? nedir?
- PWR İki devre neden ayrı? açıkla
- PWR İki devre neden ayrı? göster

</details>

### PWR Buhar üreteci yakın planı açıkla

Kimlik: `entry:pwr.focus.sgzoom`

U boruları, boru levhası, bölme plakası, ayırıcılar ve kurutucular yakın planda.

Kaynaklar: `nuce-ch2`, `nrc-unit3`

<details><summary>Alternatif soru ifadeleri</summary>

- PWR Buhar üreteci yakın planı nedir?
- PWR Buhar üreteci yakın planı açıkla
- PWR Buhar üreteci yakın planı göster

</details>

### PWR Sıcak kolu vurgula açıkla

Kimlik: `entry:pwr.focus.hot`

Sıcak kol: reaktör çıkışından buhar üretecine. Çekirdekte ısınan su, kaynamadan, basınç altında sıvı olarak taşınır.

Kaynaklar: `nuce-ch2`, `nrc-unit3`

<details><summary>Alternatif soru ifadeleri</summary>

- PWR Sıcak kolu vurgula nedir?
- PWR Sıcak kolu vurgula açıkla
- PWR Sıcak kolu vurgula göster

</details>

### PWR Soğuk kolu vurgula açıkla

Kimlik: `entry:pwr.focus.cold`

Soğuk kol: buhar üreteci çıkışından pompaya ve reaktör girişine. Soğumuş su kabın halkasal boşluğundan aşağı iner.

Kaynaklar: `nuce-ch2`, `nrc-unit3`

<details><summary>Alternatif soru ifadeleri</summary>

- PWR Soğuk kolu vurgula nedir?
- PWR Soğuk kolu vurgula açıkla
- PWR Soğuk kolu vurgula göster

</details>

### PWR PWR anlatımı · 1. Çekirdek açıkla

Kimlik: `entry:pwr.tour.core`

Uranyum-235 çekirdekleri nötronla bölünür; açığa çıkan enerji yakıt çubuklarında ısıya dönüşür. Kontrol çubukları üstten girer ve nötron soğurarak reaksiyonu ayarlar. Su hem soğutucu hem yavaşlatıcıdır.

Kaynaklar: `nuce-ch2`, `nrc-unit3`

<details><summary>Alternatif soru ifadeleri</summary>

- PWR PWR anlatımı · 1. Çekirdek nedir?
- PWR PWR anlatımı · 1. Çekirdek açıkla
- PWR PWR anlatımı · 1. Çekirdek göster
- PWR Çekirdek nedir?
- PWR Çekirdek açıkla
- PWR Çekirdek göster

</details>

### PWR PWR anlatımı · 2. Birincil devre açıkla

Kimlik: `entry:pwr.tour.primary`

Birincil su yüksek basınç altında tutulur; çekirdekte ısınır ama normal çalışmada toplu olarak kaynamaz. Pompa suyu kapalı çevrimde dolaştırır, basınçlandırıcı basıncı ayarlar.

Kaynaklar: `nuce-ch2`, `nrc-unit3`

<details><summary>Alternatif soru ifadeleri</summary>

- PWR PWR anlatımı · 2. Birincil devre nedir?
- PWR PWR anlatımı · 2. Birincil devre açıkla
- PWR PWR anlatımı · 2. Birincil devre göster
- PWR Birincil devre nedir?
- PWR Birincil devre açıkla
- PWR Birincil devre göster

</details>

### PWR PWR anlatımı · 3. Buhar üreteci açıkla

Kimlik: `entry:pwr.tour.sg`

Sıcak birincil su U borularının içinden geçer. Isı boru duvarından ikincil tarafa aktarılır ve borular dışındaki ikincil su kaynar. Akışkanlar karışmaz; yalnız enerji geçer.

Kaynaklar: `nuce-ch2`, `nrc-unit3`

<details><summary>Alternatif soru ifadeleri</summary>

- PWR PWR anlatımı · 3. Buhar üreteci nedir?
- PWR PWR anlatımı · 3. Buhar üreteci açıkla
- PWR PWR anlatımı · 3. Buhar üreteci göster
- PWR Buhar üreteci nedir?
- PWR Buhar üreteci açıkla
- PWR Buhar üreteci göster

</details>

### PWR PWR anlatımı · 4. Türbin ve jeneratör açıkla

Kimlik: `entry:pwr.tour.turbine`

İkincil devrenin buharı ana buhar hattıyla YB türbinine, oradan AB türbinine gider. Türbinler ve jeneratör aynı mili döndürür; mekanik enerji elektriğe çevrilir.

Kaynaklar: `nuce-ch2`, `nrc-unit3`

<details><summary>Alternatif soru ifadeleri</summary>

- PWR PWR anlatımı · 4. Türbin ve jeneratör nedir?
- PWR PWR anlatımı · 4. Türbin ve jeneratör açıkla
- PWR PWR anlatımı · 4. Türbin ve jeneratör göster
- PWR Türbin ve jeneratör nedir?
- PWR Türbin ve jeneratör açıkla
- PWR Türbin ve jeneratör göster

</details>

### PWR PWR anlatımı · 5. Kondenser açıkla

Kimlik: `entry:pwr.tour.condenser`

Türbinden çıkan buhar, içinden soğutma suyu geçen boruların üzerinde yoğuşur. Bu ısı ayrı soğutma suyu çevrimiyle çevreye atılır; soğutma suyu ikincil su ile karışmaz.

Kaynaklar: `nuce-ch2`, `nrc-unit3`

<details><summary>Alternatif soru ifadeleri</summary>

- PWR PWR anlatımı · 5. Kondenser nedir?
- PWR PWR anlatımı · 5. Kondenser açıkla
- PWR PWR anlatımı · 5. Kondenser göster
- PWR Kondenser nedir?
- PWR Kondenser açıkla
- PWR Kondenser göster

</details>

### PWR PWR anlatımı · 6. Dönüş açıkla

Kimlik: `entry:pwr.tour.return`

Yoğuşan su besleme pompası ve ön ısıtıcı üzerinden buhar üretecinin ikincil tarafına geri döner; ikincil çevrim tamamlanır. Birincil çevrim ise kendi içinde reaktöre döner.

Kaynaklar: `nuce-ch2`, `nrc-unit3`

<details><summary>Alternatif soru ifadeleri</summary>

- PWR PWR anlatımı · 6. Dönüş nedir?
- PWR PWR anlatımı · 6. Dönüş açıkla
- PWR PWR anlatımı · 6. Dönüş göster
- PWR Dönüş nedir?
- PWR Dönüş açıkla
- PWR Dönüş göster

</details>

### PWR PWR’de buhar nerede oluşur? açıkla

Kimlik: `entry:pwr.topic.steam-where`

Buhar, dikey U borulu buhar üretecinin ikincil (gövde) tarafında oluşur. Birincil su yüksek basınçta tutulduğu için normal çalışmada çekirdekte toplu kaynama olmaz; iki devre arasında yalnız ısı geçer.

Kaynaklar: `nuce-ch2`, `nrc-unit3`

<details><summary>Alternatif soru ifadeleri</summary>

- PWR PWR’de buhar nerede oluşur? nedir?
- PWR PWR’de buhar nerede oluşur? açıkla
- PWR PWR’de buhar nerede oluşur? göster
- PWR buhar nerede oluşuyor nedir?
- PWR buhar nerede oluşuyor açıkla
- PWR buhar nerede oluşuyor göster
- PWR buhar oluşumu nedir?
- PWR buhar oluşumu açıkla
- PWR buhar oluşumu göster
- PWR kaynama nerede nedir?
- PWR kaynama nerede açıkla
- PWR kaynama nerede göster
- PWR buhar nerede nedir?
- PWR buhar nerede açıkla
- PWR buhar nerede göster

</details>

### PWR Tahmin dersi · Kapatmadan sonra ksenon ne yapar? açıkla

Kimlik: `entry:pwr.predict.xenon-shutdown`

Reaktör kapatıldıktan sonraki saatlerde ksenon-135’in neden önce artıp sonra azaldığını açıklayabilmek.

Kaynaklar: `p-2-94`, `fig-2-41`, `model-xenon`

<details><summary>Alternatif soru ifadeleri</summary>

- PWR Tahmin dersi · Kapatmadan sonra ksenon ne yapar? nedir?
- PWR Tahmin dersi · Kapatmadan sonra ksenon ne yapar? açıkla
- PWR Tahmin dersi · Kapatmadan sonra ksenon ne yapar? göster
- PWR tahmin dersi nedir?
- PWR tahmin dersi açıkla
- PWR tahmin dersi göster
- PWR tahmin et nedir?
- PWR tahmin et açıkla
- PWR tahmin et göster
- PWR Kapatmadan sonra ksenon ne yapar? nedir?
- PWR Kapatmadan sonra ksenon ne yapar? açıkla
- PWR Kapatmadan sonra ksenon ne yapar? göster

</details>

### PWR Türbine giden buhar nerede oluşur?

Kimlik: `compare:steam-where:pwr`

Buhar üretecinin ikincil (gövde) tarafında. Birincil devrede normal çalışmada toplu kaynama olmaz.

Kaynaklar: `nuce-ch2`, `nrc-unit3`

<details><summary>Alternatif soru ifadeleri</summary>

- PWR buhar nerede oluşur
- PWR buhar nerede oluşuyor
- PWR su nerede kaynar

</details>

### PWR Çekirdekte üretilen ısı türbine nasıl ulaşır?

Kimlik: `compare:heat-path:pwr`

Çekirdek → sıcak kol → buhar üretecinin U boruları (ısı boru duvarından geçer) → ikincil buhar → türbin.

Kaynaklar: `nuce-ch2`, `nrc-unit3`

<details><summary>Alternatif soru ifadeleri</summary>

- PWR ısı türbine nasıl ulaşır
- PWR enerji türbine nasıl aktarılır

</details>

### PWR Reaktör suyu ile türbin suyu aynı akışkan mı?

Kimlik: `compare:loops:pwr`

Hayır. İki ayrı çevrim; aralarında yalnız ısı geçer, akışkan karışmaz. Türbine ikincil buhar gider.

Kaynaklar: `nuce-ch2`, `nrc-unit3`

<details><summary>Alternatif soru ifadeleri</summary>

- PWR reaktör suyu türbine gider mi
- PWR birincil ve ikincil su karışır mı
- PWR iki devre neden ayrı
- PWR kaç devre var
- PWR reaktör suyu türbin suyu aynı mı

</details>

### PWR Basınçlandırıcı var mı, ne işe yarar?

Kimlik: `compare:pressurizer:pwr`

Var. Birincil devrenin basıncını yüksek tutar (ders notları ~155 bar); ısıtıcılar basıncı artırır, püskürtme düşürür. Su/buhar ara yüzü yalnız burada bulunur.

Kaynaklar: `nuce-ch2`, `nrc-unit3`

<details><summary>Alternatif soru ifadeleri</summary>

- PWR basınçlandırıcı var mı
- PWR basınç nasıl kontrol edilir

</details>

### PWR Buhar üreteci nasıl yerleşmiştir?

Kimlik: `compare:sg-layout:pwr`

Çizilen tasarımda dikey, U borulu buhar üreteci: yüksek ve dar; ayırıcı ve kurutucular üst bölümde.

Bu açıklama çizilen temsili tasarıma aittir; gerçek tesislerin ayrıntıları değişebilir.

Kaynaklar: `nuce-ch2`, `nrc-unit3`

<details><summary>Alternatif soru ifadeleri</summary>

- PWR buhar üreteci yatay mı dikey mi

</details>

### PWR Çizilen tasarımda kontrol çubukları nereden girer?

Kimlik: `compare:rods:pwr`

Çizilen tasarımda kabın üst kapağındaki sürücülerden, üstten giren çubuk kümeleri.

Bu açıklama çizilen temsili tasarıma aittir; gerçek tesislerin ayrıntıları değişebilir.

Kaynaklar: `nuce-ch2`, `nrc-unit3`

<details><summary>Alternatif soru ifadeleri</summary>

- PWR kontrol çubukları nereden girer
- PWR kontrol çubukları alttan mı üstten mi

</details>

## BWR

### BWR Reaktör kabı ve koruma yapısı aynı şey mi?

Kimlik: `concept:bwr:vessel-containment`

Aynı parça değildir; reaktör kabı ve onu çevreleyen koruma yapısının görevleri farklıdır.

Reaktör basınç kabı: Çekirdeği, kaynayan suyu ve buhar ayırma donanımını barındırır.

Koruma yapısı (temsili): Reaktör kabını ve devridaim sistemini çevreler.

Kaynaklar: `nuce-ch2`, `nrc-bwr`

<details><summary>Alternatif soru ifadeleri</summary>

- BWR reaktör kabı koruma binası farkı
- BWR kap ve containment farkı

</details>

### BWR Türbin ve jeneratör arasındaki fark nedir?

Kimlik: `concept:bwr:turbine-generator`

Türbin mekanik dönme hareketi sağlar; elektrik jeneratörde üretilir.

Yüksek basınç (YB) türbini: Reaktör buharının enerjisinin bir kısmını mil işine çevirir.

Jeneratör: Mil işini elektriğe dönüştürür.

Kaynaklar: `nuce-ch2`, `nrc-bwr`

<details><summary>Alternatif soru ifadeleri</summary>

- BWR elektrik türbinde mi jeneratörde mi üretilir
- BWR elektrik nerede üretilir

</details>

### BWR Pompa elektrik üretir mi?

Kimlik: `concept:bwr:pump-generator`

Pompa elektrik üretmez; akışkanı dolaştırır. Elektrik jeneratörde üretilir.

Devridaim pompası ve hattı: Jet pompalarına sürücü akış sağlar.

Jeneratör: Mil işini elektriğe dönüştürür.

Kaynaklar: `nuce-ch2`, `nrc-bwr`

<details><summary>Alternatif soru ifadeleri</summary>

- BWR pompa jeneratör aynı mı
- BWR pompa türbin gibi mi

</details>

### BWR Kondenserden çıkan su nereye gider?

Kimlik: `concept:bwr:condenser-feed`

Yoğuşan su, besleme suyu yolu üzerinden çevrime geri gönderilir.

Kondenser: Türbin çıkış buharını yoğuşturur.

Besleme suyu pompası: Yoğuşan suyu doğrudan reaktör kabına geri basar.

Kaynaklar: `nuce-ch2`, `nrc-bwr`

<details><summary>Alternatif soru ifadeleri</summary>

- BWR besleme suyu nereden gelir
- BWR yoğuşan su tekrar kullanılır mı

</details>

### BWR Kontrol çubukları ile çekirdek arasındaki ilişki nedir?

Kimlik: `concept:bwr:rods-fuel`

Kontrol çubukları yakıt değildir; nötron soğurarak zincirleme tepkimeyi etkiler.

Kontrol çubukları (alttan): Nötron soğurarak reaksiyon hızını ayarlar.

Reaktör basınç kabı: Çekirdeği, kaynayan suyu ve buhar ayırma donanımını barındırır.

Kaynaklar: `nuce-ch2`, `nrc-bwr`

<details><summary>Alternatif soru ifadeleri</summary>

- BWR kontrol çubukları yakıt mı
- BWR kontrol çubukları neyi soğurur

</details>

### BWR nedir?

Kimlik: `entry:bwr`

Reaktör suyu daha düşük basınçta (ders notlarında ~70 bar) tutulur ve doğrudan çekirdekte kaynar. Buhar kabın üst bölümünde ayrılıp kurutulur ve ayrı bir buhar üreteci olmadan doğrudan türbine gider. Kontrol çubukları alttan girer.

Kaynaklar: `nuce-ch2`, `nrc-bwr`

<details><summary>Alternatif soru ifadeleri</summary>

- BWR Kaynar Su Reaktörü (BWR) — temsili jet pompalı tasarım nedir?
- BWR Kaynar Su Reaktörü (BWR) — temsili jet pompalı tasarım açıkla
- BWR Kaynar Su Reaktörü (BWR) — temsili jet pompalı tasarım göster
- BWR bwr nedir?
- BWR bwr açıkla
- BWR bwr göster
- BWR kaynar su reaktörü nedir?
- BWR kaynar su reaktörü açıkla
- BWR kaynar su reaktörü göster
- BWR kaynayan su reaktörü nedir?
- BWR kaynayan su reaktörü açıkla
- BWR kaynayan su reaktörü göster

</details>

### BWR Reaktör basınç kabı ne işe yarar?

Kimlik: `entry:bwr.vessel`

Çekirdeği, kaynayan suyu ve buhar ayırma donanımını barındırır.

BWR kabı PWR’ye göre daha ince duvarlı ama çok daha büyüktür; çünkü çekirdeğin yanı sıra buhar ayırıcıları ve kurutucuları da içerir. Kabın alt bölümü sıvı, orta bölümü su-buhar karışımı, üst bölümü buhardır.

Kaynaklar: `nuce-ch2`, `nrc-bwr`

<details><summary>Alternatif soru ifadeleri</summary>

- BWR Reaktör basınç kabı nedir?
- BWR Reaktör basınç kabı açıkla
- BWR Reaktör basınç kabı göster
- BWR reaktör kabı nedir?
- BWR reaktör kabı açıkla
- BWR reaktör kabı göster
- BWR basınç kabı nedir?
- BWR basınç kabı açıkla
- BWR basınç kabı göster
- BWR kap nedir?
- BWR kap açıkla
- BWR kap göster
- BWR rpv nedir?
- BWR rpv açıkla
- BWR rpv göster
- BWR Reaktör basınç kabı ne işe yarar?
- BWR Reaktör basınç kabı nasıl çalışır?
- BWR reaktör kabı ne işe yarar?
- BWR reaktör kabı nasıl çalışır?
- BWR basınç kabı ne işe yarar?
- BWR basınç kabı nasıl çalışır?
- BWR kap ne işe yarar?
- BWR kap nasıl çalışır?
- BWR rpv ne işe yarar?
- BWR rpv nasıl çalışır?

</details>

### BWR Çekirdek (kaynama bölgesi) ne işe yarar?

Kimlik: `entry:bwr.core`

Fisyon ısısını üretir; su burada kaynamaya başlar.

Su yakıt demetlerinin kanal kutuları içinden yukarı akarken ısınır ve kaynar; çekirdeğin üst kısmına doğru kabarcık oranı artar. Su hem soğutucu hem yavaşlatıcıdır.

Kaynaklar: `nuce-ch2`, `nrc-bwr`

<details><summary>Alternatif soru ifadeleri</summary>

- BWR Çekirdek (kaynama bölgesi) nedir?
- BWR Çekirdek (kaynama bölgesi) açıkla
- BWR Çekirdek (kaynama bölgesi) göster
- BWR çekirdek nedir?
- BWR çekirdek açıkla
- BWR çekirdek göster
- BWR yakıt nedir?
- BWR yakıt açıkla
- BWR yakıt göster
- BWR kaynama nedir?
- BWR kaynama açıkla
- BWR kaynama göster
- BWR Çekirdek (kaynama bölgesi) ne işe yarar?
- BWR Çekirdek (kaynama bölgesi) nasıl çalışır?
- BWR çekirdek ne işe yarar?
- BWR çekirdek nasıl çalışır?
- BWR yakıt ne işe yarar?
- BWR yakıt nasıl çalışır?
- BWR kaynama ne işe yarar?
- BWR kaynama nasıl çalışır?

</details>

### BWR Kontrol çubukları (alttan) ne işe yarar?

Kimlik: `entry:bwr.rods`

Nötron soğurarak reaksiyon hızını ayarlar.

Geleneksel BWR’de haç (cruciform) kesitli çubuklar, kabın altındaki sürücülerden yukarı doğru girer (ders notları: alttan giren tek LWR tipi). BWR’de güç ayrıca devridaim debisi değiştirilerek de ayarlanır. Çubuk konumu güçle birebir eşlenmez.

Kaynaklar: `nuce-ch2`, `nrc-bwr`

<details><summary>Alternatif soru ifadeleri</summary>

- BWR Kontrol çubukları (alttan) nedir?
- BWR Kontrol çubukları (alttan) açıkla
- BWR Kontrol çubukları (alttan) göster
- BWR kontrol çubuğu nedir?
- BWR kontrol çubuğu açıkla
- BWR kontrol çubuğu göster
- BWR kontrol çubukları nedir?
- BWR kontrol çubukları açıkla
- BWR kontrol çubukları göster
- BWR çubuk nedir?
- BWR çubuk açıkla
- BWR çubuk göster
- BWR Kontrol çubukları (alttan) ne işe yarar?
- BWR Kontrol çubukları (alttan) nasıl çalışır?
- BWR kontrol çubuğu ne işe yarar?
- BWR kontrol çubuğu nasıl çalışır?
- BWR kontrol çubukları ne işe yarar?
- BWR kontrol çubukları nasıl çalışır?
- BWR çubuk ne işe yarar?
- BWR çubuk nasıl çalışır?

</details>

### BWR Buhar ayırıcıları ne işe yarar?

Kimlik: `entry:bwr.separators`

Su-buhar karışımındaki suyu ayırır.

Çekirdekten yükselen karışım dikey borularla (standpipe) siklon tipi ayırıcılara girer; dönen akış suyu dışa atar. Ayrılan su halkasal boşluktan (downcomer) aşağı döner, buhar yukarı devam eder.

Kaynaklar: `nuce-ch2`, `nrc-bwr`

<details><summary>Alternatif soru ifadeleri</summary>

- BWR Buhar ayırıcıları nedir?
- BWR Buhar ayırıcıları açıkla
- BWR Buhar ayırıcıları göster
- BWR buhar ayırıcı nedir?
- BWR buhar ayırıcı açıkla
- BWR buhar ayırıcı göster
- BWR ayırıcı nedir?
- BWR ayırıcı açıkla
- BWR ayırıcı göster
- BWR siklon nedir?
- BWR siklon açıkla
- BWR siklon göster
- BWR Buhar ayırıcıları ne işe yarar?
- BWR Buhar ayırıcıları nasıl çalışır?
- BWR buhar ayırıcı ne işe yarar?
- BWR buhar ayırıcı nasıl çalışır?
- BWR ayırıcı ne işe yarar?
- BWR ayırıcı nasıl çalışır?
- BWR siklon ne işe yarar?
- BWR siklon nasıl çalışır?

</details>

### BWR Buhar kurutucuları ne işe yarar?

Kimlik: `entry:bwr.dryers`

Buhardaki kalan nemi tutar.

Çok katlı oluklu (şevron) paneller buhardaki damlacıkları yakalar; damlalar aşağı süzülür. Türbine giden buharın nemi düşük tutulur.

Kaynaklar: `nuce-ch2`, `nrc-bwr`

<details><summary>Alternatif soru ifadeleri</summary>

- BWR Buhar kurutucuları nedir?
- BWR Buhar kurutucuları açıkla
- BWR Buhar kurutucuları göster
- BWR buhar kurutucu nedir?
- BWR buhar kurutucu açıkla
- BWR buhar kurutucu göster
- BWR kurutucu nedir?
- BWR kurutucu açıkla
- BWR kurutucu göster
- BWR Buhar kurutucuları ne işe yarar?
- BWR Buhar kurutucuları nasıl çalışır?
- BWR buhar kurutucu ne işe yarar?
- BWR buhar kurutucu nasıl çalışır?
- BWR kurutucu ne işe yarar?
- BWR kurutucu nasıl çalışır?

</details>

### BWR Jet pompaları ve downcomer ne işe yarar?

Kimlik: `entry:bwr.jetpumps`

Devridaim akışını çekirdeğe yönlendirir.

Ayrılan su ve besleme suyu çekirdek gömleği ile kap duvarı arasındaki halkasal boşluktan aşağı iner. Dış devridaim pompasının bastığı sürücü akış jet pompalarında bu suyu sürükler ve alt plenuma iter.

Kaynaklar: `nuce-ch2`, `nrc-bwr`

<details><summary>Alternatif soru ifadeleri</summary>

- BWR Jet pompaları ve downcomer nedir?
- BWR Jet pompaları ve downcomer açıkla
- BWR Jet pompaları ve downcomer göster
- BWR jet pompası nedir?
- BWR jet pompası açıkla
- BWR jet pompası göster
- BWR downcomer nedir?
- BWR downcomer açıkla
- BWR downcomer göster
- BWR Jet pompaları ve downcomer ne işe yarar?
- BWR Jet pompaları ve downcomer nasıl çalışır?
- BWR jet pompası ne işe yarar?
- BWR jet pompası nasıl çalışır?
- BWR downcomer ne işe yarar?
- BWR downcomer nasıl çalışır?

</details>

### BWR Devridaim pompası ve hattı ne işe yarar?

Kimlik: `entry:bwr.recirc`

Jet pompalarına sürücü akış sağlar.

Downcomer’dan alınan suyu jet pompalarının nozullarına basar. Devridaim debisi artınca kaynama boşluğu azalır, nötron yavaşlaması artar ve güç yükselir; bu BWR’ye özgü bir güç ayarı yoludur.

Kaynaklar: `nuce-ch2`, `nrc-bwr`

<details><summary>Alternatif soru ifadeleri</summary>

- BWR Devridaim pompası ve hattı nedir?
- BWR Devridaim pompası ve hattı açıkla
- BWR Devridaim pompası ve hattı göster
- BWR devridaim nedir?
- BWR devridaim açıkla
- BWR devridaim göster
- BWR resirkülasyon nedir?
- BWR resirkülasyon açıkla
- BWR resirkülasyon göster
- BWR devridaim pompası nedir?
- BWR devridaim pompası açıkla
- BWR devridaim pompası göster
- BWR Devridaim pompası ve hattı ne işe yarar?
- BWR Devridaim pompası ve hattı nasıl çalışır?
- BWR devridaim ne işe yarar?
- BWR devridaim nasıl çalışır?
- BWR resirkülasyon ne işe yarar?
- BWR resirkülasyon nasıl çalışır?
- BWR devridaim pompası ne işe yarar?
- BWR devridaim pompası nasıl çalışır?

</details>

### BWR Ana buhar hattı ne işe yarar?

Kimlik: `entry:bwr.steamline`

Reaktörde oluşan buharı doğrudan türbine taşır.

BWR’de türbine giden buhar reaktör suyundan oluşur; arada buhar üreteci yoktur. Bu nedenle türbin tarafı da radyasyon açısından korumalı ve izlenen bir bölgedir.

Kaynaklar: `nuce-ch2`, `nrc-bwr`

<details><summary>Alternatif soru ifadeleri</summary>

- BWR Ana buhar hattı nedir?
- BWR Ana buhar hattı açıkla
- BWR Ana buhar hattı göster
- BWR ana buhar hattı nedir?
- BWR ana buhar hattı açıkla
- BWR ana buhar hattı göster
- BWR buhar hattı nedir?
- BWR buhar hattı açıkla
- BWR buhar hattı göster
- BWR Ana buhar hattı ne işe yarar?
- BWR Ana buhar hattı nasıl çalışır?
- BWR ana buhar hattı ne işe yarar?
- BWR ana buhar hattı nasıl çalışır?
- BWR buhar hattı ne işe yarar?
- BWR buhar hattı nasıl çalışır?

</details>

### BWR Yüksek basınç (YB) türbini ne işe yarar?

Kimlik: `entry:bwr.hp`

Reaktör buharının enerjisinin bir kısmını mil işine çevirir.

Reaktörden gelen doymuş buhar YB türbininde genişler, geçiş borusuyla AB türbinine gider.

Kaynaklar: `nuce-ch2`, `nrc-bwr`

<details><summary>Alternatif soru ifadeleri</summary>

- BWR Yüksek basınç (YB) türbini nedir?
- BWR Yüksek basınç (YB) türbini açıkla
- BWR Yüksek basınç (YB) türbini göster
- BWR yüksek basınç türbini nedir?
- BWR yüksek basınç türbini açıkla
- BWR yüksek basınç türbini göster
- BWR yb türbini nedir?
- BWR yb türbini açıkla
- BWR yb türbini göster
- BWR türbin nedir?
- BWR türbin açıkla
- BWR türbin göster
- BWR Yüksek basınç (YB) türbini ne işe yarar?
- BWR Yüksek basınç (YB) türbini nasıl çalışır?
- BWR yüksek basınç türbini ne işe yarar?
- BWR yüksek basınç türbini nasıl çalışır?
- BWR yb türbini ne işe yarar?
- BWR yb türbini nasıl çalışır?
- BWR türbin ne işe yarar?
- BWR türbin nasıl çalışır?

</details>

### BWR Alçak basınç (AB) türbini ne işe yarar?

Kimlik: `entry:bwr.lp`

Buhar enerjisinin kalanını mekanik enerjiye çevirir.

Çift akışlı türbinden çıkan buhar kondensere boşalır. Türbinler ve jeneratör aynı mil üzerindedir.

Kaynaklar: `nuce-ch2`, `nrc-bwr`

<details><summary>Alternatif soru ifadeleri</summary>

- BWR Alçak basınç (AB) türbini nedir?
- BWR Alçak basınç (AB) türbini açıkla
- BWR Alçak basınç (AB) türbini göster
- BWR alçak basınç türbini nedir?
- BWR alçak basınç türbini açıkla
- BWR alçak basınç türbini göster
- BWR ab türbini nedir?
- BWR ab türbini açıkla
- BWR ab türbini göster
- BWR türbin nedir?
- BWR türbin açıkla
- BWR türbin göster
- BWR Alçak basınç (AB) türbini ne işe yarar?
- BWR Alçak basınç (AB) türbini nasıl çalışır?
- BWR alçak basınç türbini ne işe yarar?
- BWR alçak basınç türbini nasıl çalışır?
- BWR ab türbini ne işe yarar?
- BWR ab türbini nasıl çalışır?
- BWR türbin ne işe yarar?
- BWR türbin nasıl çalışır?

</details>

### BWR Jeneratör ne işe yarar?

Kimlik: `entry:bwr.gen`

Mil işini elektriğe dönüştürür.

Şebekeye senkron bağlıdır; güç değişince hız değil tork değişir. Mil animasyonu güçten bağımsız sabit hızdadır.

Kaynaklar: `nuce-ch2`, `nrc-bwr`

<details><summary>Alternatif soru ifadeleri</summary>

- BWR Jeneratör nedir?
- BWR Jeneratör açıkla
- BWR Jeneratör göster
- BWR jeneratör nedir?
- BWR jeneratör açıkla
- BWR jeneratör göster
- BWR generatör nedir?
- BWR generatör açıkla
- BWR generatör göster
- BWR elektrik üretimi nedir?
- BWR elektrik üretimi açıkla
- BWR elektrik üretimi göster
- BWR Jeneratör ne işe yarar?
- BWR Jeneratör nasıl çalışır?
- BWR jeneratör ne işe yarar?
- BWR jeneratör nasıl çalışır?
- BWR generatör ne işe yarar?
- BWR generatör nasıl çalışır?
- BWR elektrik üretimi ne işe yarar?
- BWR elektrik üretimi nasıl çalışır?

</details>

### BWR Kondenser ne işe yarar?

Kimlik: `entry:bwr.condenser`

Türbin çıkış buharını yoğuşturur.

Buhar soğutma suyu borularının dışında yoğuşur ve sıcak kuyuda toplanır. Soğutma suyu ayrı bir çevrimdir, reaktör suyuyla karışmaz.

Kaynaklar: `nuce-ch2`, `nrc-bwr`

<details><summary>Alternatif soru ifadeleri</summary>

- BWR Kondenser nedir?
- BWR Kondenser açıkla
- BWR Kondenser göster
- BWR kondenser nedir?
- BWR kondenser açıkla
- BWR kondenser göster
- BWR yoğuşturucu nedir?
- BWR yoğuşturucu açıkla
- BWR yoğuşturucu göster
- BWR yoğuşma nedir?
- BWR yoğuşma açıkla
- BWR yoğuşma göster
- BWR Kondenser ne işe yarar?
- BWR Kondenser nasıl çalışır?
- BWR kondenser ne işe yarar?
- BWR kondenser nasıl çalışır?
- BWR yoğuşturucu ne işe yarar?
- BWR yoğuşturucu nasıl çalışır?
- BWR yoğuşma ne işe yarar?
- BWR yoğuşma nasıl çalışır?

</details>

### BWR Besleme suyu pompası ne işe yarar?

Kimlik: `entry:bwr.feedpump`

Yoğuşan suyu doğrudan reaktör kabına geri basar.

Su ön ısıtıcıdan geçip kabın üst kısmındaki besleme suyu dağıtıcısından (sparger) downcomer’a girer ve ayrılan suyla karışır.

Kaynaklar: `nuce-ch2`, `nrc-bwr`

<details><summary>Alternatif soru ifadeleri</summary>

- BWR Besleme suyu pompası nedir?
- BWR Besleme suyu pompası açıkla
- BWR Besleme suyu pompası göster
- BWR besleme suyu pompası nedir?
- BWR besleme suyu pompası açıkla
- BWR besleme suyu pompası göster
- BWR besleme pompası nedir?
- BWR besleme pompası açıkla
- BWR besleme pompası göster
- BWR Besleme suyu pompası ne işe yarar?
- BWR Besleme suyu pompası nasıl çalışır?
- BWR besleme suyu pompası ne işe yarar?
- BWR besleme suyu pompası nasıl çalışır?
- BWR besleme pompası ne işe yarar?
- BWR besleme pompası nasıl çalışır?

</details>

### BWR Besleme suyu ön ısıtıcısı ne işe yarar?

Kimlik: `entry:bwr.heater`

Besleme suyunu kaba girmeden önce ısıtır.

Gerçek tesislerde birden çok ısıtıcı bulunur; burada tek kutuyla sadeleştirildi.

Kaynaklar: `nuce-ch2`, `nrc-bwr`

<details><summary>Alternatif soru ifadeleri</summary>

- BWR Besleme suyu ön ısıtıcısı nedir?
- BWR Besleme suyu ön ısıtıcısı açıkla
- BWR Besleme suyu ön ısıtıcısı göster
- BWR ön ısıtıcı nedir?
- BWR ön ısıtıcı açıkla
- BWR ön ısıtıcı göster
- BWR besleme suyu ısıtıcısı nedir?
- BWR besleme suyu ısıtıcısı açıkla
- BWR besleme suyu ısıtıcısı göster
- BWR Besleme suyu ön ısıtıcısı ne işe yarar?
- BWR Besleme suyu ön ısıtıcısı nasıl çalışır?
- BWR ön ısıtıcı ne işe yarar?
- BWR ön ısıtıcı nasıl çalışır?
- BWR besleme suyu ısıtıcısı ne işe yarar?
- BWR besleme suyu ısıtıcısı nasıl çalışır?

</details>

### BWR Soğutma suyu çevrimi ne işe yarar?

Kimlik: `entry:bwr.coolsource`

Kondenser ısısını çevreye atar.

Deniz, nehir veya soğutma kulesi üzerinden çalışan ayrı çevrimdir; şemada turkuaz ve kesik-noktalı çizgiyle gösterilir.

Kaynaklar: `nuce-ch2`, `nrc-bwr`

<details><summary>Alternatif soru ifadeleri</summary>

- BWR Soğutma suyu çevrimi nedir?
- BWR Soğutma suyu çevrimi açıkla
- BWR Soğutma suyu çevrimi göster
- BWR soğutma suyu nedir?
- BWR soğutma suyu açıkla
- BWR soğutma suyu göster
- BWR soğutma kulesi nedir?
- BWR soğutma kulesi açıkla
- BWR soğutma kulesi göster
- BWR Soğutma suyu çevrimi ne işe yarar?
- BWR Soğutma suyu çevrimi nasıl çalışır?
- BWR soğutma suyu ne işe yarar?
- BWR soğutma suyu nasıl çalışır?
- BWR soğutma kulesi ne işe yarar?
- BWR soğutma kulesi nasıl çalışır?

</details>

### BWR Türbin binası (korumalı bölge) ne işe yarar?

Kimlik: `entry:bwr.turbinebldg`

Türbin, kondenser ve besleme sistemini barındırır.

Buhar doğrudan reaktörden geldiği için BWR türbin binası radyasyon açısından korunan ve izlenen bir bölgedir. PWR ve VVER’de türbine yalnız ikincil devre buharı gider.

Kaynaklar: `nuce-ch2`, `nrc-bwr`

<details><summary>Alternatif soru ifadeleri</summary>

- BWR Türbin binası (korumalı bölge) nedir?
- BWR Türbin binası (korumalı bölge) açıkla
- BWR Türbin binası (korumalı bölge) göster
- BWR türbin binası nedir?
- BWR türbin binası açıkla
- BWR türbin binası göster
- BWR Türbin binası (korumalı bölge) ne işe yarar?
- BWR Türbin binası (korumalı bölge) nasıl çalışır?
- BWR türbin binası ne işe yarar?
- BWR türbin binası nasıl çalışır?

</details>

### BWR Koruma yapısı (temsili) ne işe yarar?

Kimlik: `entry:bwr.containment`

Reaktör kabını ve devridaim sistemini çevreler.

BWR koruma yapıları (Mark I/II/III vb.) basınç bastırma havuzu içerir ve tasarıma göre çok farklıdır; burada sadeleştirilmiş bir dış hat çizildi.

Kaynaklar: `nuce-ch2`, `nrc-bwr`

<details><summary>Alternatif soru ifadeleri</summary>

- BWR Koruma yapısı (temsili) nedir?
- BWR Koruma yapısı (temsili) açıkla
- BWR Koruma yapısı (temsili) göster
- BWR koruma yapısı nedir?
- BWR koruma yapısı açıkla
- BWR koruma yapısı göster
- BWR containment nedir?
- BWR containment açıkla
- BWR containment göster
- BWR koruma binası nedir?
- BWR koruma binası açıkla
- BWR koruma binası göster
- BWR Koruma yapısı (temsili) ne işe yarar?
- BWR Koruma yapısı (temsili) nasıl çalışır?
- BWR koruma yapısı ne işe yarar?
- BWR koruma yapısı nasıl çalışır?
- BWR containment ne işe yarar?
- BWR containment nasıl çalışır?
- BWR koruma binası ne işe yarar?
- BWR koruma binası nasıl çalışır?

</details>

### BWR Buhar nerede oluşuyor? açıkla

Kimlik: `entry:bwr.focus.where`

BWR’de buhar reaktör kabının içinde, doğrudan çekirdekte oluşur: su yakıt demetleri arasında yukarı akarken kaynar. Ayrı bir buhar üreteci yoktur.

Kaynaklar: `nuce-ch2`, `nrc-bwr`

<details><summary>Alternatif soru ifadeleri</summary>

- BWR Buhar nerede oluşuyor? nedir?
- BWR Buhar nerede oluşuyor? açıkla
- BWR Buhar nerede oluşuyor? göster

</details>

### BWR Ayırıcı ve kurutucu yakın planı açıkla

Kimlik: `entry:bwr.focus.sepzoom`

Siklon tipi ayırıcılar suyu dönen akışla dışa atar; şevron kurutucular kalan damlacıkları tutar. Kuru buhar kubbeden ana buhar hattına çıkar.

Kaynaklar: `nuce-ch2`, `nrc-bwr`

<details><summary>Alternatif soru ifadeleri</summary>

- BWR Ayırıcı ve kurutucu yakın planı nedir?
- BWR Ayırıcı ve kurutucu yakın planı açıkla
- BWR Ayırıcı ve kurutucu yakın planı göster

</details>

### BWR Devridaim yolunu vurgula açıkla

Kimlik: `entry:bwr.focus.recircpath`

Ayrılan su downcomer’dan iner → jet pompaları → alt plenum → çekirdekten yukarı → ayırıcılar → tekrar downcomer. Dış devridaim pompası jet pompalarını sürer.

Kaynaklar: `nuce-ch2`, `nrc-bwr`

<details><summary>Alternatif soru ifadeleri</summary>

- BWR Devridaim yolunu vurgula nedir?
- BWR Devridaim yolunu vurgula açıkla
- BWR Devridaim yolunu vurgula göster

</details>

### BWR Kap içindeki sıvı ve buhar bölgeleri açıkla

Kimlik: `entry:bwr.focus.zones`

Alt plenum ve downcomer: sıvı su. Çekirdek ve üstü: kabarcık oranı artan su-buhar karışımı. Su seviyesi ayırıcılar hizasında; üstünde kurutucular ve buhar kubbesi.

Kaynaklar: `nuce-ch2`, `nrc-bwr`

<details><summary>Alternatif soru ifadeleri</summary>

- BWR Kap içindeki sıvı ve buhar bölgeleri nedir?
- BWR Kap içindeki sıvı ve buhar bölgeleri açıkla
- BWR Kap içindeki sıvı ve buhar bölgeleri göster

</details>

### BWR BWR anlatımı · 1. Çekirdekte kaynama açıkla

Kimlik: `entry:bwr.tour.boiling`

Fisyon ısısıyla su, yakıt demetleri arasında yukarı akarken doğrudan kaynar. Kabarcıklar çekirdeğin üst kısmına doğru çoğalır. Kontrol çubukları alttan girer.

Kaynaklar: `nuce-ch2`, `nrc-bwr`

<details><summary>Alternatif soru ifadeleri</summary>

- BWR BWR anlatımı · 1. Çekirdekte kaynama nedir?
- BWR BWR anlatımı · 1. Çekirdekte kaynama açıkla
- BWR BWR anlatımı · 1. Çekirdekte kaynama göster
- BWR Çekirdekte kaynama nedir?
- BWR Çekirdekte kaynama açıkla
- BWR Çekirdekte kaynama göster

</details>

### BWR BWR anlatımı · 2. Buhar ayırma ve kurutma açıkla

Kimlik: `entry:bwr.tour.separation`

Su-buhar karışımı ayırıcılarda dönerek ayrışır; su aşağı döner. Buhar kurutuculardan geçerken kalan nem tutulur ve kuru buhar kubbede toplanır.

Kaynaklar: `nuce-ch2`, `nrc-bwr`

<details><summary>Alternatif soru ifadeleri</summary>

- BWR BWR anlatımı · 2. Buhar ayırma ve kurutma nedir?
- BWR BWR anlatımı · 2. Buhar ayırma ve kurutma açıkla
- BWR BWR anlatımı · 2. Buhar ayırma ve kurutma göster
- BWR Buhar ayırma ve kurutma nedir?
- BWR Buhar ayırma ve kurutma açıkla
- BWR Buhar ayırma ve kurutma göster

</details>

### BWR BWR anlatımı · 3. Doğrudan türbine açıkla

Kimlik: `entry:bwr.tour.turbine`

Buhar ana buhar hattıyla reaktörden doğrudan türbine gider; ara buhar üreteci yoktur. Bu yüzden türbin binası da korumalı bölgedir.

Kaynaklar: `nuce-ch2`, `nrc-bwr`

<details><summary>Alternatif soru ifadeleri</summary>

- BWR BWR anlatımı · 3. Doğrudan türbine nedir?
- BWR BWR anlatımı · 3. Doğrudan türbine açıkla
- BWR BWR anlatımı · 3. Doğrudan türbine göster
- BWR Doğrudan türbine nedir?
- BWR Doğrudan türbine açıkla
- BWR Doğrudan türbine göster

</details>

### BWR BWR anlatımı · 4. Kondenser açıkla

Kimlik: `entry:bwr.tour.condenser`

Türbinden çıkan buhar soğutma suyu boruları üzerinde yoğuşur. Soğutma suyu ayrı çevrimdir ve reaktör suyuyla karışmaz.

Kaynaklar: `nuce-ch2`, `nrc-bwr`

<details><summary>Alternatif soru ifadeleri</summary>

- BWR BWR anlatımı · 4. Kondenser nedir?
- BWR BWR anlatımı · 4. Kondenser açıkla
- BWR BWR anlatımı · 4. Kondenser göster
- BWR Kondenser nedir?
- BWR Kondenser açıkla
- BWR Kondenser göster

</details>

### BWR BWR anlatımı · 5. Besleme suyu dönüşü açıkla

Kimlik: `entry:bwr.tour.feedwater`

Yoğuşan su ön ısıtılıp kaba geri basılır, ayrılan suyla downcomer’da karışır. Jet pompaları ve devridaim pompası suyu tekrar çekirdeğe yönlendirir.

Kaynaklar: `nuce-ch2`, `nrc-bwr`

<details><summary>Alternatif soru ifadeleri</summary>

- BWR BWR anlatımı · 5. Besleme suyu dönüşü nedir?
- BWR BWR anlatımı · 5. Besleme suyu dönüşü açıkla
- BWR BWR anlatımı · 5. Besleme suyu dönüşü göster
- BWR Besleme suyu dönüşü nedir?
- BWR Besleme suyu dönüşü açıkla
- BWR Besleme suyu dönüşü göster

</details>

### BWR BWR’de buhar üreteci ve basınçlandırıcı yoktur açıkla

Kimlik: `entry:bwr.topic.no-sg`

BWR’de reaktör suyu doğrudan çekirdekte kaynar; buhar kabın üst bölümündeki ayırıcı ve kurutuculardan geçip doğrudan türbine gider. Ayrı bir buhar üreteci ve basınçlandırıcı yoktur; tek çevrim vardır.

Kaynaklar: `nuce-ch2`, `nrc-bwr`

<details><summary>Alternatif soru ifadeleri</summary>

- BWR BWR’de buhar üreteci ve basınçlandırıcı yoktur nedir?
- BWR BWR’de buhar üreteci ve basınçlandırıcı yoktur açıkla
- BWR BWR’de buhar üreteci ve basınçlandırıcı yoktur göster
- BWR buhar üreteci nedir?
- BWR buhar üreteci açıkla
- BWR buhar üreteci göster
- BWR basınçlandırıcı nedir?
- BWR basınçlandırıcı açıkla
- BWR basınçlandırıcı göster
- BWR buhar nerede oluşuyor nedir?
- BWR buhar nerede oluşuyor açıkla
- BWR buhar nerede oluşuyor göster
- BWR buhar oluşumu nedir?
- BWR buhar oluşumu açıkla
- BWR buhar oluşumu göster

</details>

### BWR Türbine giden buhar nerede oluşur?

Kimlik: `compare:steam-where:bwr`

Doğrudan reaktör kabında: su çekirdekte kaynar, buhar kabın üstünde ayrılır ve kurutulur.

Kaynaklar: `nuce-ch2`, `nrc-bwr`

<details><summary>Alternatif soru ifadeleri</summary>

- BWR buhar nerede oluşur
- BWR buhar nerede oluşuyor
- BWR su nerede kaynar

</details>

### BWR Çekirdekte üretilen ısı türbine nasıl ulaşır?

Kimlik: `compare:heat-path:bwr`

Çekirdek → kaynayan reaktör suyu → ayırıcı/kurutucu → aynı akışkanın buharı doğrudan türbine. Arada ısı değiştirici yok.

Kaynaklar: `nuce-ch2`, `nrc-bwr`

<details><summary>Alternatif soru ifadeleri</summary>

- BWR ısı türbine nasıl ulaşır
- BWR enerji türbine nasıl aktarılır

</details>

### BWR Reaktör suyu ile türbin suyu aynı akışkan mı?

Kimlik: `compare:loops:bwr`

Evet. Tek (doğrudan) çevrim: reaktör suyunun buharı türbine gider; bu yüzden türbin tarafı da korumalı bölgedir.

Kaynaklar: `nuce-ch2`, `nrc-bwr`

<details><summary>Alternatif soru ifadeleri</summary>

- BWR reaktör suyu türbine gider mi
- BWR birincil ve ikincil su karışır mı
- BWR iki devre neden ayrı
- BWR kaç devre var
- BWR reaktör suyu türbin suyu aynı mı

</details>

### BWR Basınçlandırıcı var mı, ne işe yarar?

Kimlik: `compare:pressurizer:bwr`

Yok. Su ve buhar zaten reaktör kabında birlikte bulunur (kabın üst bölümü buhardır).

Kaynaklar: `nuce-ch2`, `nrc-bwr`

<details><summary>Alternatif soru ifadeleri</summary>

- BWR basınçlandırıcı var mı
- BWR basınç nasıl kontrol edilir

</details>

### BWR Buhar üreteci nasıl yerleşmiştir?

Kimlik: `compare:sg-layout:bwr`

Ayrı buhar üreteci yok. Ayırıcılar ve kurutucular reaktör kabının içindedir.

Kaynaklar: `nuce-ch2`, `nrc-bwr`

<details><summary>Alternatif soru ifadeleri</summary>

- BWR buhar üreteci yatay mı dikey mi

</details>

### BWR Çizilen tasarımda kontrol çubukları nereden girer?

Kimlik: `compare:rods:bwr`

Çizilen (geleneksel) tasarımda kabın altından giren haç kesitli çubuklar; ders notlarına göre alttan giren tek LWR tipi.

Bu açıklama çizilen temsili tasarıma aittir; gerçek tesislerin ayrıntıları değişebilir.

Kaynaklar: `nuce-ch2`, `nrc-bwr`

<details><summary>Alternatif soru ifadeleri</summary>

- BWR kontrol çubukları nereden girer
- BWR kontrol çubukları alttan mı üstten mi

</details>

## VVER

### VVER Reaktör kabı ve koruma yapısı aynı şey mi?

Kimlik: `concept:vver:vessel-containment`

Aynı parça değildir; reaktör kabı ve onu çevreleyen koruma yapısının görevleri farklıdır.

Reaktör basınç kabı: Çekirdeği ve birincil soğutucuyu basınç altında tutar.

Koruma yapısı (containment): Birincil devreyi çevreleyen yapı.

Kaynaklar: `nuce-ch2`, `iaea-vver`

<details><summary>Alternatif soru ifadeleri</summary>

- VVER reaktör kabı koruma binası farkı
- VVER kap ve containment farkı

</details>

### VVER Türbin ve jeneratör arasındaki fark nedir?

Kimlik: `concept:vver:turbine-generator`

Türbin mekanik dönme hareketi sağlar; elektrik jeneratörde üretilir.

Yüksek basınç (YB) türbini: Buhar enerjisinin bir kısmını mil işine çevirir.

Jeneratör: Mil işini elektriğe dönüştürür.

Kaynaklar: `nuce-ch2`, `iaea-vver`

<details><summary>Alternatif soru ifadeleri</summary>

- VVER elektrik türbinde mi jeneratörde mi üretilir
- VVER elektrik nerede üretilir

</details>

### VVER Pompa elektrik üretir mi?

Kimlik: `concept:vver:pump-generator`

Pompa elektrik üretmez; akışkanı dolaştırır. Elektrik jeneratörde üretilir.

Ana sirkülasyon pompası: Birincil suyu kapalı çevrimde dolaştırır.

Jeneratör: Mil işini elektriğe dönüştürür.

Kaynaklar: `nuce-ch2`, `iaea-vver`

<details><summary>Alternatif soru ifadeleri</summary>

- VVER pompa jeneratör aynı mı
- VVER pompa türbin gibi mi

</details>

### VVER Kondenserden çıkan su nereye gider?

Kimlik: `concept:vver:condenser-feed`

Yoğuşan su, besleme suyu yolu üzerinden çevrime geri gönderilir.

Kondenser: Türbin çıkış buharını yoğuşturur.

Besleme suyu pompası: Yoğuşan suyu buhar üretecine geri basar.

Kaynaklar: `nuce-ch2`, `iaea-vver`

<details><summary>Alternatif soru ifadeleri</summary>

- VVER besleme suyu nereden gelir
- VVER yoğuşan su tekrar kullanılır mı

</details>

### VVER Kontrol çubukları ile çekirdek arasındaki ilişki nedir?

Kimlik: `concept:vver:rods-fuel`

Kontrol çubukları yakıt değildir; nötron soğurarak zincirleme tepkimeyi etkiler.

Kontrol çubukları ve üst blok: Nötron soğurarak reaksiyon hızını ayarlar.

Reaktör basınç kabı: Çekirdeği ve birincil soğutucuyu basınç altında tutar.

Kaynaklar: `nuce-ch2`, `iaea-vver`

<details><summary>Alternatif soru ifadeleri</summary>

- VVER kontrol çubukları yakıt mı
- VVER kontrol çubukları neyi soğurur

</details>

### VVER Buhar üreteci ile kondenser arasındaki fark nedir?

Kimlik: `concept:vver:sg-condenser`

Buhar üreteci ikincil suya ısı aktararak buhar üretir; kondenser ise türbin çıkışındaki buharı soğutarak yoğuşturur.

Yatay buhar üreteci: Birincil ısıyı ikincil devreye aktararak buhar üretir.

Kondenser: Türbin çıkış buharını yoğuşturur.

Kaynaklar: `nuce-ch2`, `iaea-vver`

<details><summary>Alternatif soru ifadeleri</summary>

- VVER kondenser buhar üreteci aynı mı
- VVER buhar üreteci yoğuşturucu farkı

</details>

### VVER nedir?

Kimlik: `entry:vver`

VVER bir basınçlı su reaktörüdür: birincil su basınç altında sıvı kalır, buhar ayrı bir ikincil devrede oluşur. Ayırt edici özellikleri yatay buhar üreteci, sıcak/soğuk kolların kaba farklı kotlarda bağlanması ve altıgen (üçgen adımlı) yakıt demetleridir.

Kaynaklar: `nuce-ch2`, `iaea-vver`

<details><summary>Alternatif soru ifadeleri</summary>

- VVER VVER (Su-Su Enerji Reaktörü) — PWR ailesinden, yatay buhar üreteçli temsili tasarım nedir?
- VVER VVER (Su-Su Enerji Reaktörü) — PWR ailesinden, yatay buhar üreteçli temsili tasarım açıkla
- VVER VVER (Su-Su Enerji Reaktörü) — PWR ailesinden, yatay buhar üreteçli temsili tasarım göster
- VVER vver nedir?
- VVER vver açıkla
- VVER vver göster
- VVER wwer nedir?
- VVER wwer açıkla
- VVER wwer göster
- VVER rus tasarımı nedir?
- VVER rus tasarımı açıkla
- VVER rus tasarımı göster

</details>

### VVER Reaktör basınç kabı ne işe yarar?

Kimlik: `entry:vver.vessel`

Çekirdeği ve birincil soğutucuyu basınç altında tutar.

VVER-1000 kabı görece dar ve uzundur. Ders notlarına göre sıcak ve soğuk kollar kaba farklı kotlarda bağlanır: soğuk su alt nozul sırasından girip halkasal boşluktan iner, çekirdekten yukarı çıkarak üst nozul sırasından ayrılır.

Kaynaklar: `nuce-ch2`, `iaea-vver`

<details><summary>Alternatif soru ifadeleri</summary>

- VVER Reaktör basınç kabı nedir?
- VVER Reaktör basınç kabı açıkla
- VVER Reaktör basınç kabı göster
- VVER reaktör kabı nedir?
- VVER reaktör kabı açıkla
- VVER reaktör kabı göster
- VVER basınç kabı nedir?
- VVER basınç kabı açıkla
- VVER basınç kabı göster
- VVER kap nedir?
- VVER kap açıkla
- VVER kap göster
- VVER rpv nedir?
- VVER rpv açıkla
- VVER rpv göster
- VVER Reaktör basınç kabı ne işe yarar?
- VVER Reaktör basınç kabı nasıl çalışır?
- VVER reaktör kabı ne işe yarar?
- VVER reaktör kabı nasıl çalışır?
- VVER basınç kabı ne işe yarar?
- VVER basınç kabı nasıl çalışır?
- VVER kap ne işe yarar?
- VVER kap nasıl çalışır?
- VVER rpv ne işe yarar?
- VVER rpv nasıl çalışır?

</details>

### VVER Kontrol çubukları ve üst blok ne işe yarar?

Kimlik: `entry:vver.rods`

Nötron soğurarak reaksiyon hızını ayarlar.

Çubuklar ABD PWR’lerinde olduğu gibi üstten girer; sürücüler kabın üzerindeki yüksek üst blokta bulunur. Altıgen demetlerin kılavuz borularına küme hâlinde girerler. Çubuk konumu güçle birebir eşlenmez.

Kaynaklar: `nuce-ch2`, `iaea-vver`

<details><summary>Alternatif soru ifadeleri</summary>

- VVER Kontrol çubukları ve üst blok nedir?
- VVER Kontrol çubukları ve üst blok açıkla
- VVER Kontrol çubukları ve üst blok göster
- VVER kontrol çubuğu nedir?
- VVER kontrol çubuğu açıkla
- VVER kontrol çubuğu göster
- VVER kontrol çubukları nedir?
- VVER kontrol çubukları açıkla
- VVER kontrol çubukları göster
- VVER çubuk nedir?
- VVER çubuk açıkla
- VVER çubuk göster
- VVER Kontrol çubukları ve üst blok ne işe yarar?
- VVER Kontrol çubukları ve üst blok nasıl çalışır?
- VVER kontrol çubuğu ne işe yarar?
- VVER kontrol çubuğu nasıl çalışır?
- VVER kontrol çubukları ne işe yarar?
- VVER kontrol çubukları nasıl çalışır?
- VVER çubuk ne işe yarar?
- VVER çubuk nasıl çalışır?

</details>

### VVER Basınçlandırıcı ne işe yarar?

Kimlik: `entry:vver.pressurizer`

Birincil devre basıncını kontrol eder.

Ders notlarına göre çevrimlerden birinin sıcak koluna bağlıdır. Isıtıcılar ve püskürtme ile basıncı ayarlar; birincil devrede toplu kaynamayı önler.

Kaynaklar: `nuce-ch2`, `iaea-vver`

<details><summary>Alternatif soru ifadeleri</summary>

- VVER Basınçlandırıcı nedir?
- VVER Basınçlandırıcı açıkla
- VVER Basınçlandırıcı göster
- VVER basınçlandırıcı nedir?
- VVER basınçlandırıcı açıkla
- VVER basınçlandırıcı göster
- VVER pressurizer nedir?
- VVER pressurizer açıkla
- VVER pressurizer göster
- VVER basınç kontrolü nedir?
- VVER basınç kontrolü açıkla
- VVER basınç kontrolü göster
- VVER Basınçlandırıcı ne işe yarar?
- VVER Basınçlandırıcı nasıl çalışır?
- VVER basınçlandırıcı ne işe yarar?
- VVER basınçlandırıcı nasıl çalışır?
- VVER pressurizer ne işe yarar?
- VVER pressurizer nasıl çalışır?
- VVER basınç kontrolü ne işe yarar?
- VVER basınç kontrolü nasıl çalışır?

</details>

### VVER Yatay buhar üreteci ne işe yarar?

Kimlik: `entry:vver.hsg`

Birincil ısıyı ikincil devreye aktararak buhar üretir.

Birincil su boruların içinde, ikincil su gövde (kabuk) tarafındadır. Sıcak su sıcak kolektörden yatay U borularına dağılır, ısısını boru duvarından verip soğuk kolektörde toplanır. Gövde geniş bir buhar tamburu gibi çalışır; üstteki ayırıcılar nemi alır. Yatay düzen tortu temizliğini kolaylaştırır; doğal dolaşım itici yüksekliği dikey üreteçlere göre daha azdır (ders notları).

Kaynaklar: `nuce-ch2`, `iaea-vver`

<details><summary>Alternatif soru ifadeleri</summary>

- VVER Yatay buhar üreteci nedir?
- VVER Yatay buhar üreteci açıkla
- VVER Yatay buhar üreteci göster
- VVER buhar üreteci nedir?
- VVER buhar üreteci açıkla
- VVER buhar üreteci göster
- VVER yatay buhar üreteci nedir?
- VVER yatay buhar üreteci açıkla
- VVER yatay buhar üreteci göster
- VVER buhar jeneratörü nedir?
- VVER buhar jeneratörü açıkla
- VVER buhar jeneratörü göster
- VVER steam generator nedir?
- VVER steam generator açıkla
- VVER steam generator göster
- VVER Yatay buhar üreteci ne işe yarar?
- VVER Yatay buhar üreteci nasıl çalışır?
- VVER buhar üreteci ne işe yarar?
- VVER buhar üreteci nasıl çalışır?
- VVER yatay buhar üreteci ne işe yarar?
- VVER yatay buhar üreteci nasıl çalışır?
- VVER buhar jeneratörü ne işe yarar?
- VVER buhar jeneratörü nasıl çalışır?
- VVER steam generator ne işe yarar?
- VVER steam generator nasıl çalışır?

</details>

### VVER Sıcak kolektör ne işe yarar?

Kimlik: `entry:vver.collector-hot`

Sıcak kol suyunu yatay borulara dağıtır.

Dikey, kalın cidarlı bir silindirdir; boruların uçları kolektör duvarına bağlanır. Birincil su buradan borulara girer.

Kaynaklar: `nuce-ch2`, `iaea-vver`

<details><summary>Alternatif soru ifadeleri</summary>

- VVER Sıcak kolektör nedir?
- VVER Sıcak kolektör açıkla
- VVER Sıcak kolektör göster
- VVER sıcak kolektör nedir?
- VVER sıcak kolektör açıkla
- VVER sıcak kolektör göster
- VVER kolektör nedir?
- VVER kolektör açıkla
- VVER kolektör göster
- VVER Sıcak kolektör ne işe yarar?
- VVER Sıcak kolektör nasıl çalışır?
- VVER sıcak kolektör ne işe yarar?
- VVER sıcak kolektör nasıl çalışır?
- VVER kolektör ne işe yarar?
- VVER kolektör nasıl çalışır?

</details>

### VVER Soğuk kolektör ne işe yarar?

Kimlik: `entry:vver.collector-cold`

Borularda soğuyan birincil suyu toplar.

Borulardan dönen su bu kolektörde birleşir ve soğuk kol üzerinden pompaya gider.

Kaynaklar: `nuce-ch2`, `iaea-vver`

<details><summary>Alternatif soru ifadeleri</summary>

- VVER Soğuk kolektör nedir?
- VVER Soğuk kolektör açıkla
- VVER Soğuk kolektör göster
- VVER soğuk kolektör nedir?
- VVER soğuk kolektör açıkla
- VVER soğuk kolektör göster
- VVER kolektör nedir?
- VVER kolektör açıkla
- VVER kolektör göster
- VVER Soğuk kolektör ne işe yarar?
- VVER Soğuk kolektör nasıl çalışır?
- VVER soğuk kolektör ne işe yarar?
- VVER soğuk kolektör nasıl çalışır?
- VVER kolektör ne işe yarar?
- VVER kolektör nasıl çalışır?

</details>

### VVER Sıcak kol (üst kot) ne işe yarar?

Kimlik: `entry:vver.hotleg`

Isınan birincil suyu sıcak kolektöre taşır.

Kabın üst nozul sırasından çıkar. Su basınç altında sıvıdır; şemada turuncu-kırmızı, düz çizgi.

Kaynaklar: `nuce-ch2`, `iaea-vver`

<details><summary>Alternatif soru ifadeleri</summary>

- VVER Sıcak kol (üst kot) nedir?
- VVER Sıcak kol (üst kot) açıkla
- VVER Sıcak kol (üst kot) göster
- VVER sıcak kol nedir?
- VVER sıcak kol açıkla
- VVER sıcak kol göster
- VVER hot leg nedir?
- VVER hot leg açıkla
- VVER hot leg göster
- VVER Sıcak kol (üst kot) ne işe yarar?
- VVER Sıcak kol (üst kot) nasıl çalışır?
- VVER sıcak kol ne işe yarar?
- VVER sıcak kol nasıl çalışır?
- VVER hot leg ne işe yarar?
- VVER hot leg nasıl çalışır?

</details>

### VVER Soğuk kol (alt kot) ne işe yarar?

Kimlik: `entry:vver.coldleg`

Soğuk kolektörden çıkan suyu pompa üzerinden kaba döndürür.

Kabın alt nozul sırasından girer. Şemada mavi, düz çizgi.

Kaynaklar: `nuce-ch2`, `iaea-vver`

<details><summary>Alternatif soru ifadeleri</summary>

- VVER Soğuk kol (alt kot) nedir?
- VVER Soğuk kol (alt kot) açıkla
- VVER Soğuk kol (alt kot) göster
- VVER soğuk kol nedir?
- VVER soğuk kol açıkla
- VVER soğuk kol göster
- VVER cold leg nedir?
- VVER cold leg açıkla
- VVER cold leg göster
- VVER Soğuk kol (alt kot) ne işe yarar?
- VVER Soğuk kol (alt kot) nasıl çalışır?
- VVER soğuk kol ne işe yarar?
- VVER soğuk kol nasıl çalışır?
- VVER cold leg ne işe yarar?
- VVER cold leg nasıl çalışır?

</details>

### VVER Ana sirkülasyon pompası ne işe yarar?

Kimlik: `entry:vver.mcp`

Birincil suyu kapalı çevrimde dolaştırır.

Dikey motorlu büyük santrifüj pompa. Birincil debi sabit gösterilir; güç değişince sıcaklık farkı değişir.

Kaynaklar: `nuce-ch2`, `iaea-vver`

<details><summary>Alternatif soru ifadeleri</summary>

- VVER Ana sirkülasyon pompası nedir?
- VVER Ana sirkülasyon pompası açıkla
- VVER Ana sirkülasyon pompası göster
- VVER ana sirkülasyon pompası nedir?
- VVER ana sirkülasyon pompası açıkla
- VVER ana sirkülasyon pompası göster
- VVER birincil pompa nedir?
- VVER birincil pompa açıkla
- VVER birincil pompa göster
- VVER pompa nedir?
- VVER pompa açıkla
- VVER pompa göster
- VVER Ana sirkülasyon pompası ne işe yarar?
- VVER Ana sirkülasyon pompası nasıl çalışır?
- VVER ana sirkülasyon pompası ne işe yarar?
- VVER ana sirkülasyon pompası nasıl çalışır?
- VVER birincil pompa ne işe yarar?
- VVER birincil pompa nasıl çalışır?
- VVER pompa ne işe yarar?
- VVER pompa nasıl çalışır?

</details>

### VVER Ana buhar hattı ne işe yarar?

Kimlik: `entry:vver.steamline`

İkincil buharı türbine götürür.

Yatay buhar üretecinin üstündeki nozullardan toplanan ikincil buhar koruma yapısının dışındaki türbine gider. Birincil su türbine gitmez.

Kaynaklar: `nuce-ch2`, `iaea-vver`

<details><summary>Alternatif soru ifadeleri</summary>

- VVER Ana buhar hattı nedir?
- VVER Ana buhar hattı açıkla
- VVER Ana buhar hattı göster
- VVER ana buhar hattı nedir?
- VVER ana buhar hattı açıkla
- VVER ana buhar hattı göster
- VVER buhar hattı nedir?
- VVER buhar hattı açıkla
- VVER buhar hattı göster
- VVER Ana buhar hattı ne işe yarar?
- VVER Ana buhar hattı nasıl çalışır?
- VVER ana buhar hattı ne işe yarar?
- VVER ana buhar hattı nasıl çalışır?
- VVER buhar hattı ne işe yarar?
- VVER buhar hattı nasıl çalışır?

</details>

### VVER Yüksek basınç (YB) türbini ne işe yarar?

Kimlik: `entry:vver.hp`

Buhar enerjisinin bir kısmını mil işine çevirir.

İkincil devre buharı YB türbininde genişler, geçiş borusuyla AB türbinine gider.

Kaynaklar: `nuce-ch2`, `iaea-vver`

<details><summary>Alternatif soru ifadeleri</summary>

- VVER Yüksek basınç (YB) türbini nedir?
- VVER Yüksek basınç (YB) türbini açıkla
- VVER Yüksek basınç (YB) türbini göster
- VVER yüksek basınç türbini nedir?
- VVER yüksek basınç türbini açıkla
- VVER yüksek basınç türbini göster
- VVER yb türbini nedir?
- VVER yb türbini açıkla
- VVER yb türbini göster
- VVER türbin nedir?
- VVER türbin açıkla
- VVER türbin göster
- VVER Yüksek basınç (YB) türbini ne işe yarar?
- VVER Yüksek basınç (YB) türbini nasıl çalışır?
- VVER yüksek basınç türbini ne işe yarar?
- VVER yüksek basınç türbini nasıl çalışır?
- VVER yb türbini ne işe yarar?
- VVER yb türbini nasıl çalışır?
- VVER türbin ne işe yarar?
- VVER türbin nasıl çalışır?

</details>

### VVER Alçak basınç (AB) türbini ne işe yarar?

Kimlik: `entry:vver.lp`

Buhar enerjisinin kalanını mekanik enerjiye çevirir.

Çift akışlı türbinden çıkan buhar kondensere boşalır.

Kaynaklar: `nuce-ch2`, `iaea-vver`

<details><summary>Alternatif soru ifadeleri</summary>

- VVER Alçak basınç (AB) türbini nedir?
- VVER Alçak basınç (AB) türbini açıkla
- VVER Alçak basınç (AB) türbini göster
- VVER alçak basınç türbini nedir?
- VVER alçak basınç türbini açıkla
- VVER alçak basınç türbini göster
- VVER ab türbini nedir?
- VVER ab türbini açıkla
- VVER ab türbini göster
- VVER türbin nedir?
- VVER türbin açıkla
- VVER türbin göster
- VVER Alçak basınç (AB) türbini ne işe yarar?
- VVER Alçak basınç (AB) türbini nasıl çalışır?
- VVER alçak basınç türbini ne işe yarar?
- VVER alçak basınç türbini nasıl çalışır?
- VVER ab türbini ne işe yarar?
- VVER ab türbini nasıl çalışır?
- VVER türbin ne işe yarar?
- VVER türbin nasıl çalışır?

</details>

### VVER Jeneratör ne işe yarar?

Kimlik: `entry:vver.gen`

Mil işini elektriğe dönüştürür.

Şebekeye senkron bağlıdır; güç değişince hız değil tork değişir.

Kaynaklar: `nuce-ch2`, `iaea-vver`

<details><summary>Alternatif soru ifadeleri</summary>

- VVER Jeneratör nedir?
- VVER Jeneratör açıkla
- VVER Jeneratör göster
- VVER jeneratör nedir?
- VVER jeneratör açıkla
- VVER jeneratör göster
- VVER generatör nedir?
- VVER generatör açıkla
- VVER generatör göster
- VVER elektrik üretimi nedir?
- VVER elektrik üretimi açıkla
- VVER elektrik üretimi göster
- VVER Jeneratör ne işe yarar?
- VVER Jeneratör nasıl çalışır?
- VVER jeneratör ne işe yarar?
- VVER jeneratör nasıl çalışır?
- VVER generatör ne işe yarar?
- VVER generatör nasıl çalışır?
- VVER elektrik üretimi ne işe yarar?
- VVER elektrik üretimi nasıl çalışır?

</details>

### VVER Kondenser ne işe yarar?

Kimlik: `entry:vver.condenser`

Türbin çıkış buharını yoğuşturur.

Buhar soğutma suyu borularının dışında yoğuşur; soğutma suyu ayrı çevrimdir ve karışmaz.

Kaynaklar: `nuce-ch2`, `iaea-vver`

<details><summary>Alternatif soru ifadeleri</summary>

- VVER Kondenser nedir?
- VVER Kondenser açıkla
- VVER Kondenser göster
- VVER kondenser nedir?
- VVER kondenser açıkla
- VVER kondenser göster
- VVER yoğuşturucu nedir?
- VVER yoğuşturucu açıkla
- VVER yoğuşturucu göster
- VVER yoğuşma nedir?
- VVER yoğuşma açıkla
- VVER yoğuşma göster
- VVER Kondenser ne işe yarar?
- VVER Kondenser nasıl çalışır?
- VVER kondenser ne işe yarar?
- VVER kondenser nasıl çalışır?
- VVER yoğuşturucu ne işe yarar?
- VVER yoğuşturucu nasıl çalışır?
- VVER yoğuşma ne işe yarar?
- VVER yoğuşma nasıl çalışır?

</details>

### VVER Besleme suyu pompası ne işe yarar?

Kimlik: `entry:vver.feedpump`

Yoğuşan suyu buhar üretecine geri basar.

Su ön ısıtıcıdan geçip yatay buhar üretecindeki besleme suyu dağıtıcısına gider.

Kaynaklar: `nuce-ch2`, `iaea-vver`

<details><summary>Alternatif soru ifadeleri</summary>

- VVER Besleme suyu pompası nedir?
- VVER Besleme suyu pompası açıkla
- VVER Besleme suyu pompası göster
- VVER besleme suyu pompası nedir?
- VVER besleme suyu pompası açıkla
- VVER besleme suyu pompası göster
- VVER besleme pompası nedir?
- VVER besleme pompası açıkla
- VVER besleme pompası göster
- VVER Besleme suyu pompası ne işe yarar?
- VVER Besleme suyu pompası nasıl çalışır?
- VVER besleme suyu pompası ne işe yarar?
- VVER besleme suyu pompası nasıl çalışır?
- VVER besleme pompası ne işe yarar?
- VVER besleme pompası nasıl çalışır?

</details>

### VVER Besleme suyu ön ısıtıcısı ne işe yarar?

Kimlik: `entry:vver.heater`

Besleme suyunu ısıtır.

Birden çok ısıtıcı tek kutuyla sadeleştirildi.

Kaynaklar: `nuce-ch2`, `iaea-vver`

<details><summary>Alternatif soru ifadeleri</summary>

- VVER Besleme suyu ön ısıtıcısı nedir?
- VVER Besleme suyu ön ısıtıcısı açıkla
- VVER Besleme suyu ön ısıtıcısı göster
- VVER ön ısıtıcı nedir?
- VVER ön ısıtıcı açıkla
- VVER ön ısıtıcı göster
- VVER besleme suyu ısıtıcısı nedir?
- VVER besleme suyu ısıtıcısı açıkla
- VVER besleme suyu ısıtıcısı göster
- VVER Besleme suyu ön ısıtıcısı ne işe yarar?
- VVER Besleme suyu ön ısıtıcısı nasıl çalışır?
- VVER ön ısıtıcı ne işe yarar?
- VVER ön ısıtıcı nasıl çalışır?
- VVER besleme suyu ısıtıcısı ne işe yarar?
- VVER besleme suyu ısıtıcısı nasıl çalışır?

</details>

### VVER Soğutma suyu çevrimi ne işe yarar?

Kimlik: `entry:vver.coolsource`

Kondenser ısısını çevreye atar.

Ayrı üçüncü çevrim; turkuaz ve kesik-noktalı çizgi.

Kaynaklar: `nuce-ch2`, `iaea-vver`

<details><summary>Alternatif soru ifadeleri</summary>

- VVER Soğutma suyu çevrimi nedir?
- VVER Soğutma suyu çevrimi açıkla
- VVER Soğutma suyu çevrimi göster
- VVER soğutma suyu nedir?
- VVER soğutma suyu açıkla
- VVER soğutma suyu göster
- VVER soğutma kulesi nedir?
- VVER soğutma kulesi açıkla
- VVER soğutma kulesi göster
- VVER Soğutma suyu çevrimi ne işe yarar?
- VVER Soğutma suyu çevrimi nasıl çalışır?
- VVER soğutma suyu ne işe yarar?
- VVER soğutma suyu nasıl çalışır?
- VVER soğutma kulesi ne işe yarar?
- VVER soğutma kulesi nasıl çalışır?

</details>

### VVER Koruma yapısı (containment) ne işe yarar?

Kimlik: `entry:vver.containment`

Birincil devreyi çevreleyen yapı.

Ders notlarına göre VVER-1000 koruma yapısı ABD tipi çelik astarlı ön gerilmeli beton yapıya benzer. Eski VVER-440/230’da tam kapsamlı bir koruma yapısı yoktu; tasarımlar arasında büyük fark vardır.

Kaynaklar: `nuce-ch2`, `iaea-vver`

<details><summary>Alternatif soru ifadeleri</summary>

- VVER Koruma yapısı (containment) nedir?
- VVER Koruma yapısı (containment) açıkla
- VVER Koruma yapısı (containment) göster
- VVER koruma yapısı nedir?
- VVER koruma yapısı açıkla
- VVER koruma yapısı göster
- VVER containment nedir?
- VVER containment açıkla
- VVER containment göster
- VVER koruma binası nedir?
- VVER koruma binası açıkla
- VVER koruma binası göster
- VVER Koruma yapısı (containment) ne işe yarar?
- VVER Koruma yapısı (containment) nasıl çalışır?
- VVER koruma yapısı ne işe yarar?
- VVER koruma yapısı nasıl çalışır?
- VVER containment ne işe yarar?
- VVER containment nasıl çalışır?
- VVER koruma binası ne işe yarar?
- VVER koruma binası nasıl çalışır?

</details>

### VVER Dalgalanma (surge) hattı ne işe yarar?

Kimlik: `entry:vver.surge`

Basınçlandırıcıyı sıcak kola bağlar.

Birincil sudaki hacim değişimleri bu hat üzerinden basınçlandırıcıya girip çıkar.

Kaynaklar: `nuce-ch2`, `iaea-vver`

<details><summary>Alternatif soru ifadeleri</summary>

- VVER Dalgalanma (surge) hattı nedir?
- VVER Dalgalanma (surge) hattı açıkla
- VVER Dalgalanma (surge) hattı göster
- VVER dalgalanma hattı nedir?
- VVER dalgalanma hattı açıkla
- VVER dalgalanma hattı göster
- VVER surge hattı nedir?
- VVER surge hattı açıkla
- VVER surge hattı göster
- VVER Dalgalanma (surge) hattı ne işe yarar?
- VVER Dalgalanma (surge) hattı nasıl çalışır?
- VVER dalgalanma hattı ne işe yarar?
- VVER dalgalanma hattı nasıl çalışır?
- VVER surge hattı ne işe yarar?
- VVER surge hattı nasıl çalışır?

</details>

### VVER Yatay buhar üreteci yakın planı açıkla

Kimlik: `entry:vver.focus.hsgzoom`

Gövde, kolektörler, yatay U boru demeti, su seviyesi, buhar boşluğu, nem ayırıcı ve besleme dağıtıcısı yakın planda.

Kaynaklar: `nuce-ch2`, `iaea-vver`

<details><summary>Alternatif soru ifadeleri</summary>

- VVER Yatay buhar üreteci yakın planı nedir?
- VVER Yatay buhar üreteci yakın planı açıkla
- VVER Yatay buhar üreteci yakın planı göster

</details>

### VVER Kolektör ve boru demeti açıkla

Kimlik: `entry:vver.focus.collectors`

Sıcak kolektör → yatay U boruları → soğuk kolektör. Birincil su boruların içinde kalır; ikincil su boruların dışında kaynar. İki akışkan karışmaz.

Kaynaklar: `nuce-ch2`, `iaea-vver`

<details><summary>Alternatif soru ifadeleri</summary>

- VVER Kolektör ve boru demeti nedir?
- VVER Kolektör ve boru demeti açıkla
- VVER Kolektör ve boru demeti göster

</details>

### VVER Altıgen yakıt demeti açıkla

Kimlik: `entry:vver.focus.hexfuel`

VVER yakıt çubukları üçgen adımlı dizilir ve demetler altıgendir; ABD PWR’lerinde kare adım kullanılır (ders notları).

Kaynaklar: `nuce-ch2`, `iaea-vver`

<details><summary>Alternatif soru ifadeleri</summary>

- VVER Altıgen yakıt demeti nedir?
- VVER Altıgen yakıt demeti açıkla
- VVER Altıgen yakıt demeti göster

</details>

### VVER Dikey buhar üreteciyle karşılaştır açıkla

Kimlik: `entry:vver.focus.vsg`

İkisi de PWR ailesinde birincil ve ikincil devreyi ayırır. Fark ekipman geometrisindedir: dikey U borulu üreteç yüksek ve dar, VVER’in yatay üreteci uzun ve yataydır.

Kaynaklar: `nuce-ch2`, `iaea-vver`

<details><summary>Alternatif soru ifadeleri</summary>

- VVER Dikey buhar üreteciyle karşılaştır nedir?
- VVER Dikey buhar üreteciyle karşılaştır açıkla
- VVER Dikey buhar üreteciyle karşılaştır göster

</details>

### VVER VVER anlatımı · 1. Çekirdek açıkla

Kimlik: `entry:vver.tour.core`

Altıgen yakıt demetlerinde fisyon ısısı üretilir. Kontrol çubuğu kümeleri üst bloktan aşağı girer. Su hem soğutucu hem yavaşlatıcıdır.

Kaynaklar: `nuce-ch2`, `iaea-vver`

<details><summary>Alternatif soru ifadeleri</summary>

- VVER VVER anlatımı · 1. Çekirdek nedir?
- VVER VVER anlatımı · 1. Çekirdek açıkla
- VVER VVER anlatımı · 1. Çekirdek göster
- VVER Çekirdek nedir?
- VVER Çekirdek açıkla
- VVER Çekirdek göster

</details>

### VVER VVER anlatımı · 2. Birincil çevrim açıkla

Kimlik: `entry:vver.tour.primary`

Birincil su basınç altında sıvı kalır. Isınan su üst kottaki sıcak koldan çıkar, pompa ile alt kottaki soğuk koldan geri döner. Basınçlandırıcı basıncı ayarlar.

Kaynaklar: `nuce-ch2`, `iaea-vver`

<details><summary>Alternatif soru ifadeleri</summary>

- VVER VVER anlatımı · 2. Birincil çevrim nedir?
- VVER VVER anlatımı · 2. Birincil çevrim açıkla
- VVER VVER anlatımı · 2. Birincil çevrim göster
- VVER Birincil çevrim nedir?
- VVER Birincil çevrim açıkla
- VVER Birincil çevrim göster

</details>

### VVER VVER anlatımı · 3. Yatay buhar üreteci açıkla

Kimlik: `entry:vver.tour.hsg`

Sıcak kolektörden yatay U borularına dağılan birincil su ısısını boru duvarından verir ve soğuk kolektörde toplanır. Gövde tarafındaki ikincil su kaynar; akışkanlar karışmaz.

Kaynaklar: `nuce-ch2`, `iaea-vver`

<details><summary>Alternatif soru ifadeleri</summary>

- VVER VVER anlatımı · 3. Yatay buhar üreteci nedir?
- VVER VVER anlatımı · 3. Yatay buhar üreteci açıkla
- VVER VVER anlatımı · 3. Yatay buhar üreteci göster
- VVER Yatay buhar üreteci nedir?
- VVER Yatay buhar üreteci açıkla
- VVER Yatay buhar üreteci göster

</details>

### VVER VVER anlatımı · 4. İkincil çevrim açıkla

Kimlik: `entry:vver.tour.secondary`

Gövdenin üst bölümünde ayrılan buhar nozullardan toplanır ve ana buhar hattıyla koruma yapısının dışına çıkar.

Kaynaklar: `nuce-ch2`, `iaea-vver`

<details><summary>Alternatif soru ifadeleri</summary>

- VVER VVER anlatımı · 4. İkincil çevrim nedir?
- VVER VVER anlatımı · 4. İkincil çevrim açıkla
- VVER VVER anlatımı · 4. İkincil çevrim göster
- VVER İkincil çevrim nedir?
- VVER İkincil çevrim açıkla
- VVER İkincil çevrim göster

</details>

### VVER VVER anlatımı · 5. Türbin ve kondenser açıkla

Kimlik: `entry:vver.tour.turbine`

Buhar YB ve AB türbinlerinde genişleyerek jeneratörü döndürür, ardından kondenserde ayrı soğutma suyu çevrimiyle yoğuşturulur.

Kaynaklar: `nuce-ch2`, `iaea-vver`

<details><summary>Alternatif soru ifadeleri</summary>

- VVER VVER anlatımı · 5. Türbin ve kondenser nedir?
- VVER VVER anlatımı · 5. Türbin ve kondenser açıkla
- VVER VVER anlatımı · 5. Türbin ve kondenser göster
- VVER Türbin ve kondenser nedir?
- VVER Türbin ve kondenser açıkla
- VVER Türbin ve kondenser göster

</details>

### VVER VVER anlatımı · 6. Dönüş açıkla

Kimlik: `entry:vver.tour.return`

Yoğuşan su besleme pompası ve ön ısıtıcıdan geçerek yatay buhar üretecindeki dağıtıcıya geri döner.

Kaynaklar: `nuce-ch2`, `iaea-vver`

<details><summary>Alternatif soru ifadeleri</summary>

- VVER VVER anlatımı · 6. Dönüş nedir?
- VVER VVER anlatımı · 6. Dönüş açıkla
- VVER VVER anlatımı · 6. Dönüş göster
- VVER Dönüş nedir?
- VVER Dönüş açıkla
- VVER Dönüş göster

</details>

### VVER VVER’de buhar nerede oluşur? açıkla

Kimlik: `entry:vver.topic.steam-where`

Buhar, yatay buhar üretecinin ikincil (gövde) tarafında, yatay U borularının dışında oluşur. Birincil su basınç altında sıvı kalır; iki devre arasında yalnız ısı geçer.

Kaynaklar: `nuce-ch2`, `iaea-vver`

<details><summary>Alternatif soru ifadeleri</summary>

- VVER VVER’de buhar nerede oluşur? nedir?
- VVER VVER’de buhar nerede oluşur? açıkla
- VVER VVER’de buhar nerede oluşur? göster
- VVER buhar nerede oluşuyor nedir?
- VVER buhar nerede oluşuyor açıkla
- VVER buhar nerede oluşuyor göster
- VVER buhar oluşumu nedir?
- VVER buhar oluşumu açıkla
- VVER buhar oluşumu göster
- VVER kaynama nerede nedir?
- VVER kaynama nerede açıkla
- VVER kaynama nerede göster
- VVER buhar nerede nedir?
- VVER buhar nerede açıkla
- VVER buhar nerede göster

</details>

### VVER Türbine giden buhar nerede oluşur?

Kimlik: `compare:steam-where:vver`

Yatay buhar üretecinin ikincil (gövde) tarafında. Birincil su basınç altında sıvı kalır.

Kaynaklar: `nuce-ch2`, `iaea-vver`

<details><summary>Alternatif soru ifadeleri</summary>

- VVER buhar nerede oluşur
- VVER buhar nerede oluşuyor
- VVER su nerede kaynar

</details>

### VVER Çekirdekte üretilen ısı türbine nasıl ulaşır?

Kimlik: `compare:heat-path:vver`

Çekirdek → sıcak kol → sıcak kolektör → yatay U boruları → ikincil buhar → türbin.

Kaynaklar: `nuce-ch2`, `iaea-vver`

<details><summary>Alternatif soru ifadeleri</summary>

- VVER ısı türbine nasıl ulaşır
- VVER enerji türbine nasıl aktarılır

</details>

### VVER Reaktör suyu ile türbin suyu aynı akışkan mı?

Kimlik: `compare:loops:vver`

Hayır. İki ayrı çevrim; aralarında yalnız ısı geçer. Türbine ikincil buhar gider.

Kaynaklar: `nuce-ch2`, `iaea-vver`

<details><summary>Alternatif soru ifadeleri</summary>

- VVER reaktör suyu türbine gider mi
- VVER birincil ve ikincil su karışır mı
- VVER iki devre neden ayrı
- VVER kaç devre var
- VVER reaktör suyu türbin suyu aynı mı

</details>

### VVER Basınçlandırıcı var mı, ne işe yarar?

Kimlik: `compare:pressurizer:vver`

Var. PWR ailesinde olduğu gibi dalgalanma hattıyla sıcak kola bağlıdır ve birincil basıncı ayarlar.

Kaynaklar: `nuce-ch2`, `iaea-vver`

<details><summary>Alternatif soru ifadeleri</summary>

- VVER basınçlandırıcı var mı
- VVER basınç nasıl kontrol edilir

</details>

### VVER Buhar üreteci nasıl yerleşmiştir?

Kimlik: `compare:sg-layout:vver`

Uzun yatay buhar üreteci: birincil su sıcak kolektörden yatay U borularına dağılır, soğuk kolektörde toplanır.

Kaynaklar: `nuce-ch2`, `iaea-vver`

<details><summary>Alternatif soru ifadeleri</summary>

- VVER buhar üreteci yatay mı dikey mi

</details>

### VVER Çizilen tasarımda kontrol çubukları nereden girer?

Kimlik: `compare:rods:vver`

Çizilen tasarımda yüksek üst bloktaki sürücülerden, üstten giren çubuk kümeleri.

Bu açıklama çizilen temsili tasarıma aittir; gerçek tesislerin ayrıntıları değişebilir.

Kaynaklar: `nuce-ch2`, `iaea-vver`

<details><summary>Alternatif soru ifadeleri</summary>

- VVER kontrol çubukları nereden girer
- VVER kontrol çubukları alttan mı üstten mi

</details>

## Karşılaştırma

### PWR ve BWR: Türbine giden buhar nerede oluşur?

Kimlik: `compare:steam-where:pwr-bwr`

PWR: Buhar üretecinin ikincil (gövde) tarafında. Birincil devrede normal çalışmada toplu kaynama olmaz.

BWR: Doğrudan reaktör kabında: su çekirdekte kaynar, buhar kabın üstünde ayrılır ve kurutulur.

Kaynaklar: `nuce-ch2`, `nrc-unit3`, `nrc-bwr`

<details><summary>Alternatif soru ifadeleri</summary>

- pwr bwr buhar nerede oluşur karşılaştır
- pwr bwr buhar nerede oluşuyor karşılaştır
- pwr bwr su nerede kaynar karşılaştır

</details>

### PWR ve VVER: Türbine giden buhar nerede oluşur?

Kimlik: `compare:steam-where:pwr-vver`

PWR: Buhar üretecinin ikincil (gövde) tarafında. Birincil devrede normal çalışmada toplu kaynama olmaz.

VVER: Yatay buhar üretecinin ikincil (gövde) tarafında. Birincil su basınç altında sıvı kalır.

Kaynaklar: `nuce-ch2`, `nrc-unit3`, `iaea-vver`

<details><summary>Alternatif soru ifadeleri</summary>

- pwr vver buhar nerede oluşur karşılaştır
- pwr vver buhar nerede oluşuyor karşılaştır
- pwr vver su nerede kaynar karşılaştır

</details>

### BWR ve VVER: Türbine giden buhar nerede oluşur?

Kimlik: `compare:steam-where:bwr-vver`

BWR: Doğrudan reaktör kabında: su çekirdekte kaynar, buhar kabın üstünde ayrılır ve kurutulur.

VVER: Yatay buhar üretecinin ikincil (gövde) tarafında. Birincil su basınç altında sıvı kalır.

Kaynaklar: `nuce-ch2`, `nrc-bwr`, `iaea-vver`

<details><summary>Alternatif soru ifadeleri</summary>

- bwr vver buhar nerede oluşur karşılaştır
- bwr vver buhar nerede oluşuyor karşılaştır
- bwr vver su nerede kaynar karşılaştır

</details>

### PWR ve BWR ve VVER: Türbine giden buhar nerede oluşur?

Kimlik: `compare:steam-where:pwr-bwr-vver`

PWR: Buhar üretecinin ikincil (gövde) tarafında. Birincil devrede normal çalışmada toplu kaynama olmaz.

BWR: Doğrudan reaktör kabında: su çekirdekte kaynar, buhar kabın üstünde ayrılır ve kurutulur.

VVER: Yatay buhar üretecinin ikincil (gövde) tarafında. Birincil su basınç altında sıvı kalır.

Kaynaklar: `nuce-ch2`, `nrc-unit3`, `nrc-bwr`, `iaea-vver`

<details><summary>Alternatif soru ifadeleri</summary>

- pwr bwr vver buhar nerede oluşur karşılaştır
- pwr bwr vver buhar nerede oluşuyor karşılaştır
- pwr bwr vver su nerede kaynar karşılaştır

</details>

### PWR ve BWR: Çekirdekte üretilen ısı türbine nasıl ulaşır?

Kimlik: `compare:heat-path:pwr-bwr`

PWR: Çekirdek → sıcak kol → buhar üretecinin U boruları (ısı boru duvarından geçer) → ikincil buhar → türbin.

BWR: Çekirdek → kaynayan reaktör suyu → ayırıcı/kurutucu → aynı akışkanın buharı doğrudan türbine. Arada ısı değiştirici yok.

Kaynaklar: `nuce-ch2`, `nrc-unit3`, `nrc-bwr`

<details><summary>Alternatif soru ifadeleri</summary>

- pwr bwr ısı türbine nasıl ulaşır karşılaştır
- pwr bwr enerji türbine nasıl aktarılır karşılaştır

</details>

### PWR ve VVER: Çekirdekte üretilen ısı türbine nasıl ulaşır?

Kimlik: `compare:heat-path:pwr-vver`

PWR: Çekirdek → sıcak kol → buhar üretecinin U boruları (ısı boru duvarından geçer) → ikincil buhar → türbin.

VVER: Çekirdek → sıcak kol → sıcak kolektör → yatay U boruları → ikincil buhar → türbin.

Kaynaklar: `nuce-ch2`, `nrc-unit3`, `iaea-vver`

<details><summary>Alternatif soru ifadeleri</summary>

- pwr vver ısı türbine nasıl ulaşır karşılaştır
- pwr vver enerji türbine nasıl aktarılır karşılaştır

</details>

### BWR ve VVER: Çekirdekte üretilen ısı türbine nasıl ulaşır?

Kimlik: `compare:heat-path:bwr-vver`

BWR: Çekirdek → kaynayan reaktör suyu → ayırıcı/kurutucu → aynı akışkanın buharı doğrudan türbine. Arada ısı değiştirici yok.

VVER: Çekirdek → sıcak kol → sıcak kolektör → yatay U boruları → ikincil buhar → türbin.

Kaynaklar: `nuce-ch2`, `nrc-bwr`, `iaea-vver`

<details><summary>Alternatif soru ifadeleri</summary>

- bwr vver ısı türbine nasıl ulaşır karşılaştır
- bwr vver enerji türbine nasıl aktarılır karşılaştır

</details>

### PWR ve BWR ve VVER: Çekirdekte üretilen ısı türbine nasıl ulaşır?

Kimlik: `compare:heat-path:pwr-bwr-vver`

PWR: Çekirdek → sıcak kol → buhar üretecinin U boruları (ısı boru duvarından geçer) → ikincil buhar → türbin.

BWR: Çekirdek → kaynayan reaktör suyu → ayırıcı/kurutucu → aynı akışkanın buharı doğrudan türbine. Arada ısı değiştirici yok.

VVER: Çekirdek → sıcak kol → sıcak kolektör → yatay U boruları → ikincil buhar → türbin.

Kaynaklar: `nuce-ch2`, `nrc-unit3`, `nrc-bwr`, `iaea-vver`

<details><summary>Alternatif soru ifadeleri</summary>

- pwr bwr vver ısı türbine nasıl ulaşır karşılaştır
- pwr bwr vver enerji türbine nasıl aktarılır karşılaştır

</details>

### PWR ve BWR: Reaktör suyu ile türbin suyu aynı akışkan mı?

Kimlik: `compare:loops:pwr-bwr`

PWR: Hayır. İki ayrı çevrim; aralarında yalnız ısı geçer, akışkan karışmaz. Türbine ikincil buhar gider.

BWR: Evet. Tek (doğrudan) çevrim: reaktör suyunun buharı türbine gider; bu yüzden türbin tarafı da korumalı bölgedir.

Kaynaklar: `nuce-ch2`, `nrc-unit3`, `nrc-bwr`

<details><summary>Alternatif soru ifadeleri</summary>

- pwr bwr reaktör suyu türbine gider mi karşılaştır
- pwr bwr birincil ve ikincil su karışır mı karşılaştır
- pwr bwr iki devre neden ayrı karşılaştır
- pwr bwr kaç devre var karşılaştır
- pwr bwr reaktör suyu türbin suyu aynı mı karşılaştır

</details>

### PWR ve VVER: Reaktör suyu ile türbin suyu aynı akışkan mı?

Kimlik: `compare:loops:pwr-vver`

PWR: Hayır. İki ayrı çevrim; aralarında yalnız ısı geçer, akışkan karışmaz. Türbine ikincil buhar gider.

VVER: Hayır. İki ayrı çevrim; aralarında yalnız ısı geçer. Türbine ikincil buhar gider.

Kaynaklar: `nuce-ch2`, `nrc-unit3`, `iaea-vver`

<details><summary>Alternatif soru ifadeleri</summary>

- pwr vver reaktör suyu türbine gider mi karşılaştır
- pwr vver birincil ve ikincil su karışır mı karşılaştır
- pwr vver iki devre neden ayrı karşılaştır
- pwr vver kaç devre var karşılaştır
- pwr vver reaktör suyu türbin suyu aynı mı karşılaştır

</details>

### BWR ve VVER: Reaktör suyu ile türbin suyu aynı akışkan mı?

Kimlik: `compare:loops:bwr-vver`

BWR: Evet. Tek (doğrudan) çevrim: reaktör suyunun buharı türbine gider; bu yüzden türbin tarafı da korumalı bölgedir.

VVER: Hayır. İki ayrı çevrim; aralarında yalnız ısı geçer. Türbine ikincil buhar gider.

Kaynaklar: `nuce-ch2`, `nrc-bwr`, `iaea-vver`

<details><summary>Alternatif soru ifadeleri</summary>

- bwr vver reaktör suyu türbine gider mi karşılaştır
- bwr vver birincil ve ikincil su karışır mı karşılaştır
- bwr vver iki devre neden ayrı karşılaştır
- bwr vver kaç devre var karşılaştır
- bwr vver reaktör suyu türbin suyu aynı mı karşılaştır

</details>

### PWR ve BWR ve VVER: Reaktör suyu ile türbin suyu aynı akışkan mı?

Kimlik: `compare:loops:pwr-bwr-vver`

PWR: Hayır. İki ayrı çevrim; aralarında yalnız ısı geçer, akışkan karışmaz. Türbine ikincil buhar gider.

BWR: Evet. Tek (doğrudan) çevrim: reaktör suyunun buharı türbine gider; bu yüzden türbin tarafı da korumalı bölgedir.

VVER: Hayır. İki ayrı çevrim; aralarında yalnız ısı geçer. Türbine ikincil buhar gider.

Kaynaklar: `nuce-ch2`, `nrc-unit3`, `nrc-bwr`, `iaea-vver`

<details><summary>Alternatif soru ifadeleri</summary>

- pwr bwr vver reaktör suyu türbine gider mi karşılaştır
- pwr bwr vver birincil ve ikincil su karışır mı karşılaştır
- pwr bwr vver iki devre neden ayrı karşılaştır
- pwr bwr vver kaç devre var karşılaştır
- pwr bwr vver reaktör suyu türbin suyu aynı mı karşılaştır

</details>

### PWR ve BWR: Basınçlandırıcı var mı, ne işe yarar?

Kimlik: `compare:pressurizer:pwr-bwr`

PWR: Var. Birincil devrenin basıncını yüksek tutar (ders notları ~155 bar); ısıtıcılar basıncı artırır, püskürtme düşürür. Su/buhar ara yüzü yalnız burada bulunur.

BWR: Yok. Su ve buhar zaten reaktör kabında birlikte bulunur (kabın üst bölümü buhardır).

Kaynaklar: `nuce-ch2`, `nrc-unit3`, `nrc-bwr`

<details><summary>Alternatif soru ifadeleri</summary>

- pwr bwr basınçlandırıcı var mı karşılaştır
- pwr bwr basınç nasıl kontrol edilir karşılaştır

</details>

### PWR ve VVER: Basınçlandırıcı var mı, ne işe yarar?

Kimlik: `compare:pressurizer:pwr-vver`

PWR: Var. Birincil devrenin basıncını yüksek tutar (ders notları ~155 bar); ısıtıcılar basıncı artırır, püskürtme düşürür. Su/buhar ara yüzü yalnız burada bulunur.

VVER: Var. PWR ailesinde olduğu gibi dalgalanma hattıyla sıcak kola bağlıdır ve birincil basıncı ayarlar.

Kaynaklar: `nuce-ch2`, `nrc-unit3`, `iaea-vver`

<details><summary>Alternatif soru ifadeleri</summary>

- pwr vver basınçlandırıcı var mı karşılaştır
- pwr vver basınç nasıl kontrol edilir karşılaştır

</details>

### BWR ve VVER: Basınçlandırıcı var mı, ne işe yarar?

Kimlik: `compare:pressurizer:bwr-vver`

BWR: Yok. Su ve buhar zaten reaktör kabında birlikte bulunur (kabın üst bölümü buhardır).

VVER: Var. PWR ailesinde olduğu gibi dalgalanma hattıyla sıcak kola bağlıdır ve birincil basıncı ayarlar.

Kaynaklar: `nuce-ch2`, `nrc-bwr`, `iaea-vver`

<details><summary>Alternatif soru ifadeleri</summary>

- bwr vver basınçlandırıcı var mı karşılaştır
- bwr vver basınç nasıl kontrol edilir karşılaştır

</details>

### PWR ve BWR ve VVER: Basınçlandırıcı var mı, ne işe yarar?

Kimlik: `compare:pressurizer:pwr-bwr-vver`

PWR: Var. Birincil devrenin basıncını yüksek tutar (ders notları ~155 bar); ısıtıcılar basıncı artırır, püskürtme düşürür. Su/buhar ara yüzü yalnız burada bulunur.

BWR: Yok. Su ve buhar zaten reaktör kabında birlikte bulunur (kabın üst bölümü buhardır).

VVER: Var. PWR ailesinde olduğu gibi dalgalanma hattıyla sıcak kola bağlıdır ve birincil basıncı ayarlar.

Kaynaklar: `nuce-ch2`, `nrc-unit3`, `nrc-bwr`, `iaea-vver`

<details><summary>Alternatif soru ifadeleri</summary>

- pwr bwr vver basınçlandırıcı var mı karşılaştır
- pwr bwr vver basınç nasıl kontrol edilir karşılaştır

</details>

### PWR ve BWR: Buhar üreteci nasıl yerleşmiştir?

Kimlik: `compare:sg-layout:pwr-bwr`

PWR: Çizilen tasarımda dikey, U borulu buhar üreteci: yüksek ve dar; ayırıcı ve kurutucular üst bölümde.

BWR: Ayrı buhar üreteci yok. Ayırıcılar ve kurutucular reaktör kabının içindedir.

Çizilen temsili tasarımlar karşılaştırılıyor; bu ayrıntılar bütün tesislere genellenemez.

Kaynaklar: `nuce-ch2`, `nrc-unit3`, `nrc-bwr`

<details><summary>Alternatif soru ifadeleri</summary>

- pwr bwr buhar üreteci yatay mı dikey mi karşılaştır

</details>

### PWR ve VVER: Buhar üreteci nasıl yerleşmiştir?

Kimlik: `compare:sg-layout:pwr-vver`

PWR: Çizilen tasarımda dikey, U borulu buhar üreteci: yüksek ve dar; ayırıcı ve kurutucular üst bölümde.

VVER: Uzun yatay buhar üreteci: birincil su sıcak kolektörden yatay U borularına dağılır, soğuk kolektörde toplanır.

Çizilen temsili tasarımlar karşılaştırılıyor; bu ayrıntılar bütün tesislere genellenemez.

Kaynaklar: `nuce-ch2`, `nrc-unit3`, `iaea-vver`

<details><summary>Alternatif soru ifadeleri</summary>

- pwr vver buhar üreteci yatay mı dikey mi karşılaştır

</details>

### BWR ve VVER: Buhar üreteci nasıl yerleşmiştir?

Kimlik: `compare:sg-layout:bwr-vver`

BWR: Ayrı buhar üreteci yok. Ayırıcılar ve kurutucular reaktör kabının içindedir.

VVER: Uzun yatay buhar üreteci: birincil su sıcak kolektörden yatay U borularına dağılır, soğuk kolektörde toplanır.

Kaynaklar: `nuce-ch2`, `nrc-bwr`, `iaea-vver`

<details><summary>Alternatif soru ifadeleri</summary>

- bwr vver buhar üreteci yatay mı dikey mi karşılaştır

</details>

### PWR ve BWR ve VVER: Buhar üreteci nasıl yerleşmiştir?

Kimlik: `compare:sg-layout:pwr-bwr-vver`

PWR: Çizilen tasarımda dikey, U borulu buhar üreteci: yüksek ve dar; ayırıcı ve kurutucular üst bölümde.

BWR: Ayrı buhar üreteci yok. Ayırıcılar ve kurutucular reaktör kabının içindedir.

VVER: Uzun yatay buhar üreteci: birincil su sıcak kolektörden yatay U borularına dağılır, soğuk kolektörde toplanır.

Çizilen temsili tasarımlar karşılaştırılıyor; bu ayrıntılar bütün tesislere genellenemez.

Kaynaklar: `nuce-ch2`, `nrc-unit3`, `nrc-bwr`, `iaea-vver`

<details><summary>Alternatif soru ifadeleri</summary>

- pwr bwr vver buhar üreteci yatay mı dikey mi karşılaştır

</details>

### PWR ve BWR: Çizilen tasarımda kontrol çubukları nereden girer?

Kimlik: `compare:rods:pwr-bwr`

PWR: Çizilen tasarımda kabın üst kapağındaki sürücülerden, üstten giren çubuk kümeleri.

BWR: Çizilen (geleneksel) tasarımda kabın altından giren haç kesitli çubuklar; ders notlarına göre alttan giren tek LWR tipi.

Çizilen temsili tasarımlar karşılaştırılıyor; bu ayrıntılar bütün tesislere genellenemez.

Kaynaklar: `nuce-ch2`, `nrc-unit3`, `nrc-bwr`

<details><summary>Alternatif soru ifadeleri</summary>

- pwr bwr kontrol çubukları nereden girer karşılaştır
- pwr bwr kontrol çubukları alttan mı üstten mi karşılaştır

</details>

### PWR ve VVER: Çizilen tasarımda kontrol çubukları nereden girer?

Kimlik: `compare:rods:pwr-vver`

PWR: Çizilen tasarımda kabın üst kapağındaki sürücülerden, üstten giren çubuk kümeleri.

VVER: Çizilen tasarımda yüksek üst bloktaki sürücülerden, üstten giren çubuk kümeleri.

Çizilen temsili tasarımlar karşılaştırılıyor; bu ayrıntılar bütün tesislere genellenemez.

Kaynaklar: `nuce-ch2`, `nrc-unit3`, `iaea-vver`

<details><summary>Alternatif soru ifadeleri</summary>

- pwr vver kontrol çubukları nereden girer karşılaştır
- pwr vver kontrol çubukları alttan mı üstten mi karşılaştır

</details>

### BWR ve VVER: Çizilen tasarımda kontrol çubukları nereden girer?

Kimlik: `compare:rods:bwr-vver`

BWR: Çizilen (geleneksel) tasarımda kabın altından giren haç kesitli çubuklar; ders notlarına göre alttan giren tek LWR tipi.

VVER: Çizilen tasarımda yüksek üst bloktaki sürücülerden, üstten giren çubuk kümeleri.

Çizilen temsili tasarımlar karşılaştırılıyor; bu ayrıntılar bütün tesislere genellenemez.

Kaynaklar: `nuce-ch2`, `nrc-bwr`, `iaea-vver`

<details><summary>Alternatif soru ifadeleri</summary>

- bwr vver kontrol çubukları nereden girer karşılaştır
- bwr vver kontrol çubukları alttan mı üstten mi karşılaştır

</details>

### PWR ve BWR ve VVER: Çizilen tasarımda kontrol çubukları nereden girer?

Kimlik: `compare:rods:pwr-bwr-vver`

PWR: Çizilen tasarımda kabın üst kapağındaki sürücülerden, üstten giren çubuk kümeleri.

BWR: Çizilen (geleneksel) tasarımda kabın altından giren haç kesitli çubuklar; ders notlarına göre alttan giren tek LWR tipi.

VVER: Çizilen tasarımda yüksek üst bloktaki sürücülerden, üstten giren çubuk kümeleri.

Çizilen temsili tasarımlar karşılaştırılıyor; bu ayrıntılar bütün tesislere genellenemez.

Kaynaklar: `nuce-ch2`, `nrc-unit3`, `nrc-bwr`, `iaea-vver`

<details><summary>Alternatif soru ifadeleri</summary>

- pwr bwr vver kontrol çubukları nereden girer karşılaştır
- pwr bwr vver kontrol çubukları alttan mı üstten mi karşılaştır

</details>

### PWR VE BWR arasındaki fark nedir?

Kimlik: `families:pwr-bwr`

PWR: Birincil devredeki su yüksek basınç altında (ders notlarında ~155 bar) tutulduğu için çekirdekte toplu kaynama olmaz. Isı, dikey U borulu buhar üretecinde ayrı bir ikincil devreye aktarılır; türbine yalnız ikincil devrenin buharı gider.

BWR: Reaktör suyu daha düşük basınçta (ders notlarında ~70 bar) tutulur ve doğrudan çekirdekte kaynar. Buhar kabın üst bölümünde ayrılıp kurutulur ve ayrı bir buhar üreteci olmadan doğrudan türbine gider. Kontrol çubukları alttan girer.

Kaynaklar: `nuce-ch2`, `nrc-unit3`, `nrc-bwr`

<details><summary>Alternatif soru ifadeleri</summary>

- pwr bwr karşılaştır
- pwr bwr farkları
- pwr bwr aynı mı

</details>

### PWR VE VVER arasındaki fark nedir?

Kimlik: `families:pwr-vver`

PWR: Birincil devredeki su yüksek basınç altında (ders notlarında ~155 bar) tutulduğu için çekirdekte toplu kaynama olmaz. Isı, dikey U borulu buhar üretecinde ayrı bir ikincil devreye aktarılır; türbine yalnız ikincil devrenin buharı gider.

VVER: VVER bir basınçlı su reaktörüdür: birincil su basınç altında sıvı kalır, buhar ayrı bir ikincil devrede oluşur. Ayırt edici özellikleri yatay buhar üreteci, sıcak/soğuk kolların kaba farklı kotlarda bağlanması ve altıgen (üçgen adımlı) yakıt demetleridir.

Kaynaklar: `nuce-ch2`, `nrc-unit3`, `iaea-vver`

<details><summary>Alternatif soru ifadeleri</summary>

- pwr vver karşılaştır
- pwr vver farkları
- pwr vver aynı mı

</details>

### BWR VE VVER arasındaki fark nedir?

Kimlik: `families:bwr-vver`

BWR: Reaktör suyu daha düşük basınçta (ders notlarında ~70 bar) tutulur ve doğrudan çekirdekte kaynar. Buhar kabın üst bölümünde ayrılıp kurutulur ve ayrı bir buhar üreteci olmadan doğrudan türbine gider. Kontrol çubukları alttan girer.

VVER: VVER bir basınçlı su reaktörüdür: birincil su basınç altında sıvı kalır, buhar ayrı bir ikincil devrede oluşur. Ayırt edici özellikleri yatay buhar üreteci, sıcak/soğuk kolların kaba farklı kotlarda bağlanması ve altıgen (üçgen adımlı) yakıt demetleridir.

Kaynaklar: `nuce-ch2`, `nrc-bwr`, `iaea-vver`

<details><summary>Alternatif soru ifadeleri</summary>

- bwr vver karşılaştır
- bwr vver farkları
- bwr vver aynı mı

</details>

### PWR VE BWR VE VVER arasındaki fark nedir?

Kimlik: `families:pwr-bwr-vver`

PWR: Birincil devredeki su yüksek basınç altında (ders notlarında ~155 bar) tutulduğu için çekirdekte toplu kaynama olmaz. Isı, dikey U borulu buhar üretecinde ayrı bir ikincil devreye aktarılır; türbine yalnız ikincil devrenin buharı gider.

BWR: Reaktör suyu daha düşük basınçta (ders notlarında ~70 bar) tutulur ve doğrudan çekirdekte kaynar. Buhar kabın üst bölümünde ayrılıp kurutulur ve ayrı bir buhar üreteci olmadan doğrudan türbine gider. Kontrol çubukları alttan girer.

VVER: VVER bir basınçlı su reaktörüdür: birincil su basınç altında sıvı kalır, buhar ayrı bir ikincil devrede oluşur. Ayırt edici özellikleri yatay buhar üreteci, sıcak/soğuk kolların kaba farklı kotlarda bağlanması ve altıgen (üçgen adımlı) yakıt demetleridir.

Kaynaklar: `nuce-ch2`, `nrc-unit3`, `nrc-bwr`, `iaea-vver`

<details><summary>Alternatif soru ifadeleri</summary>

- pwr bwr vver karşılaştır
- pwr bwr vver farkları
- pwr bwr vver aynı mı

</details>

## İşletme

### PWR İşletme ve davranış · İşletme modları açıkla

Kimlik: `entry:pwr.ops.modes`

PWR’nin altı işletme modu: güçte çalışmadan yakıt değişimine kadar fisyon gücü, türbin, soğutma yolu (birincil pompa + buhar üreteci ya da RHR), çubuklar ve kap kapağının durumu.

Kaynaklar: `tab-2-14`, `nuce-2-5`

<details><summary>Alternatif soru ifadeleri</summary>

- PWR İşletme ve davranış · İşletme modları nedir?
- PWR İşletme ve davranış · İşletme modları açıkla
- PWR İşletme ve davranış · İşletme modları göster
- PWR işletme modları nedir?
- PWR işletme modları açıkla
- PWR işletme modları göster
- PWR modlar nedir?
- PWR modlar açıkla
- PWR modlar göster
- PWR mod nedir?
- PWR mod açıkla
- PWR mod göster
- PWR yakıt değişimi nedir?
- PWR yakıt değişimi açıkla
- PWR yakıt değişimi göster
- PWR sıcak bekleme nedir?
- PWR sıcak bekleme açıkla
- PWR sıcak bekleme göster
- PWR soğuk kapatma nedir?
- PWR soğuk kapatma açıkla
- PWR soğuk kapatma göster
- PWR rhr nedir?
- PWR rhr açıkla
- PWR rhr göster

</details>

### PWR İşletme ve davranış · Isınma ve ısı uzaklaştırma açıkla

Kimlik: `entry:pwr.ops.heatup`

Soğuk durumdan çalışma sıcaklığına ısınmanın kavramsal aşamaları: ısı kaynakları ve alıcıları, basınçlandırıcıda buhar hacmi oluşturma, pompa ısısı, buhar boşaltma (steam dump).

Kaynaklar: `p-2-89`

<details><summary>Alternatif soru ifadeleri</summary>

- PWR İşletme ve davranış · Isınma ve ısı uzaklaştırma nedir?
- PWR İşletme ve davranış · Isınma ve ısı uzaklaştırma açıkla
- PWR İşletme ve davranış · Isınma ve ısı uzaklaştırma göster
- PWR ısınma nedir?
- PWR ısınma açıkla
- PWR ısınma göster
- PWR ısıtma nedir?
- PWR ısıtma açıkla
- PWR ısıtma göster
- PWR pompa ısısı nedir?
- PWR pompa ısısı açıkla
- PWR pompa ısısı göster
- PWR steam dump nedir?
- PWR steam dump açıkla
- PWR steam dump göster
- PWR buhar boşaltma nedir?
- PWR buhar boşaltma açıkla
- PWR buhar boşaltma göster
- PWR ısı uzaklaştırma nedir?
- PWR ısı uzaklaştırma açıkla
- PWR ısı uzaklaştırma göster

</details>

### PWR İşletme ve davranış · Bor ve yakıt çevrimi açıkla

Kimlik: `entry:pwr.ops.boron`

Yakıt çevrimi boyunca soğutucudaki bor derişiminin azaltılması (bor azaltma eğrisi).

Kaynaklar: `fig-2-39`, `p-2-94`

<details><summary>Alternatif soru ifadeleri</summary>

- PWR İşletme ve davranış · Bor ve yakıt çevrimi nedir?
- PWR İşletme ve davranış · Bor ve yakıt çevrimi açıkla
- PWR İşletme ve davranış · Bor ve yakıt çevrimi göster
- PWR bor nedir?
- PWR bor açıkla
- PWR bor göster
- PWR boron nedir?
- PWR boron açıkla
- PWR boron göster
- PWR yakıt çevrimi nedir?
- PWR yakıt çevrimi açıkla
- PWR yakıt çevrimi göster
- PWR bor eğrisi nedir?
- PWR bor eğrisi açıkla
- PWR bor eğrisi göster
- PWR ppm nedir?
- PWR ppm açıkla
- PWR ppm göster
- PWR yanma nedir?
- PWR yanma açıkla
- PWR yanma göster

</details>

### PWR İşletme ve davranış · Yük takibi ve ksenon açıkla

Kimlik: `entry:pwr.ops.xenon`

Yük takibi profilleri ve kapatma sonrası iyot-135 / ksenon-135 davranışı; ksenonun reaktivite etkisi.

Kaynaklar: `fig-2-40`, `fig-2-41`, `p-2-94`, `model-xenon`

<details><summary>Alternatif soru ifadeleri</summary>

- PWR İşletme ve davranış · Yük takibi ve ksenon nedir?
- PWR İşletme ve davranış · Yük takibi ve ksenon açıkla
- PWR İşletme ve davranış · Yük takibi ve ksenon göster
- PWR yük takibi nedir?
- PWR yük takibi açıkla
- PWR yük takibi göster
- PWR ksenon nedir?
- PWR ksenon açıkla
- PWR ksenon göster
- PWR xenon nedir?
- PWR xenon açıkla
- PWR xenon göster
- PWR iyot nedir?
- PWR iyot açıkla
- PWR iyot göster
- PWR xe-135 nedir?
- PWR xe-135 açıkla
- PWR xe-135 göster
- PWR i-135 nedir?
- PWR i-135 açıkla
- PWR i-135 göster
- PWR zehirlenme nedir?
- PWR zehirlenme açıkla
- PWR zehirlenme göster

</details>

### PWR İşletme ve davranış · Eksenel güç dağılımı açıkla

Kimlik: `entry:pwr.ops.axial`

Çekirdekte üst/alt güç dağılımı, ΔI ve eksenel ofset (AO); aynı toplam güçte farklı dağılımlar.

Kaynaklar: `fig-2-42`, `fig-2-43`, `p-2-96`

<details><summary>Alternatif soru ifadeleri</summary>

- PWR İşletme ve davranış · Eksenel güç dağılımı nedir?
- PWR İşletme ve davranış · Eksenel güç dağılımı açıkla
- PWR İşletme ve davranış · Eksenel güç dağılımı göster
- PWR eksenel nedir?
- PWR eksenel açıkla
- PWR eksenel göster
- PWR delta i nedir?
- PWR delta i açıkla
- PWR delta i göster
- PWR δi nedir?
- PWR δi açıkla
- PWR δi göster
- PWR eksenel ofset nedir?
- PWR eksenel ofset açıkla
- PWR eksenel ofset göster
- PWR ao nedir?
- PWR ao açıkla
- PWR ao göster
- PWR güç dağılımı nedir?
- PWR güç dağılımı açıkla
- PWR güç dağılımı göster
- PWR eksenel güç nedir?
- PWR eksenel güç açıkla
- PWR eksenel güç göster

</details>

### PWR İşletme ve davranış · Otomatik kontrol ilişkileri açıkla

Kimlik: `entry:pwr.ops.controls`

Otomatik kontrol sistemlerinin hangi büyüklüğü hangi ekipmanla ayarladığı ve eksenel dağılımın neden tek bir otomatik değişkene indirgenemediği.

Kaynaklar: `p-2-96`

<details><summary>Alternatif soru ifadeleri</summary>

- PWR İşletme ve davranış · Otomatik kontrol ilişkileri nedir?
- PWR İşletme ve davranış · Otomatik kontrol ilişkileri açıkla
- PWR İşletme ve davranış · Otomatik kontrol ilişkileri göster
- PWR otomatik kontrol nedir?
- PWR otomatik kontrol açıkla
- PWR otomatik kontrol göster
- PWR kontrol sistemi nedir?
- PWR kontrol sistemi açıkla
- PWR kontrol sistemi göster
- PWR kontrol ilişkileri nedir?
- PWR kontrol ilişkileri açıkla
- PWR kontrol ilişkileri göster

</details>

### PWR Kapatmadan sonra ksenon neden artar? açıkla

Kimlik: `entry:pwr.topic.xenon-shutdown`

Ksenon-135’in büyük kısmı doğrudan fisyondan değil, iyot-135’in bozunmasından gelir. İyot önceki güç düzeyinde birikmiştir. Güç düştüğünde veya fisyon durduğunda ksenonun nötronla tüketimi azalır ya da durur; iyot ise bozunmaya devam eder. Bu yüzden ksenon önce artar (negatif reaktivite büyür), saatler sonra tepe yapar ve iyot tükendikçe azalır (kaynak s. 2-94; Şekil 2-41). Daha yüksek güçten kapatmada birikmiş iyot fazla olduğundan etki daha büyüktür.

Kaynaklar: `p-2-94`, `fig-2-41`, `model-xenon`

<details><summary>Alternatif soru ifadeleri</summary>

- PWR Kapatmadan sonra ksenon neden artar? nedir?
- PWR Kapatmadan sonra ksenon neden artar? açıkla
- PWR Kapatmadan sonra ksenon neden artar? göster
- PWR ksenon nedir?
- PWR ksenon açıkla
- PWR ksenon göster
- PWR xenon nedir?
- PWR xenon açıkla
- PWR xenon göster
- PWR xe-135 nedir?
- PWR xe-135 açıkla
- PWR xe-135 göster
- PWR iyot nedir?
- PWR iyot açıkla
- PWR iyot göster
- PWR kapatma nedir?
- PWR kapatma açıkla
- PWR kapatma göster
- PWR kapatmadan sonra nedir?
- PWR kapatmadan sonra açıkla
- PWR kapatmadan sonra göster
- PWR ksenon tepesi nedir?
- PWR ksenon tepesi açıkla
- PWR ksenon tepesi göster
- PWR ksenon zehirlenmesi nedir?
- PWR ksenon zehirlenmesi açıkla
- PWR ksenon zehirlenmesi göster

</details>

### PWR %100 güçten kapatma · Kapatma (t = 0) açıkla

Kimlik: `entry:xenon:shut-100:trip`

Fisyon gücü sıfıra iner; artık ısı sürer. Şekil 2-41’in yatay ekseni bu andan itibaren sayılır.

Kaynaklar: `fig-2-41`, `p-2-94`

<details><summary>Alternatif soru ifadeleri</summary>

- PWR %100 güçten kapatma · Kapatma (t = 0) nedir?
- PWR %100 güçten kapatma · Kapatma (t = 0) açıkla
- PWR %100 güçten kapatma · Kapatma (t = 0) göster
- PWR kapatma anı nedir?
- PWR kapatma anı açıkla
- PWR kapatma anı göster

</details>

### PWR %100 güçten kapatma · Modelde ksenon tepesi (7,8 sa) açıkla

Kimlik: `entry:xenon:shut-100:peak-model`

Temsili modelde ksenonun en yüksek olduğu an. Kapatmadan sonra ksenon nötronla tüketilmez; önceki güçte birikmiş iyot bozunarak ksenon üretmeye devam eder. Üretim bozunmayı geçtiği sürece ksenon artar.

Kaynaklar: `model-xenon`, `p-2-94`

<details><summary>Alternatif soru ifadeleri</summary>

- PWR %100 güçten kapatma · Modelde ksenon tepesi (7,8 sa) nedir?
- PWR %100 güçten kapatma · Modelde ksenon tepesi (7,8 sa) açıkla
- PWR %100 güçten kapatma · Modelde ksenon tepesi (7,8 sa) göster
- PWR tepe nedir?
- PWR tepe açıkla
- PWR tepe göster
- PWR zirve nedir?
- PWR zirve açıkla
- PWR zirve göster
- PWR pik nedir?
- PWR pik açıkla
- PWR pik göster
- PWR ksenon tepesi nedir?
- PWR ksenon tepesi açıkla
- PWR ksenon tepesi göster
- PWR en yüksek nedir?
- PWR en yüksek açıkla
- PWR en yüksek göster

</details>

### PWR %100 güçten kapatma · Kaynak eğrisinde tepe (~8,0 sa) açıkla

Kimlik: `entry:xenon:shut-100:peak-figure`

Şekil 2-41’de %100 güçten kapatma eğrisinin en negatif olduğu yaklaşık an (şekilden okunmuştur; ± okuma belirsizliği vardır).

Kaynaklar: `fig-2-41`

<details><summary>Alternatif soru ifadeleri</summary>

- PWR %100 güçten kapatma · Kaynak eğrisinde tepe (~8,0 sa) nedir?
- PWR %100 güçten kapatma · Kaynak eğrisinde tepe (~8,0 sa) açıkla
- PWR %100 güçten kapatma · Kaynak eğrisinde tepe (~8,0 sa) göster
- PWR tepe nedir?
- PWR tepe açıkla
- PWR tepe göster
- PWR zirve nedir?
- PWR zirve açıkla
- PWR zirve göster
- PWR pik nedir?
- PWR pik açıkla
- PWR pik göster
- PWR ksenon tepesi nedir?
- PWR ksenon tepesi açıkla
- PWR ksenon tepesi göster
- PWR en yüksek nedir?
- PWR en yüksek açıkla
- PWR en yüksek göster

</details>

### PWR %100 güçten kapatma · İyot tükendikçe ksenon azalıyor açıkla

Kimlik: `entry:xenon:shut-100:decay`

İyot büyük ölçüde bozunduktan sonra ksenon üretimi kendi bozunmasının gerisinde kalır; ksenon ve negatif etkisi azalır.

Kaynaklar: `model-xenon`, `p-2-94`

<details><summary>Alternatif soru ifadeleri</summary>

- PWR %100 güçten kapatma · İyot tükendikçe ksenon azalıyor nedir?
- PWR %100 güçten kapatma · İyot tükendikçe ksenon azalıyor açıkla
- PWR %100 güçten kapatma · İyot tükendikçe ksenon azalıyor göster
- PWR rampa nedir?
- PWR rampa açıkla
- PWR rampa göster
- PWR güç değişimi nedir?
- PWR güç değişimi açıkla
- PWR güç değişimi göster

</details>

### PWR Yük takibi 12-3-6-3 · Güç azaltma başlıyor (%100 → %50) açıkla

Kimlik: `entry:xenon:load-12-3-6-3:ramp-1-start`

İstenen güç düşmeye başlar. Ksenonun tüketimi güçle azaldığı, iyot ise önceki güçte birikmiş olduğu için ksenon etkisi takip eden saatlerde büyür.

Kaynaklar: `fig-2-40`, `p-2-94`

<details><summary>Alternatif soru ifadeleri</summary>

- PWR Yük takibi 12-3-6-3 · Güç azaltma başlıyor (%100 → %50) nedir?
- PWR Yük takibi 12-3-6-3 · Güç azaltma başlıyor (%100 → %50) açıkla
- PWR Yük takibi 12-3-6-3 · Güç azaltma başlıyor (%100 → %50) göster
- PWR rampa nedir?
- PWR rampa açıkla
- PWR rampa göster
- PWR güç değişimi nedir?
- PWR güç değişimi açıkla
- PWR güç değişimi göster

</details>

### PWR Yük takibi 12-3-6-3 · Rampa bitti: %50 açıkla

Kimlik: `entry:xenon:load-12-3-6-3:ramp-1-end`

İstenen güç yeni düzeyde sabitlenir; iyot ve ksenon bu güce ait dengeye saatler içinde yaklaşır (anında değil).

Kaynaklar: `fig-2-40`, `p-2-94`

<details><summary>Alternatif soru ifadeleri</summary>

- PWR Yük takibi 12-3-6-3 · Rampa bitti: %50 nedir?
- PWR Yük takibi 12-3-6-3 · Rampa bitti: %50 açıkla
- PWR Yük takibi 12-3-6-3 · Rampa bitti: %50 göster
- PWR rampa nedir?
- PWR rampa açıkla
- PWR rampa göster
- PWR güç değişimi nedir?
- PWR güç değişimi açıkla
- PWR güç değişimi göster

</details>

### PWR Yük takibi 12-3-6-3 · Modelde ksenon tepesi (13,4 sa) açıkla

Kimlik: `entry:xenon:load-12-3-6-3:peak-model`

Temsili modelde ksenonun en yüksek olduğu an. Güç düşüşünden sonra iyottan gelen ksenon üretimi, tüketim ve bozunmayı geçtiği sürece ksenon artar; dengelendiği anda tepe oluşur.

Kaynaklar: `model-xenon`, `p-2-94`

<details><summary>Alternatif soru ifadeleri</summary>

- PWR Yük takibi 12-3-6-3 · Modelde ksenon tepesi (13,4 sa) nedir?
- PWR Yük takibi 12-3-6-3 · Modelde ksenon tepesi (13,4 sa) açıkla
- PWR Yük takibi 12-3-6-3 · Modelde ksenon tepesi (13,4 sa) göster
- PWR tepe nedir?
- PWR tepe açıkla
- PWR tepe göster
- PWR zirve nedir?
- PWR zirve açıkla
- PWR zirve göster
- PWR pik nedir?
- PWR pik açıkla
- PWR pik göster
- PWR ksenon tepesi nedir?
- PWR ksenon tepesi açıkla
- PWR ksenon tepesi göster
- PWR en yüksek nedir?
- PWR en yüksek açıkla
- PWR en yüksek göster

</details>

### PWR Yük takibi 12-3-6-3 · Güç artırma başlıyor (%50 → %100) açıkla

Kimlik: `entry:xenon:load-12-3-6-3:ramp-2-start`

İstenen güç artmaya başlar. Nötron akısı arttıkça ksenon daha hızlı tüketilir; ksenon etkisi önce azalır, sonra yeni dengeye yönelir.

Kaynaklar: `fig-2-40`, `p-2-94`

<details><summary>Alternatif soru ifadeleri</summary>

- PWR Yük takibi 12-3-6-3 · Güç artırma başlıyor (%50 → %100) nedir?
- PWR Yük takibi 12-3-6-3 · Güç artırma başlıyor (%50 → %100) açıkla
- PWR Yük takibi 12-3-6-3 · Güç artırma başlıyor (%50 → %100) göster
- PWR rampa nedir?
- PWR rampa açıkla
- PWR rampa göster
- PWR güç değişimi nedir?
- PWR güç değişimi açıkla
- PWR güç değişimi göster

</details>

### PWR Yük takibi 12-3-6-3 · Rampa bitti: %100 açıkla

Kimlik: `entry:xenon:load-12-3-6-3:ramp-2-end`

İstenen güç yeni düzeyde sabitlenir; iyot ve ksenon bu güce ait dengeye saatler içinde yaklaşır (anında değil).

Kaynaklar: `fig-2-40`, `p-2-94`

<details><summary>Alternatif soru ifadeleri</summary>

- PWR Yük takibi 12-3-6-3 · Rampa bitti: %100 nedir?
- PWR Yük takibi 12-3-6-3 · Rampa bitti: %100 açıkla
- PWR Yük takibi 12-3-6-3 · Rampa bitti: %100 göster
- PWR rampa nedir?
- PWR rampa açıkla
- PWR rampa göster
- PWR güç değişimi nedir?
- PWR güç değişimi açıkla
- PWR güç değişimi göster

</details>

### PWR Mod 1 Güç işletmesi nedir?

Kimlik: `mode:1`

Fisyon ısısı birincil devreden buhar üreteçlerine, oradan türbine gider. Tablodaki “% nominal ısıl güç” artık ısıyı hariç tutar; çalışan çekirdekte artık ısı fisyon ısısının içinde küçük bir paydır.

Soğutma: Ana soğutucu pompaları ve buhar üreteçleri (kaynak 2-88). Türbin: Temsili %100 güçte türbin-jeneratör elektrik üretiyor.

Kaynaklar: `tab-2-14`, `nuce-2-5`

<details><summary>Alternatif soru ifadeleri</summary>

- mod 1
- Güç işletmesi
- Power Operation
- Güç işletmesi soğutma nasıl olur

</details>

### PWR Mod 2 Başlatma nedir?

Kimlik: `mode:2`

Tablodaki ≤%5 eşiği idari bir mod sınırıdır; kritiklik fiziksel olarak k_eff = 1 koşuludur. Düşük güçte üretilen ısı türbine değil, steam dump üzerinden kondensere aktarılabilir.

Soğutma: Sıcak koşulda ısı birincil pompalar ve buhar üreteçleriyle alınır; buhar, türbin atlatma (steam dump) yoluyla kondensere gidebilir (2-92). Not: 2-88 metni “start-up” için RHR’den de söz eder; bu, soğuk durumdan başlayan başlatma sürecinin ilk aşamalarına karşılık gelir (bkz. Isınma bölümü). Türbin: Temsili: düşük fisyon gücünde elektrik üretimi yok; ısı steam dump ile atılıyor.

Kaynaklar: `tab-2-14`, `nuce-2-5`

<details><summary>Alternatif soru ifadeleri</summary>

- mod 2
- Başlatma
- Startup
- Başlatma soğutma nasıl olur

</details>

### PWR Mod 3 Sıcak bekleme nedir?

Kimlik: `mode:3`

Fisyon gücü sıfır ama ısı üretimi sıfır değil: artık ısı sürüyor ve buhar üreteçleri üzerinden uzaklaştırılmalı. Kaynak 2-89: elektrik/enstrüman sorunu gibi durumlar yalnız Mod 3 kapatma gerektirebilir; dönüş süresi kısalır.

Soğutma: Ana soğutucu pompaları ve buhar üreteçleri (2-88); yüksüz ortalama sıcaklık steam dump kontrolüyle korunur (2-92). Türbin: Elektrik üretimi yok.

Kaynaklar: `tab-2-14`, `nuce-2-5`

<details><summary>Alternatif soru ifadeleri</summary>

- mod 3
- Sıcak bekleme
- Hot Standby
- Sıcak bekleme soğutma nasıl olur

</details>

### PWR Mod 4 Sıcak durdurma nedir?

Kimlik: `mode:4`

Sıcaklık Mod 3’e göre daha düşük olabilir; artık ısı hâlâ vardır ve uzaklaştırılmalıdır.

Soğutma: Kaynak 2-88: hot-shutdown modunda soğutma ana soğutucu pompaları ve buhar üreteçleriyle sağlanır. Sıcaklık düştükçe RHR’ye geçişin ne zaman yapıldığı tasarıma ve prosedüre bağlıdır; burada evrensel bir kural gösterilmez. Türbin: Elektrik üretimi yok.

Kaynaklar: `tab-2-14`, `nuce-2-5`

<details><summary>Alternatif soru ifadeleri</summary>

- mod 4
- Sıcak durdurma
- Hot Shutdown
- Sıcak durdurma soğutma nasıl olur

</details>

### PWR Mod 5 Soğuk durdurma nedir?

Kimlik: `mode:5`

Düşük sıcaklıkta buhar üreteçleri ısı alıcısı olarak kullanılmaz; artık ısıyı RHR sistemi alır.

Soğutma: Artık ısı RHR pompaları ve ısı değiştiricileriyle uzaklaştırılır (2-88). Birincil devrenin açılmasını gerektiren bakımlar Mod 5 ister (2-89). Türbin: Elektrik üretimi yok.

Kaynaklar: `tab-2-14`, `nuce-2-5`

<details><summary>Alternatif soru ifadeleri</summary>

- mod 5
- Soğuk durdurma
- Cold Shutdown
- Soğuk durdurma soğutma nasıl olur

</details>

### PWR Mod 6 Yakıt değiştirme nedir?

Kimlik: `mode:6`

Kap açıldığında soğutucunun kaynayarak kaybolmaması için sıcaklık düşük tutulur ve daha büyük reaktivite payı istenir (2-89). Artık ısı yine RHR ile alınır.

Soğutma: RHR sistemi artık ısıyı uzaklaştırır (2-88). Türbin: Elektrik üretimi yok.

Kaynaklar: `tab-2-14`, `nuce-2-5`

<details><summary>Alternatif soru ifadeleri</summary>

- mod 6
- Yakıt değiştirme
- Refueling
- Yakıt değiştirme soğutma nasıl olur

</details>

### PWR Düşük sıcaklıkta artık ısının alınması nasıl olur?

Kimlik: `heatup:rhr`

Çekirdek alt kritik ve çubuklar içeride; fisyon yok ama artık ısı var. Bu ısıyı RHR pompaları ve ısı değiştiricisi alır. Ana soğutucu pompaları çalışmıyor; buhar üreteçleri dolu ve ısı alıcısı değil.

Isı kaynakları: Artık ısı (fisyon yok). Isı alıcıları: RHR ısı değiştiricisi. Tamamen su dolu (“solid”), ısıtıcılar kapalı. Kavramsal eğitim anlatımıdır.

Kaynaklar: `p-2-89`

<details><summary>Alternatif soru ifadeleri</summary>

- Düşük sıcaklıkta artık ısının alınması

</details>

### PWR Isı girdileri ve sistemin ısınması nasıl olur?

Kimlik: `heatup:warm`

RHR akışı ısı değiştiricinin etrafından dolaştırıldığında artık ısı artık dışarı atılmaz ve birincil devrenin sıcaklığı yükselmeye başlar. Isı üretimi değişmedi; değişen, ısının nereye gittiğidir.

Isı kaynakları: Artık ısı. Isı alıcıları: RHR ısı değiştiricisi atlatıldı → ısı alınmıyor; Çevreye kayıplar. Hâlâ su dolu. Kavramsal eğitim anlatımıdır.

Kaynaklar: `p-2-89`

<details><summary>Alternatif soru ifadeleri</summary>

- Isı girdileri ve sistemin ısınması

</details>

### PWR Basınçlandırıcıda buhar hacmi nasıl olur?

Kimlik: `heatup:bubble`

Isıtıcılar basınçlandırıcıyı birincil devreden daha sıcak tutar; böylece buhar kabarcığı çekirdeğin üstünde değil, basınçlandırıcının üst kısmında oluşur. Bu buhar hacmi basınç kontrolü içindir; çekirdekte kaynama değildir.

Isı kaynakları: Artık ısı; Basınçlandırıcı ısıtıcıları. Isı alıcıları: RHR ısı değiştiricisi atlatıldı → ısı alınmıyor; Çevreye kayıplar. Üstte buhar hacmi, ~%60 su. Kavramsal eğitim anlatımıdır.

Kaynaklar: `p-2-89`

<details><summary>Alternatif soru ifadeleri</summary>

- Basınçlandırıcıda buhar hacmi

</details>

### PWR Birincil dolaşım ve buhar üretecine ısı aktarımı nasıl olur?

Kimlik: `heatup:rcp`

Isınmanın başlıca kaynağı pompaların suya kattığı enerjidir. Pompalar çalışınca RHR durdurulur. Sıcaklık arttıkça çevreye kayıplar da artar ve ısınma hızı yavaşlar. Buhar üreteçlerinin ikincil tarafı da ısınır.

Isı kaynakları: Ana soğutucu pompalarının işi (sürtünme → ısı); Artık ısı; Basınçlandırıcı ısıtıcıları. Isı alıcıları: Buhar üreteçlerindeki suyun ısınması; Çevreye kayıplar (sıcaklıkla artar). Buhar hacmi korunuyor, ~%60 su. Kavramsal eğitim anlatımıdır.

Kaynaklar: `p-2-89`

<details><summary>Alternatif soru ifadeleri</summary>

- Birincil dolaşım ve buhar üretecine ısı aktarımı

</details>

### PWR Sıcak bekleme nasıl olur?

Kimlik: `heatup:standby`

Steam dump kontrol sistemi artan buhar basıncına tepki vererek fazla ısıyı kondensere atar ve yüksüz ortalama sıcaklığı yaklaşık sabit tutar. Türbin elektrik üretmediği hâlde ısı sistemden uzaklaştırılabilir.

Isı kaynakları: Ana soğutucu pompalarının işi; Artık ısı; Basınçlandırıcı ısıtıcıları (basınç kontrolü). Isı alıcıları: Buhar üreteçleri → steam dump → kondenser; Çevreye kayıplar. Buhar hacmi, temsili program seviyesi. Kavramsal eğitim anlatımıdır.

Kaynaklar: `p-2-89`

<details><summary>Alternatif soru ifadeleri</summary>

- Sıcak bekleme

</details>

### PWR Düşük fisyon gücünden güç işletmesine (kavramsal) nasıl olur?

Kimlik: `heatup:critical`

Bor seyreltmesi ve çubuk hareketiyle reaktör kritik olur (k_eff = 1) ve fisyon gücü artar. Kaynağa göre kritiklik noktasını tam belirlemek zordur; reaktör hafifçe süperkritik yapılıp sonra kritikliğe döndürülür. Güç arttıkça buhar türbine yönlendirilir ve elektrik üretimi başlar.

Isı kaynakları: Fisyon (düşükten artan); Pompaların işi; Artık ısı; Basınçlandırıcı ısıtıcıları (basınç kontrolü). Isı alıcıları: Buhar üreteçleri → türbin (güç düşükken ısı, önceki aşamadaki gibi kondensere atılır). Buhar hacmi, temsili program seviyesi. Kavramsal eğitim anlatımıdır.

Kaynaklar: `p-2-89`

<details><summary>Alternatif soru ifadeleri</summary>

- Düşük fisyon gücünden güç işletmesine (kavramsal)

</details>

### PWR Türbin gücü nasıl kontrol edilir?

Kimlik: `control:turbine`

Türbin kontrol sistemi: Türbine giden buhar akışını ayarlayarak türbin gücünü istenen değere getirir.

Türbin daha fazla buhar çekerse birincil devreden daha fazla ısı alınır; bu, birincil sıcaklıkları ve dolayısıyla diğer kontrol döngülerini etkiler.

Kaynaklar: `p-2-96`

<details><summary>Alternatif soru ifadeleri</summary>

- Türbin kontrol sistemi
- Türbin gücü hangi sistem ayarlar

</details>

### PWR Reaktör soğutucu sıcaklıkları nasıl kontrol edilir?

Kimlik: `control:temp`

Çubuk kontrol sistemi: Ölçülen sıcaklık hedeften saparsa kontrol çubuklarını hareket ettirerek reaktiviteyi ve reaktör gücünü değiştirir.

Kaynak 2-97: bor konsantrasyonu değişince birincil sıcaklıklar değişir; otomatik çubuk kontrolü sıcaklığı geri getirirken çubukları hareket ettirir ve bu da eksenel güç dağılımını değiştirir.

Kaynaklar: `p-2-96`

<details><summary>Alternatif soru ifadeleri</summary>

- Çubuk kontrol sistemi
- Reaktör soğutucu sıcaklıkları hangi sistem ayarlar

</details>

### PWR Birincil devre basıncı nasıl kontrol edilir?

Kimlik: `control:pressure`

Basınçlandırıcı basınç kontrolü: Basınç düşerse ısıtıcılar buhar üretip basıncı artırır; basınç yükselirse püskürtme buharı yoğuşturur.

Basınç, birincil suyun kaynamadan sıvı kalmasını sağlar; basınçlandırıcıdaki buhar hacmi bu kontrolün aracıdır.

Kaynaklar: `p-2-96`

<details><summary>Alternatif soru ifadeleri</summary>

- Basınçlandırıcı basınç kontrolü
- Birincil devre basıncı hangi sistem ayarlar

</details>

### PWR Birincil taraf su envanteri nasıl kontrol edilir?

Kimlik: `control:inventory`

Basınçlandırıcı seviye kontrolü: Basınçlandırıcı seviyesini izleyerek birincil devredeki su miktarını ayarlar.

Sıcaklık değişince su genleşir veya büzülür ve basınçlandırıcı seviyesi değişir; seviye kontrolü bu değişimi karşılar.

Kaynaklar: `p-2-96`

<details><summary>Alternatif soru ifadeleri</summary>

- Basınçlandırıcı seviye kontrolü
- Birincil taraf su envanteri hangi sistem ayarlar

</details>

### PWR Buhar üreteci su envanteri nasıl kontrol edilir?

Kimlik: `control:sglevel`

Buhar üreteci seviye kontrolü: Besleme suyu akışını ayarlayarak buhar üretecinin ikincil tarafındaki su seviyesini korur.

Buhar çekişi arttığında ikincil taraftaki su daha hızlı buharlaşır; seviye kontrolü besleme suyunu artırarak dengeyi sağlar.

Kaynaklar: `p-2-96`

<details><summary>Alternatif soru ifadeleri</summary>

- Buhar üreteci seviye kontrolü
- Buhar üreteci su envanteri hangi sistem ayarlar

</details>

### Eksenel güç dağılımı otomatik kontrol edilir mi?

Kimlik: `axial-auto`

Kaynak 2-96: önemli bir çekirdek parametresi olan eksenel güç dağılımı otomatik olarak kontrol edilmez. Bu dağılım soğutucu sıcaklığı, çubuk konumu ve yerel ksenon gibi birden çok etkinin birleşimidir; yukarıdaki listedeki gibi tek bir ölçülen değişken ve tek bir kontrol sistemiyle eşlenemez. Bunun yerine eksenel akı farkı (ΔI) hesaplanmış bir hedef bandı içinde tutulur (2-98).

Kaynaklar: `fig-2-42`, `fig-2-43`, `p-2-96`

<details><summary>Alternatif soru ifadeleri</summary>

- eksenel dağılım neden otomatik değil

</details>

### Ksenon neden kapatmadan sonra artar?

Kimlik: `xenon-growth`

Ksenon-135’in büyük kısmı doğrudan fisyondan değil, iyot-135’in bozunmasından gelir. İyot önceki güç düzeyinde birikmiştir. Güç düştüğünde veya fisyon durduğunda ksenonun nötronla tüketimi azalır ya da durur; iyot ise bozunmaya devam eder. Bu yüzden ksenon önce artar (negatif reaktivite büyür), saatler sonra tepe yapar ve iyot tükendikçe azalır (kaynak s. 2-94; Şekil 2-41). Daha yüksek güçten kapatmada birikmiş iyot fazla olduğundan etki daha büyüktür.

Kaynaklar: `p-2-94`, `fig-2-41`, `model-xenon`

<details><summary>Alternatif soru ifadeleri</summary>

- ksenon neden artıyor
- kapatınca ksenon neden yükselir
- reaktör durunca ksenon biter mi
- kapatma sonrası ksenon zehirlenmesi
- xenon neden kapatmadan sonra artabiliyor

</details>

### Ksenon tepesi kaç saatte oluşur?

Kimlik: `xenon-peak`

Tepe zamanı kapatma öncesindeki duruma ve kullanılan modele bağlıdır. Kaynaktaki şekilden okunan tepe ile uygulamanın modelinden hesaplanan tepe ayrı işaretlenir; tek bir zamanı bütün durumlar için kesin değer olarak vermiyoruz.

Grafikte ◆ şekilden okunan, ● modelden hesaplanan olaydır. Olayı seçmek açıklamasını açar; senaryo saatini taşımak ayrı düğmeyle yapılır.

Kaynaklar: `fig-2-40`, `fig-2-41`, `p-2-94`, `model-xenon`

<details><summary>Alternatif soru ifadeleri</summary>

- ksenon ne zaman tepe yapar
- ksenon zirvesi kaç saat sonra
- ksenon maksimum zamanı

</details>

### Yakıt çevriminde bor neden azaltılır?

Kimlik: `boron-decrease`

Yakıt tükendikçe eklenen negatif reaktiviteyi karşılamak için soğutucudaki bor azaltılır. Çevrim başındaki ilk keskin düşüşte ksenon birikimi de etkilidir.

Eğrideki küçük toparlanmanın açıklaması uygulamada yorum olarak ayrılır; şeklin tamamı tek bir etkiye bağlanmaz.

Kaynaklar: `fig-2-39`, `p-2-94`

<details><summary>Alternatif soru ifadeleri</summary>

- bor neden düşer
- bor derişimi neden azalır
- bor konsantrasyonu neden azaltılıyor

</details>

### Reaktör kapatılınca soğutma neden sürer?

Kimlik: `decay-heat`

Fisyon durduğunda artık ısı hemen sıfırlanmaz. Bu nedenle kapatma sonrasında da ısı uzaklaştırılır; uygulamanın PWR işletme bölümünde düşük sıcaklık koşullarında RHR ile soğutma gösterilir.

Kaynaklar: `tab-2-14`, `nuce-2-5`, `p-2-89`

<details><summary>Alternatif soru ifadeleri</summary>

- fisyon durunca ısı biter mi
- artık ısı nedir
- kapatma sonrası artık ısı
- reaktör kapalıyken neden soğutulur
- rhr ne işe yarar

</details>

### ΔI ve AO ne demek?

Kimlik: `axial-meaning`

Toplam güç tek başına çekirdeğin üst ve alt yarılarındaki dağılımı göstermez. ΔI üst ve alt güç katkılarının farkını, AO ise bu farkın toplam güce oranını anlatır. Aynı toplam güçte farklı eksenel dağılımlar olabilir.

Kaynaklar: `fig-2-42`, `fig-2-43`, `p-2-96`

<details><summary>Alternatif soru ifadeleri</summary>

- delta i nedir
- eksenel ofset nedir
- ao nedir
- aynı toplam güç farklı dağılım olabilir mi

</details>

## Site kullanımı

### Bu rehbere ne sorabilirim?

Kimlik: `site:help`

PWR, BWR ve VVER ekipmanları, devreleri, karşılaştırmaları, PWR işletme konuları ve site kullanımı hakkında hazırlanmış cevaplar sunuyorum. Hazır sorular bölümünden konu seçebilir veya kendi sorunuzu yazabilirsiniz.

Belirsiz soruda seçenek sunarım; hazırlanmış içerikte olmayan bir cevabı uydurmam. Genel sohbet modeli değilim.

Kaynaklar: `app-guide`

<details><summary>Alternatif soru ifadeleri</summary>

- yardım
- neler biliyorsun
- hangi soruları cevaplıyorsun
- merhaba
- selam

</details>

### Asistan internet veya API kullanıyor mu?

Kimlik: `site:local`

Rehber, bu sayfayla yüklenen hazır soru-cevapları cihazınızda eşleştirir. Sorular bir model sunucusuna gönderilmez; API anahtarı veya token ücreti yoktur.

Sayfayı ilk açmak için site dosyalarının yüklenmesi gerekir; dış kaynak bağlantılarını açmak ayrıca internet ister.

Kaynaklar: `app-guide`

<details><summary>Alternatif soru ifadeleri</summary>

- yapay zeka mısın
- token harcıyor musun
- ücretli misin
- internet gerekiyor mu
- çevrimdışı çalışır mı

</details>

### Ders ilerlemem nerede saklanıyor?

Kimlik: `site:progress`

Ders ilerlemesi bu tarayıcıda saklanır. Öğrenme bölümündeki “Kaldığım yerden devam et” ile kayıtlı adıma dönersiniz; başka cihazlarla eşitlenmez.

Tarayıcı verilerini silmek kaydı kaldırabilir. Depolama engelliyse ilerleme yalnız açık oturumda tutulur.

Kaynaklar: `app-guide`

<details><summary>Alternatif soru ifadeleri</summary>

- ilerlemem kaydediliyor mu
- kaldığım yerden nasıl devam ederim
- başka cihazda ilerleme gelir mi

</details>

### İlerlemeyi nasıl sıfırlarım?

Kimlik: `site:reset`

Öğrenme bölümündeki “İlerlemeyi sıfırla” ders kaydını siler ve onay ister. Simülasyondaki “Sıfırla” ise modeli, grafiği ve sahneyi başa alır; ders kaydını silmez.

Kaynaklar: `app-guide`

<details><summary>Alternatif soru ifadeleri</summary>

- ders kaydını sil
- ilerlemeyi sıfırla
- simülasyonu sıfırlamak dersi siler mi

</details>

### Küçük ekipman etiketlerini nasıl görürüm?

Kimlik: `site:labels`

Şema araç çubuğunda “Ayrıntılı” seçin veya yakınlaştırın. Temel görünümde alt bileşen etiketleri %150 yakınlaştırmadan itibaren açılır; seçili ekipmanın etiketi her düzeyde görünür.

Kaynaklar: `app-guide`

<details><summary>Alternatif soru ifadeleri</summary>

- etiketler görünmüyor
- temel ayrıntılı farkı
- etiketleri aç
- yazıları nasıl büyütürüm

</details>

### Şemayı nasıl yakınlaştırırım?

Kimlik: `site:zoom`

Şema araç çubuğundaki yakınlaştırma ve “Sığdır” kontrollerini kullanın. Büyütülmüş şemada sürükleyerek gezinebilirsiniz; “Sığdır” çizimi tekrar görünür alana getirir.

Kaynaklar: `app-guide`

<details><summary>Alternatif soru ifadeleri</summary>

- şema küçük
- yakınlaştırma nasıl yapılır
- şemayı sığdır
- şema nasıl kaydırılır

</details>

### Tahmin dersinde neden sonraki adım kilitli?

Kimlik: `site:predict`

Önce tahmin seçin, deneyi tamamlayın ve gözleminizi seçin. Sonra açıklama açılır. Tahmin yapmadan okumak isterseniz “Atla ve açıklamayı gör” seçeneğini kullanabilirsiniz.

Kaynaklar: `app-guide`

<details><summary>Alternatif soru ifadeleri</summary>

- tahmin dersi nasıl kullanılır
- açıklamaya geçemiyorum
- deneyden sonra ne yapacağım

</details>

### Grafikteki değerler gerçek santral ölçümü mü?

Kimlik: `site:model`

Grafikler gerçek tesis ölçümü değildir. Uygulama kavramları göstermek için sadeleştirilmiş eğitim modelleri ve kaynak şekillerinden okunan veriler kullanır; bu ikisi ayrı etiketlenir.

Özellikle ksenon modelindeki tepe yüksekliği kaynak şekliyle aynı değildir. Gerçek tesis ayarı veya işletme hesabı olarak kullanılamaz.

Kaynaklar: `app-guide`

<details><summary>Alternatif soru ifadeleri</summary>

- bu gerçek simülasyon mu
- temsili model ne demek
- grafik neden kaynakla aynı değil
- model güvenilir mi

</details>

### Grafikte kare elmas ve daire ne anlama geliyor?

Kimlik: `site:markers`

■ kaynakta tanımlı, ◆ şekilden yaklaşık okunan, ● modelden hesaplanan olayı gösterir. İşareti seçmek açıklamayı açar; zamanı değiştirmek için “Senaryo saatini bu olaya götür” düğmesi ayrıdır.

Kaynaklar: `app-guide`

<details><summary>Alternatif soru ifadeleri</summary>

- grafik işaretleri nedir
- kaynak şekil model farkı
- grafik olayını seçince zaman değişir mi

</details>

### Reaktör değiştirince simülasyon neden başa dönüyor?

Kimlik: `site:switch`

Her reaktör ayrı sahne ve başlangıç durumuyla açılır. Reaktör değiştirmek simülasyonu başa alır. Rehber başka reaktöre geçişi kendiliğinden yapmaz; ilgili düğmeye sizin basmanız gerekir.

Kaynaklar: `app-guide`

<details><summary>Alternatif soru ifadeleri</summary>

- pwr bwr geçince sıfırlanıyor
- önceki konuma dön nasıl çalışır

</details>

### Animasyonu nasıl durdururum veya hızlandırırım?

Kimlik: `site:speed`

Kontrol çubuğunda “Oynat / Duraklat” ve 0.5×, 1×, 2× hız seçenekleri vardır. Cihazda hareket azaltma tercihi açıksa animasyon başlangıçta duraklatılabilir.

Kaynaklar: `app-guide`

<details><summary>Alternatif soru ifadeleri</summary>

- oynat duraklat
- animasyon hızı
- akış hareket etmiyor

</details>

### Göreli güç sürgüsü neyi değiştiriyor?

Kimlik: `site:power`

Sürgü temsili santral modelinin hedef gücünü değiştirir. Isıl güç ve elektrik tepkileri gecikmeli gelişir; çubuk hareketi güç yüzdesiyle birebir eşlenmez. Gerçek tesis kumandası değildir.

Kaynaklar: `app-guide`

<details><summary>Alternatif soru ifadeleri</summary>

- güç yüzdesi gerçek mi
- eğitim senaryosu göreli güç
- çubuk konumu neden güçle aynı değil

</details>

### Sohbetim kaydediliyor mu?

Kimlik: `site:chat`

Sohbet yalnız açık sekmenin belleğinde tutulur. “Sohbeti temizle” ile silebilirsiniz; sayfa yenilendiğinde sohbet gider. Ders ilerlemesi bundan ayrı saklanır.

Kaynaklar: `app-guide`

<details><summary>Alternatif soru ifadeleri</summary>

- sorularım saklanıyor mu
- sohbeti nasıl temizlerim

</details>
