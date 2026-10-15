import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { BlogPostWindow } from './BlogPostWindow'

const post = {
  slug: 'hello',
  title: 'Hello',
  date: '2026-01-01',
  description: 'A post.',
  body: [{ html: '<p>Body <em>text</em>.</p>' }],
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
    expect(article.closest('.max-w-prose')).not.toBeNull()
    expect(article).not.toHaveClass('max-w-none')
  })
})
