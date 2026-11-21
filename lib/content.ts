export type Lang = 'fr' | 'en'

export const LINKS = {
  whatsapp: 'https://wa.me/213558638939',
  call: 'tel:+213558638939',
  email: 'mailto:chouaib-takieddine.ramoul@univ-annaba.dz',
  portfolio: 'https://ramoul-chouaib.vercel.app/',
  linkedin: 'https://www.linkedin.com/in/chouaib-ramoul25',
  github: 'https://github.com/Chouaib-tech',
  telegram: 'https://t.me/Chouaibtakieddine',
  instagram: 'https://instagram.com/chouaib._.ramoul',
  facebook: 'https://facebook.com/ChouaibRamoul',
} as const

// Write 1-2 sentences about me here (leave empty to hide the paragraph).
export const ABOUT_FR = ''
export const ABOUT_EN = ''

export const GREETINGS = [
  { text: 'Hello', lang: 'en', dir: 'ltr' },
  { text: 'Salut', lang: 'fr', dir: 'ltr' },
  { text: 'مرحبا', lang: 'ar', dir: 'rtl' },
] as const

export const COPY = {
  fr: {
    eyebrow: "Salut, moi c'est",
    title: 'Développeur Full-Stack & Spécialiste Cybersécurité',
    badge: 'Master 2 · Réseaux & Sécurité',
    location: 'Constantine, Algérie',
    doorsTitle: 'Choisissez une porte',
    doorsHintMouse: "Survolez une porte pour l'ouvrir, cliquez pour entrer.",
    doorsHintTouch: "Touchez une porte pour l'ouvrir, touchez encore pour entrer.",
    open: 'Ouvrir',
    tapAgain: 'Touchez encore pour entrer',
    pullCord: 'Tirez la cordelette pour allumer la lumière',
    shortCall: 'Appeler',
    shortEmail: 'E-mail',
    shortPortfolio: 'Portfolio',
    langSwitch: 'Switch to English',
    photoAlt: 'Ramoul Chouaib Taki Eddine',
    avatarAlt: 'Photo de profil de Chouaib Ramoul',
    description:
      'Ramoul Chouaib Taki Eddine, développeur Full-Stack et spécialiste cybersécurité. Je crée des applications web et mobiles et je sécurise les systèmes et les réseaux sur lesquels elles reposent. Basé en Algérie.',
  },
  en: {
    eyebrow: "Hi, I'm",
    title: 'Full-Stack Developer & Cybersecurity Specialist',
    badge: 'Master 2 · Network & Security',
    location: 'Constantine, Algeria',
    doorsTitle: 'Pick a door',
    doorsHintMouse: 'Hover a door to open it, click to enter.',
    doorsHintTouch: 'Tap a door to open it, tap again to enter.',
    open: 'Open',
    tapAgain: 'Tap again to enter',
    pullCord: 'Pull the cord to turn the light on',
    shortCall: 'Call',
    shortEmail: 'Email',
    shortPortfolio: 'Portfolio',
    langSwitch: 'Passer en français',
    photoAlt: 'Ramoul Chouaib Taki Eddine',
    avatarAlt: 'Profile photo of Chouaib Ramoul',
    description:
      'Ramoul Chouaib Taki Eddine, Full-Stack Developer and cybersecurity specialist. I build web and mobile apps, and I secure the systems and networks they run on. Based in Algeria.',
  },
} as const
