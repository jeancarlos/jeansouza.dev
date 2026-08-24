export type Theme = 'light' | 'dark'

export const THEME_STORAGE_KEY = 'theme'
export const DEFAULT_THEME: Theme = 'dark'

/**
 * Single source of truth for which theme applies. An explicit stored choice
 * wins; otherwise the OS preference decides. A corrupted stored value is
 * ignored rather than trusted.
 */
export function resolveTheme(stored: string | null, prefersLight: boolean): Theme {
  if (stored === 'light' || stored === 'dark') return stored
  return prefersLight ? 'light' : 'dark'
}

/**
 * Runs inline in <head>, before any stylesheet, so the document never paints in
 * the wrong theme. It cannot import resolveTheme — a module script is deferred
 * by definition, and deferred means after first paint — so the branch is
 * duplicated here and theme.test.ts asserts the two agree.
 */
export const THEME_INIT_SCRIPT = `(function(){try{var s=localStorage.getItem('theme');var p=(s==='light'||s==='dark')?s:(window.matchMedia('(prefers-color-scheme:light)').matches?'light':'dark');document.documentElement.setAttribute('data-theme',p);document.documentElement.style.colorScheme=p}catch(e){document.documentElement.setAttribute('data-theme','dark')}})()`
