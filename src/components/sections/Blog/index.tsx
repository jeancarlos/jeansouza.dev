'use client'
import { useTranslations } from 'next-intl'
import { BlogCard } from './BlogCard'
import { Section } from '@/components/layout/Section'
import type { PostMeta } from '@/lib/posts'

interface Props {
  posts: PostMeta[]
}

export function Blog({ posts }: Props) {
  const t = useTranslations('blog')

  return (
    <Section
      id="blog"
      bg="#1e1e2e"
      dotColor="#cba6f7"
      className="min-h-screen px-6 py-24"
      style={{
        backgroundImage: `repeating-linear-gradient(
          to bottom,
          transparent,
          transparent 31px,
          rgba(255,255,255,0.06) 31px,
          rgba(255,255,255,0.06) 32px
        )`,
      }}
    >
      <div className="relative z-10 mx-auto max-w-3xl">
        <p className="text-overlay mb-8 font-mono text-sm">$ {t('command')}</p>
        <div className="space-y-6">
          {posts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      </div>
    </Section>
  )
}
