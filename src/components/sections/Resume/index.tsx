'use client'
import { useTranslations } from 'next-intl'
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
      <h2 className="text-brand-text mb-6 font-mono text-xs tracking-widest uppercase">{title}</h2>
      {children}
    </section>
  )
}

export function Resume({ entries, profile, education, assets, locale }: Props) {
  const t = useTranslations('resume')

  return (
    <div className="min-h-full p-6">
      <div className="mx-auto max-w-5xl">
        <p className="text-subtext mb-8 font-mono text-sm">{t('command')}</p>
        <Header profile={profile} locale={locale} />
        <Summary profile={profile} locale={locale} />
        <Section title={t('experience')}>
          <div className="@container">
            <ul className="relative grid grid-cols-[auto_1fr] gap-x-4 gap-y-6 @4xl:grid-cols-[1fr_auto_1fr] @4xl:gap-x-8">
              <TimelineRail />
              {entries.map((entry, i) => {
                const side = i % 2 === 0 ? 'left' : 'right'
                return (
                  <TimelineItem
                    key={entry.id}
                    entry={entry}
                    locale={locale}
                    side={side}
                    index={i}
                  />
                )
              })}
            </ul>
          </div>
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
