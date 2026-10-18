import { describe, expect, it } from 'vitest'
import { ROOT_REDIRECT_SCRIPT, preferredLocale } from './locale-storage'

describe('preferredLocale', () => {
  it('keeps the language the reader chose', () => {
    expect(preferredLocale('en', ['pt-BR'])).toBe('en')
    expect(preferredLocale('pt', ['en-US'])).toBe('pt')
  })

  it('falls back to the browser languages', () => {
    expect(preferredLocale(null, ['pt-BR'])).toBe('pt')
    expect(preferredLocale(null, ['pt'])).toBe('pt')
    expect(preferredLocale(undefined, ['en-GB'])).toBe('en')
  })

  it('prefers Portuguese anywhere in the list over an English-first browser', () => {
    expect(preferredLocale(null, ['en-US', 'pt-BR'])).toBe('pt')
  })

  it('gives English to languages the site does not have', () => {
    expect(preferredLocale(null, ['es-ES', 'fr'])).toBe('en')
    expect(preferredLocale(null, [])).toBe('en')
  })

  it('ignores a corrupted stored value and lookalike languages', () => {
    expect(preferredLocale('fr', ['pt-PT'])).toBe('pt')
    expect(preferredLocale(null, ['ptx'])).toBe('en')
  })
})

describe('ROOT_REDIRECT_SCRIPT', () => {
  it('embeds the same decision and tolerates blocked storage', () => {
    expect(ROOT_REDIRECT_SCRIPT).toContain(preferredLocale.toString())
    expect(ROOT_REDIRECT_SCRIPT).toMatch(/try\{.*localStorage.*\}catch/)
    expect(ROOT_REDIRECT_SCRIPT).toContain("location.replace('/'+")
  })
})
