import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { IBM_Plex_Mono, Outfit } from 'next/font/google'
import './globals.css'
import { SiteHeader } from '@/components/site/site-header'
import { SiteFooter } from '@/components/site/site-footer'
import { WhatsAppFloat } from '@/components/site/whatsapp-float'
import { MotionProvider } from '@/components/motion/primitives'
import { Tracking } from '@/components/analytics/tracking'
import { StraddleTicker } from '@/components/site/straddle-ticker'
import { SITE } from '@/lib/site'

const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' })
const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-plex-mono',
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE.domain),
  title: {
    default: 'The Trader Foundry — FIT Funded Indian Trader Program, Pune',
    template: '%s | The Trader Foundry',
  },
  description: SITE.heroSub,
  icons: {
    icon: '/images/logo-tf.png',
    apple: '/images/logo-tf.png',
  },
  openGraph: {
    title: 'The Trader Foundry',
    description: SITE.tagline,
    url: SITE.domain,
    siteName: SITE.name,
    type: 'website',
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#1b1c21',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${outfit.variable} ${plexMono.variable} bg-charcoal`}>
      <body className="font-sans antialiased">
        <MotionProvider>
          <SiteHeader />
          {/* Moving straddle watch strip, just below the (sticky) header. */}
          <StraddleTicker />
          <main>{children}</main>
          <SiteFooter />
          <WhatsAppFloat />
        </MotionProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
        <Tracking />
      </body>
    </html>
  )
}
