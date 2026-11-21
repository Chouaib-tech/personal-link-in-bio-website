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

export const GREETINGS = [
  { text: 'Hello', lang: 'en', dir: 'ltr' },
  { text: 'Salut', lang: 'fr', dir: 'ltr' },
  { text: 'مرحبا', lang: 'ar', dir: 'rtl' },
] as const

export const COPY = {
  fr: {
    welcome: 'Bienvenue ! Construisons quelque chose de grand ensemble.',
    title: 'Développeur Full-Stack & Spécialiste Cybersécurité',
    badge: 'Master 2 · Réseaux & Sécurité',
    pitch:
      "Je conçois et développe des produits web et mobiles sécurisés et performants, de l'interface à l'infrastructure.",
    chips: ['Full-Stack', 'Mobile', 'Cybersécurité', 'Réseaux'],
    doorsTitle: 'Entrer en contact',
    open: 'Ouvrir',
    tapAgain: 'Touchez encore pour entrer',
    pullCord: 'Tirez la cordelette pour allumer la lumière',
    shortCall: 'Appeler',
    shortEmail: 'E-mail',
    shortPortfolio: 'Portfolio',
    langSwitch: 'Switch to English',
    photoAlt: 'Portrait de Chouaib Ramoul qui fait un signe de la main',
    avatarAlt: 'Photo de profil de Chouaib Ramoul',
    description:
      'Développeur Full-Stack (web & mobile) et spécialiste cybersécurité, Master 2 Réseaux & Sécurité. Basé en Algérie.',
  },
  en: {
    welcome: "Welcome! Let's build something great together.",
    title: 'Full-Stack Developer & Cybersecurity Specialist',
    badge: 'Master 2 · Network & Security',
    pitch:
      'I design and build secure, high-performance web and mobile products, from the interface to the infrastructure.',
    chips: ['Full-Stack', 'Mobile', 'Cybersecurity', 'Networks'],
    doorsTitle: 'Get in touch',
    open: 'Open',
    tapAgain: 'Tap again to enter',
    pullCord: 'Pull the cord to turn the light on',
    shortCall: 'Call',
    shortEmail: 'Email',
    shortPortfolio: 'Portfolio',
    langSwitch: 'Passer en français',
    photoAlt: 'Portrait of Chouaib Ramoul waving hello',
    avatarAlt: 'Profile photo of Chouaib Ramoul',
    description:
      'Full-Stack Developer (web & mobile) and cybersecurity specialist with a Master 2 in Network & Security. Based in Algeria.',
  },
} as const
