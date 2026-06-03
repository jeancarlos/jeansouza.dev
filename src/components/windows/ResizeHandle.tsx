// src/components/windows/ResizeHandle.tsx
'use client'
import { useEffect, useRef } from 'react'
import type React from 'react'
import { useWindowManager } from './WindowManager'

export type ResizeDir = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw'

const MIN_W = 200
const MIN_H = 100

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

const RESIZE_STYLES: Record<ResizeDir, React.CSSProperties> = {
  n: { top: 0, left: 12, right: 12, height: 6 },
  s: { bottom: 0, left: 12, right: 12, height: 6 },
  e: { right: 0, top: 12, bottom: 12, width: 6 },
  w: { left: 0, top: 12, bottom: 12, width: 6 },
  ne: { top: 0, right: 0, width: 12, height: 12 },
  nw: { top: 0, left: 0, width: 12, height: 12 },
  se: { bottom: 0, right: 0, width: 12, height: 12 },
  sw: { bottom: 0, left: 0, width: 12, height: 12 },
}

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
  size: { width: number | string; height: number | string }
  position: { x: number; y: number }
  onResizeStart: () => void
  onResizeEnd: () => void
}

export function ResizeHandle({
  direction,
  windowId,
  size,
  position,
  onResizeStart,
  onResizeEnd,
}: ResizeHandleProps) {
  const { resizeWindow, focusWindow } = useWindowManager()
  const dragRef = useRef<DragState | null>(null)
  const pendingRef = useRef<PendingResize | null>(null)
  const rafRef = useRef<number | null>(null)

  useEffect(() => () => {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
  }, [])

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

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>): void => {
    e.stopPropagation()
    focusWindow(windowId)
    e.currentTarget.setPointerCapture(e.pointerId)
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startW: typeof size.width === 'number' ? size.width : 600,
      startH: typeof size.height === 'number' ? size.height : 400,
      startPosX: position.x,
      startPosY: position.y,
    }
    onResizeStart()
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>): void => {
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
      style={{
        position: 'absolute',
        zIndex: 20,
        cursor: RESIZE_CURSORS[direction],
        ...RESIZE_STYLES[direction],
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onClick={(e) => {
        e.stopPropagation()
      }}
    />
  )
}
