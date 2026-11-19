"""Rebuild optimized images from source-images/ into public/images/.

Swap source-images/hero.png and source-images/avatar.jpg, then run:
    python3 scripts/optimize-images.py
Requires Pillow. Hero < 150KB, avatar < 60KB.
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


hero = ImageOps.exif_transpose(Image.open(src / "hero.png")).convert("RGB")
hero = hero.resize((900, round(900 * hero.height / hero.width)), Image.LANCZOS)
save_webp(hero, out / "ramoul-hero.webp", 150)

# Avatar: square crop around the face of the source photo (tweak the box if you swap the photo).
av = ImageOps.exif_transpose(Image.open(src / "avatar.jpg")).convert("RGB")
w, h = av.size
box = (int(w * 0.33), int(h * 0.455), int(w * 0.33) + int(w * 0.30), int(h * 0.455) + int(w * 0.30))
av = av.crop(box).resize((200, 200), Image.LANCZOS)
save_webp(av, out / "ramoul-avatar.webp", 60)
