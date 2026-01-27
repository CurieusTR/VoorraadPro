import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: {
    default: 'VoorraadPro - Professioneel Voorraadbeheer',
    template: '%s | VoorraadPro',
  },
  description:
    'Professionele voorraadbeheer software voor voedingshandelaars en horeca. Beheer producten, voorraad, leveranciers en bestellingen.',
  keywords: [
    'voorraadbeheer',
    'inventory management',
    'voorraad software',
    'horeca',
    'handelaar',
    'stock management',
  ],
  authors: [{ name: 'VoorraadPro' }],
  creator: 'VoorraadPro',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/icons/apple-touch-icon.png',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#2563eb',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="nl" className={inter.variable}>
      <body className="font-sans antialiased bg-gray-50 text-gray-900">
        {children}
      </body>
    </html>
  )
}
