import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { Post } from '../lib/posts'

const loadPosts = vi.hoisted(() => vi.fn())
vi.mock('../lib/loadPosts', () => ({ loadPosts }))

import { GET } from './sitemap.xml'

const post: Post = {
  slug: 'hello',
  title: 'Hello',
  date: '2026-03-04',
  description: 'A post.',
  body: [],
  toc: [],
  locales: ['pt'],
  cover: { src: '/c.webp', srcSet: '/c.webp 820w', alt: 'A cover.' },
  thumb: { src: '/t.webp', srcSet: '/t.webp 176w' },
  ogImage: '/og-hello.jpg',
}

const run = async () => {
  const res = await (GET as unknown as () => Promise<Response>)()
  return { res, xml: await res.text() }
}

describe('sitemap.xml GET', () => {
  beforeEach(() => {
    loadPosts.mockImplementation(async (locale: string) => (locale === 'pt' ? [post] : []))
  })

  it('serves a well-formed urlset as application/xml', async () => {
    const { res, xml } = await run()
    expect(res.headers.get('Content-Type')).toBe('application/xml')
    expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>\n<urlset')).toBe(true)
    expect(xml.trimEnd().endsWith('</urlset>')).toBe(true)
  })

  it('lists every locale page plus posts in their locale only', async () => {
    const { xml } = await run()
    const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])
    expect(locs).toEqual([
      'https://jeansouza.dev/pt/',
      'https://jeansouza.dev/pt/blog/',
      'https://jeansouza.dev/pt/resume/',
      'https://jeansouza.dev/pt/more/',
      'https://jeansouza.dev/pt/blog/hello/',
      'https://jeansouza.dev/en/',
      'https://jeansouza.dev/en/blog/',
      'https://jeansouza.dev/en/resume/',
      'https://jeansouza.dev/en/more/',
    ])
  })

  it('adds lastmod for the blog index and posts, not for other pages', async () => {
    const { xml } = await run()
    const entry = (loc: string) => xml.split('<url>').find((u) => u.includes(`<loc>${loc}</loc>`))
    expect(entry('https://jeansouza.dev/pt/blog/')).toContain('<lastmod>2026-03-04</lastmod>')
    expect(entry('https://jeansouza.dev/pt/blog/hello/')).toContain('<lastmod>2026-03-04</lastmod>')
    expect(entry('https://jeansouza.dev/pt/')).not.toContain('lastmod')
    expect(entry('https://jeansouza.dev/en/blog/')).not.toContain('lastmod')
  })

  it('emits hreflang alternates, restricting a post to its own locales', async () => {
    const { xml } = await run()
    const entry = (loc: string) => xml.split('<url>').find((u) => u.includes(`<loc>${loc}</loc>`))
    const home = entry('https://jeansouza.dev/pt/')
    expect(home).toContain(
      '<xhtml:link rel="alternate" hreflang="pt-BR" href="https://jeansouza.dev/pt/"/>'
    )
    expect(home).toContain(
      '<xhtml:link rel="alternate" hreflang="en-US" href="https://jeansouza.dev/en/"/>'
    )
    expect(home).toContain('hreflang="x-default" href="https://jeansouza.dev/en/"')
    const postEntry = entry('https://jeansouza.dev/pt/blog/hello/')
    expect(postEntry).not.toContain('hreflang="en-US"')
    expect(postEntry).toContain('hreflang="x-default" href="https://jeansouza.dev/pt/blog/hello/"')
  })
})
