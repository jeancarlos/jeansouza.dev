import { useRef, useState, type KeyboardEvent, type MouseEvent } from 'react'
import { useWindowManager } from './WindowManager'
import {
  MIN_WINDOW_HEIGHT,
  MIN_WINDOW_WIDTH,
  TOPBAR_HEIGHT,
  WINDOW_SAFE,
  clampPosition,
  getViewport,
} from '@/lib/windowUtils'

export interface Box {
  x: number
  y: number
  w: number
  h: number
}

interface Strings {
  moveMode: string
  moved: string
  cancelled: string
}

const STEP = 10
const BIG_STEP = 50

const ARROWS: Record<string, [number, number] | undefined> = {
  ArrowLeft: [-1, 0],
  ArrowRight: [1, 0],
  ArrowUp: [0, -1],
  ArrowDown: [0, 1],
}

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(n, max))
}

export function step(box: Box, dx: number, dy: number, big: boolean, resize: boolean): Box {
  const d = big ? BIG_STEP : STEP
  const { vw, vh } = getViewport()
  if (resize) {
    return {
      ...box,
      w: clamp(box.w + dx * d, MIN_WINDOW_WIDTH, vw - box.x - WINDOW_SAFE),
      h: clamp(box.h + dy * d, MIN_WINDOW_HEIGHT, vh - box.y - WINDOW_SAFE),
    }
  }
  const pos = clampPosition(
    { x: box.x + dx * d, y: Math.max(TOPBAR_HEIGHT, box.y + dy * d) },
    { width: box.w, height: box.h }
  )
  return { ...box, ...pos }
}

function windowBox(el: Element): Box | null {
  const r = el.closest('[role=dialog]')?.getBoundingClientRect()
  return r ? { x: r.left, y: r.top, w: r.width, h: r.height } : null
}

export function useKeyboardMove(id: string, strings: Strings) {
  const { moveWindow, resizeWindow } = useWindowManager()
  const [active, setActive] = useState(false)
  const [status, setStatus] = useState('')
  const box = useRef<Box | null>(null)
  const start = useRef<Box | null>(null)

  function finish(message: string) {
    setActive(false)
    setStatus(message)
  }

  function apply(next: Box, resize: boolean) {
    box.current = next
    if (resize) resizeWindow(id, { width: next.w, height: next.h }, { x: next.x, y: next.y })
    else moveWindow(id, { x: next.x, y: next.y })
  }

  function onClick(e: MouseEvent<HTMLElement>) {
    if (e.detail !== 0) return
    if (active) return finish(strings.moved)
    const b = windowBox(e.currentTarget)
    if (!b) return
    box.current = b
    start.current = b
    setActive(true)
    setStatus(strings.moveMode)
  }

  function onKeyDown(e: KeyboardEvent<HTMLElement>) {
    if (!active || !box.current) return
    const arrow = ARROWS[e.key]
    if (arrow) {
      e.preventDefault()
      apply(step(box.current, arrow[0], arrow[1], e.shiftKey, e.altKey), e.altKey)
      return
    }
    if (e.key === 'Escape' && start.current) {
      e.preventDefault()
      e.stopPropagation()
      const s = start.current
      const resized = s.w !== box.current.w || s.h !== box.current.h
      apply(s, resized)
      finish(strings.cancelled)
    }
  }

  function onBlur() {
    if (active) finish(strings.moved)
  }

  return { active, status, onClick, onKeyDown, onBlur }
}
