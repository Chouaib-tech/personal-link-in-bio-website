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

export const SITE_URL = 'https://personal-linkin.vercel.app'
