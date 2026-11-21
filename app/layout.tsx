import type { Metadata, Viewport } from 'next'
import { Plus_Jakarta_Sans, Playfair_Display } from 'next/font/google'
import { COPY, LINKS } from '@/lib/content'
import { IMAGES, SITE_URL } from '@/lib/images'
import { THEME_INIT_SCRIPT } from '@/lib/theme'
import './globals.css'

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jakarta',
})

const display = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '600'],
  display: 'swap',
  variable: '--font-display',
})

const NAME = 'Ramoul Chouaib Taki Eddine'
const TITLE = `${NAME} · Développeur Full-Stack & Cybersécurité`
const DESCRIPTION = COPY.fr.description // FR is the default language
const ogImage = {
  url: IMAGES.og,
  width: IMAGES.ogSize.width,
  height: IMAGES.ogSize.height,
  alt: COPY.fr.photoAlt,
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  keywords: ['Développeur Full-Stack', 'Cybersécurité', 'Ethical hacking', 'Développeur mobile', 'Sécurité réseaux', 'Full-Stack Developer', 'Cybersecurity', NAME, 'Chouaib Ramoul', 'Algérie'],
  authors: [{ name: NAME }],
  creator: NAME,
  alternates: { canonical: '/' },
  icons: { icon: IMAGES.avatar, apple: IMAGES.avatar },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: '/',
    siteName: NAME,
    type: 'website',
    locale: 'fr_FR',
    alternateLocale: ['en_US'],
    images: [ogImage],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    images: [IMAGES.og],
  },
  robots: { index: true, follow: true },
}

// Structured data. Deliberately no phone number or email here.
const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: NAME,
  alternateName: 'Chouaib Ramoul',
  jobTitle: COPY.en.title,
  url: SITE_URL,
  image: new URL(IMAGES.hero, SITE_URL).toString(),
  sameAs: [LINKS.linkedin, LINKS.github, LINKS.telegram, LINKS.instagram, LINKS.facebook],
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f0e7d6' },
    { media: '(prefers-color-scheme: dark)', color: '#101b17' },
  ],
  colorScheme: 'dark light',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" data-theme="dark" className={`${jakarta.variable} ${display.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD).replace(/</g, '\\u003c') }} />
        {children}
      </body>
    </html>
  )
}
