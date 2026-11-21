"""Rebuild optimized images from source-images/ into public/images/.

  source-images/portrait.jpg -> public/images/ramoul-portrait.webp  (photo in the arch frame, 4:5)
  source-images/waving.png   -> public/images/ramoul-avatar.webp    (whole photo, scaled, in the round avatar next to "Hello"; also the favicon)

Swap a source file, tweak its crop below if needed, then run:
    python3 scripts/optimize-images.py
Requires Pillow. Portrait < 150KB, avatar < 60KB.
"""
from PIL import Image, ImageOps
from pathlib import Path

root = Path(__file__).resolve().parent.parent
src, out = root / "source-images", root / "public" / "images"
out.mkdir(parents=True, exist_ok=True)


def save_webp(img, path, limit_kb):
    for q in range(88, 40, -4):
        img.save(path, "WEBP", quality=q, method=6)
        if path.stat().st_size <= limit_kb * 1024:
            break
    print(f"{path.name}: {img.size} {path.stat().st_size / 1024:.0f}KB (q={q})")


# Frame photo: 4:5 crop, chest-up (box = left, top, width as a fraction of the source; height = width * 1.25).
p = ImageOps.exif_transpose(Image.open(src / "portrait.jpg")).convert("RGB")
w, h = p.size
cw = int(w * 0.68)
ch = int(cw * 1.25)
left, top = int(w * 0.16), min(int(h * 0.365), h - ch)
p = p.crop((left, top, left + cw, top + ch))
save_webp(p, out / "ramoul-portrait.webp", 150)

# Avatar: the WHOLE (square) photo, no crop, just scaled down.
a = ImageOps.exif_transpose(Image.open(src / "waving.png")).convert("RGB")
if a.width != a.height:  # keep everything visible: pad to a square instead of cropping
    side = max(a.size)
    sq = Image.new("RGB", (side, side), a.getpixel((0, 0)))
    sq.paste(a, ((side - a.width) // 2, (side - a.height) // 2))
    a = sq
a = a.resize((200, 200), Image.LANCZOS)
save_webp(a, out / "ramoul-avatar.webp", 60)
