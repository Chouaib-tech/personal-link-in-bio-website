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

// Door previews (shown inside the open doorway). Portrait 360x800 = the doorway ratio (about 0.45), so they fit
// exactly: crops, zoom and backdrops are decided per image in scripts/optimize-link-screens.py (BOX).
// pos = object-position, only matters if you swap in an image with another ratio.
const P = '/images/links-screens/'
const portrait = (name: string) => ({ src: `${P}${name}.webp`, width: 360, height: 800, pos: '50% 50%' })
export const PREVIEWS = {
  whatsapp: portrait('whatsapp'),
  email: portrait('gmail'),
  portfolio: portrait('portfolio'),
  linkedin: portrait('linkedin'),
  github: portrait('github'),
  telegram: portrait('telegram'),
  instagram: portrait('instagram'),
  facebook: portrait('facebook'),
} as const
export type PreviewKey = keyof typeof PREVIEWS

export const SITE_URL = 'https://personal-linkin.vercel.app'
