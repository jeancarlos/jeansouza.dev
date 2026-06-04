'use client'
import { useLocale } from 'next-intl'
import { useRouter, usePathname } from '@/i18n/navigation'
import { Switch } from '@/components/ui/Switch'
import { useTheme, useThemeToggle } from '@/lib/use-theme'

function SunIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      className="h-3 w-3"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4" />
      <line x1="12" y1="2" x2="12" y2="5" />
      <line x1="12" y1="19" x2="12" y2="22" />
      <line x1="4.22" y1="4.22" x2="6.34" y2="6.34" />
      <line x1="17.66" y1="17.66" x2="19.78" y2="19.78" />
      <line x1="2" y1="12" x2="5" y2="12" />
      <line x1="19" y1="12" x2="22" y2="12" />
      <line x1="4.22" y1="19.78" x2="6.34" y2="17.66" />
      <line x1="17.66" y1="6.34" x2="19.78" y2="4.22" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-3 w-3"
      aria-hidden="true"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )
}

export function ThemeToggle({ size }: { size?: 'default' | 'sm' }) {
  const theme = useTheme()
  const toggle = useThemeToggle()
  const isLight = theme === 'light'

  return (
    <Switch
      on={isLight}
      onToggle={toggle}
      aria-label="Toggle dark/light mode"
      size={size}
    >
      {isLight ? <SunIcon /> : <MoonIcon />}
    </Switch>
  )
}

const LOCALE_STORAGE_KEY = 'locale'

export function LocaleToggle({ size }: { size?: 'default' | 'sm' }) {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const next = locale === 'pt' ? 'en' : 'pt'

  const handleToggle = () => {
    localStorage.setItem(LOCALE_STORAGE_KEY, next)
    router.replace(pathname, { locale: next })
  }

  return (
    <Switch
      on={locale === 'en'}
      onToggle={handleToggle}
      aria-label={`Switch to ${next.toUpperCase()}`}
      size={size}
    >
      {locale.toUpperCase()}
    </Switch>
  )
}

export function Topbar() {
  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[19] flex h-[75px] items-center justify-between px-4">
      <div className="pointer-events-auto">
        <LocaleToggle size="sm" />
      </div>
      <div className="pointer-events-auto">
        <ThemeToggle size="sm" />
      </div>
    </div>
  )
}
