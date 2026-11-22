"""Clean source-images/avatar-3d.png (already an RGBA cutout) and export the hero WebP.

  source-images/avatar-3d.png  ->  public/images/avatar-3d.webp   (alpha, < 150KB)

Cleans: the saturated red patch at the bottom edge, red fringes on semi-transparent edge pixels,
and makes the body fully opaque (the source alpha tops out at 253). Needs Pillow + numpy.
    python3 scripts/make-avatar-cutout.py
"""
from PIL import Image
import numpy as np
from pathlib import Path

root = Path(__file__).resolve().parent.parent
src = root / "source-images" / "avatar-3d.png"
out = root / "public" / "images" / "avatar-3d.webp"

im = Image.open(src).convert("RGBA")
a = np.array(im).astype(np.int16)
r, g, b, al = a[..., 0], a[..., 1], a[..., 2], a[..., 3]
H, W = al.shape
red_dom = r - np.maximum(g, b)

# 1) saturated red leftover at the bottom edge (right side)
yy, xx = np.mgrid[0:H, 0:W]
patch = (red_dom > 90) & (r > 150) & (g < 80) & (b < 80) & (yy > H * 0.9) & (xx > W * 0.6)
for _ in range(4):  # grow it a few pixels so the red outline goes too
    grown = patch.copy()
    grown[1:] |= patch[:-1]; grown[:-1] |= patch[1:]; grown[:, 1:] |= patch[:, :-1]; grown[:, :-1] |= patch[:, 1:]
    patch = grown & (yy > H * 0.9) & (xx > W * 0.6)

# 2) red fringes: semi-transparent edge pixels with a strong red cast -> remove; the rest -> neutralise the cast
edge = (al > 0) & (al < 245)
fringe = edge & (red_dom > 55)
cast = edge & (red_dom > 20) & ~fringe
r2 = r.copy()
r2[cast] = np.maximum(g[cast], b[cast]) + 8

# 3) solid body, crisp edge
al2 = al.copy()
al2[al2 >= 235] = 255
al2[fringe] = 0
# the patch sits inside the dark suit: paint it suit-dark instead of leaving a hole
r2[patch], g[patch], b[patch], al2[patch] = 22, 17, 15, 255

out_arr = np.stack([r2, g, b, al2], axis=-1).clip(0, 255).astype(np.uint8)
res = Image.fromarray(out_arr, "RGBA")
print(f"patch px {int(patch.sum())}, fringe px {int(fringe.sum())}, cast px {int(cast.sum())}")

# display height ~560px @2x -> ~1100px; step the size/quality down until < 150KB
for width in (1100, 1000, 900):
    img = res.resize((width, round(width * H / W)), Image.LANCZOS)
    for q in range(88, 54, -6):
        img.save(out, "WEBP", quality=q, alpha_quality=90, method=6)
        if out.stat().st_size <= 150 * 1024:
            break
    if out.stat().st_size <= 150 * 1024:
        break
print(f"{out.name}: {img.size} {out.stat().st_size / 1024:.0f}KB (q={q})")
