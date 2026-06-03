import type { EducationEntry } from '@/content/resume/education'

interface Props {
  entries: EducationEntry[]
  locale: 'pt' | 'en'
}

export function Education({ entries, locale }: Props) {
  return (
    <ul className="space-y-4">
      {entries.map((entry) => (
        <li key={entry.id} className="border-surface bg-base/60 border p-5 backdrop-blur-sm">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h3 className="font-display text-text font-bold">{entry.institution}</h3>
            <span className="text-brand-text font-mono text-sm">▸ {entry.period[locale]}</span>
          </div>
          <p className="text-subtext mt-1 text-sm">{entry.degree[locale]}</p>
          {entry.description && (
            <p className="text-subtext mt-2 text-sm leading-relaxed">{entry.description[locale]}</p>
          )}
        </li>
      ))}
    </ul>
  )
}
