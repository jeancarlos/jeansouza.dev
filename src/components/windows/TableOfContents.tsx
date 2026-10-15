import { useId, type MouseEvent } from 'react'
import type { PostHeading } from '@/lib/posts'
import { useTranslations } from '../../i18n/react'

function scrollToHeading(e: MouseEvent<HTMLAnchorElement>, slug: string) {
  const target = document.getElementById(slug)
  if (!target) return
  e.preventDefault()
  target.scrollIntoView({ block: 'start' })
}

function TocLinks({ headings }: { headings: PostHeading[] }) {
  return (
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
  )
}

export function TocSidebar({ headings }: { headings: PostHeading[] }) {
  const t = useTranslations('blog')
  const titleId = useId()
  return (
    <nav
      aria-labelledby={titleId}
      className="font-reading sticky top-24 hidden max-h-[70vh] self-start overflow-y-auto @min-[900px]:block"
    >
      <p id={titleId} className="text-brand-muted mb-2 font-mono text-xs">
        {t('toc')}
      </p>
      <TocLinks headings={headings} />
    </nav>
  )
}

export function TocDisclosure({ headings }: { headings: PostHeading[] }) {
  const t = useTranslations('blog')
  return (
    <details className="border-surface not-prose my-6 rounded-xl border p-4 @min-[900px]:hidden">
      <summary className="text-brand-muted cursor-pointer font-mono text-xs">{t('toc')}</summary>
      <nav aria-label={t('toc')} className="mt-2">
        <TocLinks headings={headings} />
      </nav>
    </details>
  )
}
