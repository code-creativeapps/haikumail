import type { Metadata } from 'next'
import { DESCRIPTION, SITE_NAME, SITE_URL, TAGLINE } from '@/lib/site'
import './globals.css'

export const metadata: Metadata = {
  // Without this, relative Open Graph and canonical URLs resolve against
  // whatever host built the page — which on a preview deploy means shipping
  // vercel.app URLs into the tags that decide how the site is shared.
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — ${TAGLINE}`,
    template: `%s — ${SITE_NAME}`,
  },
  description: DESCRIPTION,
  applicationName: SITE_NAME,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    locale: 'en_GB',
    url: '/',
    title: `${SITE_NAME} — ${TAGLINE}`,
    description: DESCRIPTION,
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
