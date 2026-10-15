import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { WindowManagerProvider, useWindowManager } from './WindowManager'
import type { WindowConfig } from './WindowManager'

const baseConfig: WindowConfig = {
  id: 'test',
  url: '/test',
  title: 'Test',
  content: null,
  position: { x: 100, y: 100 },
  size: { width: 400, height: 300 },
  isExpanded: false,
  isMinimized: false,
}

function Probe({ onCapture }: { onCapture: (ctx: ReturnType<typeof useWindowManager>) => void }) {
  const ctx = useWindowManager()
  onCapture(ctx)
  return null
}

function TestConsumer() {
  const { windows, openWindow, closeWindow } = useWindowManager()
  return (
    <div>
      <span data-testid="count">{windows.length}</span>
      <button
        onClick={() =>
          openWindow({
            id: 'test-1',
            url: '/test',
            title: 'Test',
            content: <p>content</p>,
            position: { x: 0, y: 0 },
            size: { width: 400, height: 300 },
            isExpanded: false,
            isMinimized: false,
          })
        }
      >
        open
      </button>
      <button onClick={() => closeWindow('test-1')}>close</button>
    </div>
  )
}

describe('WindowManager', () => {
  it('starts with zero windows', () => {
    render(
      <WindowManagerProvider>
        <TestConsumer />
      </WindowManagerProvider>
    )
    expect(screen.getByTestId('count').textContent).toBe('0')
  })

  it('opens a window', async () => {
    render(
      <WindowManagerProvider>
        <TestConsumer />
      </WindowManagerProvider>
    )
    await userEvent.click(screen.getByText('open'))
    expect(screen.getByTestId('count').textContent).toBe('1')
  })

  it('closes a window', async () => {
    render(
      <WindowManagerProvider>
        <TestConsumer />
      </WindowManagerProvider>
    )
    await userEvent.click(screen.getByText('open'))
    await userEvent.click(screen.getByText('close'))
    expect(screen.getByTestId('count').textContent).toBe('0')
  })

  it('does not open duplicate windows (focuses instead)', async () => {
    render(
      <WindowManagerProvider>
        <TestConsumer />
      </WindowManagerProvider>
    )
    await userEvent.click(screen.getByText('open'))
    await userEvent.click(screen.getByText('open'))
    expect(screen.getByTestId('count').textContent).toBe('1')
  })

  it('cascades a fixed-size window off the top one, but not a content-sized one', () => {
    let ctx!: ReturnType<typeof useWindowManager>
    render(
      <WindowManagerProvider>
        <Probe onCapture={(c) => (ctx = c)} />
      </WindowManagerProvider>
    )
    act(() => ctx.openWindow({ ...baseConfig, id: 'first' }))
    act(() => ctx.openWindow({ ...baseConfig, id: 'second' }))
    act(() => ctx.openWindow({ ...baseConfig, id: 'auto', size: { width: 400, height: 'auto' } }))
    const at = (id: string) => ctx.windows.find((w) => w.id === id)?.position
    expect(at('second')).toEqual({ x: 150, y: 150 })
    expect(at('auto')).toEqual(baseConfig.position)
  })

  it('resizeWindow updates size and position', () => {
    let ctx!: ReturnType<typeof useWindowManager>
    render(
      <WindowManagerProvider>
        <Probe
          onCapture={(c) => {
            ctx = c
          }}
        />
      </WindowManagerProvider>
    )

    act(() => ctx.openWindow(baseConfig))
    act(() => ctx.resizeWindow('test', { width: 600, height: 500 }, { x: 50, y: 80 }))

    const win = ctx.windows.find((w) => w.id === 'test')!
    expect(win.size).toEqual({ width: 600, height: 500 })
    expect(win.position).toEqual({ x: 50, y: 80 })
  })

  it('openWindow stores origin when provided', () => {
    let ctx!: ReturnType<typeof useWindowManager>
    render(
      <WindowManagerProvider>
        <Probe
          onCapture={(c) => {
            ctx = c
          }}
        />
      </WindowManagerProvider>
    )

    const origin = { x: 10, y: 20, width: 80, height: 36 }
    act(() => ctx.openWindow({ ...baseConfig, origin }))

    const win = ctx.windows.find((w) => w.id === 'test')!
    expect(win.origin).toEqual(origin)
  })

  it('resizeWindow with nonexistent id leaves state unchanged', () => {
    let ctx!: ReturnType<typeof useWindowManager>
    render(
      <WindowManagerProvider>
        <Probe
          onCapture={(c) => {
            ctx = c
          }}
        />
      </WindowManagerProvider>
    )
    act(() => ctx.openWindow(baseConfig))
    const before = ctx.windows.length
    act(() => ctx.resizeWindow('nonexistent', { width: 999, height: 999 }, { x: 0, y: 0 }))
    expect(ctx.windows.length).toBe(before)
    expect(ctx.windows[0].size).toEqual({ width: 400, height: 300 })
  })
})

