# Chouaib Ramoul – link-in-bio

Premium mobile-first link-in-bio page (Next.js 14 static export, Tailwind, react-icons), opened from an NFC card. Deployed on Vercel.

## Edit
- Links and FR/EN copy: `lib/content.ts`
- Image paths (single place): `lib/images.ts`
- Swap photos: replace `source-images/portrait.jpg` (arch frame photo) and `source-images/waving.png` (small round avatar), tweak the crops in the script if needed, then `python3 scripts/optimize-images.py` (needs Pillow). The 1200x630 social card `public/images/og.jpg` is a separate file to replace.
- Theme tokens: `tailwind.config.ts`

## Run
```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # static export to out/
```
