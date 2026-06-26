import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import CookieBanner from '@/components/CookieBanner'
import SwRegister from '@/components/SwRegister'

export const metadata: Metadata = {
  title: 'Strudl Partner',
  description: 'Café loyalty platform for independent cafés in Vienna.',
  icons: { icon: '/strudl-partner/icon-192.png', apple: '/strudl-partner/icon-192.png' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#1A1815" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Strudl Partner" />
        <link rel="manifest" href="/strudl-partner/manifest.json" />
        <link rel="apple-touch-icon" href="/strudl-partner/icon-192.png" />
      </head>
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
        <CookieBanner />
        <SwRegister />
      </body>
    </html>
  )
}
