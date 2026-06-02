'use client'
import { useTranslations } from 'next-intl'
import { TimelineItem } from './TimelineItem'
import { BlueprintGrid } from './BlueprintGrid'
import { Section } from '@/components/layout/Section'
import type { TimelineEntry } from '@/content/resume/timeline'

interface Props {
  entries: TimelineEntry[]
  locale: 'pt' | 'en'
}

export function Resume({ entries, locale }: Props) {
  const t = useTranslations('resume')

  return (
    <Section
      id="resume"
      bg="#eff1f5"
      mode="grid"
      dotColor="#1e66f5"
      className="relative min-h-screen px-6 py-24"
    >
      <BlueprintGrid />
      <div className="relative z-10 mx-auto max-w-3xl">
        <p className="text-latte-subtext mb-8 font-mono text-sm">$ {t('command')}</p>
        <div className="space-y-4">
          {entries.map((entry, i) => (
            <TimelineItem key={entry.id} entry={entry} locale={locale} index={i} />
          ))}
        </div>
      </div>
    </Section>
  )
}
