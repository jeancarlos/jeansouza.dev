import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getPost, getAllSlugs } from '@/lib/posts'
import { routing } from '@/i18n/routing'
import { setRequestLocale } from 'next-intl/server'

type Props = { params: Promise<{ locale: string; slug: string }> }

export async function generateStaticParams() {
  const slugs = getAllSlugs()
  return routing.locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  const post = await getPost(slug, locale as 'pt' | 'en')
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
  const post = await getPost(slug, locale as 'pt' | 'en')
  if (!post) notFound()

  return (
    <div className="flex min-h-screen flex-col items-center px-6 py-16">
      <div className="w-full max-w-2xl">
        <Link
          href={`/${locale}/blog`}
          className="text-text mb-8 inline-block text-sm font-normal opacity-60 transition-opacity hover:opacity-100"
        >
          ← cd ..
        </Link>
        <article>
          <h1 className="mb-2 bg-[linear-gradient(to_right,var(--color-mauve),var(--color-blue))] bg-clip-text text-3xl font-bold text-transparent">
            {post.title}
          </h1>
          <time className="mb-8 block text-sm font-normal opacity-60">
            {new Date(post.date + 'T12:00:00').toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
          {/* Author-controlled markdown content — no user input, no XSS risk */}
          <div
            className="prose prose-pink prose-invert max-w-none font-normal"
            dangerouslySetInnerHTML={{ __html: post.contentHtml }}
          />
        </article>
      </div>
    </div>
  )
}
