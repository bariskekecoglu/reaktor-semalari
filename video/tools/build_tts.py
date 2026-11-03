"""narration.json -> VoxCPM2 okuma girdileri (sahne başına bir dosya, satır = cümle).
Fonetik yazım yalnız TTS girdisine uygulanır; ekran/altyazı metni narration.json'daki doğru yazımdır."""
import json, re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = Path(sys.argv[1] if len(sys.argv) > 1 else "C:/vidwork/tts")

def load_map():
    pairs = []
    for line in (ROOT / "tools/phonetic.tsv").read_text(encoding="utf-8").splitlines():
        if line.startswith("#") or "\t" not in line:
            continue
        a, b = line.split("\t", 1)
        pairs.append((a, b))
    return sorted(pairs, key=lambda p: -len(p[0]))

def to_tts(text, pairs):
    for a, b in pairs:
        text = re.sub(rf"(?<![\wçğıöşüÇĞİÖŞÜ]){re.escape(a)}(?![\wçğıöşüÇĞİÖŞÜ])", b, text)
    return text

def main():
    data = json.loads((ROOT / "narration.json").read_text(encoding="utf-8"))
    pairs = load_map()
    OUT.mkdir(parents=True, exist_ok=True)
    words = 0
    for sc in data["scenes"]:
        rows = []
        for i, (text, pause) in enumerate(sc["lines"], 1):
            words += len(text.split())
            tts = to_tts(text, pairs)
            last = i == len(sc["lines"])
            rows.append(tts if last else f"{tts} || {pause}")
        (OUT / f"{sc['id']}.txt").write_text("\n".join(rows) + "\n", encoding="utf-8")
    print(f"{len(data['scenes'])} sahne, {sum(len(s['lines']) for s in data['scenes'])} cümle, {words} kelime -> {OUT}")

if __name__ == "__main__":
    main()
