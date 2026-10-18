import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

type Listener = (e?: unknown) => void

const added: [EventTarget, string, EventListenerOrEventListenerObject][] = []

const workers: { url: URL; opts: unknown; postMessage: ReturnType<typeof vi.fn> }[] = []
let mediaMatches = false
let mediaListener: Listener = () => undefined

function setupEnv({
  offscreen = true,
  idle = true,
  canvas = true,
  toggle = true,
  locale = true,
}: {
  offscreen?: boolean
  idle?: boolean
  canvas?: boolean
  toggle?: boolean
  locale?: boolean
} = {}) {
  for (const target of [window, document, document.documentElement]) {
    const original = target.addEventListener.bind(target)
    vi.spyOn(target, 'addEventListener').mockImplementation(
      (type: string, listener: EventListenerOrEventListenerObject, opts?: unknown) => {
        added.push([target, type, listener])
        original(type, listener, opts as AddEventListenerOptions)
      }
    )
  }
  document.body.innerHTML = `${canvas ? '<canvas data-topography></canvas>' : ''}${
    toggle ? '<button data-theme-toggle></button>' : ''
  }${
    locale
      ? '<a data-locale-switch hreflang="pt" href="/en/blog/" data-page="/en/blog/">pt</a>'
      : ''
  }`
  const c = document.querySelector<HTMLCanvasElement>('canvas')
  if (c && offscreen) {
    ;(c as unknown as { transferControlToOffscreen: () => object }).transferControlToOffscreen =
      () => ({ offscreen: true })
  }
  vi.stubGlobal(
    'Worker',
    class {
      postMessage = vi.fn()
      constructor(url: URL, opts: unknown) {
        workers.push({ url, opts, postMessage: this.postMessage })
      }
    }
  )
  vi.stubGlobal(
    'matchMedia',
    vi.fn(() => ({
      get matches() {
        return mediaMatches
      },
      addEventListener: (_: string, l: Listener) => {
        mediaListener = l
      },
    }))
  )
  vi.stubGlobal('requestAnimationFrame', (cb: () => void) => {
    cb()
    return 1
  })
  if (idle) {
    vi.stubGlobal('requestIdleCallback', (cb: () => void) => cb())
  } else {
    Reflect.deleteProperty(window, 'requestIdleCallback')
    Reflect.deleteProperty(globalThis, 'requestIdleCallback')
  }
}

async function load() {
  await import('./chrome')
}

beforeEach(() => {
  vi.resetModules()
  workers.length = 0
  mediaMatches = false
  localStorage.clear()
  delete document.documentElement.dataset.theme
  document.documentElement.style.colorScheme = ''
  document.documentElement.style.setProperty('--contour-color', ' #abc ')
})

afterEach(() => {
  for (const [target, type, listener] of added.splice(0)) target.removeEventListener(type, listener)
  vi.unstubAllGlobals()
  vi.useRealTimers()
  vi.restoreAllMocks()
})

describe('chrome theme toggle', () => {
  it('syncs aria-checked and switches theme on click, persisting it', async () => {
    setupEnv({ canvas: false, locale: false })
    document.documentElement.dataset.theme = 'dark'
    await load()
    const button = document.querySelector<HTMLButtonElement>('[data-theme-toggle]')!
    expect(button).toHaveAttribute('aria-checked', 'false')
    button.click()
    expect(document.documentElement.dataset.theme).toBe('light')
    expect(document.documentElement.style.colorScheme).toBe('light')
    expect(localStorage.getItem('theme')).toBe('light')
    expect(button).toHaveAttribute('aria-checked', 'true')
    button.click()
    expect(document.documentElement.dataset.theme).toBe('dark')
    expect(button).toHaveAttribute('aria-checked', 'false')
  })

  it('still switches when storage throws', async () => {
    setupEnv({ canvas: false, locale: false })
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('denied')
    })
    await load()
    document.querySelector<HTMLButtonElement>('[data-theme-toggle]')!.click()
    expect(document.documentElement.dataset.theme).toBe('light')
  })

  it('does nothing without a toggle, canvas or locale link', async () => {
    setupEnv({ canvas: false, toggle: false, locale: false })
    await expect(load()).resolves.toBeUndefined()
    expect(workers).toHaveLength(0)
  })
})

