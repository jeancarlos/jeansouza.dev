'use client'
import { useTranslations } from 'next-intl'
import { BlogCard } from './BlogCard'
import type { PostMeta } from '@/lib/posts'

interface Props {
  posts: PostMeta[]
}

export function Blog({ posts }: Props) {
  const t = useTranslations('blog')

  return (
    <div className="min-h-full px-6 py-24">
      <div className="mx-auto max-w-3xl">
        <p className="text-overlay mb-8 font-mono text-sm">$ {t('command')}</p>
        <div className="space-y-6">
          {posts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      </div>
    </div>
  )
}
