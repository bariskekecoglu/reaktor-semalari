"""Kurgu ve dışa aktarma (FFmpeg skill betikleriyle).

  frames [sahne ...] [--jobs 3]   kareleri yakala (render/director.mjs, paralel)
  clips  [sahne ...]              kare dizisi -> sahne videosu (sequence.py) + sahne sesi (audio.py --replace)
  join                            sahneleri kayıpsız birleştir (join.py --copy), ses düzeyi (loudness.py -16 LUFS / -1 dBTP)
  srt                             ölçülen cümle zamanlarından SRT (uzun cümleler kelime zamanlarıyla bölünür)
  burn                            tam altyazıyı görüntüye işle (caption.py)
  sample                          15–20 sn örnek: s03 sahnesi + altyazı
"""
import json, os, re, subprocess, sys, shutil
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent           # video/
SKILL = Path("C:/Users/user/video-tools/ffmpeg-skill/scripts")
FFBIN = "C:/Users/user/AppData/Local/Microsoft/WinGet/Packages/Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-9.0.2-full_build/bin"
W = Path("C:/vidwork")
FRAMES, CLIPS, VO = W / "frames", W / "clips", W / "vo"
FINAL = ROOT / "final"
PY = sys.executable
ENV = dict(os.environ, PATH=FFBIN + os.pathsep + os.environ["PATH"], PYTHONIOENCODING="utf-8")
LOG = W / "assemble_log.jsonl"

def skill(script, *args, ok_codes=(0,)):
    cmd = [PY, str(SKILL / script), *map(str, args), "--json-brief"]
    r = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8", errors="replace", env=ENV)
    with LOG.open("a", encoding="utf-8") as f:
        f.write(json.dumps({"cmd": " ".join(cmd), "rc": r.returncode, "out": r.stdout[-2000:], "err": r.stderr[-1500:]}, ensure_ascii=False) + "\n")
    if r.returncode not in ok_codes:
        raise SystemExit(f"{script} hata rc={r.returncode}\n{r.stdout[-1500:]}\n{r.stderr[-1500:]}")
    print(f"  {script}: {r.stdout.strip()[-300:]}")
    return r.stdout

def scenes(args):
    t = json.loads((W / "timing.json").read_text(encoding="utf-8"))
    ids = [a for a in args if a.startswith("s")] or list(t.keys())
    return t, ids

def frames(args):
    t, ids = scenes(args)
    jobs = int(args[args.index("--jobs") + 1]) if "--jobs" in args else 3
    def one(sid):
        d = FRAMES / sid
        if d.exists():
            shutil.rmtree(d)
        r = subprocess.run(["node", str(ROOT / "render/director.mjs"), "--scene", sid, "--timing", str(W / "timing.json"), "--out", str(FRAMES)],
                           capture_output=True, text=True, encoding="utf-8", errors="replace")
        (W / f"render_{sid}.log").write_text(r.stdout + r.stderr, encoding="utf-8")
        n = len(list(d.glob("f*.png")))
        exp = round(t[sid]["dur"] * 30)
        warn = [l for l in (r.stdout + r.stderr).splitlines() if "bulunamadı" in l or "pageerror" in l or "[event]" in l]
        return sid, n, exp, r.returncode, warn
    with ThreadPoolExecutor(jobs) as ex:
        for sid, n, exp, rc, warn in ex.map(one, ids):
            print(f"{sid}: {n}/{exp} kare rc={rc}" + (f"  UYARI: {warn}" if warn else ""))

def clips(args):
    t, ids = scenes(args)
    CLIPS.mkdir(parents=True, exist_ok=True)
    for sid in ids:
        v = CLIPS / f"{sid}_v.mp4"; a = VO / f"{sid}_sahne.wav"; o = CLIPS / f"{sid}.mp4"
        skill("sequence.py", "--dir", FRAMES / sid, "--pattern", "f%05d.png", "--fps", 30, "--preset", "slow", "--quality", 16, "-o", v, "--overwrite")
        skill("audio.py", v, "--replace", a, "--stereo", "-o", o, "--overwrite")

def join(args):
    t, ids = scenes(args)
    lst = CLIPS / "parts.txt"
    lst.write_text("\n".join(f"{sid}.mp4" for sid in ids) + "\n", encoding="utf-8")
    skill("join.py", "--list", lst, "--transition", "none", "-o", CLIPS / "joined.mp4", "--overwrite")
    FINAL.mkdir(exist_ok=True)
    # kareler PNG (RGB) yakalanır; sequence.py bunları BT.709 sınırlı aralıklı yuv420p'ye çevirir
    skill("loudness.py", CLIPS / "joined.mp4", "-I", -16, "--tp", -1, "-o", FINAL / "proje-tanitim-tr-1080p.mp4", "--overwrite")

# ---------- altyazı ----------
MAXC = 84  # iki satır x ~42 karakter

def fmt(s):
    h, rem = divmod(max(s, 0), 3600); m, sec = divmod(rem, 60)
    return f"{int(h):02d}:{int(m):02d}:{int(sec):02d},{int(round((sec - int(sec)) * 1000)) % 1000:03d}"

