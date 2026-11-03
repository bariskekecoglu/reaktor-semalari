"""Seslendirme hattı (VoxCPM2 · hazir/belgesel_hanim).

Alt komutlar:
  gen  [sahne ...]           her sahneyi resmi CLI ile okutur (ses_tasarim.oku), cümle dosyalarına böler
  regen sXX N [N...]         yalnız verilen cümleleri aynı ses/tohumla yeniden üretir (tek satırlık okuma)
  asr  [sahne ...]           cümle dosyalarını faster-whisper ile yazıya döker, metinle karşılaştırır
  timing                     cümle sürelerinden sahne zamanlamasını (timing.json) ve sahne seslerini kurar

Motor yalnız ASCII yolları açabildiği için çalışma klasörü C:/vidwork/vo'dur; teslim kopyası video/audio/ altına alınır.
"""
import json, os, re, subprocess, sys, shutil, unicodedata
from pathlib import Path
import numpy as np
import soundfile as sf

ROOT = Path(__file__).resolve().parent.parent
VOX = Path("C:/Users/user/video-tools/voxcpm2-turkce-ses-tasarimi")
VPY = VOX / ".venv/Scripts/python.exe"
WORK = Path("C:/vidwork/vo")
TTS = Path("C:/vidwork/tts")
VOICE = "hazir/belgesel_hanim"
PAUSE = {"bagli": 0.25, "normal": 0.42, "paragraf": 0.9, "agir": 1.5}
LEAD, TAIL, LAST_TAIL = 0.55, 0.8, 4.0
SR = 48000

sys.path.insert(0, str(ROOT / "tools"))
from build_tts import load_map, to_tts  # noqa: E402

def narration():
    return json.loads((ROOT / "narration.json").read_text(encoding="utf-8"))

def run_oku(text_file: Path, out: Path):
    out.mkdir(parents=True, exist_ok=True)
    cmd = [str(VPY), "-m", "ses_tasarim.oku", "--ses", VOICE, "--metin", f"@{text_file}", "--cikti", str(out)]
    log = out / "komut.txt"
    log.write_text(" ".join(cmd) + "\n", encoding="utf-8")
    env = dict(os.environ, PYTHONIOENCODING="utf-8")
    r = subprocess.run(cmd, cwd=VOX, capture_output=True, text=True, encoding="utf-8", errors="replace", env=env)
    (out / "motor_log.txt").write_text(r.stdout + "\n--- stderr ---\n" + r.stderr, encoding="utf-8")
    if r.returncode != 0:
        raise SystemExit(f"oku hata ({out}):\n{r.stdout[-1500:]}\n{r.stderr[-1500:]}")
    print(r.stdout.strip().splitlines()[-1] if r.stdout.strip() else "(çıktı yok)")
    return json.loads((out / "ozet.json").read_text(encoding="utf-8"))

def split(sid, ozet):
    audio, sr = sf.read(Path(ozet["wav"]), dtype="float32")
    assert sr == SR, sr
    for rec in ozet["satirlar"]:
        seg = audio[int(round(rec["t0"] * SR)): int(round(rec["t1"] * SR))]
        sf.write(WORK / sid / f"{sid}_{rec['satir']:02d}.wav", seg, SR, subtype="PCM_24")

def gen(scenes):
    data = narration()
    subprocess.run([sys.executable, str(ROOT / "tools/build_tts.py"), str(TTS)], check=True)
    for sc in data["scenes"]:
        if scenes and sc["id"] not in scenes:
            continue
        out = WORK / sc["id"]
        ozet = run_oku(TTS / f"{sc['id']}.txt", out / "_okuma")
        out.mkdir(exist_ok=True)
        split(sc["id"], ozet)
        if ozet.get("supheli_satirlar"):
            print(f"  {sc['id']} hız kapısı şüpheli satırlar: {ozet['supheli_satirlar']}")

def regen(sid, nums):
    data = narration(); pairs = load_map()
    sc = next(s for s in data["scenes"] if s["id"] == sid)
    for n in nums:
        text = to_tts(sc["lines"][n - 1][0], pairs)
        tf = TTS / f"{sid}_{n:02d}_tek.txt"; tf.write_text(text + "\n", encoding="utf-8")
        ozet = run_oku(tf, WORK / sid / f"_tek_{n:02d}")
        audio, _ = sf.read(Path(ozet["wav"]), dtype="float32")
        rec = ozet["satirlar"][0]
        sf.write(WORK / sid / f"{sid}_{n:02d}.wav", audio[int(rec["t0"] * SR): int(rec["t1"] * SR)], SR, subtype="PCM_24")
        print(f"  {sid}_{n:02d} yeniden üretildi")

