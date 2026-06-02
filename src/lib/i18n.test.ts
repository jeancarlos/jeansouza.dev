import { describe, it, expect } from 'vitest'
import pt from '../../content/i18n/pt.json'
import en from '../../content/i18n/en.json'

function getKeys(obj: object, prefix = ''): string[] {
  return Object.entries(obj).flatMap(([k, v]) =>
    typeof v === 'object' && v !== null
      ? getKeys(v as object, prefix ? `${prefix}.${k}` : k)
      : [prefix ? `${prefix}.${k}` : k]
  )
}

describe('i18n keys', () => {
  it('EN has all keys present in PT', () => {
    const ptKeys = getKeys(pt).sort()
    const enKeys = getKeys(en).sort()
    expect(enKeys).toEqual(ptKeys)
  })

  it('PT has all keys present in EN', () => {
    const ptKeys = getKeys(pt).sort()
    const enKeys = getKeys(en).sort()
    expect(ptKeys).toEqual(enKeys)
  })
})
