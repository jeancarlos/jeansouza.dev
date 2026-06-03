'use client'
import { useState, useRef, useEffect } from 'react'
import { useLocale } from 'next-intl'
import { useRouter, usePathname } from '@/i18n/navigation'
import { motion } from 'framer-motion'

const LOCALES = ['pt', 'en'] as const
type Locale = (typeof LOCALES)[number]

export function LocaleSwitch() {
  const locale = useLocale() as Locale
  const router = useRouter()
  const pathname = usePathname()
  const [displayLocale, setDisplayLocale] = useState<Locale>(locale)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) clearTimeout(timerRef.current)
    }
  }, [])

  const handleSwitch = (loc: Locale): void => {
    if (loc === displayLocale) return
    setDisplayLocale(loc)
    if (timerRef.current !== null) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      router.replace(pathname, { locale: loc })
    }, 280)
  }

  return (
    <div className="fixed top-4 right-4 z-[500]">
      <div className="group relative inline-flex rounded-full bg-gradient-to-r from-[#e84545] to-[#b33a73] p-[2px] shadow-sm">
        <div className="relative flex rounded-full bg-[#3e3353]">
          <motion.div
            className="absolute inset-0 rounded-full bg-gradient-to-r from-[#e84545] to-[#b33a73]"
            style={{ width: '50%' }}
            initial={{ x: displayLocale === 'pt' ? 0 : '100%' }}
            animate={{ x: displayLocale === 'pt' ? 0 : '100%' }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          />
          {LOCALES.map((loc) => (
            <button
              key={loc}
              onClick={() => {
                handleSwitch(loc)
              }}
              aria-label={`Switch to ${loc.toUpperCase()}`}
              aria-pressed={locale === loc}
              className="relative z-10 rounded-full px-3 py-1.5 text-sm font-medium transition-colors duration-200"
              style={{ color: displayLocale === loc ? '#fff' : '#b33a73' }}
            >
              {loc.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
