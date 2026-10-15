import { useLocale, useTranslations } from '../../i18n/react'
import type { Post } from '@/lib/posts'
import { pageUrl } from '@/lib/pages'
import { DIRECTORY_PERMISSIONS } from '@/lib/format'
import { THUMB_SIZE } from '@/lib/coverSize'
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
        {posts.map((post, i) => (
          <li key={post.slug}>
            <a
              href={pageUrl({ kind: 'post', post }, locale)}
              onClick={opener((origin) =>
                pageWindow({ kind: 'post', post }, locale, posts, origin)
              )}
              className={`group flex flex-col gap-4 sm:items-center ${i % 2 ? 'sm:flex-row-reverse' : 'sm:flex-row'}`}
            >
              <div className="from-brand-from to-brand-to shrink-0 rounded-xl bg-gradient-to-r p-[2px]">
                <img
                  src={post.thumb.src}
                  srcSet={post.thumb.srcSet}
                  sizes={`(min-width: 640px) ${THUMB_SIZE.width}px, calc(100vw - 56px)`}
                  {...THUMB_SIZE}
                  alt=""
                  loading={i === 0 ? 'eager' : 'lazy'}
                  fetchPriority={i === 0 ? 'high' : 'auto'}
                  className="block aspect-4/3 h-auto w-full rounded-[10px] sm:w-44"
                />
              </div>
              <div className="border-brand-to group-hover:border-brand-from min-w-0 flex-1 border-l-2 py-2 pl-4 transition-colors">
                <p className="text-brand-muted mb-1 font-mono text-xs">
                  {DIRECTORY_PERMISSIONS} <time dateTime={post.date}>{post.date}</time>
                </p>
                <h2 className="font-display text-brand-text group-hover:text-brand-from font-bold transition-colors">
                  {post.title}
                </h2>
                <p className="text-brand-muted font-reading mt-1 text-sm leading-relaxed">
                  {post.description}
                </p>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
