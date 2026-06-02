'use client'
import { useTranslations } from 'next-intl'
import { TimelineItem } from './TimelineItem'
import type { TimelineEntry } from '@/content/resume/timeline'

interface Props {
  entries: TimelineEntry[]
  locale: 'pt' | 'en'
}

export function Resume({ entries, locale }: Props) {
  const t = useTranslations('resume')

  return (
    <div className="min-h-full px-6 py-24">
      <div className="mx-auto max-w-3xl">
        <p className="text-latte-subtext mb-8 font-mono text-sm">$ {t('command')}</p>
        <div className="space-y-4">
          {entries.map((entry, i) => (
            <TimelineItem key={entry.id} entry={entry} locale={locale} index={i} />
          ))}
        </div>
      </div>
    </div>
  )
}
