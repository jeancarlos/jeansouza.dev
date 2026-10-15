import { describe, expect, it } from 'vitest'
import { ROOT_REDIRECT_SCRIPT } from './locale-storage'

function redirect(stored: string | null | Error, language: string): string {
  let target = ''
  const localStorage = {
    getItem: () => {
      if (stored instanceof Error) throw stored
      return stored
    },
  }
  // eslint-disable-next-line @typescript-eslint/no-implied-eval
  const fn = new Function('localStorage', 'navigator', 'location', ROOT_REDIRECT_SCRIPT) as (
    l: unknown,
    n: unknown,
    loc: unknown
  ) => void
  fn(localStorage, { language }, { replace: (url: string) => (target = url) })
  return target
}

describe('ROOT_REDIRECT_SCRIPT', () => {
  it('sends a reader back to the language they chose', () => {
    expect(redirect('en', 'pt-BR')).toBe('/en/')
    expect(redirect('pt', 'en-US')).toBe('/pt/')
  })

  it('falls back to the browser language without a choice', () => {
    expect(redirect(null, 'pt-BR')).toBe('/pt/')
    expect(redirect(null, 'en-US')).toBe('/en/')
  })

  it('ignores a corrupted stored value', () => {
    expect(redirect('fr', 'pt-BR')).toBe('/pt/')
  })

  it('still redirects when storage is blocked', () => {
    expect(redirect(new Error('SecurityError'), 'en-GB')).toBe('/en/')
  })
})
