import type { Locale } from '@/i18n/t'

export const LOCALE_STORAGE_KEY = 'locale'

/**
 * A language the reader picked wins. Otherwise Portuguese anywhere in the browser's language list
 * wins, since an English-first UI language is common on Portuguese phones; everyone else gets English.
 */
export function preferredLocale(
  stored: string | null | undefined,
  languages: readonly string[]
): Locale {
  if (stored === 'pt' || stored === 'en') return stored
  const bases = languages.map((tag) => tag.toLowerCase().split('-')[0])
  return bases.includes('pt') ? 'pt' : 'en'
}

/** Runs in the head of `/`, which is only a redirect: every reader lands on their language's home. */
export const ROOT_REDIRECT_SCRIPT = `(function(){var s;try{s=localStorage.getItem('${LOCALE_STORAGE_KEY}')}catch(e){}location.replace('/'+(${preferredLocale.toString()})(s,navigator.languages||[navigator.language])+'/')})()`
