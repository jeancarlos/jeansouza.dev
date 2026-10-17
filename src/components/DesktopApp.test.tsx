import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, act, waitFor } from '@testing-library/react'
import { DesktopApp } from './DesktopApp'
import type { Post } from '@/lib/posts'
import type { WindowConfig } from './windows/WindowManager'

vi.mock('./windows/pageWindows', () => ({
  windowsForPage: vi.fn((page: { kind: string } | undefined): WindowConfig[] =>
    page && page.kind !== 'home'
      ? [
          {
            id: page.kind,
            url: `/en/${page.kind}/`,
            title: `~/${page.kind}`,
            pageTitle: `title-${page.kind}`,
            content: <p>content-{page.kind}</p>,
            position: { x: 0, y: 0 },
            size: { width: 400, height: 300 },
          },
        ]
      : []
  ),
}))

vi.mock('./HomeClient', async () => {
  const { useWindowManager } = await import('./windows/WindowManager')
  const { useLocale } = await import('../i18n/react')
  return {
    HomeClient: (p: { isHomePage: boolean }) => {
      const { windows } = useWindowManager()
      return (
        <div data-testid="home" data-home={String(p.isHomePage)} data-locale={useLocale()}>
          {windows.map((w) => (
            <span key={w.id}>{w.id}</span>
          ))}
        </div>
      )
    },
  }
})

const posts = [{ slug: 'hello' }] as Post[]

beforeEach(() => {
  document.title = ''
})

describe('DesktopApp', () => {
  it('renders the home page with no windows and the home title', () => {
    render(<DesktopApp locale="en" posts={posts} pathname="/en/" />)
    const home = screen.getByTestId('home')
    expect(home).toHaveAttribute('data-home', 'true')
    expect(home).toHaveAttribute('data-locale', 'en')
    expect(home).toBeEmptyDOMElement()
    expect(document.title).not.toBe('')
  })

  it('opens the window for the page path and uses its title', () => {
    render(<DesktopApp locale="en" posts={posts} pathname="/en/blog/" />)
    expect(screen.getByTestId('home')).toHaveAttribute('data-home', 'false')
    expect(screen.getByText('blog')).toBeInTheDocument()
    expect(document.title).toBe('title-blog')
  })

  it('treats an unknown path as not home with no windows', () => {
    render(<DesktopApp locale="pt" posts={posts} pathname="/pt/nope/" />)
    expect(screen.getByTestId('home')).toHaveAttribute('data-home', 'false')
    expect(screen.getByTestId('home')).toBeEmptyDOMElement()
  })

  it('reconciles windows with the URL on popstate', async () => {
    render(<DesktopApp locale="en" posts={posts} pathname="/en/" />)
    history.replaceState(null, '', '/en/more/')
    act(() => {
      window.dispatchEvent(new PopStateEvent('popstate'))
    })
    await waitFor(() => expect(screen.getByText('more')).toBeInTheDocument())
    history.replaceState(null, '', '/en/')
    act(() => {
      window.dispatchEvent(new PopStateEvent('popstate'))
    })
    await waitFor(() => expect(screen.queryByText('more')).not.toBeInTheDocument())
  })
})
