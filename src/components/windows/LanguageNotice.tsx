import { useState, useSyncExternalStore } from 'react'
import { useLocale } from '../../i18n/react'
import { LANGUAGE_TAG, translator, type Locale } from '@/i18n/t'
import { LOCALE_STORAGE_KEY, preferredLocale } from '@/lib/locale-storage'

function storedLocale(): string | null {
  try {
    return localStorage.getItem(LOCALE_STORAGE_KEY)
  } catch {
    return null
  }
}

function remember(locale: Locale) {
  try {
    localStorage.setItem(LOCALE_STORAGE_KEY, locale)
  } catch {
    return
  }
}

const noSubscription = () => () => undefined

interface Props {
  available: readonly Locale[]
  hrefFor: (locale: Locale) => string
}

export function LanguageNotice({ available, hrefFor }: Props) {
  const locale = useLocale()
  const preferred = useSyncExternalStore(
    noSubscription,
    () => preferredLocale(storedLocale(), navigator.languages),
    () => null
  )
  const [dismissed, setDismissed] = useState(false)
  const suggested =
    !dismissed && preferred && preferred !== locale && available.includes(preferred)
      ? preferred
      : null

  if (!suggested) return null
  const t = translator(suggested)
  return (
    <div className="sticky top-0 z-10 h-0">
      <div
        lang={LANGUAGE_TAG[suggested]}
        className="border-surface bg-crust/95 text-text font-reading absolute inset-x-3 top-3 flex items-center gap-3 rounded-xl border p-3 text-sm shadow-lg"
      >
        <p className="min-w-0 flex-1">{t('languageNotice.message')}</p>
        <a
          href={hrefFor(suggested)}
          hrefLang={suggested}
          onClick={() => remember(suggested)}
          className="group from-brand-from to-brand-to shrink-0 rounded-full bg-gradient-to-r p-[2px]"
        >
          <span className="bg-brand-bg text-brand-text group-hover:text-brand-from block rounded-full px-3 py-1">
            {t('languageNotice.read')}
          </span>
        </a>
        <button
          type="button"
          aria-label={t('languageNotice.dismiss')}
          onClick={() => {
            remember(locale)
            setDismissed(true)
          }}
          className="text-subtext hover:text-text shrink-0 cursor-pointer px-1 text-lg leading-none"
        >
          ×
        </button>
      </div>
    </div>
  )
}
