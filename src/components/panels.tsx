import { LocaleProvider } from '../i18n/react'
import type { Locale } from '../i18n/t'
import { BlogPostWindow } from './windows/BlogPostWindow'
import { MoreLinksWindow } from './windows/MoreLinksWindow'
import { Resume } from './sections/Resume'
import type { Profile } from '@/content/resume/profile'
import type { EducationEntry } from '@/content/resume/education'
import type { TimelineEntry } from '@/content/resume/timeline'
import type { CurriculoAsset } from '@/lib/curriculo-assets'

/**
 * Astro renders each React component in isolation, so context does not cross
 * component boundaries the way it does inside one React tree. Each panel
 * therefore carries its own provider.
 *
 * These are rendered without a client: directive — Astro turns them into HTML
 * at build time and they ship no JavaScript.
 */

export function BlogPostPanel({
  locale,
  slug,
  title,
  date,
  content,
}: {
  locale: Locale
  slug: string
  title: string
  date: string
  content: string
}) {
  return (
    <LocaleProvider locale={locale}>
      <BlogPostWindow slug={slug} title={title} date={date} content={content} />
    </LocaleProvider>
  )
}

export function MorePanel({ locale }: { locale: Locale }) {
  return (
    <LocaleProvider locale={locale}>
      <MoreLinksWindow />
    </LocaleProvider>
  )
}

export function ResumePanel({
  locale,
  entries,
  profile,
  education,
  assets,
}: {
  locale: Locale
  entries: TimelineEntry[]
  profile: Profile
  education: EducationEntry[]
  assets: CurriculoAsset[]
}) {
  return (
    <LocaleProvider locale={locale}>
      <Resume
        entries={entries}
        profile={profile}
        education={education}
        assets={assets}
        locale={locale}
      />
    </LocaleProvider>
  )
}