def split_point(text):
    """Uzun cümleyi doğal bir yerden ikiye böl: ortaya en yakın ; : , sonrası, yoksa boşluk."""
    mid = len(text) / 2
    n = len(text)
    punct = [m.end() for m in re.finditer(r"[;:,]\s", text) if 0.3 * n <= m.end() <= 0.7 * n]
    if punct:
        k = min(punct, key=lambda c: abs(c - mid))
    else:
        # boşluklar: tek harfli sözcükten sonra bölme; "ve/ya/ama/yoksa" öncesini tercih et
        def score(c):
            prev = text[:c].split()[-1]; nxt = text[c:].split()[0]
            return abs(c - mid) + (1000 if len(prev) <= 1 else 0) - (0.12 * n if nxt in ("ve", "ya", "ama", "yoksa", "ise") else 0)
        k = min([m.start() for m in re.finditer(r"\s", text)], key=score)
    return text[:k].strip(), text[k:].strip()


def pause_split(wav, frac):
    """Cümle ses dosyasında, metin oranına (frac) en yakın gerçek durağın ortası (sn).
    Durak: en az 60 ms boyunca -40 dBFS altı. Durak yoksa orantılı süre."""
    import numpy as np, soundfile as sf
    a, sr = sf.read(str(wav)); a = a if a.ndim == 1 else a.mean(1)
    win = int(0.01 * sr); n = len(a) // win
    db = 20 * np.log10(np.sqrt((a[: n * win].reshape(n, win) ** 2).mean(1)) + 1e-9)
    dur = len(a) / sr; target = dur * frac; gaps = []; st = None
    for i, q in enumerate(db < -40):
        if q and st is None: st = i
        if not q and st is not None:
            if i - st >= 6 and st > 20 and i < n - 20: gaps.append((st + i) / 2 * 0.01)
            st = None
    if not gaps: return target, False
    g = min(gaps, key=lambda x: abs(x - target))
    return (g, True) if abs(g - target) < 0.25 * dur else (target, False)

def norm_w(x):
    return re.sub(r"[^\wçğıöşü]", "", x.replace("İ", "i").replace("I", "ı").lower())

def srt(args):
    t, ids = scenes(args)
    nar = {s["id"]: s for s in json.loads((ROOT / "narration.json").read_text(encoding="utf-8"))["scenes"]}
    # final_words.json: son videonun faster-whisper kelime zamanları (yalnız kesintisiz konuşmada bölme için)
    fw = json.loads((VO / "final_words.json").read_text(encoding="utf-8")) if (VO / "final_words.json").exists() else []
    cues, off = [], 0.0
    for sid in ids:
        for i, (text, _) in enumerate(nar[sid]["lines"], 1):
            t0, t1 = t[sid]["lines"][i - 1]
            a, b = off + t0, off + t1
            key = f"{sid}_{i:02d}"
            if len(text) > MAXC:
                p1, p2 = split_point(text)
                rel, at_pause = pause_split(VO / sid / f"{key}.wav", len(p1) / len(text))
                cut = off + t0 + rel
                if not at_pause and fw:
                    # konuşma kesintisizse: son videonun kelime zamanlarından ikinci yarının ilk kelimesi
                    first = norm_w(p2.split()[0])
                    c = [w for w in fw if norm_w(w["w"]) == first and abs(w["s"] - cut) < 1.5]
                    if c:
                        cut = min(c, key=lambda w: abs(w["s"] - cut))["s"]
                cues += [(a, cut, p1), (cut, b, p2)]
            else:
                cues.append((a, b, text))
        off += t[sid]["dur"]
    lines = []
    for n, (a, b, text) in enumerate(cues, 1):
        lines += [str(n), f"{fmt(a)} --> {fmt(b)}", text, ""]
    FINAL.mkdir(exist_ok=True)
    (FINAL / "proje-tanitim-tr.srt").write_text("\n".join(lines), encoding="utf-8")
    print(f"{len(cues)} altyazı, son: {fmt(cues[-1][1])}")

def long_words(args):
    """Uzun cümlelerin kelime zamanlarını faster-whisper ile ölç (yalnız bölme noktası için)."""
    t, ids = scenes(args)
    nar = {s["id"]: s for s in json.loads((ROOT / "narration.json").read_text(encoding="utf-8"))["scenes"]}
    out = {}
    for sid in ids:
        for i, (text, _) in enumerate(nar[sid]["lines"], 1):
            if len(text) > MAXC:
                key = f"{sid}_{i:02d}"; f = VO / sid / f"{key}.wav"; o = VO / f"w_{key}.json"
                subprocess.run(["C:/vidwork/asr/Scripts/python.exe", str(ROOT / "tools/asr_run.py"), "--words", str(f), str(o)], check=True, capture_output=True)
                out[key] = json.loads(o.read_text(encoding="utf-8"))
    (VO / "words_long.json").write_text(json.dumps(out, ensure_ascii=False), encoding="utf-8")
    print(f"{len(out)} uzun cümle ölçüldü")

def burn(args):
    src = Path(args[0]) if args else FINAL / "proje-tanitim-tr-1080p.mp4"
    out = Path(args[1]) if len(args) > 1 else FINAL / "proje-tanitim-tr-1080p-altyazili.mp4"
    srtf = Path(args[2]) if len(args) > 2 else FINAL / "proje-tanitim-tr.srt"
    skill("caption.py", src, "--srt", f"{srtf}:tr", "--font", "Segoe UI Semibold", "--size", 18, "--outline", 2, "--box",
          "--max-lines", 2, "--margin", 16, "-o", out, "--overwrite")

if __name__ == "__main__":
    cmd, rest = sys.argv[1], sys.argv[2:]
    {"frames": frames, "clips": clips, "join": join, "srt": srt, "words": long_words, "burn": burn}[cmd](rest)
