import { useEffect, useRef } from 'react'
import type { CSSProperties, PointerEvent } from 'react'
import { useWindowManager } from './WindowManager'
import { MIN_WINDOW_HEIGHT as MIN_H, MIN_WINDOW_WIDTH as MIN_W } from '@/lib/windowUtils'

export type ResizeDir = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw'

const RESIZE_CURSORS: Record<ResizeDir, string> = {
  n: 'ns-resize',
  s: 'ns-resize',
  e: 'ew-resize',
  w: 'ew-resize',
  ne: 'nesw-resize',
  sw: 'nesw-resize',
  nw: 'nwse-resize',
  se: 'nwse-resize',
}

const RESIZE_STYLES: Record<ResizeDir, CSSProperties> = {
  n: { top: 0, left: 12, right: 12, height: 6 },
  s: { bottom: 0, left: 12, right: 12, height: 6 },
  e: { right: 0, top: 12, bottom: 12, width: 6 },
  w: { left: 0, top: 12, bottom: 12, width: 6 },
  ne: { top: 0, right: 0, width: 12, height: 12 },
  nw: { top: 0, left: 0, width: 12, height: 12 },
  se: { bottom: 0, right: 0, width: 12, height: 12 },
  sw: { bottom: 0, left: 0, width: 12, height: 12 },
}

export const RESIZE_HANDLE_Z = 20

export const RESIZE_DIRS: ResizeDir[] = ['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw']

interface DragState {
  startX: number
  startY: number
  startW: number
  startH: number
  startPosX: number
  startPosY: number
}

interface PendingResize {
  size: { width: number; height: number }
  position: { x: number; y: number }
}

interface ResizeHandleProps {
  direction: ResizeDir
  windowId: string
  onResizeStart: () => void
  onResizeEnd: () => void
}

export function ResizeHandle({
  direction,
  windowId,
  onResizeStart,
  onResizeEnd,
}: ResizeHandleProps) {
  const { resizeWindow, focusWindow } = useWindowManager()
  const dragRef = useRef<DragState | null>(null)
  const pendingRef = useRef<PendingResize | null>(null)
  const rafRef = useRef<number | null>(null)

  useEffect(
    () => () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    },
    []
  )

  const flushPending = (): void => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
    if (pendingRef.current) {
      resizeWindow(windowId, pendingRef.current.size, pendingRef.current.position)
      pendingRef.current = null
    }
  }

  const handlePointerDown = (e: PointerEvent<HTMLDivElement>): void => {
    e.stopPropagation()
    focusWindow(windowId)
    e.currentTarget.setPointerCapture(e.pointerId)
    const box = e.currentTarget.closest('[role="dialog"]')?.getBoundingClientRect()
    if (!box) return
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startW: box.width,
      startH: box.height,
      startPosX: box.left,
      startPosY: box.top,
    }
    onResizeStart()
  }

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>): void => {
    if (!dragRef.current) return
    const { startX, startY, startW, startH, startPosX, startPosY } = dragRef.current
    const dx = e.clientX - startX
    const dy = e.clientY - startY
    let newW = startW
    let newH = startH
    let newX = startPosX
    let newY = startPosY

    if (direction.includes('e')) newW = Math.max(MIN_W, startW + dx)
    if (direction.includes('w')) {
      newW = Math.max(MIN_W, startW - dx)
      newX = startPosX + (startW - newW)
    }
    if (direction.includes('s')) newH = Math.max(MIN_H, startH + dy)
    if (direction.includes('n')) {
      newH = Math.max(MIN_H, startH - dy)
      newY = startPosY + (startH - newH)
    }

    pendingRef.current = {
      size: { width: newW, height: newH },
      position: { x: newX, y: newY },
    }
    if (rafRef.current !== null) return
    rafRef.current = requestAnimationFrame(() => {
      if (pendingRef.current) {
        resizeWindow(windowId, pendingRef.current.size, pendingRef.current.position)
        pendingRef.current = null
      }
      rafRef.current = null
    })
  }

  const endDrag = (): void => {
    flushPending()
    dragRef.current = null
    onResizeEnd()
  }

  return (
    <div
      data-resize-handle
      aria-hidden="true"
      className="max-md:hidden"
      style={{
        position: 'absolute',
        zIndex: RESIZE_HANDLE_Z,
        cursor: RESIZE_CURSORS[direction],
        ...RESIZE_STYLES[direction],
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    />
  )
}
