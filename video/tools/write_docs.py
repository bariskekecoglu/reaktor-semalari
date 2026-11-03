"""narration.json + timing.json -> script.md (nihai anlatım, ölçülen zamanlarla)."""
import json
from pathlib import Path
R = Path(__file__).resolve().parent.parent
nar = json.loads((R / "narration.json").read_text(encoding="utf-8"))
tm = json.loads(Path("C:/vidwork/timing.json").read_text(encoding="utf-8"))
def tc(s): return f"{int(s // 60):02d}:{s % 60:05.2f}"
out = ["# Nihai anlatım metni", "",
       "Seslendirme: VoxCPM2 · `hazir/belgesel_hanim` (sentetik ses) · okuma tohumu 2692139539. Zaman kodları üretilen ses dosyalarından ölçülmüştür (videodaki konum). Ekranda ve altyazıda bu doğru yazım kullanılır; fonetik TTS girdisi için bkz. `tools/phonetic.tsv` ve `RENDER.md`.", ""]
off = 0.0; words = 0
for sc in nar["scenes"]:
    t = tm[sc["id"]]
    out += [f"## {sc['id'][1:]} · {sc['title']}  ({tc(off)}–{tc(off + t['dur'])}, {t['dur']:.1f} sn)", ""]
    for i, (text, _) in enumerate(sc["lines"], 1):
        a, b = t["lines"][i - 1]; words += len(text.split())
        out.append(f"- `{tc(off + a)}` {text}  <sub>`{sc['id']}_{i:02d}.wav` · {b - a:.2f} sn</sub>")
    out.append(""); off += t["dur"]
out += [f"Toplam: {sum(len(s['lines']) for s in nar['scenes'])} cümle, {words} kelime, video süresi {tc(off)} ({off:.2f} sn).", ""]
(R / "script.md").write_text("\n".join(out), encoding="utf-8")
print("script.md", words, round(off, 2))
