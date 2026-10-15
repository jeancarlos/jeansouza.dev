import type { EducationEntry } from '@/content/resume/education'

interface Props {
  entries: EducationEntry[]
  locale: 'pt' | 'en'
}

export function Education({ entries, locale }: Props) {
  return entries.map((entry) => (
    <section key={entry.id}>
      <h3>{entry.institution}</h3>
      <p className="text-brand-muted -mt-3 font-mono text-xs">
        {entry.period[locale]} · <span>{entry.degree[locale]}</span>
      </p>
      {entry.description && <p>{entry.description[locale]}</p>}
    </section>
  ))
}
