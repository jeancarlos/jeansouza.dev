import type { Locale } from '@/i18n/t'

export const LOCALE_STORAGE_KEY = 'locale'

/** A language the reader picked wins; otherwise Portuguese browsers get Portuguese and everyone else English. */
export function preferredLocale(stored: string | null | undefined, language: string): Locale {
  if (stored === 'pt' || stored === 'en') return stored
  return /^pt\b/i.test(language) ? 'pt' : 'en'
}

/** Runs in the head of `/`, which is only a redirect: every reader lands on their language's home. */
export const ROOT_REDIRECT_SCRIPT = `(function(){var s;try{s=localStorage.getItem('${LOCALE_STORAGE_KEY}')}catch(e){}location.replace('/'+(${preferredLocale.toString()})(s,navigator.language)+'/')})()`