def norm(s):
    s = s.replace("İ", "i").replace("I", "ı").lower()
    s = unicodedata.normalize("NFC", s)
    return re.sub(r"[^\wçğıöşü ]+", " ", s).split()

def wer(ref, hyp):
    r, h = norm(ref), norm(hyp)
    d = list(range(len(h) + 1))
    for i in range(1, len(r) + 1):
        prev, d[0] = d[0], i
        for j in range(1, len(h) + 1):
            cur = min(d[j] + 1, d[j - 1] + 1, prev + (r[i - 1] != h[j - 1]))
            prev, d[j] = d[j], cur
    return d[len(h)] / max(len(r), 1)

def asr(scenes):
    # ayrı ortamdaki faster-whisper ile (C:/vidwork/asr)
    data = narration(); jobs = []
    for sc in data["scenes"]:
        if scenes and sc["id"] not in scenes:
            continue
        for i, (text, _) in enumerate(sc["lines"], 1):
            jobs.append({"file": str(WORK / sc["id"] / f"{sc['id']}_{i:02d}.wav"), "ref": text, "key": f"{sc['id']}_{i:02d}"})
    jf = WORK / "asr_jobs.json"; jf.write_text(json.dumps(jobs, ensure_ascii=False), encoding="utf-8")
    subprocess.run(["C:/vidwork/asr/Scripts/python.exe", str(ROOT / "tools/asr_run.py"), str(jf), str(WORK / "asr_out.json")], check=True)
    res = json.loads((WORK / "asr_out.json").read_text(encoding="utf-8"))
    report = []
    for j in jobs:
        hyp = res[j["key"]]["text"]
        w = wer(j["ref"], hyp)
        report.append({"key": j["key"], "wer": round(w, 3), "ref": j["ref"], "asr": hyp})
        flag = "  <-- kontrol" if w > 0.2 else ""
        print(f"{j['key']} WER {w:.2f}{flag}\n   ref: {j['ref']}\n   asr: {hyp}")
    old = {}
    rp = WORK / "asr_rapor.json"
    if rp.exists():
        old = {r["key"]: r for r in json.loads(rp.read_text(encoding="utf-8"))}
    old.update({r["key"]: r for r in report})
    rp.write_text(json.dumps(sorted(old.values(), key=lambda r: r["key"]), ensure_ascii=False, indent=1), encoding="utf-8")

def timing():
    data = narration(); out = {}
    scenes = data["scenes"]
    for k, sc in enumerate(scenes):
        t = LEAD; lines = []; parts = [np.zeros(int(LEAD * SR), dtype="float32")]
        for i, (text, pause) in enumerate(sc["lines"], 1):
            a, _ = sf.read(WORK / sc["id"] / f"{sc['id']}_{i:02d}.wav", dtype="float32")
            lines.append([round(t, 3), round(t + len(a) / SR, 3)])
            parts.append(a); t += len(a) / SR
            if i < len(sc["lines"]):
                p = PAUSE[pause]; parts.append(np.zeros(int(p * SR), dtype="float32")); t += p
        tail = LAST_TAIL if k == len(scenes) - 1 else TAIL
        parts.append(np.zeros(int(tail * SR), dtype="float32")); t += tail
        # süreyi kare sınırına yuvarla (30 fps)
        dur = round(np.ceil(t * 30) / 30, 4)
        audio = np.concatenate(parts)
        audio = np.concatenate([audio, np.zeros(int(round(dur * SR)) - len(audio), dtype="float32")])
        sf.write(WORK / f"{sc['id']}_sahne.wav", audio, SR, subtype="PCM_24")
        out[sc["id"]] = {"lead": LEAD, "dur": dur, "lines": lines, "title": sc["title"]}
    Path("C:/vidwork/timing.json").write_text(json.dumps(out, ensure_ascii=False, indent=1), encoding="utf-8")
    total = sum(v["dur"] for v in out.values())
    for sid, v in out.items():
        print(f"{sid} {v['title']:<26} {v['dur']:7.2f} sn")
    print(f"TOPLAM {total:.2f} sn ({int(total // 60)}:{total % 60:05.2f})")

if __name__ == "__main__":
    cmd, rest = sys.argv[1], sys.argv[2:]
    if cmd == "gen": gen(rest)
    elif cmd == "regen": regen(rest[0], [int(x) for x in rest[1:]])
    elif cmd == "asr": asr(rest)
    elif cmd == "timing": timing()
