import { getAllPostsWithContent } from '@/lib/posts'
import { HomeClient } from '@/components/HomeClient'
import { WindowManagerProvider } from '@/components/windows/WindowManager'
import { routing } from '@/i18n/routing'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Metadata } from 'next'

type Props = { params: Promise<{ locale: string }> }

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'hero' })

  return {
    title: 'Jean Souza - Senior Front-End Engineer',
    description: t('role'),
    alternates: {
      canonical: `https://jeansouza.dev/${locale}/`,
      languages: {
        'pt-BR': 'https://jeansouza.dev/pt/',
        'en-US': 'https://jeansouza.dev/en/',
      },
    },
  }
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const posts = await getAllPostsWithContent(locale as 'pt' | 'en')
  return (
    <WindowManagerProvider>
      <HomeClient posts={posts} locale={locale as 'pt' | 'en'} />
    </WindowManagerProvider>
  )
}
