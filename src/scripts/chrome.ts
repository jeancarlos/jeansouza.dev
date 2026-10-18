import { localePath } from '@/i18n/navigation'
import type { Locale } from '@/i18n/t'
import { INTRO_MS, PAUSED_INTRO_MS } from '@/lib/introTiming'
import { LOCALE_STORAGE_KEY } from '@/lib/locale-storage'
import { THEME_STORAGE_KEY, type Theme } from '@/lib/theme'
import type { TopographyMessage } from './topography.worker'

function persist(key: string, value: string): void {
  try {
    localStorage.setItem(key, value)
  } catch {
    return
  }
}

const MOTION_STORAGE_KEY = 'motion'

function storedPaused(): boolean {
  try {
    return localStorage.getItem(MOTION_STORAGE_KEY) === 'paused'
  } catch {
    return false
  }
}

function onHome(): boolean {
  const windows = document.documentElement.dataset.windows
  return windows ? windows === 'none' : /^\/(pt|en)\/?$/.test(location.pathname)
}

function startTopography(canvas: HTMLCanvasElement, paused: () => boolean) {
  if (!('transferControlToOffscreen' in canvas))
    return { repaint: () => undefined, sync: () => undefined }
  const still = matchMedia('(prefers-reduced-motion: reduce)')
  let worker: Worker | null = null
  const send = (update: TopographyMessage) => worker?.postMessage(update)
  const color = () =>
    getComputedStyle(document.documentElement).getPropertyValue('--contour-color').trim()
  const narrow = matchMedia('(width < 48rem)')
  const offHome = () => narrow.matches && !onHome()
  const introMs = () => {
    if (still.matches) return 0
    return paused() ? PAUSED_INTRO_MS : INTRO_MS
  }
  const playing = () => !still.matches && !paused() && !offHome()
  const size = () => ({ w: innerWidth, h: innerHeight, dpr: devicePixelRatio || 1 })

  const start = () => {
    worker = new Worker(new URL('./topography.worker.ts', import.meta.url), { type: 'module' })
    const offscreen = canvas.transferControlToOffscreen()
    worker.postMessage(
      {
        canvas: offscreen,
        ...size(),
        color: color(),
        animate: playing(),
        intro: introMs(),
      },
      [offscreen]
    )
  }

  let pending: TopographyMessage = {}
  let queued = false
  const sendOnce = (update: TopographyMessage) => {
    Object.assign(pending, update)
    if (queued) return
    queued = true
    requestAnimationFrame(() => {
      queued = false
      send(pending)
      pending = {}
    })
  }

  addEventListener('resize', () => sendOnce(size()))
  let ready = false
  const motion = () => {
    if (!worker) {
      if (ready && !offHome()) start()
      return
    }
    send({ animate: playing() && !document.hidden })
  }
  const begin = () => {
    ready = true
    motion()
  }
  still.addEventListener('change', motion)
  narrow.addEventListener('change', motion)
  new MutationObserver(motion).observe(document.documentElement, {
    attributeFilter: ['data-windows'],
  })
  document.addEventListener('visibilitychange', motion)
  addEventListener('pointermove', (e) => sendOnce({ pointer: [e.clientX, e.clientY] }), {
    passive: true,
  })
  document.documentElement.addEventListener('pointerleave', () => sendOnce({ pointer: null }))
  if ('requestIdleCallback' in window) requestIdleCallback(begin, { timeout: 2000 })
  else setTimeout(begin, 200)
  return { repaint: () => send({ color: color() }), sync: motion }
}

function bindSwitch(button: HTMLButtonElement, isOn: () => boolean, flip: () => void) {
  const state = button.hasAttribute('aria-pressed') ? 'aria-pressed' : 'aria-checked'
  const tip = button.querySelector('[data-tip]')
  const sync = () => {
    const on = isOn()
    button.setAttribute(state, String(on))
    if (tip) tip.textContent = (on ? button.dataset.tipOn : button.dataset.tipOff) ?? ''
  }
  sync()
  button.addEventListener('click', () => {
    flip()
    sync()
  })
}

function bindThemeToggle(button: HTMLButtonElement, onChange: () => void) {
  const root = document.documentElement
  bindSwitch(
    button,
    () => root.dataset.theme === 'light',
    () => {
      const next: Theme = root.dataset.theme === 'light' ? 'dark' : 'light'
      root.dataset.theme = next
      root.style.colorScheme = next
      persist(THEME_STORAGE_KEY, next)
      onChange()
    }
  )
}

function bindMotionToggle(button: HTMLButtonElement, onChange: () => void) {
  const root = document.documentElement
  const isPaused = () => root.dataset.motion === 'paused'
  bindSwitch(button, isPaused, () => {
    const next = isPaused() ? 'playing' : 'paused'
    root.dataset.motion = next
    persist(MOTION_STORAGE_KEY, next)
    onChange()
  })
}

function bindLocaleSwitch(link: HTMLAnchorElement) {
  link.addEventListener('click', () => {
    const next = link.hreflang as Locale
    persist(LOCALE_STORAGE_KEY, next)
    if (location.pathname !== link.dataset.page) link.href = localePath(location.pathname, next)
  })
}

const canvas = document.querySelector<HTMLCanvasElement>('[data-topography]')
if (storedPaused()) document.documentElement.dataset.motion = 'paused'
const { repaint, sync } = canvas
  ? startTopography(canvas, () => document.documentElement.dataset.motion === 'paused')
  : { repaint: () => undefined, sync: () => undefined }
const motionToggle = document.querySelector<HTMLButtonElement>('[data-motion-toggle]')
if (motionToggle) bindMotionToggle(motionToggle, sync)
const toggle = document.querySelector<HTMLButtonElement>('[data-theme-toggle]')
if (toggle) bindThemeToggle(toggle, repaint)
const localeLink = document.querySelector<HTMLAnchorElement>('[data-locale-switch]')
if (localeLink) bindLocaleSwitch(localeLink)
