import { LOCALES, type Locale } from './t'

const LOCALE_PREFIX = new RegExp(`^/(${LOCALES.join('|')})(?=/|$)`)

/** Path with any leading locale segment removed: `/pt/blog/` -> `/blog/`. */
export function stripLocale(pathname: string): string {
  return pathname.replace(LOCALE_PREFIX, '') || '/'
}

export function localePath(pathname: string, locale: Locale): string {
  const rest = stripLocale(pathname)
  return `/${locale}${rest === '/' ? '/' : rest}`
}
