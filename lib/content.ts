export type Lang = 'fr' | 'en'

export const PERSON = {
  displayName: 'Chouaib Ramoul',
  firstName: 'Chouaib Taki Eddine',
  lastName: 'Ramoul',
  phone: '+213558638939',
  phoneDisplay: '+213 558 63 89 39',
  email: 'chouaib-takieddine.ramoul@univ-annaba.dz',
  country: 'Algeria',
} as const

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
  { text: 'Hello 👋', lang: 'en', dir: 'ltr' },
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
    save: 'Enregistrer le contact',
    whatsapp: 'Écrire sur WhatsApp',
    call: 'Appeler',
    email: 'E-mail',
    portfolio: 'Voir mon portfolio',
    followMe: 'Retrouvez-moi',
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
    save: 'Save contact',
    whatsapp: 'Chat on WhatsApp',
    call: 'Call me',
    email: 'Email',
    portfolio: 'View my portfolio',
    followMe: 'Find me online',
    langSwitch: 'Passer en français',
    photoAlt: 'Portrait of Chouaib Ramoul waving hello',
    avatarAlt: 'Profile photo of Chouaib Ramoul',
    description:
      'Full-Stack Developer (web & mobile) and cybersecurity specialist with a Master 2 in Network & Security. Based in Algeria.',
  },
} as const

const esc = (s: string) => s.replace(/([,;\\])/g, '\\$1')

export function buildVCard(lang: Lang): string {
  const c = COPY[lang]
  const social: [string, string][] = [
    ['LinkedIn', LINKS.linkedin],
    ['GitHub', LINKS.github],
    ['Telegram', LINKS.telegram],
    ['Instagram', LINKS.instagram],
    ['Facebook', LINKS.facebook],
    ['WhatsApp', LINKS.whatsapp],
  ]
  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `N:${esc(PERSON.lastName)};${esc(PERSON.firstName)};;;`,
    `FN:${esc(PERSON.displayName)}`,
    `TITLE:${esc(c.title)}`,
    `TEL;TYPE=CELL,VOICE:${PERSON.phone}`,
    `EMAIL;TYPE=INTERNET,WORK:${PERSON.email}`,
    `URL:${LINKS.portfolio}`,
    `ADR;TYPE=WORK:;;;;;;${PERSON.country}`,
  ]
  social.forEach(([label, url], i) => {
    lines.push(`item${i + 1}.URL:${url}`, `item${i + 1}.X-ABLabel:${label}`)
  })
  lines.push('END:VCARD')
  return lines.join('\r\n') + '\r\n'
}

export function downloadVCard(lang: Lang) {
  const blob = new Blob([buildVCard(lang)], { type: 'text/vcard;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'Chouaib-Ramoul.vcf'
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
