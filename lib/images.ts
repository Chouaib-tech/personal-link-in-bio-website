// Single source of truth for every image path used by the site.
// To swap a picture: replace the file in source-images/, run
// `python3 scripts/optimize-images.py`, or just change a path here.
// (hero = the 3D bust cutout on the hero stage, avatar = small photo used as the favicon)
export const IMAGES = {
  hero: '/images/avatar-3d.webp', // transparent cutout: python3 scripts/make-avatar-cutout.py
  heroSize: { width: 1100, height: 1204 },
  avatar: '/images/ramoul-avatar.webp', // 200x200, favicon
  og: '/images/og.jpg', // 1200x630 social preview card
  ogSize: { width: 1200, height: 630 },
} as const

// Door previews (shown inside the open doorway). Made by scripts/optimize-link-screens.py.
// pos = object-position: which part of the screenshot stays visible in the tall, narrow doorway
// (the open door leaf hides roughly its left quarter, so subjects sit a bit right of centre).
const P = '/images/links-screens/'
export const PREVIEWS = {
  whatsapp: { src: `${P}whatsapp.webp`, width: 640, height: 360, pos: '50% 50%' },
  email: { src: `${P}gmail.webp`, width: 640, height: 426, pos: '50% 50%' },
  portfolio: { src: `${P}portfolio.webp`, width: 640, height: 317, pos: '26% 0%' },
  linkedin: { src: `${P}linkedin.webp`, width: 640, height: 468, pos: '8% 30%' },
  github: { src: `${P}github.webp`, width: 640, height: 365, pos: '18% 0%' },
  telegram: { src: `${P}telegram.webp`, width: 640, height: 304, pos: '50% 40%' },
  instagram: { src: `${P}instagram.webp`, width: 640, height: 347, pos: '8% 0%' },
  facebook: { src: `${P}facebook.webp`, width: 640, height: 403, pos: '74% 0%' },
} as const
export type PreviewKey = keyof typeof PREVIEWS

export const SITE_URL = 'https://personal-linkin.vercel.app'
