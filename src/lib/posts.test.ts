import { describe, it, expect } from 'vitest'
import { postsFor, type PostEntry } from './posts'

const cover = { src: '/c.webp', srcSet: '/c.webp 820w', alt: 'A cover.' }

const thumb = { src: '/t.webp', srcSet: '/t.webp 176w' }

const entry = (id: string, date: string): PostEntry => ({
  id,
  rendered: { html: `<p>body of ${id}</p>` },
  data: { title: id, date: new Date(date), description: 'd', cover, thumb, ogImage: `/${id}.jpg` },
})

describe('postsFor', () => {
  const entries = [
    entry('older.pt', '2026-01-01'),
    entry('newer.pt', '2026-02-01'),
    entry('newer.en', '2026-02-01'),
  ]

  it('keeps only the requested locale and strips the suffix from the slug', () => {
    expect(postsFor(entries, 'en').map((p) => p.slug)).toEqual(['newer'])
  })

  it('lists newest first with ISO dates', () => {
    expect(postsFor(entries, 'pt').map((p) => [p.slug, p.date])).toEqual([
      ['newer', '2026-02-01'],
      ['older', '2026-01-01'],
    ])
  })

  it('carries the cover and the social card through', () => {
    expect(postsFor(entries, 'en')[0]).toMatchObject({ cover, ogImage: '/newer.en.jpg' })
  })

  it('carries the html Astro rendered at build time', () => {
    expect(postsFor(entries, 'pt')[0].body).toEqual([{ html: '<p>body of newer.pt</p>' }])
  })

  it('builds the table of contents from the h2 and h3 headings', () => {
    const withHeadings: PostEntry = {
      ...entry('toc.pt', '2026-03-01'),
      rendered: {
        html: '',
        metadata: {
          headings: [
            { depth: 1, slug: 'title', text: 'Title' },
            { depth: 2, slug: 'a', text: 'A' },
            { depth: 3, slug: 'b', text: 'B' },
            { depth: 4, slug: 'c', text: 'C' },
          ],
        },
      },
    }
    expect(postsFor([withHeadings], 'pt')[0].toc.map((h) => h.slug)).toEqual(['a', 'b'])
  })

  it('lists the languages each post was written in', () => {
    expect(postsFor(entries, 'pt').map((p) => [p.slug, p.locales])).toEqual([
      ['newer', ['pt', 'en']],
      ['older', ['pt']],
    ])
  })
})
