import { localePath } from '@/i18n/navigation'
import type { Locale } from '@/i18n/t'
import { LOCALE_STORAGE_KEY } from '@/lib/locale-storage'
import {
  SPEED,
  TOTAL_DOTS,
  advanceStar,
  initStar,
  projectStar,
  resetStar,
  type Star,
} from '@/lib/starfield'
import { THEME_STORAGE_KEY, type Theme } from '@/lib/theme'

function persist(key: string, value: string): void {
  try {
    localStorage.setItem(key, value)
  } catch {
    return
  }
}

function startStarfield(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return () => undefined
  const still = matchMedia('(prefers-reduced-motion: reduce)')
  let w = 0
  let h = 0
  let stars: Star[] = []
  let color = ''
  let frame = 0

  const readColor = () => {
    color = getComputedStyle(document.documentElement).getPropertyValue('--dot-color').trim()
  }

  const draw = () => {
    ctx.clearRect(0, 0, w, h)
    ctx.fillStyle = `rgba(${color}, 0.55)`
    for (const star of stars) {
      if (!still.matches) advanceStar(star, SPEED)
      const { sx, sy, size } = projectStar(star, w, h)
      if (star.z <= 1 || sx < -50 || sx > w + 50 || sy < -50 || sy > h + 50) {
        resetStar(star, w, h)
        continue
      }
      ctx.beginPath()
      ctx.arc(sx, sy, Math.max(0.5, size), 0, Math.PI * 2)
      ctx.fill()
    }
    frame = still.matches ? 0 : requestAnimationFrame(draw)
  }

  const restart = () => {
    cancelAnimationFrame(frame)
    const dpr = devicePixelRatio || 1
    w = innerWidth
    h = innerHeight
    canvas.width = w * dpr
    canvas.height = h * dpr
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    stars = Array.from({ length: TOTAL_DOTS }, () => initStar(w, h))
    readColor()
    draw()
  }

  addEventListener('resize', restart)
  still.addEventListener('change', restart)
  const begin = () => restart()
  if ('requestIdleCallback' in window) requestIdleCallback(begin, { timeout: 2000 })
  else setTimeout(begin, 200)
  return () => {
    readColor()
    if (still.matches) draw()
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

const canvas = document.querySelector<HTMLCanvasElement>('[data-starfield]')
const repaint = canvas ? startStarfield(canvas) : () => undefined
const toggle = document.querySelector<HTMLButtonElement>('[data-theme-toggle]')
if (toggle) bindThemeToggle(toggle, repaint)
const localeLink = document.querySelector<HTMLAnchorElement>('[data-locale-switch]')
if (localeLink) bindLocaleSwitch(localeLink)
