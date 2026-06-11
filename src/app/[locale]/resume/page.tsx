import { getAllPostsWithContent } from '@/lib/posts'
import { HomeClient } from '@/components/HomeClient'
import { WindowManagerProvider } from '@/components/windows/WindowManager'
import { routing } from '@/i18n/routing'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ locale: string }>
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'resume' })

  return {
    title: `Jean Souza - ${t('title')}`,
    alternates: {
      canonical: `https://jeansouza.dev/${locale}/resume/`,
      languages: {
        'pt-BR': 'https://jeansouza.dev/pt/resume/',
        'en-US': 'https://jeansouza.dev/en/resume/',
      },
    },
  }
}

export default async function ResumePage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const posts = getAllPostsWithContent(locale as 'pt' | 'en')
  return (
    <WindowManagerProvider>
      <HomeClient posts={posts} locale={locale as 'pt' | 'en'} initialOpen="resume" />
    </WindowManagerProvider>
  )
}
