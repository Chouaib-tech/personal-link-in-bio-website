"""Door previews: source-images/links-screens/*  ->  public/images/links-screens/*.webp

Every preview is a PORTRAIT 360x800 image: the doorway is about 0.45 wide / tall, so it fits exactly.
  - phone screenshots (facebook, github, instagram, linkedin, portfolio): at their real size, slid to the right
    so the left part (profile photo + name) is not hidden behind the open door leaf
  - icons (gmail, call, telegram, whatsapp): the icon on a portrait backdrop, centred on the door

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
CENTER_X, CENTER_Y = 0.5, 0.40  # where the icon sits (fractions of the preview): centred on the door
ICON_W = 220  # width of the icon itself, in preview pixels (the open door leaf hides at most the outer ~6%)
SHIFT = int(W * 0.27)  # the open door leaf hides the left ~27% of the doorway: screenshots slide right by this much

SCREENS = ["facebook", "github", "instagram", "linkedin", "portfolio"]
ICONS = ["gmail", "call", "telegram", "whatsapp"]


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


def cut_out_checkerboard(im):
    """The call icon was saved with a fake transparency checkerboard. Flood it from the outside; the gold rim stops it."""
    a = np.asarray(im).astype(int)
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    lum, sat = a.mean(axis=2), a.max(axis=2) - a.min(axis=2)
    gray = (abs(r - g) < 12) & (abs(g - b) < 12) & (lum < 80)  # checker squares: dark neutral greys

    def dil(m, n=1):
        for _ in range(n):
            p = np.pad(m, 1)
            m = p[1:-1, 1:-1] | p[:-2, 1:-1] | p[2:, 1:-1] | p[1:-1, :-2] | p[1:-1, 2:] | p[:-2, :-2] | p[:-2, 2:] | p[2:, :-2] | p[2:, 2:]
        return m

    free = gray & ~dil(~gray, 2)  # close hairline gaps in the rim first
    reach = np.zeros_like(free)
    reach[0, :] = reach[-1, :] = reach[:, 0] = reach[:, -1] = True
    reach &= free
    while True:
        new = dil(reach) & free
        if new.sum() == reach.sum():
            break
        reach = new
    outside = (dil(reach, 3) & gray) | reach
    outside |= dil(outside, 3) & (lum < 105) & (sat < 55)  # the dark fringe just outside the rim
    alpha = Image.fromarray(((~outside) * 255).astype("uint8"), "L")
    return alpha.filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(0.7))


def icon_call(name):
    """Black + gold handset, cut out, on a green radial backdrop (the Call door's brand colour)."""
    im = ImageOps.exif_transpose(Image.open(find(name))).convert("RGB")
    alpha = cut_out_checkerboard(im)
    x0, y0, x1, y1 = bbox(np.asarray(alpha) > 128, trim=0.0)
    pad = 6
    box = (max(0, x0 - pad), max(0, y0 - pad), min(im.width, x1 + pad), min(im.height, y1 + pad))
    crop, a_crop = im.crop(box), alpha.crop(box)
    # radial green backdrop, brightest behind the handset
    yy, xx = np.mgrid[0:H, 0:W]
    d = np.hypot((xx - CENTER_X * W) / (0.95 * W), (yy - CENTER_Y * H) / (0.62 * H)).clip(0, 1)
    t = (d * d * (3 - 2 * d))[..., None]
    inner, outer = np.array([72, 160, 104]), np.array([11, 30, 21])
    canvas = Image.fromarray((inner * (1 - t) + outer * t).astype("uint8"), "RGB")
    scale = min(ICON_W / (x1 - x0), 0.46 * H / (y1 - y0))
    # soft drop shadow, then the handset
    sh = Image.new("RGB", crop.size, (0, 0, 0))
    shadow_mask = a_crop.point(lambda v: int(v * 0.38)).filter(ImageFilter.GaussianBlur(7))
    shadow = sh.resize((round(crop.width * scale), round(crop.height * scale)))
    sm = shadow_mask.resize(shadow.size, Image.LANCZOS)
    x, y = round(CENTER_X * W - shadow.width / 2), round(CENTER_Y * H - shadow.height / 2)
    canvas.paste(shadow, (x + 5, y + 9), sm)
    paste_centered(canvas, crop, scale, alpha=a_crop)
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
    jobs["call"] = lambda: icon_call("call")
    jobs["telegram"] = lambda: icon_on_dark("telegram", 45)
    jobs["whatsapp"] = lambda: icon_on_dark("whatsapp", 70)
    for name in SCREENS + ICONS:
        path = out / f"{name}.webp"
        q = save_webp(jobs[name](), path)
        print(f"{name}: {W}x{H} {path.stat().st_size / 1024:.0f}KB (q={q})")
