import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getAllPostsWithContent, getAllSlugs } from '@/lib/posts'
import { routing } from '@/i18n/routing'
import { setRequestLocale } from 'next-intl/server'
import { HomeClient } from '@/components/HomeClient'
import { WindowManagerProvider } from '@/components/windows/WindowManager'

type Props = { params: Promise<{ locale: string; slug: string }> }

export async function generateStaticParams() {
  const slugs = getAllSlugs()
  return routing.locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  const posts = await getAllPostsWithContent(locale as 'pt' | 'en')
  const post = posts.find((p) => p.slug === slug)
  if (!post) return {}
  return {
    title: `${post.title} — Jean Souza`,
    description: post.description,
    alternates: {
      languages: {
        'pt-BR': `https://jeansouza.dev/pt/blog/${slug}/`,
        'en-US': `https://jeansouza.dev/en/blog/${slug}/`,
      },
    },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `https://jeansouza.dev/${locale}/blog/${slug}/`,
      type: 'article',
    },
  }
}

export default async function PostPage({ params }: Props) {
  const { locale, slug } = await params
  setRequestLocale(locale)
  const posts = await getAllPostsWithContent(locale as 'pt' | 'en')
  const initialPost = posts.find((p) => p.slug === slug)
  if (!initialPost) notFound()

  return (
    <WindowManagerProvider>
      <HomeClient posts={posts} locale={locale as 'pt' | 'en'} initialPost={initialPost} />
    </WindowManagerProvider>
  )
}
