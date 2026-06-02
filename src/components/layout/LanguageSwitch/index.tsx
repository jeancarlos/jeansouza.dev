'use client'
import { useLocale } from 'next-intl'
import { useRouter, usePathname } from '@/i18n/navigation'

export function LanguageSwitch() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const next = locale === 'pt' ? 'en' : 'pt'

  return (
    <button
      onClick={() => router.replace(pathname, { locale: next })}
      className="text-overlay hover:text-green font-mono text-sm transition-colors"
      aria-label={`Switch to ${next.toUpperCase()}`}
    >
      [{next.toUpperCase()}]
    </button>
  )
}
