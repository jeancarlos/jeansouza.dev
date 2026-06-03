'use client'
import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'
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
      className={cn(
        'relative pt-2',
        side === 'left' && 'md:col-start-1 md:pr-8 md:text-right',
        side === 'right' && 'md:col-start-3 md:pl-8',
        'max-md:col-start-2 max-md:pl-6'
      )}
      initial={{ opacity: 0, x: initialX }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: 'easeOut' }}
    >
      <span
        aria-hidden
        className="bg-latte-blue ring-latte-base shadow-[0_0_0_1px_theme(colors.latte.blue)] absolute top-6 h-3 w-3 rounded-full ring-4 max-md:left-[-19px] md:right-auto md:left-auto md:-translate-x-1/2"
        style={side === 'left' ? { right: 'calc(-1.5rem - 6px)' } : { left: 'calc(-1.5rem - 6px)' }}
      />
      <motion.article
        data-side={side}
        className="border-latte-surface1 bg-latte-base/70 hover:border-latte-blue border p-5 backdrop-blur-sm transition-colors"
        whileHover={{ y: -2, transition: { duration: 0.15 } }}
      >
        <header
          className={cn(
            'flex flex-wrap items-baseline gap-x-3 gap-y-1',
            side === 'left' && 'md:flex-row-reverse md:justify-start'
          )}
        >
          <span className="text-latte-blue shrink-0 font-mono text-sm">▸ {entry.year[locale]}</span>
          <h3 className="font-display text-latte-text font-bold">{entry.role[locale]}</h3>
          <span className="text-latte-subtext text-sm">@ {entry.company}</span>
        </header>
        <ul
          className={cn(
            'text-latte-subtext marker:text-latte-blue mt-3 list-disc space-y-1 text-sm leading-relaxed',
            'pl-5'
          )}
        >
          {bullets.map((b, i) => (
            <li key={i}>{b[locale]}</li>
          ))}
        </ul>
      </motion.article>
    </motion.li>
  )
}
