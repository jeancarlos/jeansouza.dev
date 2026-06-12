'use client'
import { useSyncExternalStore } from 'react'
import { motion, steps } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { TerminalCard } from '@/components/ui/TerminalCard'
import { Icon } from '@/components/ui/Icon'

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

// navigator.language never changes during the page's lifetime, so the store
// never emits — useSyncExternalStore is only bridging the SSR/client snapshot.
const subscribeNever = () => () => undefined
const getClientLocale = (): 'pt' | 'en' => (navigator.language.startsWith('pt') ? 'pt' : 'en')
const getServerLocale = (): 'pt' | 'en' => 'pt'

export default function NotFound() {
  const locale = useSyncExternalStore(subscribeNever, getClientLocale, getServerLocale)

  const m = messages[locale]

  return (
    <main className="flex min-h-dvh items-center justify-center p-4">
      <TerminalCard
        title="~ jeansouza.dev"
        onClose={() => {
          window.location.href = '/'
        }}
      >
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
          <div className="pt-2 pl-5">
            <Button href="/">
              <Icon name="home" className="mr-1" /> {m.back}
            </Button>
          </div>
        </div>
      </TerminalCard>
    </main>
  )
}
