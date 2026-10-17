import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { ReactElement } from 'react'
import type { Post } from '@/lib/posts'
import { pageMeta } from '@/lib/pages'
import { pageWindow, windowsForPage } from './pageWindows'
import { BlogListWindow } from './BlogListWindow'
import { BlogPostWindow } from './BlogPostWindow'
import { MoreLinksWindow } from './MoreLinksWindow'
import { ResumeWindow } from './ResumeWindow'

const post: Post = {
  slug: 'hello',
  title: 'Hello',
  date: '2026-01-01',
  description: 'A post.',
  body: [],
  toc: [],
  locales: ['pt', 'en'],
  cover: { src: '/c.webp', srcSet: '/c.webp 820w', alt: 'A cover.' },
  thumb: { src: '/t.webp', srcSet: '/t.webp 176w' },
  ogImage: '/og.jpg',
}
const posts = [post]
const origin = { x: 10, y: 20, width: 80, height: 30 }

function setViewport(width: number, height: number) {
  vi.stubGlobal('innerWidth', width)
  vi.stubGlobal('innerHeight', height)
}

beforeEach(() => setViewport(1400, 900))
afterEach(() => vi.unstubAllGlobals())

describe('pageWindow identity', () => {
  it('names the blog list window', () => {
    const w = pageWindow({ kind: 'blog' }, 'en', posts)
    expect(w.id).toBe('blog')
    expect(w.url).toBe('/en/blog/')
    expect(w.title).toBe('~/blog')
    expect(w.pageTitle).toBe(pageMeta({ kind: 'blog' }, 'en').title)
  })

  it('names the resume and more windows', () => {
    const resume = pageWindow({ kind: 'resume' }, 'pt', posts)
    expect([resume.id, resume.url, resume.title]).toEqual(['resume', '/pt/resume/', '~/resume'])
    const more = pageWindow({ kind: 'more' }, 'pt', posts)
    expect([more.id, more.url, more.title]).toEqual(['more', '/pt/more/', '~/more'])
  })

  it('names a post window after its slug and title', () => {
    const w = pageWindow({ kind: 'post', post }, 'en', posts)
    expect(w.id).toBe('post-hello')
    expect(w.url).toBe('/en/blog/hello/')
    expect(w.title).toBe('~/blog/hello')
    expect(w.pageTitle).toContain('Hello')
  })

  it('remembers the button a window grew out of', () => {
    expect(pageWindow({ kind: 'more' }, 'en', posts, origin).origin).toBe(origin)
    expect(pageWindow({ kind: 'more' }, 'en', posts).origin).toBeUndefined()
  })
})

describe('pageWindow content', () => {
  const element = (w: ReturnType<typeof pageWindow>) => w.content as ReactElement<never>

  it('puts the posts in the list, fetching the first cover early only in front', () => {
    const front = element(pageWindow({ kind: 'blog' }, 'en', posts))
    expect(front.type).toBe(BlogListWindow)
    expect(front.props).toMatchObject({ posts, priority: true })
    const behind = element(pageWindow({ kind: 'blog' }, 'en', posts, undefined, true))
    expect(behind.props).toMatchObject({ priority: false })
  })

  it('renders the matching window for each page', () => {
    const postEl = element(pageWindow({ kind: 'post', post }, 'en', posts))
    expect(postEl.type).toBe(BlogPostWindow)
    expect(postEl.props).toMatchObject({ post })
    const resumeEl = element(pageWindow({ kind: 'resume' }, 'en', posts))
    expect(resumeEl.type).toBe(ResumeWindow)
    expect(resumeEl.props).toMatchObject({ locale: 'en' })
    expect(element(pageWindow({ kind: 'more' }, 'en', posts)).type).toBe(MoreLinksWindow)
  })
})

describe('pageWindow placement for a click', () => {
  it('anchors the blog list under the topbar in pixels', () => {
    const w = pageWindow({ kind: 'blog' }, 'en', posts, origin)
    expect(w.size).toEqual({ width: 820, height: 'auto' })
    expect(w.position).toEqual({ x: 290, y: 95 })
  })

  it('fills a wide viewport with a reading window that ignores the topbar', () => {
    for (const kind of ['resume', 'post'] as const) {
      const page = kind === 'post' ? { kind, post } : { kind }
      const w = pageWindow(page, 'en', posts, origin)
      expect(w.size).toEqual({ width: 1024, height: 860 })
      expect(w.position).toEqual({ x: 188, y: 20 })
    }
  })

  it('keeps a reading window below the topbar toggles on a narrower viewport', () => {
    setViewport(1000, 900)
    const w = pageWindow({ kind: 'resume' }, 'en', posts, origin)
    expect(w.size).toEqual({ width: 960, height: 785 })
    expect(w.position).toEqual({ x: 20, y: 95 })
  })

  it('centers the small links window below the topbar', () => {
    const w = pageWindow({ kind: 'more' }, 'en', posts, origin)
    expect(w.size).toEqual({ width: 320, height: 280 })
    expect(w.position).toEqual({ x: 540, y: 347.5 })
  })
})

describe('pageWindow placement for the page url', () => {
  it('places the blog list with css so the server can render it', () => {
    const w = pageWindow({ kind: 'blog' }, 'en', posts)
    expect(w.size).toEqual({ width: 820, height: 'auto' })
    expect(w.position).toEqual({
      x: 'calc(max(20px, (100vw - 820px) / 2) + 0px)',
      y: '95px',
    })
  })

  it('sizes a reading window with css clamps', () => {
    const w = pageWindow({ kind: 'resume' }, 'en', posts)
    const top = 'clamp(0px, (1200px - 100vw) * 1000, 75px)'
    const width = 'min(1024px, 100vw - 40px)'
    expect(w.size).toEqual({ width, height: `calc(100dvh - ${top} - 40px)` })
    expect(w.position).toEqual({
      x: `max(20px, (100vw - ${width}) / 2)`,
      y: `calc(${top} + 20px)`,
    })
  })

  it('centers the links window with css', () => {
    const w = pageWindow({ kind: 'more' }, 'en', posts)
    expect(w.size).toEqual({ width: 320, height: 280 })
    expect(w.position).toEqual({
      x: 'max(20px, (100vw - 320px) / 2)',
      y: 'calc(75px + max(20px, (100dvh - 75px - 280px) / 2))',
    })
  })
})

describe('windowsForPage', () => {
  it('opens nothing for the home page or no page', () => {
    expect(windowsForPage(undefined, 'en', posts)).toEqual([])
    expect(windowsForPage({ kind: 'home' }, 'en', posts)).toEqual([])
  })

  it('opens one window for a plain page', () => {
    const windows = windowsForPage({ kind: 'resume' }, 'en', posts)
    expect(windows.map((w) => w.id)).toEqual(['resume'])
  })

  it('opens a post over the blog list sitting behind it', () => {
    const windows = windowsForPage({ kind: 'post', post }, 'en', posts)
    expect(windows.map((w) => w.id)).toEqual(['blog', 'post-hello'])
    expect((windows[0].content as ReactElement<never>).props).toMatchObject({ priority: false })
  })
})
