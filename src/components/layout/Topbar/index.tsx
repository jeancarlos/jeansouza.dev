'use client'
import { useCallback } from 'react'
import { useLocale } from 'next-intl'
import { useRouter, usePathname } from '@/i18n/navigation'
import { Button } from '@/components/ui/Button'

function ThemeToggle() {
  const toggle = useCallback(() => {
    const html = document.documentElement
    const current = html.getAttribute('data-theme') ?? 'dark'
    const next = current === 'dark' ? 'light' : 'dark'
    html.setAttribute('data-theme', next)
    localStorage.setItem('theme', next)
  }, [])

  return (
    <Button onClick={toggle} aria-label="Toggle dark/light mode">
      <span className="select-none">☀</span>
    </Button>
  )
}

function LocaleToggle() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const next = locale === 'pt' ? 'en' : 'pt'

  return (
    <Button
      onClick={() => router.replace(pathname, { locale: next })}
      aria-label={`Switch to ${next.toUpperCase()}`}
    >
      {locale.toUpperCase()}
    </Button>
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
