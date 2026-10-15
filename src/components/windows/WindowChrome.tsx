import { useEffect, useRef, useState, type PointerEvent, type ReactNode } from 'react'
import { flushSync } from 'react-dom'
import { useWindowManager, type ButtonOrigin } from './WindowManager'
import { TOPBAR_HEIGHT, WINDOW_MAX_HEIGHT, clampPosition } from '@/lib/windowUtils'
import { getOpenKeyframes, type WindowStyle } from './terminalStyles'

interface WindowChromeProps {
  id: string
  title: string
  isHome: boolean
  isMobile: boolean
  isFocused: boolean
  isResizing: boolean
  zIndex: number
  maxHeight?: string
  origin?: ButtonOrigin
  activeStyle: WindowStyle
  outerClassName: string
  innerRounded: string
  draggable: boolean
  children: ReactNode
}

const DRAG_THRESHOLD = 3

function prefersStill(): boolean {
  return typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function WindowChrome({
  id,
  title,
  isHome,
  isMobile,
  isFocused,
  isResizing,
  zIndex,
  maxHeight,
  origin,
  activeStyle,
  outerClassName,
  innerRounded,
  draggable,
  children,
}: WindowChromeProps) {
  const { focusWindow, moveWindow } = useWindowManager()
  const ref = useRef<HTMLDivElement>(null)
  const endDrag = useRef<(() => void) | null>(null)
  const homeOffset = useRef({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [openFrom] = useState(origin)
  const instant = isResizing || isDragging
  const sharp = isMobile || isFocused

  useEffect(() => {
    const el = ref.current
    if (!el || prefersStill()) return
    const frames = getOpenKeyframes(openFrom, el.getBoundingClientRect())
    if (frames) el.animate(frames, { duration: 200, easing: 'ease-out' })
  }, [openFrom])

  useEffect(() => {
    const el = ref.current
    if (!el || !isHome) return
    const { x, y } = homeOffset.current
    el.style.translate = isMobile || (x === 0 && y === 0) ? '' : `${x}px ${y}px`
  }, [isHome, isMobile])

  useEffect(() => () => endDrag.current?.(), [])

  const commit = (el: HTMLDivElement, dx: number, dy: number) => {
    if (isHome) {
      homeOffset.current = { x: homeOffset.current.x + dx, y: homeOffset.current.y + dy }
      return
    }
    const r = el.getBoundingClientRect()
    flushSync(() =>
      moveWindow(
        id,
        clampPosition(
          { x: r.left, y: Math.max(TOPBAR_HEIGHT, r.top) },
          { width: r.width, height: r.height }
        )
      )
    )
    el.style.translate = ''
  }

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (!isFocused) focusWindow(id)
    const el = ref.current
    if (!el || endDrag.current || !draggable || isMobile) return
    if (!e.isPrimary || e.button !== 0) return
    if (!(e.target as Element).closest('[data-drag-handle]')) return

    const { pointerId } = e
    const startX = e.clientX
    const startY = e.clientY
    const base = homeOffset.current
    let active = false

    const move = (ev: globalThis.PointerEvent) => {
      if (ev.pointerId !== pointerId) return
      if (ev.buttons === 0) return finish(ev, false)
      const dx = ev.clientX - startX
      const dy = ev.clientY - startY
      if (!active) {
        if (Math.hypot(dx, dy) < DRAG_THRESHOLD) return
        active = true
        for (const a of el.getAnimations()) a.finish()
        setIsDragging(true)
      }
      el.style.translate = `${base.x + dx}px ${base.y + dy}px`
    }

    const finish = (ev: globalThis.PointerEvent | null, keep: boolean) => {
      if (ev && ev.pointerId !== pointerId) return
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      window.removeEventListener('pointercancel', cancel)
      window.removeEventListener('blur', abandon)
      endDrag.current = null
      if (!active) return
      if (keep && ev) commit(el, ev.clientX - startX, ev.clientY - startY)
      else el.style.translate = isHome && (base.x || base.y) ? `${base.x}px ${base.y}px` : ''
      requestAnimationFrame(() => setIsDragging(false))
    }

    const up = (ev: globalThis.PointerEvent) => finish(ev, true)
    const cancel = (ev: globalThis.PointerEvent) => finish(ev, false)
    const abandon = () => finish(null, false)

    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    window.addEventListener('pointercancel', cancel)
    window.addEventListener('blur', abandon)
    endDrag.current = abandon
  }

  return (
    <div
      ref={ref}
      onPointerDown={onPointerDown}
      onFocus={() => {
        if (!isFocused) focusWindow(id)
      }}
      style={{
        left: activeStyle.left,
        top: activeStyle.top,
        width: activeStyle.width,
        height: activeStyle.height,
        zIndex,
        position: 'fixed',
        filter: sharp ? undefined : 'blur(2px) opacity(0.85)',
        ...(activeStyle.height === 'auto' &&
          !isMobile && { maxHeight: maxHeight ?? WINDOW_MAX_HEIGHT }),
      }}
      className={`${outerClassName} flex ${isFocused ? '' : 'max-md:hidden'} ${openFrom ? '' : 'window-in'} ${instant ? '' : 'transition-[left,top,filter] duration-150 ease-out motion-reduce:transition-none'}`}
      role="dialog"
      aria-label={title}
    >
      <div className={`flex min-h-0 w-full flex-col overflow-hidden ${innerRounded}`}>
        {children}
      </div>
    </div>
  )
}
