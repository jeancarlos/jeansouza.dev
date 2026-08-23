import pt from '../../content/i18n/pt.json'
import en from '../../content/i18n/en.json'

export const LOCALES = ['pt', 'en'] as const
export type Locale = (typeof LOCALES)[number]

const CATALOGS: Record<Locale, unknown> = { pt, en }

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value)
}

/**
 * Resolves a dot path against a locale catalog. Throws on a miss rather than
 * returning undefined: a missing string should fail the build, not render as
 * an empty node the way the Next site allowed.
 */
export function useTranslations(locale: Locale) {
  const catalog = CATALOGS[locale]
  return (key: string): string => {
    const value = key.split('.').reduce<unknown>(
      (acc, part) =>
        typeof acc === 'object' && acc !== null
          ? (acc as Record<string, unknown>)[part]
          : undefined,
      catalog,
    )
    if (typeof value !== 'string') throw new Error(`missing translation: ${locale}.${key}`)
    return value
  }
}
