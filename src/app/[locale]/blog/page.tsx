import { getAllPostsWithContent } from '@/lib/posts'
import { HomeClient } from '@/components/HomeClient'
import { WindowManagerProvider } from '@/components/windows/WindowManager'
import { setRequestLocale } from 'next-intl/server'

type Props = { params: Promise<{ locale: string }> }

export function generateStaticParams() {
  return [{ locale: 'pt' }, { locale: 'en' }]
}

export default async function BlogPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const posts = await getAllPostsWithContent(locale as 'pt' | 'en')

  return (
    <WindowManagerProvider>
      <HomeClient posts={posts} locale={locale as 'pt' | 'en'} initialOpen="blog" />
    </WindowManagerProvider>
  )
}
