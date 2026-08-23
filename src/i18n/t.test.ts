import { describe, expect, it } from 'vitest'
import { LOCALES, useTranslations } from './t'
import pt from '../../content/i18n/pt.json'
import en from '../../content/i18n/en.json'

const isRecord = (o: unknown): o is Record<string, unknown> =>
  typeof o === 'object' && o !== null && !Array.isArray(o)

function keys(o: unknown, prefix = ''): string[] {
  if (!isRecord(o)) return prefix ? [prefix] : []
  return Object.entries(o).flatMap(([k, v]) => keys(v, prefix ? `${prefix}.${k}` : k))
}

describe('i18n catalogs', () => {
  it('exposes both locales', () => {
    expect([...LOCALES]).toEqual(['pt', 'en'])
  })

  it('has identical key sets in pt and en', () => {
    expect(keys(pt).sort()).toEqual(keys(en).sort())
  })

  it('resolves a dot path', () => {
    const t = useTranslations('pt')
    const firstKey = keys(pt)[0]
    expect(typeof t(firstKey)).toBe('string')
  })

  it('throws on a missing key instead of rendering undefined', () => {
    const t = useTranslations('en')
    expect(() => t('this.key.does.not.exist')).toThrow(/missing translation/i)
  })
})
