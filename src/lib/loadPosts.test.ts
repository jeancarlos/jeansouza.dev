import { beforeEach, describe, expect, it, vi } from 'vitest'
import { getImage } from 'astro:assets'
import { getCollection } from 'astro:content'
import { loadPosts } from './loadPosts'

vi.mock('astro:content', () => ({ getCollection: vi.fn() }))
vi.mock('astro:assets', () => ({ getImage: vi.fn() }))

const entry = (id: string, rendered?: object) => ({
  id,
  rendered,
  data: {
    title: `title ${id}`,
    date: new Date('2026-01-02T00:00:00Z'),
    description: 'desc',
    image: { src: `/${id}.png` },
    imageAlt: `alt ${id}`,
  },
})

describe('loadPosts', () => {
  beforeEach(() => {
    vi.mocked(getImage).mockImplementation((async (o: { width: number; format: string }) => ({
      src: `/img-${o.width}.${o.format}`,
      srcSet: { attribute: `set-${o.width}` },
    })) as never)
  })

  it('builds cover, thumb and og images for the entries of the locale', async () => {
    vi.mocked(getCollection).mockResolvedValue([entry('hello.en'), entry('hello.pt')] as never)
    const posts = await loadPosts('en')
    expect(posts).toHaveLength(1)
    expect(posts[0]).toMatchObject({
      slug: 'hello',
      title: 'title hello.en',
      date: '2026-01-02',
      locales: expect.arrayContaining(['en', 'pt']),
      cover: { src: '/img-820.webp', srcSet: 'set-820', alt: 'alt hello.en' },
      thumb: { src: '/img-176.webp', srcSet: 'set-176' },
      ogImage: '/img-1200.jpg',
    })
  })

  it('keeps the rendered html and headings', async () => {
    const headings = [{ depth: 2, slug: 'a', text: 'A' }]
    vi.mocked(getCollection).mockResolvedValue([
      entry('p.en', { html: '<h2 id="a">A</h2>', metadata: { headings } }),
    ] as never)
    const [post] = await loadPosts('en')
    expect(post.toc).toEqual(headings)
  })

  it('returns nothing when no entry is written in the locale', async () => {
    vi.mocked(getCollection).mockResolvedValue([entry('p.en')] as never)
    expect(await loadPosts('pt')).toEqual([])
  })
})
