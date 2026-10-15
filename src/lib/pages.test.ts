import { describe, expect, it } from 'vitest'
import { LOCALES } from '@/i18n/t'
import type { Post } from './posts'
import { pageFromPath, pageMeta, pageUrl, type Page } from './pages'

const post: Post = {
  slug: 'hello',
  title: 'Hello',
  date: '2026-01-01',
  description: 'A post.',
  content: '',
  cover: { src: '/c.webp', srcSet: '/c.webp 820w', alt: 'A cover.' },
  thumb: { src: '/t.webp', srcSet: '/t.webp 176w' },
  ogImage: '/og-hello.jpg',
}
const pages: Page[] = [
  { kind: 'home' },
  { kind: 'blog' },
  { kind: 'resume' },
  { kind: 'more' },
  { kind: 'post', post },
]

describe('pages', () => {
  it.each(LOCALES)('maps every %s page to a URL and back', (locale) => {
    for (const page of pages) expect(pageFromPath(pageUrl(page, locale), [post])).toEqual(page)
  })

  it('serves trailing-slash URLs under the locale', () => {
    expect(pages.map((p) => pageUrl(p, 'en'))).toEqual([
      '/en/',
      '/en/blog/',
      '/en/resume/',
      '/en/more/',
      '/en/blog/hello/',
    ])
  })

  it('knows no page for unknown paths', () => {
    expect(pageFromPath('/pt/blog/missing/', [post])).toBeUndefined()
    expect(pageFromPath('/pt/blog', [post])).toBeUndefined()
    expect(pageFromPath('/', [post])).toBeUndefined()
  })

  it.each(LOCALES)(
    'gives every %s page a distinct title and a search-sized description',
    (locale) => {
      const metas = pages.map((p) => pageMeta(p, locale))
      expect(new Set(metas.map((m) => m.title)).size).toBe(pages.length)
      for (const { title, description } of metas.slice(0, 4)) {
        expect(title.length).toBeLessThanOrEqual(60)
        expect(description.length).toBeGreaterThanOrEqual(70)
        expect(description.length).toBeLessThanOrEqual(160)
      }
    }
  )
})
