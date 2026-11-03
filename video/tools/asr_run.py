"""faster-whisper (large-v3-turbo, CPU int8) ile yazıya dökme. Ayrı ortamda çalışır: C:/vidwork/asr.
Kullanım: asr_run.py jobs.json out.json            (cümle dosyaları; doğrulama)
          asr_run.py --words narration.wav out.json (kelime zamanları; altyazı bölme)"""
import json, sys
from faster_whisper import WhisperModel

m = WhisperModel("large-v3-turbo", device="cpu", compute_type="int8", download_root="C:/vidwork/asr_models")
if sys.argv[1] == "--words":
    segs, _ = m.transcribe(sys.argv[2], language="tr", word_timestamps=True, vad_filter=False, beam_size=5)
    words = [{"w": w.word, "s": round(w.start, 3), "e": round(w.end, 3)} for s in segs for w in s.words]
    json.dump(words, open(sys.argv[3], "w", encoding="utf-8"), ensure_ascii=False)
else:
    jobs = json.load(open(sys.argv[1], encoding="utf-8")); out = {}
    for j in jobs:
        segs, _ = m.transcribe(j["file"], language="tr", beam_size=5, vad_filter=False)
        out[j["key"]] = {"text": " ".join(s.text.strip() for s in segs)}
        print(j["key"], out[j["key"]]["text"], flush=True)
    json.dump(out, open(sys.argv[2], "w", encoding="utf-8"), ensure_ascii=False, indent=1)
