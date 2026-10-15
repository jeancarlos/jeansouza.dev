import { useId, type MouseEvent } from 'react'
import { COVER_SIZE } from '@/lib/coverSize'
import type { Post, PostHeading } from '@/lib/posts'
import { pageUrl } from '@/lib/pages'
import { LanguageNotice } from './LanguageNotice'
import { Timeline } from '@/components/ui/Timeline'
import { useTranslations } from '../../i18n/react'

function scrollToHeading(e: MouseEvent<HTMLAnchorElement>, slug: string) {
  const target = document.getElementById(slug)
  if (!target) return
  e.preventDefault()
  target.scrollIntoView({ block: 'start' })
}

function TableOfContents({ headings }: { headings: PostHeading[] }) {
  const t = useTranslations('blog')
  const titleId = useId()
  return (
    <nav aria-labelledby={titleId} className="border-surface not-prose my-6 rounded-xl border p-4">
      <p id={titleId} className="text-brand-muted mb-2 font-mono text-xs">
        {t('toc')}
      </p>
      <ol className="space-y-1 text-sm">
        {headings.map((h) => (
          <li key={h.slug} className={h.depth === 3 ? 'pl-4' : undefined}>
            <a
              href={`#${h.slug}`}
              onClick={(e) => scrollToHeading(e, h.slug)}
              className="text-brand-text hover:text-brand-from underline-offset-2 hover:underline"
            >
              {h.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}

export function BlogPostWindow({ post }: { post: Post }) {
  return (
    <div className="text-text @container">
      <LanguageNotice
        available={post.locales}
        hrefFor={(locale) => pageUrl({ kind: 'post', post }, locale)}
      />
      <img
        src={post.cover.src}
        srcSet={post.cover.srcSet}
        sizes="(min-width: 1072px) 1024px, 100vw"
        {...COVER_SIZE}
        alt={post.cover.alt}
        fetchPriority="high"
        className="block h-auto w-full @min-[800px]:h-80 @min-[800px]:object-cover @min-[800px]:object-[50%_10%]"
      />
      <div className="mx-auto max-w-3xl p-6">
        <p className="text-brand-muted mb-4 truncate font-mono text-xs">$ cat {post.slug}.md</p>
        <article className="prose dark:prose-invert font-reading max-w-none">
          <h1 className="font-display text-brand-text">{post.title}</h1>
          <p className="text-brand-muted -mt-4 mb-4 font-mono text-xs">
            <time dateTime={post.date}>{post.date}</time>
          </p>
          {post.toc.length > 1 && <TableOfContents headings={post.toc} />}
          {post.body.map((part, i) =>
            'html' in part ? (
              <div key={i} dangerouslySetInnerHTML={{ __html: part.html }} />
            ) : (
              <Timeline key={i} entries={part.timeline} />
            )
          )}
        </article>
      </div>
    </div>
  )
}
