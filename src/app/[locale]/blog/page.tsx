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
  const t = await getTranslations({ locale, namespace: 'nav' })
  return {
    title: `Jean Souza - ${t('blog')}`,
    alternates: {
      canonical: `https://jeansouza.dev/${locale}/blog/`,
      languages: {
        'pt-BR': 'https://jeansouza.dev/pt/blog/',
        'en-US': 'https://jeansouza.dev/en/blog/',
      },
    },
  }
}

export default async function BlogPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const posts = getAllPostsWithContent(locale as 'pt' | 'en')

  return (
    <WindowManagerProvider>
      <HomeClient posts={posts} locale={locale as 'pt' | 'en'} initialOpen="blog" />
    </WindowManagerProvider>
  )
}
