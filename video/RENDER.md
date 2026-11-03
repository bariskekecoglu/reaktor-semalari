# Yeniden üretim (RENDER)

Video üretimi uygulamadan ayrıdır: uygulamanın kaynağına dokunulmaz, kayıtlar uygulamanın **üretim derlemesinden** alınır. Büyük ara dosyalar OneDrive dışında, `C:\vidwork` altında tutulur (kareler ~2 GB PNG). VoxCPM2 motoru yalnız ASCII yolları açabildiği için ses çalışma klasörü de `C:\vidwork\vo`'dur.

## Klasör düzeni

| Yol | İçerik |
| --- | --- |
| `narration.json` | Tek doğru kaynak: sahneler, cümleler (doğru yazım) ve durak türleri |
| `tools/phonetic.tsv` | Yalnız TTS girdisine uygulanan okunuşlar (VVER, CANDU, SVG, PNG, 1986) |
| `tools/build_tts.py` | `narration.json` → sahne başına VoxCPM2 metin dosyası |
| `tools/vo_pipeline.py` | Seslendirme: `gen`, `regen`, `asr`, `timing` |
| `tools/asr_run.py` | faster-whisper ile doğrulama ve uzun cümlelerde kelime zamanı |
| `render/director.mjs` | Playwright + sahte saatle kare kare yakalama |
| `render/scenes.mjs` | 12 sahnenin kamera, vurgu, imleç ve uygulama eylemleri (cümle zamanlarına bağlı) |
| `render/overlay.js` | Sayfaya eklenen kompozisyon katmanı (kamera, etiket, halka, imleç, geçiş) |
| `tools/assemble.py` | FFmpeg skill ile kurgu: `frames`, `clips`, `join`, `words`, `srt`, `burn` |
| `tools/write_docs.py` | `script.md` üretimi |
| `tools/verify_offline.mjs`, `tools/verify_export.mjs` | Videoda gösterilen çevrimdışı çalışma ve şema indirme iddialarının doğrulaması |
| `audio/` | Cümle sesleri, sahne sesleri, birleşik anlatım, üretim kayıtları |
| `final/` | Teslim videoları ve SRT |
| `samples/` | 18 sn örnek render (ilk prototip) |

## Bağımlılıklar (bu makinede kullanılan sürümler)

