import type { Metadata } from 'next'
import { Poppins, Roboto } from 'next/font/google'
import '@fortawesome/fontawesome-free/css/all.min.css'
import '@/styles/globals.css'

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
  title: 'Jean Souza - Front-End Engineer',
  description: 'Specialist in technologies for the creation of web applications.',
  metadataBase: new URL('https://jeansouza.dev'),
  openGraph: {
    title: 'Jean Souza - Front-End Engineer',
    description: 'Specialist in technologies for the creation of web applications.',
    url: 'https://jeansouza.dev',
    siteName: 'Jean Souza',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${poppins.variable} ${roboto.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  )
}
