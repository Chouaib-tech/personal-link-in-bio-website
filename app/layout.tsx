import type { Metadata, Viewport } from 'next'
import { Plus_Jakarta_Sans, Playfair_Display } from 'next/font/google'
import { COPY } from '@/lib/content'
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
  weight: '600',
  display: 'swap',
  variable: '--font-display',
})

const TITLE = 'Chouaib Ramoul - Full-Stack Developer'
const DESCRIPTION = COPY.en.description
const ogImage = {
  url: IMAGES.og,
  width: IMAGES.ogSize.width,
  height: IMAGES.ogSize.height,
  alt: COPY.en.photoAlt,
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  keywords: ['Full-Stack Developer', 'Cybersecurity', 'Mobile Developer', 'Network & Security', 'Chouaib Ramoul', 'Algeria'],
  authors: [{ name: 'Chouaib Ramoul' }],
  creator: 'Chouaib Ramoul',
  alternates: { canonical: '/' },
  icons: { icon: IMAGES.avatar, apple: IMAGES.avatar },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: '/',
    siteName: 'Chouaib Ramoul',
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
      <body>{children}</body>
    </html>
  )
}