- Windows 11, NVIDIA RTX 4060 8 GB, sürücü 610.88
- Node 24.12 · Playwright 1.48.2 (`video/package.json`), tarayıcı olarak **kurulu Google Chrome** (`channel: 'chrome'`; Playwright'ın kendi Chromium paketi bu makinede “yan yana yapılandırma” hatasıyla açılmadı)
- Python 3.12.10 (`winget install Python.Python.3.12`)
- FFmpeg 9.0.2 full build (gyan.dev, `winget install Gyan.FFmpeg`) + [ffmpeg-skill](https://github.com/kajisho5/ffmpeg-skill) 3.1.1 (`C:\Users\user\video-tools\ffmpeg-skill`); `_contract.py doctor`: zorunlu yetenek eksiği yok
- [voxcpm2-turkce-ses-tasarimi](https://github.com/alexturkey/voxcpm2-turkce-ses-tasarimi) commit `22fca2e` (`C:\Users\user\video-tools\voxcpm2-turkce-ses-tasarimi`), kurulum `scripts\kur.ps1 -Kok C:\vox` (hazır motor v0.1.1, CUDA 12.8 çalışma DLL'leri, model `voxcpm2-q8_0.gguf` sha256 `c8e01ab4…7c96432`). Not: sistemdeki varsayılan `py -3` Python 3.14 olduğu için `.venv` kurulumdan önce Python 3.12 ile oluşturuldu (numpy 2.2.6 3.14 tekerleği sunmuyor).
- faster-whisper 1.1.0 + PyAV 13.1.0 ayrı ortamda (`C:\vidwork\asr`), model `large-v3-turbo`, CPU int8

## Ses ayarları

| Ayar | Değer |
| --- | --- |
| Ses kimliği | `hazir/belgesel_hanim` — repodaki hazır, metin tarifinden tasarlanmış sentetik ses (“ellili yaşlarda, derin ve sıcak alto, sakin belgesel anlatıcısı”); kimseden klonlanmadı |
| Okuma tohumu | 2692139539 (ses kartındaki `okuma_tohumu`; değiştirilmedi) |
| Kalite | 16 adım, CFG 2.0 (repoda sabit; değiştirilmedi) |
| Yöntem | Sahne başına resmi CLI okuması (satır = cümle), sonra `ozet.json` zamanlarıyla cümle dosyalarına bölme; hatalı cümleler tek satırlık okumayla aynı ses/tohumla yeniden üretildi |
| Cümle arası durak (kurguda) | normal 0,42 sn · bağlı 0,25 sn · paragraf 0,9 sn; sahne başı 0,55 sn, sahne sonu 0,8 sn, son sahne sonu 4,0 sn |
| Hız | Değiştirilmedi (hızlandırma/yavaşlatma yok) |
| Çıkış | 48 kHz mono PCM; kurguda stereo (iki kanal aynı), AAC 48 kHz (ölçülen ≈ 207 kb/s); −16 LUFS, true peak ≤ −1 dBTP |
| Müzik | Yok |

VoxCPM2 üretim komutları ve özetleri: `audio/uretim_kayitlari/<sahne>/komut_*.txt`, `ozet*.json`. Örnek (tam komut):

```
C:\Users\user\video-tools\voxcpm2-turkce-ses-tasarimi\.venv\Scripts\python.exe -m ses_tasarim.oku --ses hazir/belgesel_hanim --metin @C:\vidwork\tts\s03.txt --cikti C:\vidwork\vo\s03\_okuma
```

## Çalıştırma sırası

Önce uygulamanın üretim derlemesi ve önizleme sunucusu (proje kökünde; `dist/` yerine ayrı klasöre yazar):

```bash
npx vite build --outDir C:/vidwork/appdist --emptyOutDir
```

```bash
npx vite preview --outDir C:/vidwork/appdist --port 4173 --strictPort
```

(`.claude/launch.json` içinde `reaktor-video-preview` adıyla da tanımlıdır.) Ardından `video/` klasöründe:

```bash
npm install
```

```bash
cd C:/Users/user/video-tools/voxcpm2-turkce-ses-tasarimi && .venv/Scripts/python.exe "C:/Users/user/OneDrive/Masaüstü/proje/video/tools/vo_pipeline.py" gen
```

```bash
cd C:/Users/user/video-tools/voxcpm2-turkce-ses-tasarimi && .venv/Scripts/python.exe "C:/Users/user/OneDrive/Masaüstü/proje/video/tools/vo_pipeline.py" asr
```

```bash
cd C:/Users/user/video-tools/voxcpm2-turkce-ses-tasarimi && .venv/Scripts/python.exe "C:/Users/user/OneDrive/Masaüstü/proje/video/tools/vo_pipeline.py" timing
```

Tek cümleyi yeniden üretmek: `vo_pipeline.py regen s09 3 7` (sonra `asr s09` ve `timing`).

```bash
py -3.12 tools/assemble.py frames --jobs 3
```

```bash
py -3.12 tools/assemble.py clips
```

```bash
py -3.12 tools/assemble.py join
```

```bash
py -3.12 tools/assemble.py words
```

```bash
py -3.12 tools/assemble.py srt
```

```bash
py -3.12 tools/assemble.py burn
```

```bash
py -3.12 tools/write_docs.py
```

`assemble.py` her FFmpeg skill çağrısını `C:\vidwork\assemble_log.jsonl` dosyasına yazar. Kullanılan skill betikleri: `sequence.py` (PNG dizisi → H.264, CRF 16, preset slow), `audio.py --replace --stereo` (sahne sesi), `join.py --transition none` (sahneler; yuv420p'ye normalleştirir), `loudness.py -I -16 --tp -1` (iki geçişli loudnorm, video kopyalanır, faststart), `caption.py --font "Segoe UI Semibold" --size 18 --outline 2 --box --max-lines 2 --margin 16` (altyazı işleme), `cut.py --accurate` (örnek), `check.py --content`, `look.py`, `probe.py`.

Önizleme kareleri için: `node render/director.mjs --scene s05 --stills 3,8,15` (PNG'ler `C:/vidwork/frames/s05/still_*.png`).

## Teknik notlar

- Kayıt deterministiktir: `page.clock` sahte saati her karede 1/30 sn ilerletir; uygulamanın tek `requestAnimationFrame` döngüsü bu saatle çalışır. Uygulama eylemleri gerçek düğme tıklamalarıdır.
- Kareler PNG (RGB) yakalanır. İlk denemede JPEG kullanıldı; `sequence.py` bunu tam aralıklı `yuvj420p` olarak kodladı ve FFmpeg skill aralık dönüştürme seçeneği sunmadığı için kaynak PNG'ye çevrildi (sonuç `yuv420p`, BT.709, sınırlı aralık).
- Kapanıştaki adres `bariskekecoglu.github.io/reaktor-semalari` 2026-11-03'te HTTP 200 ile doğrulandı.
