'use client'
import { type ReactNode, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { useWindowManager, type ButtonOrigin } from './WindowManager'

interface Props {
  id: string
  url: string
  title: string
  children: ReactNode
  position: { x: number; y: number }
  size: { width: number | string; height: number | string }
  isExpanded: boolean
  isMinimized: boolean
  zIndex: number
  closeable?: boolean
  isFocused?: boolean
  origin?: ButtonOrigin
}

function TrafficDot({
  label,
  symbol,
  onClick,
  disabled,
}: {
  label: string
  symbol: string
  onClick: () => void
  disabled?: boolean
}) {
  return (
    <button
      data-traffic-dot
      aria-label={label}
      disabled={disabled}
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
      className={`group relative inline-block rounded-full bg-gradient-to-r from-[#e84545] to-[#b33a73] p-px transition-transform active:scale-95 ${disabled ? 'pointer-events-none opacity-30' : ''}`}
    >
      <span className="flex h-3 w-3 items-center justify-center rounded-full bg-[#3e3353] font-mono text-[8px] leading-none text-[#f2b8d4] transition-colors duration-150 group-hover:bg-transparent group-hover:text-white">
        {symbol}
      </span>
    </button>
  )
}

const MIN_W = 200
const MIN_H = 100

type ResizeDir = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw'

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

const RESIZE_DIRS: ResizeDir[] = ['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw']

interface ResizeHandleProps {
  direction: ResizeDir
  windowId: string
  size: { width: number | string; height: number | string }
  position: { x: number; y: number }
  onResizeStart: () => void
  onResizeEnd: () => void
}

function ResizeHandle({
  direction,
  windowId,
  size,
  position,
  onResizeStart,
  onResizeEnd,
}: ResizeHandleProps) {
  const { resizeWindow, focusWindow } = useWindowManager()
  const dragRef = useRef<{
    startX: number
    startY: number
    startW: number
    startH: number
    startPosX: number
    startPosY: number
  } | null>(null)

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
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

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
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

    resizeWindow(windowId, { width: newW, height: newH }, { x: newX, y: newY })
  }

  const handlePointerUp = () => {
    dragRef.current = null
    onResizeEnd()
  }

  return (
    <div
      style={{
        position: 'absolute',
        zIndex: 20,
        cursor: RESIZE_CURSORS[direction],
        ...RESIZE_STYLES[direction],
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    />
  )
}

export function TerminalWindow({
  id,
  url,
  title,
  children,
  position,
  size,
  isExpanded,
  isMinimized,
  zIndex,
  closeable = true,
  isFocused = true,
  origin,
}: Props) {
  const { closeWindow, focusWindow, expandWindow, minimizeWindow } = useWindowManager()
  const [isResizing, setIsResizing] = useState(false)

  const expandedStyle = {
    width: 'calc(100vw - 80px)' as string | number,
    height: 'calc(100vh - 80px)' as string | number,
    x: 40,
    y: 40,
  }

  const normalStyle = {
    width: size.width,
    height: isMinimized ? 44 : size.height,
    x: position.x,
    y: position.y,
  }

  const activeStyle = isExpanded ? expandedStyle : normalStyle

  return (
    <motion.div
      drag
      dragMomentum={false}
      dragConstraints={{ top: 0 }}
      initial={
        origin
          ? {
              x: origin.x,
              y: origin.y,
              width: origin.width,
              height: origin.height,
              opacity: 0,
            }
          : { opacity: 0, scale: 0.75 }
      }
      animate={{
        ...activeStyle,
        filter: isFocused ? 'blur(0px)' : 'blur(2px)',
        opacity: isFocused ? 1 : 0.6,
        scale: 1,
      }}
      exit={{ opacity: 0, scale: 0.9, filter: 'blur(4px)' }}
      transition={
        isResizing
          ? { duration: 0 }
          : {
              opacity: { type: 'tween', duration: 0.2, ease: 'easeOut' },
              filter: { type: 'tween', duration: 0.25, ease: 'easeOut' },
              scale: { type: 'spring', stiffness: 400, damping: 22 },
              width: { type: 'spring', stiffness: 350, damping: 28 },
              height: { type: 'spring', stiffness: 350, damping: 28 },
              x: { type: 'spring', stiffness: 350, damping: 28 },
              y: { type: 'spring', stiffness: 350, damping: 28 },
            }
      }
      style={{ ...activeStyle, zIndex, position: 'fixed' as const }}
      onPointerDown={() => focusWindow(id)}
      onClick={() => history.pushState(null, '', url)}
      className="rounded-2xl bg-gradient-to-r from-[#e84545] to-[#b33a73] p-[2px] shadow-2xl"
      role="dialog"
      aria-label={title}
    >
      <div className="flex h-full w-full flex-col overflow-hidden rounded-[14px]">
        {/* Header */}
        <div className="flex shrink-0 cursor-grab items-center gap-2 bg-gradient-to-r from-[#e84545] to-[#b33a73] px-3 py-2 select-none active:cursor-grabbing">
          <TrafficDot
            label="Close"
            symbol="×"
            onClick={() => closeWindow(id)}
            disabled={!closeable}
          />
          <TrafficDot label="Minimize" symbol="−" onClick={() => minimizeWindow(id)} />
          <TrafficDot label="Expand" symbol="+" onClick={() => expandWindow(id)} />
          <span className="ml-2 font-mono text-xs text-white/80">{title}</span>
        </div>

        {/* Body */}
        {!isMinimized && (
          <div className="flex-1 overflow-y-auto rounded-[14px] bg-[#11111b] font-mono text-[#f2b8d4]">
            {children}
          </div>
        )}
      </div>

      {/* Resize handles — only when window is interactive */}
      {!isExpanded && !isMinimized &&
        RESIZE_DIRS.map((dir) => (
          <ResizeHandle
            key={dir}
            direction={dir}
            windowId={id}
            size={size}
            position={position}
            onResizeStart={() => setIsResizing(true)}
            onResizeEnd={() => setIsResizing(false)}
          />
        ))}
    </motion.div>
  )
}
