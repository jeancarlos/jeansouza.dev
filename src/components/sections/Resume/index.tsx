'use client'
import { useTranslations } from 'next-intl'
import { useMediaQuery } from '@/lib/use-media-query'
import { Header } from './Header'
import { Summary } from './Summary'
import { TimelineRail } from './TimelineRail'
import { TimelineItem } from './TimelineItem'
import { Education } from './Education'
import { Languages } from './Languages'
import { Downloads } from './Downloads'
import type { Profile } from '@/content/resume/profile'
import type { EducationEntry } from '@/content/resume/education'
import type { TimelineEntry } from '@/content/resume/timeline'
import type { CurriculoAsset } from '@/lib/curriculo-assets'

interface Props {
  entries: TimelineEntry[]
  profile: Profile
  education: EducationEntry[]
  assets: CurriculoAsset[]
  locale: 'pt' | 'en'
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-12">
      <h2 className="mb-6 font-mono text-xs uppercase tracking-widest text-latte-blue">
        {title}
      </h2>
      {children}
    </section>
  )
}

export function Resume({ entries, profile, education, assets, locale }: Props) {
  const t = useTranslations('resume')
  const isWide = useMediaQuery('(min-width: 768px)')

  return (
    <div className="min-h-full px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <p className="mb-8 font-mono text-sm text-latte-subtext">$ {t('command')}</p>
        <Header profile={profile} locale={locale} />
        <Summary profile={profile} locale={locale} />
        <Section title={t('experience')}>
          <ul className="relative grid grid-cols-[1fr_auto_1fr] gap-x-8
                         max-md:grid-cols-[auto_1fr] max-md:gap-x-4">
            <TimelineRail />
            {entries.map((entry, i) => (
              <TimelineItem
                key={entry.id}
                entry={entry}
                locale={locale}
                side={isWide ? (i % 2 === 0 ? 'left' : 'right') : 'right'}
                index={i}
              />
            ))}
          </ul>
        </Section>
        <Section title={t('education')}>
          <Education entries={education} locale={locale} />
        </Section>
        <Section title={t('languages')}>
          <Languages value={profile.languages[locale]} />
        </Section>
        <Downloads assets={assets} locale={locale} />
      </div>
    </div>
  )
}
