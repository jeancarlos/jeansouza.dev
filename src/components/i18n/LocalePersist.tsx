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
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'pt' || stored === 'en') {
      if (stored !== locale) {
        router.replace(pathname, { locale: stored })
        return
      }
    } else {
      localStorage.setItem(STORAGE_KEY, locale)
    }
  }, [locale, router, pathname])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, locale)
  }, [locale])

  return null
}
