import { describe, it, expect } from 'vitest'
import { postsFor, type PostEntry } from './posts'

const entry = (id: string, date: string): PostEntry => ({
  id,
  body: `body of ${id}`,
  data: { title: id, date: new Date(date), description: 'd' },
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

  it('carries the markdown body as content', () => {
    expect(postsFor(entries, 'pt')[0].content).toBe('body of newer.pt')
  })
})
