'use client'
import { useLocale } from 'next-intl'
import { useRouter, usePathname } from '@/i18n/navigation'
import { Switch } from '@/components/ui/Switch'
import { useTheme, useThemeToggle } from '@/lib/use-theme'

export function ThemeToggle({ size }: { size?: 'default' | 'sm' }) {
  const theme = useTheme()
  const toggle = useThemeToggle()

  return (
    <Switch
      on={theme === 'light'}
      onToggle={toggle}
      aria-label="Toggle dark/light mode"
      size={size}
    >
      <span aria-hidden="true" className="select-none">
        ☀
      </span>
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
  // hidden md:flex = hidden below the 768px breakpoint, flex on md+.
  // Using CSS instead of `if (isMobile) return null` avoids the SSR
  // hydration flash (server has no matchMedia, client snapshot defaults
  // to desktop and would briefly render the topbar on mobile).
  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[19] hidden h-[75px] items-center justify-between px-4 md:flex">
      <div className="pointer-events-auto">
        <LocaleToggle size="sm" />
      </div>
      <div className="pointer-events-auto">
        <ThemeToggle size="sm" />
      </div>
    </div>
  )
}
