'use client'
import { motion, useReducedMotion } from 'framer-motion'
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
  const reduce = useReducedMotion()
  const bullets = getBulletsForEntry(entry)
  const initialTranslation = side === 'left' ? -40 : 40
  const translateX = reduce ? 0 : initialTranslation

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
        <motion.article
          data-side={side}
          className="border-surface w-full min-w-0 rounded-2xl border bg-[var(--button-inner-bg)] p-5 transition-colors"
          initial={{ opacity: 0, x: translateX }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          <header className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h3 className="font-display text-text min-w-0 font-bold [overflow-wrap:break-word] break-words hyphens-auto">
              {entry.role[locale]}
            </h3>
            <span className="text-subtext basis-full text-sm">
              @ {entry.company}
              {entry.location && (
                <span className="text-overlay ml-2">· {entry.location[locale]}</span>
              )}
            </span>
          </header>
          <ul className="text-subtext marker:text-brand-text mt-3 list-disc space-y-1 pl-5 text-sm leading-relaxed">
            {bullets.map((b, i) => (
              <li key={i}>{b[locale]}</li>
            ))}
          </ul>
        </motion.article>
      </div>
    </li>
  )
}
