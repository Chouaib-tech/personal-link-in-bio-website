"""Door previews: source-images/links-screens/*.png -> public/images/links-screens/*.webp (640px wide, < 60KB).

Swap a screenshot in source-images/links-screens/, run:
    python3 scripts/optimize-link-screens.py
then copy the printed sizes into PREVIEWS in lib/images.ts if they changed. Requires Pillow.
"""
from PIL import Image
from pathlib import Path

root = Path(__file__).resolve().parent.parent
src, out = root / "source-images" / "links-screens", root / "public" / "images" / "links-screens"
out.mkdir(parents=True, exist_ok=True)
for old in out.glob("*"):
    old.unlink()  # publish only the WebP files

for f in sorted(src.glob("*.png")):
    im = Image.open(f).convert("RGB")
    im = im.resize((640, round(640 * im.height / im.width)), Image.LANCZOS)
    path = out / f"{f.stem}.webp"
    for q in range(86, 30, -4):
        im.save(path, "WEBP", quality=q, method=6)
        if path.stat().st_size <= 60 * 1024:
            break
    print(f"{f.stem}: {im.size[0]}x{im.size[1]} {path.stat().st_size / 1024:.0f}KB (q={q})")
