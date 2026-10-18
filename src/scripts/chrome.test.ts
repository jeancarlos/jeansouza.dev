import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

type Listener = (e?: unknown) => void

const observers: MutationObserver[] = []

const added: [EventTarget, string, EventListenerOrEventListenerObject][] = []

const workers: { url: URL; opts: unknown; postMessage: ReturnType<typeof vi.fn> }[] = []
let mediaMatches = false
let mobileMatches = false
const mediaListeners: Record<string, Listener> = {}
const mediaListener = () => mediaListeners['(prefers-reduced-motion: reduce)']()
const NARROW = '(width < 48rem)'

function setupEnv({
  offscreen = true,
  idle = true,
  canvas = true,
  toggle = true,
  locale = true,
  motion = true,
}: {
  offscreen?: boolean
  idle?: boolean
  canvas?: boolean
  toggle?: boolean
  locale?: boolean
  motion?: boolean
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
  const RealObserver = MutationObserver
  vi.stubGlobal(
    'MutationObserver',
    class extends RealObserver {
      constructor(cb: MutationCallback) {
        super(cb)
        observers.push(this)
      }
    }
  )
  document.body.innerHTML = `${canvas ? '<canvas data-topography></canvas>' : ''}${
    toggle
      ? '<button data-theme-toggle data-tip-on="Set dark mode" data-tip-off="Set light mode"><span data-tip></span></button>'
      : ''
  }${
    motion
      ? '<button aria-pressed="false" data-motion-toggle data-tip-on="Resume" data-tip-off="Pause"><span data-tip></span></button>'
      : ''
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
    vi.fn((query: string) => ({
      get matches() {
        return query === NARROW ? mobileMatches : mediaMatches
      },
      addEventListener: (_: string, l: Listener) => {
        mediaListeners[query] = l
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
  mobileMatches = false
  delete document.documentElement.dataset.windows
  history.replaceState(null, '', '/pt/')
  localStorage.clear()
  delete document.documentElement.dataset.theme
  delete document.documentElement.dataset.motion
  document.documentElement.style.colorScheme = ''
  document.documentElement.style.setProperty('--contour-color', ' #abc ')
})

afterEach(() => {
  for (const observer of observers.splice(0)) observer.disconnect()
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
    expect(post).toHaveBeenLastCalledWith({ animate: false, intro: 0 })
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

describe('chrome tooltips', () => {
  it('names the action the theme switch will take, and follows its state', async () => {
    setupEnv({ canvas: false, locale: false, motion: false })
    document.documentElement.dataset.theme = 'dark'
    await load()
    const button = document.querySelector<HTMLButtonElement>('[data-theme-toggle]')!
    const tip = button.querySelector('[data-tip]')!
    expect(tip).toHaveAttribute('data-tip', 'Set light mode')
    button.click()
    expect(tip).toHaveAttribute('data-tip', 'Set dark mode')
  })
})

describe('chrome motion toggle', () => {
  const postedAnimate = () =>
    workers[0].postMessage.mock.calls.map((c) => c[0].animate).filter((a) => a !== undefined)

  it('pauses the background, persists the choice and updates aria and tooltip', async () => {
    setupEnv({ locale: false, toggle: false })
    await load()
    const button = document.querySelector<HTMLButtonElement>('[data-motion-toggle]')!
    const tip = button.querySelector('[data-tip]')!
    expect(button).toHaveAttribute('aria-pressed', 'false')
    expect(tip).toHaveAttribute('data-tip', 'Pause')
    button.click()
    expect(document.documentElement.dataset.motion).toBe('paused')
    expect(localStorage.getItem('motion')).toBe('paused')
    expect(button).toHaveAttribute('aria-pressed', 'true')
    expect(tip).toHaveAttribute('data-tip', 'Resume')
    expect(postedAnimate().at(-1)).toBe(false)
    button.click()
    expect(localStorage.getItem('motion')).toBe('playing')
    expect(postedAnimate().at(-1)).toBe(true)
  })

  it('starts paused when the visitor paused it before', async () => {
    document.documentElement.dataset.motion = 'paused'
    setupEnv({ locale: false, toggle: false })
    await load()
    expect(workers[0].postMessage.mock.calls[0][0].animate).toBe(false)
    expect(document.querySelector('[data-motion-toggle]')).toHaveAttribute('aria-pressed', 'true')
  })

  it('stays paused when the page becomes visible again', async () => {
    setupEnv({ locale: false, toggle: false })
    await load()
    document.querySelector<HTMLButtonElement>('[data-motion-toggle]')!.click()
    document.dispatchEvent(new Event('visibilitychange'))
    expect(postedAnimate().at(-1)).toBe(false)
  })

  it('still toggles when storage throws or there is no canvas', async () => {
    setupEnv({ canvas: false, locale: false, toggle: false })
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('denied')
    })
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('denied')
    })
    await load()
    document.querySelector<HTMLButtonElement>('[data-motion-toggle]')!.click()
    expect(document.documentElement.dataset.motion).toBe('paused')
  })
})

describe('chrome topography off the home page on mobile', () => {
  const open = async (state: 'open' | 'none') => {
    document.documentElement.dataset.windows = state
    await new Promise((resolve) => setTimeout(resolve))
  }

  it('does not start the worker on mobile while a window is open', async () => {
    mobileMatches = true
    document.documentElement.dataset.windows = 'open'
    setupEnv({ locale: false, toggle: false })
    await load()
    expect(workers).toHaveLength(0)
  })

  it('does not start on a window page before the windows hydrate', async () => {
    mobileMatches = true
    history.replaceState(null, '', '/pt/blog/')
    setupEnv({ locale: false, toggle: false })
    await load()
    expect(workers).toHaveLength(0)
  })

  it('starts the worker on mobile at home', async () => {
    mobileMatches = true
    setupEnv({ locale: false, toggle: false })
    await load()
    expect(workers).toHaveLength(1)
    expect(workers[0].postMessage.mock.calls[0][0].animate).toBe(true)
  })

  it('keeps animating on desktop with a window open', async () => {
    document.documentElement.dataset.windows = 'open'
    setupEnv({ locale: false, toggle: false })
    await load()
    expect(workers[0].postMessage.mock.calls[0][0].animate).toBe(true)
  })

  it('stops when a window opens and resumes when it closes', async () => {
    mobileMatches = true
    setupEnv({ locale: false, toggle: false })
    await load()
    const post = workers[0].postMessage
    await open('open')
    expect(post).toHaveBeenLastCalledWith({ animate: false })
    await open('none')
    expect(post).toHaveBeenLastCalledWith({ animate: true })
  })

  it('starts late when the reader returns home', async () => {
    mobileMatches = true
    document.documentElement.dataset.windows = 'open'
    setupEnv({ locale: false, toggle: false })
    await load()
    await open('none')
    expect(workers).toHaveLength(1)
  })

  it('reacts to the viewport becoming narrow or wide', async () => {
    setupEnv({ locale: false, toggle: false })
    document.documentElement.dataset.windows = 'open'
    await load()
    mobileMatches = true
    mediaListeners[NARROW]()
    expect(workers[0].postMessage).toHaveBeenLastCalledWith({ animate: false })
  })
})

describe('chrome background intro', () => {
  it('asks for the intro on the first frame, unless motion is reduced', async () => {
    setupEnv({ locale: false, toggle: false })
    await load()
    expect(workers[0].postMessage.mock.calls[0][0].intro).toBe(2800)
  })

  it('skips the intro under reduced motion', async () => {
    mediaMatches = true
    setupEnv({ locale: false, toggle: false })
    await load()
    expect(workers[0].postMessage.mock.calls[0][0].intro).toBe(0)
  })

  it('freezes on pause and carries on from the same point on unpause, with no new intro', async () => {
    setupEnv({ locale: false, toggle: false })
    await load()
    const post = workers[0].postMessage
    const button = document.querySelector<HTMLButtonElement>('[data-motion-toggle]')!
    post.mockClear()
    button.click()
    expect(post).toHaveBeenLastCalledWith({ animate: false })
    button.click()
    expect(post).toHaveBeenLastCalledWith({ animate: true })
    for (const [message] of post.mock.calls) expect(message).not.toHaveProperty('intro')
  })

  it('stays paused on reload and plays the quick intro', async () => {
    document.documentElement.dataset.motion = 'paused'
    setupEnv({ locale: false, toggle: false })
    await load()
    const first = workers[0].postMessage.mock.calls[0][0]
    expect(first.animate).toBe(false)
    expect(first.intro).toBe(200)
    expect(document.documentElement.dataset.motion).toBe('paused')
  })
})

describe('chrome topography start conditions', () => {
  it('waits for the tab to become visible before starting', async () => {
    vi.spyOn(document, 'hidden', 'get').mockReturnValue(true)
    setupEnv({ locale: false, toggle: false })
    await load()
    expect(workers).toHaveLength(0)
    vi.spyOn(document, 'hidden', 'get').mockReturnValue(false)
    document.dispatchEvent(new Event('visibilitychange'))
    expect(workers).toHaveLength(1)
  })

  it('treats pages that are not window pages, like the 404, as home on mobile', async () => {
    mobileMatches = true
    history.replaceState(null, '', '/pt/nao-existe')
    setupEnv({ locale: false, toggle: false })
    await load()
    expect(workers).toHaveLength(1)
  })

  it('ends a running intro when reduced motion switches on', async () => {
    setupEnv({ locale: false, toggle: false })
    await load()
    const post = workers[0].postMessage
    mediaMatches = true
    mediaListener()
    expect(post).toHaveBeenLastCalledWith({ animate: false, intro: 0 })
  })
})

describe('chrome tooltips dismissal', () => {
  it('hides the tooltips on Escape until a control is entered or focused again', async () => {
    setupEnv({ canvas: false, locale: false })
    await load()
    const root = document.documentElement
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }))
    expect(root).not.toHaveAttribute('data-tips-hidden')
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    expect(root).toHaveAttribute('data-tips-hidden')
    document.querySelector<HTMLElement>('[data-theme-toggle]')!.dispatchEvent(new Event('focus'))
    expect(root).not.toHaveAttribute('data-tips-hidden')
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    document
      .querySelector<HTMLElement>('[data-motion-toggle]')!
      .dispatchEvent(new Event('pointerenter'))
    expect(root).not.toHaveAttribute('data-tips-hidden')
  })
})
