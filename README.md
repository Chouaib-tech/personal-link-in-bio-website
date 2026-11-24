# Chouaib Ramoul – link-in-bio

Premium mobile-first link-in-bio page (Next.js 14 static export, Tailwind, react-icons), opened from an NFC card. Deployed on Vercel.

## Edit
- Links and FR/EN copy: `lib/content.ts`
- Image paths (single place): `lib/images.ts`
- Hero bust: replace `source-images/avatar-3d.png` (transparent cutout), then `python3 scripts/make-avatar-cutout.py`. Favicon: `source-images/waving.png`, then `python3 scripts/optimize-images.py`. The 1200x630 social card `public/images/og.jpg` is a separate file to replace.
- Door previews (the picture inside each open door): put the phone screenshots / icons in `source-images/links-screens/` (facebook, github, instagram, linkedin, portfolio = screenshots; gmail, call, telegram, whatsapp = icons), then `python3 scripts/optimize-link-screens.py`. Only the generated WebP files go in `public/`. All scripts need Pillow + numpy.
- Theme tokens: `tailwind.config.ts`

## Run
```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # static export to out/
```
