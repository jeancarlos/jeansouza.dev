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

/**
 * Framework-free stand-in for next-intl's createNavigation. Same call shape as
 * before — `router.replace(pathname, { locale })` — so the two callers are
 * unchanged, but it navigates with the browser instead of a Next router.
 */
export function usePathname(): string {
  return typeof window === 'undefined' ? '/' : window.location.pathname
}

export function useRouter() {
  return {
    replace(pathname: string, options?: { locale?: Locale }) {
      if (typeof window === 'undefined') return
      const target = options?.locale ? localePath(pathname, options.locale) : pathname
      window.location.replace(target)
    },
    push(pathname: string, options?: { locale?: Locale }) {
      if (typeof window === 'undefined') return
      const target = options?.locale ? localePath(pathname, options.locale) : pathname
      window.location.assign(target)
    },
  }
}
