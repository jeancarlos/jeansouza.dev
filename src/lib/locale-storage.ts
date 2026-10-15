import type { Locale } from '@/i18n/t'

export const LOCALE_STORAGE_KEY = 'locale'

/** A language the reader picked wins; otherwise Portuguese browsers get Portuguese and everyone else English. */
export function preferredLocale(stored: string | null | undefined, language: string): Locale {
  if (stored === 'pt' || stored === 'en') return stored
  return /^pt\b/i.test(language) ? 'pt' : 'en'
}

/** Runs in the head of `/`, which renders the English home, so only Portuguese readers are redirected. */
export const ROOT_REDIRECT_SCRIPT = `(function(){var s;try{s=localStorage.getItem('${LOCALE_STORAGE_KEY}')}catch(e){}if((${preferredLocale.toString()})(s,navigator.language)==='pt')location.replace('/pt/')})()`
