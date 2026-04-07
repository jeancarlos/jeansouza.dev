import Link from 'next/link'
import type { Metadata } from 'next'
import { getPost, getAllSlugs } from '@/lib/posts'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const slugs = getAllSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)
  return {
    title: `${post.title} — Jean Souza`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      url: `https://jeansouza.dev/blog/${slug}/`,
      type: 'article',
    },
  }
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params
  const post = await getPost(slug)

  return (
    <div className="min-h-screen flex flex-col items-center py-16 px-6">
      <div className="w-full max-w-2xl">
        <Link
          href="/"
          className="text-brand-text opacity-60 hover:opacity-100 transition-opacity font-body font-normal text-sm mb-8 inline-block"
        >
          ← Jean Souza
        </Link>
        <article>
          <h1 className="bg-brand-gradient bg-clip-text text-transparent text-3xl font-bold mb-2">
            {post.title}
          </h1>
          <time className="block text-sm opacity-60 mb-8 font-body font-normal">
            {new Date(post.date + 'T12:00:00').toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
          {/* Author-controlled markdown content — no user input, no XSS risk */}
          <div
            className="prose prose-invert prose-pink max-w-none font-body font-normal"
            dangerouslySetInnerHTML={{ __html: post.contentHtml }}
          />
        </article>
      </div>
    </div>
  )
}
