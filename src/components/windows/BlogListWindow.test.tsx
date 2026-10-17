import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { LocaleProvider } from '../../i18n/react'
import { BlogListWindow } from './BlogListWindow'
import { WindowManagerProvider, useWindowManager } from './WindowManager'

const post = (slug: string) => ({
  slug,
  title: slug,
  date: '2026-01-01',
  description: 'A post.',
  body: [],
  toc: [],
  locales: ['pt' as const],
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
  it('fetches the first thumbnail early only when the list is in front', () => {
    const imgs = (priority: boolean) =>
      render(
        <LocaleProvider locale="en">
          <WindowManagerProvider>
            <BlogListWindow posts={[post('first'), post('second')]} priority={priority} />
          </WindowManagerProvider>
        </LocaleProvider>
      ).container.querySelectorAll('img')
    const front = imgs(true)
    expect(front[0]).toHaveAttribute('loading', 'eager')
    expect(front[0]).toHaveAttribute('fetchpriority', 'high')
    expect(front[1]).toHaveAttribute('loading', 'lazy')
    const behind = imgs(false)
    expect(behind[0]).toHaveAttribute('loading', 'lazy')
    expect(behind[0]).not.toHaveAttribute('fetchpriority', 'high')
  })
})

function OpenIds() {
  const { windows } = useWindowManager()
  return <output>{windows.map((w) => w.id).join(',')}</output>
}

function renderList(posts: ReturnType<typeof post>[], locale: 'pt' | 'en' = 'en') {
  return render(
    <LocaleProvider locale={locale}>
      <WindowManagerProvider>
        <BlogListWindow posts={posts} />
        <OpenIds />
      </WindowManagerProvider>
    </LocaleProvider>
  )
}

describe('BlogListWindow interaction', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    localStorage.clear()
  })

  it('links each post to its page in the current language', () => {
    renderList([post('first')], 'en')
    expect(screen.getByRole('link', { name: /first/ })).toHaveAttribute('href', '/en/blog/first/')
  })

  it('opens the post as a window on a plain click', async () => {
    renderList([post('first')])
    await userEvent.click(screen.getByRole('link', { name: /first/ }))
    expect(screen.getByRole('status')).toHaveTextContent('post-first')
  })

  it('leaves a modified click to the browser', () => {
    renderList([post('first')])
    const notPrevented = fireEvent.click(screen.getByRole('link', { name: /first/ }), {
      ctrlKey: true,
    })
    expect(notPrevented).toBe(true)
    expect(screen.getByRole('status')).toHaveTextContent('')
  })

  it('says the list is empty when there are no posts', () => {
    renderList([])
    expect(screen.getByText(/\(empty\)/)).toBeInTheDocument()
    expect(screen.queryByRole('listitem')).toBeNull()
  })

  it('offers the blog list in the other language to a browser that prefers it', () => {
    vi.spyOn(navigator, 'language', 'get').mockReturnValue('pt-BR')
    renderList([post('first')], 'en')
    expect(screen.getByRole('link', { name: 'Ler em português' })).toHaveAttribute(
      'href',
      '/pt/blog/'
    )
  })
})
