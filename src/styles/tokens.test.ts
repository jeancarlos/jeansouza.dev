import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

const HEX = /#[0-9a-f]{3,8}\b/gi

function cssFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const path = join(dir, e.name)
    if (e.isDirectory()) return cssFiles(path)
    return e.name.endsWith('.css') ? [path] : []
  })
}

describe('design tokens', () => {
  it('keeps hex colors in tokens.css only', () => {
    const offenders = cssFiles('src')
      .filter((file) => !file.endsWith(join('styles', 'tokens.css')))
      .flatMap((file) =>
        (readFileSync(file, 'utf8').match(HEX) ?? []).map((hex) => `${file}: ${hex}`)
      )
    expect(offenders).toEqual([])
  })
})
