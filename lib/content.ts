export type Lang = 'fr' | 'en'

export const LINKS = {
  whatsapp: 'https://wa.me/213558638939',
  call: 'tel:+213558638939',
  email: 'mailto:chouaibramoul.it@gmail.com',
  portfolio: 'https://ramoul-chouaib.vercel.app/',
  linkedin: 'https://www.linkedin.com/in/chouaib-ramoul25',
  github: 'https://github.com/Chouaib-tech',
  telegram: 'https://t.me/Chouaibtakieddine',
  instagram: 'https://instagram.com/chouaib._.ramoul',
  facebook: 'https://www.facebook.com/chouaib.ramoul.9',
} as const

// Write 1-2 sentences about me here (leave empty to hide the paragraph).
export const ABOUT_FR = ''
export const ABOUT_EN = ''

/** Desktop browsers often have no mail app for mailto:, so the email door opens Gmail compose there. */
export const GMAIL_COMPOSE = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(LINKS.email.replace('mailto:', ''))}`

export const COPY = {
  fr: {
    eyebrow: "Salut, moi c'est",
    title: 'Développeur Full-Stack & Spécialiste Cybersécurité',
    badge: 'Master 2 · Réseaux & Sécurité',
    location: 'Constantine, Algérie',
    doorsTitle: 'Choisissez une porte',
    doorsHintMouse: "Survolez une porte pour l'ouvrir, cliquez pour entrer.",
    doorsHintTouch: "Touchez une porte pour l'ouvrir, touchez encore pour entrer.",
    previewAlt: {
      whatsapp: 'Logo WhatsApp',
      call: "Icône d'appel téléphonique",
      email: 'Logo Gmail',
      portfolio: 'Aperçu de mon portfolio',
      linkedin: 'Aperçu de mon profil LinkedIn',
      github: 'Aperçu de mon profil GitHub',
      telegram: 'Logo Telegram',
      instagram: 'Aperçu de mon profil Instagram',
      facebook: 'Aperçu de mon profil Facebook',
    },
    open: 'Ouvrir',
    tapAgain: 'Touchez encore pour entrer',
    pullCord: 'Tirez la cordelette pour allumer la lumière',
    shortCall: 'Appeler',
    shortEmail: 'E-mail',
    shortPortfolio: 'Portfolio',
    langSwitch: 'Switch to English',
    photoAlt: 'Ramoul Chouaib Taki Eddine',
    avatarLabel: 'Dire bonjour',
    bubbles: ["Salut ! Moi c'est Chouaib", 'Ravi de vous rencontrer', 'Choisissez une porte, juste en dessous'],
    seeDoors: 'Voir les portes',
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
    previewAlt: {
      whatsapp: 'WhatsApp logo',
      call: 'Phone call icon',
      email: 'Gmail logo',
      portfolio: 'Preview of my portfolio',
      linkedin: 'Preview of my LinkedIn profile',
      github: 'Preview of my GitHub profile',
      telegram: 'Telegram logo',
      instagram: 'Preview of my Instagram profile',
      facebook: 'Preview of my Facebook profile',
    },
    open: 'Open',
    tapAgain: 'Tap again to enter',
    pullCord: 'Pull the cord to turn the light on',
    shortCall: 'Call',
    shortEmail: 'Email',
    shortPortfolio: 'Portfolio',
    langSwitch: 'Passer en français',
    photoAlt: 'Ramoul Chouaib Taki Eddine',
    avatarLabel: 'Say hi',
    bubbles: ["Hi! I'm Chouaib", 'Nice to meet you', 'Pick a door, just below'],
    seeDoors: 'See the doors',
    description:
      'Ramoul Chouaib Taki Eddine, Full-Stack Developer and cybersecurity specialist. I build web and mobile apps, and I secure the systems and networks they run on. Based in Algeria.',
  },
} as const
