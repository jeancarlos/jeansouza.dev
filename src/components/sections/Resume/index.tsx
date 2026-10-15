import { useTranslations } from '../../../i18n/react'
import { Header } from './Header'
import { Summary } from './Summary'
import { Education } from './Education'
import { Languages } from './Languages'
import { Downloads } from './Downloads'
import { Timeline } from '@/components/ui/Timeline'
import { getBulletsForEntry } from '@/content/resume/selection'
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

function experience(entries: TimelineEntry[], locale: 'pt' | 'en') {
  return entries.map((entry, i) => ({
    date: entry.year[locale],
    title: entry.role[locale],
    meta: entry.location ? `@ ${entry.company} · ${entry.location[locale]}` : `@ ${entry.company}`,
    items: getBulletsForEntry(entry).map((b) => b[locale]),
    dotted: entries[i + 1]?.careerStart,
  }))
}

export function Resume({ entries, profile, education, assets, locale }: Props) {
  const t = useTranslations('resume')

  return (
    <div className="text-text mx-auto max-w-prose p-6">
      <p className="text-brand-muted mb-4 truncate font-mono text-xs">{t('command')}</p>
      <article className="prose dark:prose-invert font-reading">
        <Header profile={profile} locale={locale} />
        <Summary profile={profile} locale={locale} />
        <h2>{t('experience')}</h2>
        <Timeline entries={experience(entries, locale)} />
        <h2>{t('education')}</h2>
        <Education entries={education} locale={locale} />
        <h2>{t('languages')}</h2>
        <Languages value={profile.languages[locale]} />
        <Downloads assets={assets} locale={locale} />
      </article>
    </div>
  )
}
