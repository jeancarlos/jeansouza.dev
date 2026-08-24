import { describe, expect, it } from 'vitest'
import { readdirSync, readFileSync } from 'node:fs'
import matter from 'gray-matter'

const DIR = 'src/content/blog'

// src/lib/posts.test.ts writes temporary fixtures into this same directory —
// getAllPosts reads a module-level path, so it has nowhere else to put them.
// Vitest isolates workers but not the filesystem, so without this filter the
// two files race and this one fails only when the full suite runs.
const isFixture = (f: string) => f.startsWith('__')

describe('blog collection', () => {
  it('has the one post in both locales', () => {
    // One post, renamed in cd3c187. The pre-rename slug survives only as a
    // redirect stub under public/, never as a source file.
    const ids = readdirSync(DIR)
      .filter((f) => f.endsWith('.md') && !isFixture(f))
      .sort()
    expect(ids).toEqual([
      '2026-06-03-por-que-eu-construi-esse-site-do-jeito-que-construi.en.md',
      '2026-06-03-por-que-eu-construi-esse-site-do-jeito-que-construi.pt.md',
    ])
  })

  it('every post carries the frontmatter the schema demands', () => {
    for (const f of readdirSync(DIR).filter((f) => f.endsWith('.md') && !isFixture(f))) {
      const { data } = matter(readFileSync(`${DIR}/${f}`, 'utf8'))
      expect(typeof data.title, f).toBe('string')
      expect(typeof data.description, f).toBe('string')
      expect(data.date, f).toBeTruthy()
    }
  })

  it('keeps the pre-rename URL alive as a redirect stub', () => {
    for (const locale of ['pt', 'en']) {
      const stub = readFileSync(
        `public/${locale}/blog/2026-06-03-como-modernizei-meu-site/index.html`,
        'utf8',
      )
      expect(stub).toContain('por-que-eu-construi-esse-site-do-jeito-que-construi')
      expect(stub).toContain('rel="canonical"')
    }
  })
})
