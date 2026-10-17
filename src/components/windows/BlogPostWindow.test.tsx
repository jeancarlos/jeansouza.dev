import { render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { BlogPostWindow } from './BlogPostWindow'

const post = {
  slug: 'hello',
  title: 'Hello',
  date: '2026-01-01',
  description: 'A post.',
  body: [{ html: '<p>Body <em>text</em>.</p>' }],
  toc: [],
  locales: ['pt' as const],
  cover: { src: '/c.webp', srcSet: '/c.webp 820w', alt: 'A cover.' },
  thumb: { src: '/t.webp', srcSet: '/t.webp 176w' },
  ogImage: '/og-hello.jpg',
}

describe('BlogPostWindow', () => {
  it('shows the cover outside the reading column', () => {
    render(<BlogPostWindow post={post} />)
    const cover = screen.getByRole('img', { name: 'A cover.' })
    expect(cover).toHaveAttribute('srcset', '/c.webp 820w')
    expect(cover.closest('.max-w-prose')).toBeNull()
  })

  it('renders the html built from the markdown', () => {
    render(<BlogPostWindow post={post} />)
    expect(screen.getByRole('article').querySelector('em')).toHaveTextContent('text')
  })

  it('renders a timeline between the html around it', () => {
    render(
      <BlogPostWindow
        post={{
          ...post,
          body: [
            { html: '<p>before</p>' },
            { timeline: [{ date: '2020', title: 'First job' }] },
            { html: '<p>after</p>' },
          ],
        }}
      />
    )
    const article = screen.getByRole('article')
    const order = [...article.querySelectorAll('p, h3')].map((el) => el.textContent)
    expect(order).toEqual(expect.arrayContaining(['before', 'First job', 'after']))
    expect(order.indexOf('before')).toBeLessThan(order.indexOf('First job'))
    expect(order.indexOf('First job')).toBeLessThan(order.indexOf('after'))
  })

  it('keeps the text in a column of readable width', () => {
    render(<BlogPostWindow post={post} />)
    const article = screen.getByRole('article')
    expect(article.closest('.max-w-3xl')).not.toBeNull()
  })

  it('lists the headings in a table of contents that links to them', () => {
    render(
      <BlogPostWindow
        post={{
          ...post,
          body: [{ html: '<h2 id="one">One</h2><h3 id="two">Two</h3>' }],
          toc: [
            { depth: 2, slug: 'one', text: 'One' },
            { depth: 3, slug: 'two', text: 'Two' },
          ],
        }}
      />
    )
    const tocs = screen.getAllByRole('navigation', { name: 'Tópicos' })
    expect(tocs).toHaveLength(2)
    for (const toc of tocs) {
      const links = toc.querySelectorAll('a')
      expect([...links].map((a) => a.getAttribute('href'))).toEqual(['#one', '#two'])
    }
  })

  it('pins the table of contents beside the post on wide windows and folds it on narrow ones', () => {
    render(
      <BlogPostWindow
        post={{
          ...post,
          toc: [
            { depth: 2, slug: 'one', text: 'One' },
            { depth: 2, slug: 'two', text: 'Two' },
          ],
        }}
      />
    )
    const [sidebar, folded] = screen.getAllByRole('navigation', { name: 'Tópicos' })
    expect(sidebar).toHaveClass('sticky', 'hidden', '@min-[900px]:block')
    expect(sidebar.closest('article')).toBeNull()
    const details = folded.closest('details')
    expect(details).toHaveClass('@min-[900px]:hidden')
    expect(details).not.toHaveAttribute('open')
    expect(details?.querySelector('summary')).toHaveTextContent('Tópicos')
  })

  it('skips the table of contents for a post with one heading or none', () => {
    render(<BlogPostWindow post={{ ...post, toc: [{ depth: 2, slug: 'one', text: 'One' }] }} />)
    expect(screen.queryByRole('navigation')).toBeNull()
  })
})

describe('BlogPostWindow language notice', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    localStorage.clear()
  })

  it('offers the post in the other language it was written in', () => {
    vi.spyOn(navigator, 'language', 'get').mockReturnValue('en-US')
    render(<BlogPostWindow post={{ ...post, locales: ['pt', 'en'] }} />)
    expect(screen.getByRole('link', { name: 'Read in English' })).toHaveAttribute(
      'href',
      '/en/blog/hello/'
    )
  })

  it('stays quiet for a post that exists in one language only', () => {
    vi.spyOn(navigator, 'language', 'get').mockReturnValue('en-US')
    render(<BlogPostWindow post={post} />)
    expect(screen.queryByRole('link', { name: 'Read in English' })).toBeNull()
  })
})
