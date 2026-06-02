import { getAllPostsWithContent } from '@/lib/posts'
import { HomeClient } from '@/components/HomeClient'
import { routing } from '@/i18n/routing'
import { setRequestLocale } from 'next-intl/server'

type Props = { params: Promise<{ locale: string }> }

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const posts = await getAllPostsWithContent(locale as 'pt' | 'en')
  return <HomeClient posts={posts} />
}
