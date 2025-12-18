import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Ramoul Chouaib Taki Eddine | Software Engineer',
  description: 'Software Engineer | Cybersecurity & Mobile Developer. Secure • Elegant • Scalable Solutions',
  keywords: ['Software Engineer', 'Cybersecurity', 'Mobile Developer', 'Full Stack Developer', 'Ramoul Chouaib'],
  authors: [{ name: 'Ramoul Chouaib Taki Eddine' }],
  creator: 'Ramoul Chouaib Taki Eddine',
  openGraph: {
    title: 'Ramoul Chouaib Taki Eddine | Software Engineer',
    description: 'Software Engineer | Cybersecurity & Mobile Developer. Secure • Elegant • Scalable Solutions',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ramoul Chouaib Taki Eddine | Software Engineer',
    description: 'Software Engineer | Cybersecurity & Mobile Developer. Secure • Elegant • Scalable Solutions',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-cyber-bg">
        {children}
      </body>
    </html>
  )
}

