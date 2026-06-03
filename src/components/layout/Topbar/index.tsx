'use client'
import { useCallback, useEffect, useState } from 'react'
import { useLocale } from 'next-intl'
import { useRouter, usePathname } from '@/i18n/navigation'
import { Switch } from '@/components/ui/Switch'
import { useIsMobile } from '@/lib/useIsMobile'

export function ThemeToggle({ size }: { size?: 'default' | 'sm' }) {
  const [mounted, setMounted] = useState(false)
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')

  useEffect(() => {
    const stored = localStorage.getItem('theme')
    if (stored === 'light' || stored === 'dark') setTheme(stored)
    setMounted(true)
  }, [])

  const toggle = useCallback(() => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark'
      document.documentElement.setAttribute('data-theme', next)
      localStorage.setItem('theme', next)
      return next
    })
  }, [])

  if (!mounted) return null

  return (
    <Switch on={theme === 'light'} onToggle={toggle} aria-label="Toggle dark/light mode" size={size}>
      <span className="select-none">☀</span>
    </Switch>
  )
}

export function LocaleToggle({ size }: { size?: 'default' | 'sm' }) {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const next = locale === 'pt' ? 'en' : 'pt'

  return (
    <Switch
      on={locale === 'en'}
      onToggle={() => router.replace(pathname, { locale: next })}
      aria-label={`Switch to ${next.toUpperCase()}`}
      size={size}
    >
      {locale.toUpperCase()}
    </Switch>
  )
}

export function Topbar() {
  const isMobile = useIsMobile()
  if (isMobile) return null

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[9999] flex h-[75px] items-center justify-between px-4">
      <div className="pointer-events-auto">
        <LocaleToggle size="sm" />
      </div>
      <div className="pointer-events-auto">
        <ThemeToggle size="sm" />
      </div>
    </div>
  )
}
