import { runInNewContext } from 'node:vm'
import { describe, expect, it, vi } from 'vitest'
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
  const run = (
    stored: string | null,
    languages: string[] | undefined,
    { language = 'xx', blocked = false } = {}
  ) => {
    const replace = vi.fn()
    const localStorage = {
      getItem: () => {
        if (blocked) throw new Error('denied')
        return stored
      },
    }
    runInNewContext(ROOT_REDIRECT_SCRIPT, {
      localStorage,
      navigator: { languages, language },
      location: { replace },
    })
    return replace.mock.calls[0][0] as string
  }

  it('sends the reader to the language they chose, or the one the browser lists', () => {
    expect(run('en', ['pt-BR'])).toBe('/en/')
    expect(run(null, ['en-US', 'pt-BR'])).toBe('/pt/')
    expect(run(null, ['fr'])).toBe('/en/')
  })

  it('falls back to the single browser language and survives blocked storage', () => {
    expect(run(null, undefined, { language: 'pt-PT' })).toBe('/pt/')
    expect(run(null, ['pt-BR'], { blocked: true })).toBe('/pt/')
  })
})