describe('WindowManager history', () => {
  const blog: WindowConfig = { ...baseConfig, id: 'blog', url: '/pt/blog/', pageTitle: 'Blog' }
  const post: WindowConfig = { ...baseConfig, id: 'post', url: '/pt/blog/post/', pageTitle: 'Post' }

  function renderManager(props: Partial<Parameters<typeof WindowManagerProvider>[0]> = {}) {
    let ctx!: ReturnType<typeof useWindowManager>
    render(
      <WindowManagerProvider homeUrl="/pt/" homeTitle="Home" {...props}>
        <Probe
          onCapture={(c) => {
            ctx = c
          }}
        />
      </WindowManagerProvider>
    )
    return () => ctx
  }

  const popTo = (url: string) =>
    act(() => {
      history.pushState(null, '', url)
      window.dispatchEvent(new PopStateEvent('popstate'))
    })

  beforeEach(() => history.replaceState(null, '', '/pt/'))

  it('renders the windows the page was served with', () => {
    const ctx = renderManager({ initialWindows: [blog, post] })
    expect(ctx().windows.map((w) => w.id)).toEqual(['blog', 'post'])
    expect(document.title).toBe('Post')
  })

  it('pushes the URL of a window it opens and titles the tab after it', () => {
    const ctx = renderManager()
    act(() => ctx().openWindow(blog))
    expect(location.pathname).toBe('/pt/blog/')
    expect(history.state).toEqual({ _appWindow: 'blog' })
    expect(document.title).toBe('Blog')
  })

  it('goes Back when closing the window that pushed the current entry', () => {
    const back = vi.spyOn(history, 'back').mockImplementation(() => undefined)
    const ctx = renderManager()
    act(() => ctx().openWindow(blog))
    act(() => ctx().closeWindow('blog'))
    expect(back).toHaveBeenCalledOnce()
    expect(ctx().windows).toEqual([])
    back.mockRestore()
  })

  it('rewrites the URL to the next window when closing a server-rendered one', () => {
    history.replaceState(null, '', '/pt/blog/post/')
    const ctx = renderManager({ initialWindows: [blog, post] })
    act(() => ctx().closeWindow('post'))
    expect(location.pathname).toBe('/pt/blog/')
    act(() => ctx().closeWindow('blog'))
    expect(location.pathname).toBe('/pt/')
    expect(document.title).toBe('Home')
  })

  it('rewrites the URL to the window brought to the front', () => {
    history.replaceState(null, '', '/pt/blog/post/')
    const ctx = renderManager({ initialWindows: [blog, post] })
    act(() => ctx().focusWindow('blog'))
    expect(location.pathname).toBe('/pt/blog/')
    expect(document.title).toBe('Blog')
    act(() => ctx().focusWindow('home'))
    expect(location.pathname).toBe('/pt/')
    expect(document.title).toBe('Home')
  })

  it('rewrites the URL instead of going Back once another window took the entry over', () => {
    const back = vi.spyOn(history, 'back').mockImplementation(() => undefined)
    const ctx = renderManager({ initialWindows: [blog] })
    act(() => ctx().openWindow(post))
    act(() => ctx().focusWindow('home'))
    act(() => ctx().closeWindow('post'))
    expect(back).not.toHaveBeenCalled()
    expect(location.pathname).toBe('/pt/')
    back.mockRestore()
  })

  it('pushes no entry when a window that is already open is opened again', () => {
    const ctx = renderManager()
    act(() => ctx().openWindow(blog))
    const entries = history.length
    act(() => ctx().openWindow(post))
    act(() => ctx().openWindow(blog))
    expect(history.length).toBe(entries + 1)
    expect(location.pathname).toBe('/pt/blog/post/')
  })

  it('opens and closes windows to match the URL that Back or Forward lands on', () => {
    const byPath: Record<string, WindowConfig[]> = {
      '/pt/blog/post/': [blog, post],
      '/pt/blog/': [blog],
    }
    const windowsForPath = (path: string) => byPath[path] ?? []
    const ctx = renderManager({ windowsForPath })
    popTo('/pt/blog/post/')
    expect(ctx().windows.map((w) => w.id)).toEqual(['blog', 'post'])
    popTo('/pt/blog/')
    expect(ctx().windows.map((w) => w.id)).toEqual(['blog'])
    popTo('/pt/')
    expect(ctx().windows).toEqual([])
  })
})
