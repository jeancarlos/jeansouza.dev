import { useReveal } from '@/lib/useReveal'
import { joinClassNames } from '@/lib/utils'
import { getBulletsForEntry } from '@/content/resume/selection'
import type { TimelineEntry } from '@/content/resume/timeline'
import { TimelineDot, type ConnectorStyle } from './TimelineDot'

interface Props {
  entry: TimelineEntry
  locale: 'pt' | 'en'
  side: 'left' | 'right'
  connectorAbove: ConnectorStyle
  connectorBelow: ConnectorStyle
  isLast: boolean
}

export function TimelineItem({
  entry,
  locale,
  side,
  connectorAbove,
  connectorBelow,
  isLast,
}: Props) {
  const [ref, hidden] = useReveal<HTMLElement>()
  const bullets = getBulletsForEntry(entry)
  const offset = side === 'left' ? '-translate-x-10' : 'translate-x-10'

  return (
    <li className="grid grid-cols-[2rem_1fr] @4xl:grid-cols-[1fr_2rem_1fr]">
      <TimelineDot above={connectorAbove} below={connectorBelow} />
      <div
        className={joinClassNames(
          'col-start-2 row-start-1 flex min-w-0 flex-col gap-2 pl-2',
          !isLast && 'pb-10',
          side === 'left'
            ? '@4xl:col-start-1 @4xl:items-end @4xl:pr-6 @4xl:pl-0'
            : '@4xl:col-start-3 @4xl:pl-6'
        )}
      >
        <time
          className={joinClassNames(
            'font-mono text-xs leading-none tracking-widest text-[var(--color-brand-text,var(--color-brand-from))] uppercase',
            side === 'left' && '@4xl:text-right'
          )}
        >
          {entry.year[locale]}
        </time>
        <article
          ref={ref}
          data-side={side}
          className={joinClassNames(
            'border-surface w-full min-w-0 rounded-2xl border bg-[var(--button-inner-bg)] p-5 transition-[color,background-color,border-color,opacity,translate] duration-400 ease-out motion-reduce:transition-none',
            hidden && `opacity-0 ${offset}`
          )}
        >
          <header className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h3 className="font-display text-text min-w-0 font-bold [overflow-wrap:break-word] break-words hyphens-auto">
              {entry.role[locale]}
            </h3>
            <span className="text-subtext basis-full text-sm">
              @ {entry.company}
              {entry.location && (
                <span className="text-subtext ml-2">· {entry.location[locale]}</span>
              )}
            </span>
          </header>
          <ul className="text-subtext marker:text-brand-text mt-3 list-disc space-y-1 pl-5 text-sm leading-relaxed">
            {bullets.map((b, i) => (
              <li key={i}>{b[locale]}</li>
            ))}
          </ul>
        </article>
      </div>
    </li>
  )
}
