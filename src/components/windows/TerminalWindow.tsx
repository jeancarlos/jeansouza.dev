'use client'
import { type ReactNode, useState } from 'react'
import { motion, useDragControls } from 'framer-motion'
import { useWindowManager, type ButtonOrigin } from './WindowManager'
import { TrafficDot } from './TrafficDot'
import { ResizeHandle, RESIZE_DIRS } from './ResizeHandle'
import { useIsMobile } from '@/lib/useIsMobile'
import { TOPBAR_HEIGHT, clampPosition } from '@/lib/windowUtils'

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
  minimizable?: boolean
  expandable?: boolean
  resizable?: boolean
  isFocused?: boolean
  origin?: ButtonOrigin
}

// eslint-disable-next-line complexity
export function TerminalWindow({
  id,
  title,
  children,
  position,
  size,
  isExpanded,
  isMinimized,
  zIndex,
  closeable = true,
  minimizable = true,
  expandable = true,
  resizable = true,
  isFocused = true,
  origin,
}: Props) {
  const { closeWindow, focusWindow, expandWindow, minimizeWindow, moveWindow } = useWindowManager()
  const [isResizing, setIsResizing] = useState(false)
  const dragControls = useDragControls()
  const isMobile = useIsMobile()

  const isHome = id === 'home'

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

  const mobileStyle = {
    width: '100vw' as string | number,
    height: '100dvh' as string | number,
    x: 0,
    y: 0,
  }

  const activeStyle = isMobile && !isHome
    ? mobileStyle
    : isExpanded
      ? expandedStyle
      : normalStyle

  const outerRounded = isMobile && !isHome ? 'rounded-[44px]' : isMobile && isHome ? '' : 'rounded-2xl'
  const innerRounded = isMobile && !isHome ? 'rounded-[42px]' : isMobile && isHome ? '' : 'rounded-[14px]'

  return (
    <motion.div
      drag={isMobile ? false : true}
      dragListener={false}
      dragControls={dragControls}
      dragMomentum={false}
      dragConstraints={{ top: isMobile ? 0 : TOPBAR_HEIGHT }}
      onDragEnd={(_, info) => {
        const w = typeof size.width === 'number' ? size.width : 600
        const h = typeof size.height === 'number' ? size.height : 400
        const raw = { x: position.x + info.offset.x, y: position.y + info.offset.y }
        moveWindow(id, clampPosition({ x: raw.x, y: Math.max(TOPBAR_HEIGHT, raw.y) }, { width: w, height: h }))
      }}
      initial={
        origin
          ? { x: origin.x, y: origin.y, width: origin.width, height: origin.height, opacity: 0 }
          : { opacity: 0, scale: 0.75 }
      }
      animate={{
        ...activeStyle,
        filter: isMobile || isFocused ? 'blur(0px)' : 'blur(2px)',
        opacity: isMobile || isFocused ? 1 : 0.6,
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
              width: { type: 'tween', duration: 0.15, ease: 'easeOut' },
              height: { type: 'tween', duration: 0.15, ease: 'easeOut' },
              x: { type: 'tween', duration: 0.15, ease: 'easeOut' },
              y: { type: 'tween', duration: 0.15, ease: 'easeOut' },
            }
      }
      style={{ ...activeStyle, zIndex, position: 'fixed' as const }}
      onPointerDown={() => {
        focusWindow(id)
      }}
      className={isMobile ? outerRounded : `${outerRounded} bg-gradient-to-r from-[#e84545] to-[#b33a73] p-[2px] shadow-2xl`}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className={`flex h-full w-full flex-col overflow-hidden ${innerRounded}`}>
        {/* Header — hidden on mobile home (switches float in Topbar) */}
        {!(isMobile && isHome) && (
          <div
            onPointerDown={(e) => {
              if (!isMobile) dragControls.start(e)
            }}
            className={`flex shrink-0 items-center gap-2 px-3 py-2.5 select-none ${isMobile ? 'bg-transparent' : 'cursor-grab bg-gradient-to-r from-[#e84545] to-[#b33a73] active:cursor-grabbing'}`}
          >
            {isMobile ? (
              <>
                <button
                  onClick={() => closeWindow(id)}
                  className="font-mono text-xs text-white/90 hover:text-white"
                  aria-label="Go back"
                >
                  {'< back'}
                </button>
                <span className="ml-3 font-mono text-xs text-white/80">{title}</span>
              </>
            ) : (
              <>
                <TrafficDot
                  label="Close"
                  symbol="×"
                  color="#ff5f56"
                  onClick={() => closeWindow(id)}
                  disabled={!closeable}
                />
                <TrafficDot
                  label="Minimize"
                  symbol="−"
                  color="#eab308"
                  onClick={() => minimizeWindow(id)}
                  disabled={!minimizable}
                />
                <TrafficDot
                  label="Expand"
                  symbol="+"
                  color="#22c55e"
                  onClick={() => expandWindow(id)}
                  disabled={!expandable}
                />
                <span className="ml-2 font-mono text-xs text-white/80">{title}</span>
              </>
            )}
          </div>
        )}

        {/* Body */}
        {!isMinimized && (
          <div
            className={`flex-1 overflow-y-auto ${innerRounded} font-mono text-[#f2b8d4] ${
              isMobile ? 'bg-transparent' : 'bg-[#11111b]'
            }`}
          >
            {children}
          </div>
        )}
      </div>

      {/* Resize handles */}
      {!isMobile &&
        resizable &&
        !isExpanded &&
        !isMinimized &&
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
