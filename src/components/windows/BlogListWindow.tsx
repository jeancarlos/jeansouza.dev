import { useLocale, useTranslations } from '../../i18n/react'
import type { Post } from '@/lib/posts'
import { pageUrl } from '@/lib/pages'
import { DIRECTORY_PERMISSIONS } from '@/lib/format'
import { useWindowOpener } from './WindowManager'
import { pageWindow } from './pageWindows'

export function BlogListWindow({ posts }: { posts: Post[] }) {
  const t = useTranslations('blog')
  const locale = useLocale()
  const opener = useWindowOpener()
  return (
    <div className="text-brand-text space-y-4 p-6">
      <h1 className="sr-only">{t('title')}</h1>
      <p className="text-brand-muted mb-4 text-xs" aria-hidden="true">
        $ {t('command')}
      </p>
      {posts.length === 0 && (
        <p className="text-brand-muted text-sm">
          {DIRECTORY_PERMISSIONS} {t('empty')}
        </p>
      )}
      <ul className="space-y-4">
        {posts.map((post) => (
          <li key={post.slug}>
            <a
              href={pageUrl({ kind: 'post', post }, locale)}
              onClick={opener((origin) =>
                pageWindow({ kind: 'post', post }, locale, posts, origin)
              )}
              className="group border-brand-to hover:border-brand-from block border-l-2 py-2 pl-4 transition-colors"
            >
              <p className="text-brand-muted mb-1 font-mono text-xs">
                {DIRECTORY_PERMISSIONS} <time dateTime={post.date}>{post.date}</time>
              </p>
              <h2 className="font-display text-brand-text group-hover:text-brand-from font-bold transition-colors">
                {post.title}
              </h2>
              <p className="text-brand-muted mt-1 text-sm leading-relaxed">{post.description}</p>
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
