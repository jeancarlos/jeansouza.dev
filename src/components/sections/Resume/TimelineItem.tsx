'use client'
import { motion, useReducedMotion } from 'framer-motion'
import { joinClassNames } from '@/lib/utils'
import { getBulletsForEntry } from '@/content/resume/selection'
import type { TimelineEntry } from '@/content/resume/timeline'

interface Props {
  entry: TimelineEntry
  locale: 'pt' | 'en'
  side: 'left' | 'right'
  index: number
}

export function TimelineItem({ entry, locale, side, index }: Props) {
  const reduce = useReducedMotion()
  const bullets = getBulletsForEntry(entry)
  const sideX = side === 'left' ? -40 : 40
  const initialX = reduce ? 0 : sideX

  return (
    <motion.li
      style={{ gridRow: index + 1 }}
      className={joinClassNames(
        'relative flex flex-col gap-2',
        'col-start-2 pl-6',
        side === 'left' && '@4xl:col-start-1 @4xl:pr-8 @4xl:pl-0',
        side === 'right' && '@4xl:col-start-3 @4xl:pl-8'
      )}
      initial={{ opacity: 0, x: initialX }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: 'easeOut' }}
    >
      <span
        aria-hidden
        className={joinClassNames(
          'bg-brand-from ring-crust absolute h-3 w-3 rounded-full shadow-[0_0_0_1px_var(--color-brand-from)] ring-4',
          'top-[6px] left-[-19px]',
          side === 'left' ? '@4xl:right-[-22px] @4xl:left-auto' : '@4xl:left-[-22px]'
        )}
      />
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
        className="border-surface hover:border-brand-from min-w-0 border bg-[var(--button-inner-bg)] p-5 transition-colors"
        whileHover={{ y: -2, transition: { duration: 0.15 } }}
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
    </motion.li>
  )
}
