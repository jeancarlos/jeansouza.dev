'use client'
import { useTranslations } from 'next-intl'
import { motion, steps } from 'framer-motion'
import { Terminal } from '@/components/ui/Terminal'
import { Typewriter } from '@/components/ui/Typewriter'
import { SocialLinks } from '@/components/ui/SocialLinks'
import { Section } from '@/components/layout/Section'

export function Hero() {
  const t = useTranslations('hero')

  return (
    <Section
      id="hero"
      bg="#11111b"
      mode="bow"
      dotColor="#a6e3a1"
      className="flex min-h-screen items-center justify-center px-6 py-16"
    >
      <Terminal className="w-full max-w-2xl">
        <div className="text-text space-y-3">
          <p className="text-overlay text-xs">~ jeansouza.dev</p>
          <p className="flex items-center gap-2">
            <span className="text-green select-none">{'>'}</span>
            <Typewriter text={t('prompt')} className="font-display text-mauve text-2xl font-bold" />
            <motion.span
              className="text-green"
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 1, repeat: Infinity, ease: steps(2, 'start') }}
              aria-hidden="true"
            >
              _
            </motion.span>
          </p>
          <p className="text-subtext pl-5">
            <Typewriter text={t('role')} delay={0.8} />
          </p>
          <div className="flex flex-wrap items-center gap-6 pt-6 pl-5">
            <button
              className="text-green border-green hover:bg-green hover:text-crust border px-4 py-1.5 font-mono text-sm transition-colors"
              onClick={() => {
                document.getElementById('resume')?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              [{t('cta')}]
            </button>
            <SocialLinks open />
          </div>
        </div>
      </Terminal>
    </Section>
  )
}
