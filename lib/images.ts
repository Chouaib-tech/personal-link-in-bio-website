// Single source of truth for every image path used by the site.
// To swap a picture: replace the file in source-images/, run
// `python3 scripts/optimize-images.py`, or just change a path here.
// (hero = the photo in the arch frame, avatar = the small round photo next to "Hello")
export const IMAGES = {
  hero: '/images/ramoul-portrait.webp', // 4:5 portrait shown in the arch frame
  heroSize: { width: 652, height: 815 },
  heroFocus: '50% 22%', // object-position inside the arch frame; tweak after swapping the photo
  avatar: '/images/ramoul-avatar.webp', // 200x200, round avatar / favicon
  avatarSize: { width: 200, height: 200 },
  og: '/images/og.jpg', // 1200x630 social preview card
  ogSize: { width: 1200, height: 630 },
} as const

export const SITE_URL = 'https://personal-linkin.vercel.app'
