import type { Metadata, Viewport } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import { COPY } from '@/lib/content'
import { IMAGES, SITE_URL } from '@/lib/images'
import './globals.css'

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jakarta',
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
  themeColor: '#0E0E10',
  colorScheme: 'dark',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={jakarta.variable}>
      <body>{children}</body>
    </html>
  )
}
