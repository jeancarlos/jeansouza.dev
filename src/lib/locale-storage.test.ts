import { describe, expect, it } from 'vitest'
import { ROOT_REDIRECT_SCRIPT, preferredLocale } from './locale-storage'

describe('preferredLocale', () => {
  it('keeps the language the reader chose', () => {
    expect(preferredLocale('en', 'pt-BR')).toBe('en')
    expect(preferredLocale('pt', 'en-US')).toBe('pt')
  })

  it('falls back to the browser language', () => {
    expect(preferredLocale(null, 'pt-BR')).toBe('pt')
    expect(preferredLocale(null, 'pt')).toBe('pt')
    expect(preferredLocale(undefined, 'en-GB')).toBe('en')
  })

  it('ignores a corrupted stored value and lookalike languages', () => {
    expect(preferredLocale('fr', 'pt-PT')).toBe('pt')
    expect(preferredLocale(null, 'ptx')).toBe('en')
  })
})

describe('ROOT_REDIRECT_SCRIPT', () => {
  it('embeds the same decision and tolerates blocked storage', () => {
    expect(ROOT_REDIRECT_SCRIPT).toContain(preferredLocale.toString())
    expect(ROOT_REDIRECT_SCRIPT).toMatch(/try\{.*localStorage.*\}catch/)
  })
})
