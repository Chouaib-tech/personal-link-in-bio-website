"""Door previews: source-images/links-screens/*  ->  public/images/links-screens/*.webp

Every preview is a PORTRAIT 360x800 image: the doorway is about 0.45 wide / tall, so it fits exactly.
  - phone screenshots (facebook, github, instagram, linkedin, portfolio): at their real size, slid to the right
    so the left part (profile photo + name) is not hidden behind the open door leaf
  - cards (telegram, whatsapp, call): his own designed picture; only its middle part is used, slid right of the open door leaf
  - icon (gmail): the icon on a portrait backdrop, just clear of the open door leaf

To change a picture: put the new file in source-images/links-screens/ with the same name
(png / jpg / jpeg / webp), then run
    python3 scripts/optimize-link-screens.py
Requires Pillow + numpy. Each file stays under about 40KB. The folder public/images/links-screens/ is
emptied first, so only the WebP files get published (never put your originals there).
"""
from PIL import Image, ImageDraw, ImageFilter, ImageOps
import numpy as np
from pathlib import Path

root = Path(__file__).resolve().parent.parent
src, out = root / "source-images" / "links-screens", root / "public" / "images" / "links-screens"

W, H = 360, 800
CENTER_X, CENTER_Y = 0.56, 0.40  # where the icon sits (fractions of the preview): a little right of the door centre, clear of the open leaf
ICON_W = 220  # width of the icon itself, in preview pixels (the open door leaf hides at most the outer ~6%)
SHIFT = int(W * 0.27)  # the open door leaf hides the left ~27% of the doorway: screenshots slide right by this much

SCREENS = ["facebook", "github", "instagram", "linkedin", "portfolio"]
ICONS = ["gmail"]
# designed cards (about square, content in the middle): name -> (content box x0, y0, x1, y1 in the source picture, scale)
CARDS = {"telegram": ((380, 335, 855, 965), 0.5), "whatsapp": ((325, 250, 925, 905), 0.41), "call": ((210, 375, 865, 1025), 0.38)}
CARD_X, CARD_Y = 0.60, 0.42  # where the middle of the card content sits (fractions of the preview), clear of the open leaf


def find(name):
    for ext in ("png", "jpg", "jpeg", "webp"):
        p = src / f"{name}.{ext}"
        if p.exists():
            return p
    raise SystemExit(f"missing source picture: {src}/{name}.(png|jpg|jpeg|webp)")


def bbox(mask, trim=0.3):
    ys, xs = np.nonzero(mask)
    x0, x1 = np.percentile(xs, [trim, 100 - trim])
    y0, y1 = np.percentile(ys, [trim, 100 - trim])
    return int(x0), int(y0), int(x1), int(y1)


def blurred_cover(im, blur=14, dark=0.55):
    s = max(W / im.width, H / im.height)
    big = im.resize((round(im.width * s), round(im.height * s)), Image.LANCZOS)
    l, t = (big.width - W) // 2, (big.height - H) // 2
    bg = big.crop((l, t, l + W, t + H)).filter(ImageFilter.GaussianBlur(blur))
    return Image.eval(bg, lambda v: int(v * dark))


def paste_centered(canvas, crop, scale, feather=0, alpha=None):
    crop = crop.resize((max(1, round(crop.width * scale)), max(1, round(crop.height * scale))), Image.LANCZOS)
    if alpha is not None:
        mask = alpha.resize(crop.size, Image.LANCZOS)
    else:  # soft rectangular edge, so the icon's own backdrop melts into ours
        mask = Image.new("L", crop.size, 0)
        ImageDraw.Draw(mask).rectangle([feather, feather, crop.width - feather, crop.height - feather], fill=255)
        mask = mask.filter(ImageFilter.GaussianBlur(max(feather / 2.2, 0.1)))
    x, y = round(CENTER_X * W - crop.width / 2), round(CENTER_Y * H - crop.height / 2)
    canvas.paste(crop, (x, y), mask)


