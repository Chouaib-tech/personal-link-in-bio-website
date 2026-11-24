"""Door previews: source-images/links-screens/*.png -> public/images/links-screens/*.webp

Each preview is a PORTRAIT 360x800 image (the doorway is about 0.45 wide/tall, so it fits exactly):
  - background: the whole screenshot, blurred + darkened (or a flat brand colour for logos)
  - foreground: the best crop (BOX, as fractions of the source) scaled to the width, sitting a bit above
    the middle (the brand icon + label cover the bottom of the doorway).

Tune a crop in BOX, run:   python3 scripts/optimize-link-screens.py
Requires Pillow + numpy. Each file stays under 40KB.
"""
from PIL import Image, ImageFilter, ImageEnhance
import numpy as np
from pathlib import Path

root = Path(__file__).resolve().parent.parent
src, out = root / "source-images" / "links-screens", root / "public" / "images" / "links-screens"
out.mkdir(parents=True, exist_ok=True)
for old in out.glob("*"):
    old.unlink()  # publish only the WebP files

W, H = 360, 800
CENTER_Y = 0.42  # where the middle of the crop sits (fraction of the height)
CENTER_X = 0.63  # the open door leaf covers the left quarter, so subjects sit right of centre
VISIBLE_W = int(W * 0.70)  # widest the subject may be

# name: (x0, y0, x1, y1) crop box, fractions of the source image
BOX = {
    "facebook": (0.54, 0.40, 0.88, 0.70),   # profile photo + name
    "instagram": (0.14, 0.04, 0.46, 0.44),  # profile photo + name
    "linkedin": (0.00, 0.17, 0.44, 0.63),   # photo + name + headline
    "github": (0.07, 0.02, 0.33, 0.52),     # photo + name
    "telegram": (0.39, 0.08, 0.61, 0.52),   # the profile card
    "portfolio": (0.00, 0.00, 0.62, 1.00),  # top of the page: swirl + name
    "whatsapp": (0.30, 0.08, 0.70, 0.92),   # the icon
}
LOGO_BG = {"gmail": (255, 255, 255)}  # logos: flat brand-ish background, logo only


def place(bg, fg, max_w=VISIBLE_W, max_h=int(H * 0.8)):
    s = min(max_w / fg.width, max_h / fg.height)
    fg = fg.resize((round(fg.width * s), round(fg.height * s)), Image.LANCZOS)
    x = min(max(round(W * CENTER_X - fg.width / 2), 0), W - fg.width)
    y = min(max(round(H * CENTER_Y - fg.height / 2), 0), H - fg.height)
    bg.paste(fg, (x, y))


for f in sorted(src.glob("*.png")):
    name = f.stem
    im = Image.open(f).convert("RGB")
    w, h = im.size
    if name in LOGO_BG:
        canvas = Image.new("RGB", (W, H), LOGO_BG[name])
        a = np.array(im).astype(int)
        ink = (a.min(axis=2) < 235)
        cols = np.nonzero(ink.any(axis=0))[0]
        # the Gmail "M" is the first blob of ink: stop at the first wide gap
        gaps = np.nonzero(np.diff(cols) > w * 0.02)[0]
        x1 = cols[gaps[0]] if len(gaps) else cols[-1]
        sub = ink[:, : x1 + 1]
        ys, xs = np.nonzero(sub)
        pad = 8
        logo = im.crop((xs.min() - pad, ys.min() - pad, xs.max() + pad, ys.max() + pad))
        place(canvas, logo, max_w=int(W * 0.58))
    else:
        # blurred, darkened cover of the whole screenshot
        s = max(W / w, H / h)
        bgi = im.resize((round(w * s), round(h * s)), Image.LANCZOS)
        l, t = (bgi.width - W) // 2, (bgi.height - H) // 2
        canvas = bgi.crop((l, t, l + W, t + H)).filter(ImageFilter.GaussianBlur(14))
        canvas = ImageEnhance.Brightness(canvas).enhance(0.55)
        x0, y0, x1, y1 = BOX[name]
        crop = im.crop((round(x0 * w), round(y0 * h), round(x1 * w), round(y1 * h)))
        place(canvas, crop)
    path = out / f"{name}.webp"
    for q in range(88, 30, -4):
        canvas.save(path, "WEBP", quality=q, method=6)
        if path.stat().st_size <= 40 * 1024:
            break
    print(f"{name}: {W}x{H} {path.stat().st_size / 1024:.0f}KB (q={q})")
