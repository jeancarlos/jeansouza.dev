'use client'
import { useTranslations } from 'next-intl'
import type { Post } from '@/lib/posts'
import type { ButtonOrigin } from '@/components/windows/WindowManager'
import { DIRECTORY_PERMISSIONS } from '@/lib/format'

interface Props {
  posts: Post[]
  onOpenPost: (post: Post, origin: ButtonOrigin) => void
}

export function BlogListWindow({ posts, onOpenPost }: Props) {
  const t = useTranslations('blog')
  return (
    <div className="text-brand-text space-y-4 p-6">
      <p className="text-brand-to mb-4 text-xs">$ ls posts/</p>
      {posts.length === 0 && (
        <p className="text-brand-to text-sm">
          {DIRECTORY_PERMISSIONS} {t('empty')}
        </p>
      )}
      {posts.map((post) => (
        <button
          key={post.slug}
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect()
            onOpenPost(post, { x: rect.left, y: rect.top, width: rect.width, height: rect.height })
          }}
          className="group border-brand-to hover:border-brand-from block w-full cursor-pointer border-l-2 py-2 pl-4 text-left transition-colors"
        >
          <p className="text-brand-to mb-1 font-mono text-xs">
            {DIRECTORY_PERMISSIONS} {post.date}
          </p>
          <p className="font-display text-brand-text group-hover:text-brand-from font-bold transition-colors">
            {post.title}
          </p>
          <p className="text-brand-to mt-1 text-sm leading-relaxed">{post.description}</p>
        </button>
      ))}
    </div>
  )
}
