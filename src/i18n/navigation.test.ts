import { describe, expect, it } from 'vitest'
import { localePath, stripLocale } from './navigation'

describe('locale-aware paths', () => {
  it('strips a leading locale segment', () => {
    expect(stripLocale('/pt/blog/')).toBe('/blog/')
    expect(stripLocale('/en/resume/')).toBe('/resume/')
  })

  it('treats a bare locale root as /', () => {
    expect(stripLocale('/pt')).toBe('/')
    expect(stripLocale('/en/')).toBe('/')
  })

  it('leaves an unprefixed path alone', () => {
    expect(stripLocale('/blog/')).toBe('/blog/')
  })

  it('does not strip a path that merely starts with the letters', () => {
    expect(stripLocale('/entries/')).toBe('/entries/')
    expect(stripLocale('/ptolemy/')).toBe('/ptolemy/')
  })

  it('swaps the locale while keeping the path', () => {
    expect(localePath('/pt/blog/', 'en')).toBe('/en/blog/')
    expect(localePath('/en/', 'pt')).toBe('/pt/')
  })
})
