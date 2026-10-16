import { localePath } from '@/i18n/navigation'
import type { Locale } from '@/i18n/t'
import { LOCALE_STORAGE_KEY } from '@/lib/locale-storage'
import { THEME_STORAGE_KEY, type Theme } from '@/lib/theme'
import type { TopographyState } from './topography.worker'

function persist(key: string, value: string): void {
  try {
    localStorage.setItem(key, value)
  } catch {
    return
  }
}

function startTopography(canvas: HTMLCanvasElement) {
  if (!('transferControlToOffscreen' in canvas)) return () => undefined
  const still = matchMedia('(prefers-reduced-motion: reduce), (width < 48rem)')
  let worker: Worker | null = null
  const send = (update: Partial<TopographyState>) => worker?.postMessage(update)
  const color = () =>
    getComputedStyle(document.documentElement).getPropertyValue('--contour-color').trim()
  const size = () => ({ w: innerWidth, h: innerHeight, dpr: devicePixelRatio || 1 })

  const begin = () => {
    worker = new Worker(new URL('./topography.worker.ts', import.meta.url), { type: 'module' })
    const offscreen = canvas.transferControlToOffscreen()
    worker.postMessage({ canvas: offscreen, ...size(), color: color(), animate: !still.matches }, [
      offscreen,
    ])
  }

  let pending: Partial<TopographyState> = {}
  let queued = false
  const sendOnce = (update: Partial<TopographyState>) => {
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
  const motion = () => send({ animate: !still.matches && !document.hidden })
  still.addEventListener('change', motion)
  document.addEventListener('visibilitychange', motion)
  addEventListener('pointermove', (e) => sendOnce({ pointer: [e.clientX, e.clientY] }), {
    passive: true,
  })
  document.documentElement.addEventListener('pointerleave', () => sendOnce({ pointer: null }))
  if ('requestIdleCallback' in window) requestIdleCallback(begin, { timeout: 2000 })
  else setTimeout(begin, 200)
  return () => send({ color: color() })
}

function bindThemeToggle(button: HTMLButtonElement, onChange: () => void) {
  const root = document.documentElement
  const sync = () => button.setAttribute('aria-checked', String(root.dataset.theme === 'light'))
  sync()
  button.addEventListener('click', () => {
    const next: Theme = root.dataset.theme === 'light' ? 'dark' : 'light'
    root.dataset.theme = next
    root.style.colorScheme = next
    persist(THEME_STORAGE_KEY, next)
    sync()
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
const repaint = canvas ? startTopography(canvas) : () => undefined
const toggle = document.querySelector<HTMLButtonElement>('[data-theme-toggle]')
if (toggle) bindThemeToggle(toggle, repaint)
const localeLink = document.querySelector<HTMLAnchorElement>('[data-locale-switch]')
if (localeLink) bindLocaleSwitch(localeLink)
