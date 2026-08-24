import { describe, expect, it } from 'vitest'
import { DEFAULT_THEME, THEME_INIT_SCRIPT, resolveTheme } from './theme'

describe('resolveTheme', () => {
  it('prefers an explicit stored choice', () => {
    expect(resolveTheme('dark', true)).toBe('dark')
    expect(resolveTheme('light', false)).toBe('light')
  })

  it('falls back to the system preference', () => {
    expect(resolveTheme(null, true)).toBe('light')
    expect(resolveTheme(null, false)).toBe('dark')
  })

  it('ignores a corrupted stored value', () => {
    expect(resolveTheme('purple', false)).toBe(DEFAULT_THEME)
  })
})

describe('THEME_INIT_SCRIPT', () => {
  // The inline script duplicates resolveTheme's branch because it cannot
  // import. These assertions are what keep the two from drifting apart.
  it('applies the same precedence as resolveTheme', () => {
    for (const [stored, prefersLight] of [
      ['dark', true],
      ['light', false],
      [null, true],
      [null, false],
      ['purple', false],
    ] as const) {
      const matchMedia = () => ({ matches: prefersLight })
      const el = { setAttribute: (_: string, v: string) => (el.value = v), value: '', style: {} }
      const fn = new Function(
        'localStorage',
        'window',
        'document',
        THEME_INIT_SCRIPT,
      ) as (l: unknown, w: unknown, d: unknown) => void
      fn({ getItem: () => stored }, { matchMedia }, { documentElement: el })
      expect(el.value, `stored=${String(stored)} prefersLight=${prefersLight}`).toBe(
        resolveTheme(stored, prefersLight),
      )
    }
  })

  it('sets colorScheme so browser-painted controls follow the theme', () => {
    expect(THEME_INIT_SCRIPT).toContain('colorScheme')
  })

  it('falls back to dark when storage throws', () => {
    expect(THEME_INIT_SCRIPT).toContain("setAttribute('data-theme','dark')")
  })
})
