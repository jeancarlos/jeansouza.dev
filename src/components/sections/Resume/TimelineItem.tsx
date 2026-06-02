'use client'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import type { TimelineEntry } from '@/content/resume/timeline'

interface Props {
  entry: TimelineEntry
  locale: 'pt' | 'en'
  index: number
}

export function TimelineItem({ entry, locale, index }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, rotateX: -12, y: 24 }}
      animate={inView ? { opacity: 1, rotateX: 0, y: 0 } : {}}
      transition={{ duration: 0.45, delay: index * 0.08, ease: 'easeOut' }}
      whileHover={{ y: -2, transition: { duration: 0.15 } }}
      style={{ transformStyle: 'preserve-3d', perspective: 800 }}
      className="border-latte-mantle hover:border-latte-blue border bg-white/70 p-5 backdrop-blur-sm transition-colors"
    >
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="text-latte-blue shrink-0 font-mono text-sm">▸ {entry.year[locale]}</span>
        <span className="font-display text-latte-text font-bold">{entry.role[locale]}</span>
        <span className="text-latte-subtext text-sm">
          @ <span>{entry.company}</span>
        </span>
      </div>
      <p className="text-latte-subtext mt-2 pl-10 text-sm leading-relaxed whitespace-pre-line">
        {entry.description[locale]}
      </p>
    </motion.div>
  )
}
