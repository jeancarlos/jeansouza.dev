'use client'
import { useEffect } from 'react'
import { useLocale } from 'next-intl'
import { useRouter, usePathname } from '@/i18n/navigation'

const STORAGE_KEY = 'locale'

export function LocalePersist() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (typeof window === 'undefined') return
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'pt' || stored === 'en') {
      if (stored !== locale) {
        router.replace(pathname, { locale: stored })
        return
      }
    } else {
      localStorage.setItem(STORAGE_KEY, locale)
    }
    document.documentElement.lang = locale
  }, [locale, router, pathname])

  return null
}
