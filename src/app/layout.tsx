import type { Metadata } from 'next'
import { Poppins, Roboto } from 'next/font/google'
import '@fortawesome/fontawesome-free/css/all.min.css'
import '@/styles/globals.css'
import { DotBackground } from '@/components/DotBackground'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['500', '700'],
  variable: '--font-poppins',
  display: 'swap',
})

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  variable: '--font-roboto',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Jean Souza - Senior Front-End Engineer',
  description:
    '15 years shipping web interfaces — from jQuery to React 19. Senior Front-End Engineer with a DevOps edge: React, Next.js, TypeScript, Docker, and a homelab with 3 years of uptime.',
  metadataBase: new URL('https://jeansouza.dev'),
  openGraph: {
    title: 'Jean Souza - Senior Front-End Engineer',
    description:
      '15 years shipping web interfaces — from jQuery to React 19. React · Next.js · TypeScript · DevOps.',
    url: 'https://jeansouza.dev',
    siteName: 'Jean Souza',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${poppins.variable} ${roboto.variable}`}>
      <body className="font-sans">
        <DotBackground />
        {children}
      </body>
    </html>
  )
}