def screen(name):
    """A phone screenshot at its real size, slid right by SHIFT so its left part clears the door leaf.
    The strip it leaves on the left (hidden behind the leaf) is a blurred copy of the screenshot."""
    im = ImageOps.exif_transpose(Image.open(find(name))).convert("RGB")
    full = ImageOps.fit(im, (W, H), Image.LANCZOS, centering=(0.5, 0.0))
    canvas = blurred_cover(full, blur=10, dark=0.6)
    canvas.paste(full.crop((0, 0, W - SHIFT, H)), (SHIFT, 0))
    return canvas


def card(name):
    """A designed card (dark picture, content in the middle). The content is scaled down so all of it fits the part of
    the doorway the open leaf does not hide; the rest of the picture is a blurred copy of itself, so it has no edges."""
    (x0, y0, x1, y1), scale = CARDS[name]
    im = ImageOps.exif_transpose(Image.open(find(name))).convert("RGB")
    canvas = blurred_cover(im, blur=24, dark=0.45)
    big = im.resize((round(im.width * scale), round(im.height * scale)), Image.LANCZOS)
    ox = round(CARD_X * W - (x0 + x1) / 2 * scale)
    oy = round(CARD_Y * H - (y0 + y1) / 2 * scale)
    f = 90  # soft top / bottom edge where the card ends
    mask = Image.new("L", big.size, 255)
    d = ImageDraw.Draw(mask)
    for i in range(f):
        v = int(255 * i / f)
        d.line([(0, i), (big.width, i)], fill=v)
        d.line([(0, big.height - 1 - i), (big.width, big.height - 1 - i)], fill=v)
    canvas.paste(big, (ox, oy), mask)
    return canvas


def icon_on_dark(name, threshold):
    """Icon photographed on a dark backdrop (telegram, whatsapp): blurred copy as backdrop, soft-edged icon on top."""
    im = ImageOps.exif_transpose(Image.open(find(name))).convert("RGB")
    a = np.asarray(im).astype(int)
    x0, y0, x1, y1 = bbox(a.max(axis=2) > threshold)
    bw, bh = x1 - x0, y1 - y0
    m = int(max(bw, bh) * 0.22)
    crop = im.crop((max(0, x0 - m), max(0, y0 - m), min(im.width, x1 + m), min(im.height, y1 + m)))
    canvas = blurred_cover(im, blur=22, dark=0.9)
    scale = min(ICON_W / bw, 0.46 * H / bh)
    paste_centered(canvas, crop, scale, feather=int(m * scale * 0.9))
    return canvas


def icon_on_white(name):
    """Icon on a white backdrop (gmail): white canvas, the icon pasted with a soft edge."""
    im = ImageOps.exif_transpose(Image.open(find(name))).convert("RGB")
    a = np.asarray(im).astype(int)
    x0, y0, x1, y1 = bbox(a.min(axis=2) < 232)
    bw, bh = x1 - x0, y1 - y0
    m = int(max(bw, bh) * 0.16)
    crop = im.crop((max(0, x0 - m), max(0, y0 - m), min(im.width, x1 + m), min(im.height, y1 + m)))
    canvas = Image.new("RGB", (W, H), (255, 255, 255))
    scale = min(ICON_W / bw, 0.46 * H / bh)
    paste_centered(canvas, crop, scale, feather=int(m * scale * 0.8))
    return canvas


def save_webp(img, path, limit_kb=40):
    for q in range(90, 38, -4):
        img.save(path, "WEBP", quality=q, method=6)
        if path.stat().st_size <= limit_kb * 1024:
            break
    return q


if __name__ == "__main__":
    out.mkdir(parents=True, exist_ok=True)
    for old in out.glob("*"):
        old.unlink()  # publish only the WebP files
    jobs = {n: (lambda n=n: screen(n)) for n in SCREENS}
    jobs["gmail"] = lambda: icon_on_white("gmail")
    jobs["call"] = lambda: card("call")
    jobs["telegram"] = lambda: card("telegram")
    jobs["whatsapp"] = lambda: card("whatsapp")
    for name in SCREENS + ICONS + list(CARDS):
        path = out / f"{name}.webp"
        q = save_webp(jobs[name](), path)
        print(f"{name}: {W}x{H} {path.stat().st_size / 1024:.0f}KB (q={q})")
