'use client'
import { useEffect, useState } from 'react'
import { motion, steps } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { TerminalCard } from '@/components/ui/TerminalCard'

const messages = {
  pt: {
    description: 'Essa página não existe (ou foi movida). Recomendo voltar para a home.',
    back: 'Voltar para a home',
  },
  en: {
    description: "This page doesn't exist (or has moved). Head back home.",
    back: 'Back to home',
  },
}

export default function NotFound() {
  const [locale, setLocale] = useState<'pt' | 'en'>('pt')

  useEffect(() => {
    setLocale(navigator.language.startsWith('pt') ? 'pt' : 'en')
  }, [])

  const m = messages[locale]

  return (
    <main className="flex min-h-dvh items-center justify-center p-4">
      <TerminalCard title="~ jeansouza.dev" onClose={() => { window.location.href = '/' }}>
        <div className="space-y-4">
          <p className="text-brand-to text-xs">~ jeansouza.dev</p>
          <p className="flex items-center gap-2">
            <span className="text-brand-from select-none">{'>'}</span>
            <span className="font-display text-text text-2xl font-bold">404</span>
            <motion.span
              className="text-brand-from"
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 1, repeat: Infinity, ease: steps(2, 'start') }}
              aria-hidden="true"
            >
              _
            </motion.span>
          </p>
          <p className="text-subtext pl-5 text-sm leading-relaxed">{m.description}</p>
          <div className="pl-5 pt-2">
            <Button href="/">
              <i className="fas fa-home mr-1" aria-hidden="true" /> {m.back}
            </Button>
          </div>
        </div>
      </TerminalCard>
    </main>
  )
}
