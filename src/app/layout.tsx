import type { Metadata } from 'next'
import Script from 'next/script'
import { Poppins, Space_Grotesk, JetBrains_Mono } from 'next/font/google'
import '@/styles/globals.css'
import { DotBackground } from '@/components/DotBackground'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['500', '700'],
  variable: '--font-poppins',
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
})

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  title: 'Jean Souza - Senior Front-End Engineer',
  description:
    '15 years shipping web interfaces — from jQuery to React 19. Senior Front-End Engineer with a DevOps edge: React, Next.js, TypeScript, Docker, and a homelab with 3 years of uptime.',
  metadataBase: new URL('https://jeansouza.dev'),
  openGraph: {
    title: 'Jean Souza - Senior Front-End Engineer',
    description: '15 years shipping web interfaces — from jQuery to React 19.',
    url: 'https://jeansouza.dev',
    siteName: 'Jean Souza',
    type: 'website',
  },
  icons: {
    icon: '/favicon.svg',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="pt"
      className={`${poppins.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body className="font-sans">
        <Script id="theme-init" strategy="beforeInteractive" src="/theme-init.js" />
        <DotBackground />
        {children}
      </body>
    </html>
  )
}
