'use client'
import { useCallback, useState } from 'react'
import { useLocale } from 'next-intl'
import { useRouter, usePathname } from '@/i18n/navigation'
import { Switch } from '@/components/ui/Switch'

function ThemeToggle() {
  const [theme, setTheme] = useState<'dark' | 'light' | null>(() => {
    if (typeof window === 'undefined') return null
    const stored = localStorage.getItem('theme')
    return stored === 'light' || stored === 'dark' ? stored : 'dark'
  })

  const toggle = useCallback(() => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark'
      document.documentElement.setAttribute('data-theme', next)
      localStorage.setItem('theme', next)
      return next
    })
  }, [])

  if (theme === null) return null

  return (
    <Switch on={theme === 'light'} onToggle={toggle} aria-label="Toggle dark/light mode">
      <span className="select-none">☀</span>
    </Switch>
  )
}

function LocaleToggle() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const next = locale === 'pt' ? 'en' : 'pt'

  return (
    <Switch
      on={locale === 'en'}
      onToggle={() => router.replace(pathname, { locale: next })}
      aria-label={`Switch to ${next.toUpperCase()}`}
    >
      {locale.toUpperCase()}
    </Switch>
  )
}

export function Topbar() {
  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[9999] flex items-start justify-between p-3">
      <div className="pointer-events-auto">
        <LocaleToggle />
      </div>
      <div className="pointer-events-auto">
        <ThemeToggle />
      </div>
    </div>
  )
}
