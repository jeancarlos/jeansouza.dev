import { describe, expect, it } from 'vitest'
import { readdirSync, readFileSync } from 'node:fs'

const DIR = 'src/content/blog'

describe('blog collection', () => {
  it('publishes every post in both locales', () => {
    const files = readdirSync(DIR).filter((f) => f.endsWith('.md'))
    const slugs = (locale: string) =>
      files
        .filter((f) => f.endsWith(`.${locale}.md`))
        .map((f) => f.slice(0, -`.${locale}.md`.length))
    expect(slugs('pt').length).toBeGreaterThan(0)
    expect(slugs('en').sort()).toEqual(slugs('pt').sort())
  })

  it('keeps the pre-rename URL alive as a redirect stub', () => {
    for (const locale of ['pt', 'en']) {
      const stub = readFileSync(
        `public/${locale}/blog/2026-06-03-como-modernizei-meu-site/index.html`,
        'utf8'
      )
      expect(stub).toContain('por-que-eu-construi-esse-site-do-jeito-que-construi')
      expect(stub).toContain('rel="canonical"')
    }
  })
})
