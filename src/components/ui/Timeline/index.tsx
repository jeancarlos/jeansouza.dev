export interface TimelineEntry {
  date: string
  title: string
  meta?: string
  items?: string[]
  dotted?: boolean
}

export function Timeline({ entries }: { entries: TimelineEntry[] }) {
  return (
    <ol className="timeline">
      {entries.map((entry, i) => (
        <li key={i} data-dotted={entry.dotted ? '' : undefined}>
          <p className="text-brand-muted font-mono text-xs">{entry.date}</p>
          <h3>{entry.title}</h3>
          {entry.meta && <p className="text-subtext font-mono text-xs">{entry.meta}</p>}
          {entry.items && entry.items.length > 0 && (
            <ul>
              {entry.items.map((item, j) => (
                <li key={j}>{item}</li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ol>
  )
}
