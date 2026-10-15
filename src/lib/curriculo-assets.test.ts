import { existsSync } from 'node:fs'
import { describe, it, expect } from 'vitest'
import { CURRICULO_ASSETS } from './curriculo-assets'

describe('CURRICULO_ASSETS', () => {
  it.each(CURRICULO_ASSETS)('$url is published from public/', ({ url }) => {
    expect(existsSync(`public${url}`)).toBe(true)
  })

  it('offers every format in both locales', () => {
    const pairs = CURRICULO_ASSETS.map((a) => `${a.locale}:${a.format}`).sort()
    expect(pairs).toEqual(['en:docx', 'en:pdf', 'pt:docx', 'pt:pdf'])
  })
})
