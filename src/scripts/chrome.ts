import { localePath } from '@/i18n/navigation'
import type { Locale } from '@/i18n/t'
import { LOCALE_STORAGE_KEY } from '@/lib/locale-storage'
import { chainSegments, contourSegments } from '@/lib/topography'
import { THEME_STORAGE_KEY, type Theme } from '@/lib/theme'

function persist(key: string, value: string): void {
  try {
    localStorage.setItem(key, value)
  } catch {
    return
  }
}

const FRAME_MS = 1000 / 24

function toPath(line: number[]): Path2D {
  const path = new Path2D()
  path.moveTo(line[0], line[1])
  for (let i = 2; i < line.length; i += 2) path.lineTo(line[i], line[i + 1])
  return path
}

function buildPaths(w: number, h: number): Path2D[] {
  return contourSegments(w, h).map((segs) => {
    const path = new Path2D()
    for (const line of chainSegments(segs)) path.addPath(toPath(line))
    return path
  })
}

function strokeLevels(ctx: CanvasRenderingContext2D, paths: Path2D[], color: string, t: number) {
  ctx.strokeStyle = `rgb(${color})`
  ctx.lineCap = 'round'
  paths.forEach((path, k) => {
    const dotted = k % 4 === 2
    const pulse = t === 0 ? 1 : 0.6 + 0.4 * Math.sin(t / 900 + k * 2.3)
    ctx.globalAlpha = dotted ? 0.4 * pulse : 0.14
    ctx.lineWidth = dotted ? 1.5 : 1
    ctx.setLineDash(dotted ? [0, 5] : [])
    ctx.lineDashOffset = (t / 160) * (k % 8 === 2 ? 1 : -1)
    ctx.stroke(path)
  })
}

function startTopography(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return () => undefined
  const still = matchMedia('(prefers-reduced-motion: reduce), (width < 48rem)')
  let w = 0
  let h = 0
  let paths: Path2D[] = []
  let color = ''
  let frame = 0
  let last = 0

  const readColor = () => {
    color = getComputedStyle(document.documentElement).getPropertyValue('--contour-color').trim()
  }

  const paint = (t: number) => {
    ctx.clearRect(0, 0, w, h)
    strokeLevels(ctx, paths, color, t)
  }

  const tick = (t: number) => {
    frame = requestAnimationFrame(tick)
    if (t - last < FRAME_MS) return
    last = t
    paint(t)
  }

  const restart = () => {
    cancelAnimationFrame(frame)
    const dpr = devicePixelRatio || 1
    w = innerWidth
    h = innerHeight
    canvas.width = w * dpr
    canvas.height = h * dpr
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    paths = buildPaths(w, h)
    readColor()
    paint(0)
    if (!still.matches) frame = requestAnimationFrame(tick)
  }

  addEventListener('resize', restart)
  still.addEventListener('change', restart)
  const begin = () => restart()
  if ('requestIdleCallback' in window) requestIdleCallback(begin, { timeout: 2000 })
  else setTimeout(begin, 200)
  return () => {
    readColor()
    if (still.matches) paint(0)
  }
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