async function clickLocaleLink(path: string) {
  setupEnv({ canvas: false, toggle: false })
  history.replaceState(null, '', path)
  await load()
  const link = document.querySelector<HTMLAnchorElement>('[data-locale-switch]')!
  link.addEventListener('click', (e) => e.preventDefault())
  link.click()
  return link
}

describe('chrome locale switch', () => {
  it('stores the chosen locale and rewrites the href when the path differs', async () => {
    const link = await clickLocaleLink('/en/more/')
    expect(localStorage.getItem('locale')).toBe('pt')
    expect(link.getAttribute('href')).toBe('/pt/more/')
  })

  it('keeps the href when already on the linked page', async () => {
    const link = await clickLocaleLink('/en/blog/')
    expect(link.getAttribute('href')).toBe('/en/blog/')
  })
})

describe('chrome topography', () => {
  it('does not start a worker when OffscreenCanvas is unsupported', async () => {
    setupEnv({ offscreen: false, locale: false })
    await load()
    expect(workers).toHaveLength(0)
    document.querySelector<HTMLButtonElement>('[data-theme-toggle]')!.click()
  })

  it('starts the worker on idle with canvas, size, color and animation', async () => {
    setupEnv({ locale: false, toggle: false })
    await load()
    expect(workers).toHaveLength(1)
    const msg = workers[0].postMessage.mock.calls[0][0]
    expect(msg).toMatchObject({
      canvas: { offscreen: true },
      w: innerWidth,
      h: innerHeight,
      color: '#abc',
      animate: true,
    })
    expect(workers[0].opts).toEqual({ type: 'module' })
  })

  it('does not animate under reduced motion', async () => {
    mediaMatches = true
    setupEnv({ locale: false, toggle: false })
    await load()
    expect(workers[0].postMessage.mock.calls[0][0].animate).toBe(false)
  })

  it('keeps animating on narrow viewports', async () => {
    setupEnv({ locale: false, toggle: false })
    await load()
    expect(vi.mocked(matchMedia).mock.calls[0][0]).toBe('(prefers-reduced-motion: reduce)')
  })

  it('falls back to a timeout without requestIdleCallback', async () => {
    vi.useFakeTimers()
    setupEnv({ idle: false, locale: false, toggle: false })
    await load()
    expect(workers).toHaveLength(0)
    vi.advanceTimersByTime(200)
    expect(workers).toHaveLength(1)
  })

  it('forwards resize, pointer, visibility and motion changes to the worker', async () => {
    setupEnv({ locale: false, toggle: false })
    await load()
    const post = workers[0].postMessage
    post.mockClear()

    window.dispatchEvent(new Event('resize'))
    expect(post).toHaveBeenLastCalledWith(
      expect.objectContaining({ w: innerWidth, h: innerHeight })
    )

    window.dispatchEvent(new PointerEvent('pointermove', { clientX: 5, clientY: 7 }))
    expect(post).toHaveBeenLastCalledWith({ pointer: [5, 7] })

    document.documentElement.dispatchEvent(new Event('pointerleave'))
    expect(post).toHaveBeenLastCalledWith({ pointer: null })

    mediaListener()
    expect(post).toHaveBeenLastCalledWith({ animate: true })

    mediaMatches = true
    document.dispatchEvent(new Event('visibilitychange'))
    expect(post).toHaveBeenLastCalledWith({ animate: false })
  })

  it('merges updates queued in the same frame into one message', async () => {
    setupEnv({ locale: false, toggle: false })
    const frames: (() => void)[] = []
    vi.stubGlobal('requestAnimationFrame', (cb: () => void) => frames.push(cb))
    await load()
    const post = workers[0].postMessage
    post.mockClear()
    window.dispatchEvent(new PointerEvent('pointermove', { clientX: 1, clientY: 2 }))
    window.dispatchEvent(new Event('resize'))
    expect(frames).toHaveLength(1)
    frames[0]()
    expect(post).toHaveBeenCalledTimes(1)
    expect(post.mock.calls[0][0]).toMatchObject({ pointer: [1, 2], w: innerWidth })
  })

  it('repaints the contour color after a theme change', async () => {
    setupEnv({ locale: false })
    await load()
    const post = workers[0].postMessage
    document.documentElement.style.setProperty('--contour-color', '#fff')
    post.mockClear()
    document.querySelector<HTMLButtonElement>('[data-theme-toggle]')!.click()
    expect(post).toHaveBeenCalledWith({ color: '#fff' })
  })
})
