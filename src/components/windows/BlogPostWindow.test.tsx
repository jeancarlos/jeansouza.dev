import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { BlogPostWindow } from './BlogPostWindow'

const post = {
  slug: 'hello',
  title: 'Hello',
  date: '2026-01-01',
  description: 'A post.',
  content: 'Body.',
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

  it('keeps the text in a column of readable width', () => {
    render(<BlogPostWindow post={post} />)
    const article = screen.getByRole('article')
    expect(article.closest('.max-w-prose')).not.toBeNull()
    expect(article).not.toHaveClass('max-w-none')
  })
})
