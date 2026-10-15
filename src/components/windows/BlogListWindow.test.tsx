import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { LocaleProvider } from '../../i18n/react'
import { BlogListWindow } from './BlogListWindow'
import { WindowManagerProvider } from './WindowManager'

const post = (slug: string) => ({
  slug,
  title: slug,
  date: '2026-01-01',
  description: 'A post.',
  html: '',
  cover: { src: '/c.webp', srcSet: '/c.webp 820w', alt: 'A cover.' },
  thumb: { src: `/${slug}.webp`, srcSet: `/${slug}.webp 176w` },
  ogImage: '/og.jpg',
})

describe('BlogListWindow', () => {
  it('alternates the thumbnail between the left and the right', () => {
    render(
      <LocaleProvider locale="en">
        <WindowManagerProvider>
          <BlogListWindow posts={[post('first'), post('second')]} />
        </WindowManagerProvider>
      </LocaleProvider>
    )
    const [first, second] = screen.getAllByRole('link')
    expect(first).toHaveClass('sm:flex-row')
    expect(second).toHaveClass('sm:flex-row-reverse')
  })

  it('keeps the thumbnails out of the accessibility tree', () => {
    const { container } = render(
      <LocaleProvider locale="en">
        <WindowManagerProvider>
          <BlogListWindow posts={[post('first')]} />
        </WindowManagerProvider>
      </LocaleProvider>
    )
    expect(container.querySelector('img')).toHaveAttribute('alt', '')
    expect(screen.queryByRole('img')).toBeNull()
  })
})
