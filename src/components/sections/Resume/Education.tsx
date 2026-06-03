import type { EducationEntry } from '@/content/resume/education'

interface Props {
  entries: EducationEntry[]
  locale: 'pt' | 'en'
}

export function Education({ entries, locale }: Props) {
  return (
    <ul className="space-y-4">
      {entries.map(entry => (
        <li
          key={entry.id}
          className="border border-latte-surface1 bg-latte-base/70 p-5 backdrop-blur-sm"
        >
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h3 className="font-display font-bold text-latte-text">
              {entry.institution}
            </h3>
            <span className="font-mono text-sm text-latte-blue">
              ▸ {entry.period[locale]}
            </span>
          </div>
          <p className="mt-1 text-sm text-latte-subtext">{entry.degree[locale]}</p>
          {entry.description && (
            <p className="mt-2 text-sm leading-relaxed text-latte-subtext">
              {entry.description[locale]}
            </p>
          )}
        </li>
      ))}
    </ul>
  )
}
