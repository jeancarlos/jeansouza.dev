import { existsSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import config from '../astro.config.mjs'

const fonts = config.fonts ?? []
const files = fonts.flatMap((font) =>
  'options' in font && 'variants' in font.options
    ? font.options.variants.flatMap((variant) => variant.src as string[])
    : []
)

describe('fonts', () => {
  it('self-hosts every family, so a CDN outage cannot break the build or the page', () => {
    expect(fonts.map((font) => font.provider.name)).toEqual(['local', 'local', 'local'])
  })

  it('ships every font file the config points at', () => {
    expect(files).toHaveLength(5)
    for (const file of files) expect(existsSync(file)).toBe(true)
  })

  it('swaps the font in after first paint instead of keeping the fallback', () => {
    expect(fonts.map((font) => font.display)).toEqual(['swap', 'swap', 'swap'])
  })
})
