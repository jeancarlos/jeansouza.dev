'use client'
import { type ReactNode } from 'react'
import { motion, type DragControls, type PanInfo } from 'framer-motion'
import { useWindowManager, type ButtonOrigin } from './WindowManager'
import { TOPBAR_HEIGHT, WINDOW_MAX_HEIGHT, clampPosition } from '@/lib/windowUtils'
import { getAnimateStyle, getTransition, type WindowStyle } from './terminalStyles'

interface WindowChromeProps {
  id: string
  title: string
  isMobile: boolean
  isFocused: boolean
  isResizing: boolean
  zIndex: number
  position: { x: number; y: number }
  size: { width: number | string; height: number | string }
  maxHeight?: string
  origin?: ButtonOrigin
  activeStyle: WindowStyle
  outerClassName: string
  innerRounded: string
  dragControls: DragControls
  children: ReactNode
}

export function WindowChrome({
  id,
  title,
  isMobile,
  isFocused,
  isResizing,
  zIndex,
  position,
  size,
  maxHeight,
  origin,
  activeStyle,
  outerClassName,
  innerRounded,
  dragControls,
  children,
}: WindowChromeProps) {
  const { focusWindow, moveWindow } = useWindowManager()

  const w = typeof size.width === 'number' ? size.width : 600
  const h = typeof size.height === 'number' ? size.height : 400
  const animateStyle = getAnimateStyle(activeStyle, isMobile, isFocused)
  const transition = getTransition(isResizing)
  // Content-sized windows leave height out of the entry animation so framer
  // doesn't try to tween from the button height to auto (which it can't do).
  // opacity:0 on the initial state hides the first frame at full content height.
  const autoHeight = activeStyle.height === 'auto'
  const initial = origin
    ? {
        x: origin.x,
        y: origin.y,
        width: origin.width,
        ...(autoHeight ? {} : { height: origin.height }),
        opacity: 0,
      }
    : { opacity: 0, scale: 0.75 }

  const onDragEnd = (_: unknown, info: PanInfo) => {
    const raw = { x: position.x + info.offset.x, y: position.y + info.offset.y }
    moveWindow(
      id,
      clampPosition({ x: raw.x, y: Math.max(TOPBAR_HEIGHT, raw.y) }, { width: w, height: h })
    )
  }

  return (
    <motion.div
      drag={isMobile ? false : true}
      dragListener={false}
      dragControls={dragControls}
      dragMomentum={false}
      dragConstraints={{ top: isMobile ? 0 : TOPBAR_HEIGHT }}
      onDragEnd={onDragEnd}
      initial={initial}
      animate={{ ...animateStyle }}
      exit={{ opacity: 0, scale: 0.9, filter: 'blur(4px)' }}
      transition={transition}
      style={{
        ...activeStyle,
        zIndex,
        position: 'fixed',
        // Content-sized windows grow with their content up to the usable
        // viewport height (below the topbar, inside the safe margins).
        ...(activeStyle.height === 'auto' &&
          !isMobile && { maxHeight: maxHeight ?? WINDOW_MAX_HEIGHT }),
      }}
      onPointerDown={() => focusWindow(id)}
      className={`${outerClassName} flex`}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      {/* Stretched flex child instead of h-full: percentage heights don't
          resolve when the window is content-sized (height auto + max-height). */}
      <div className={`flex min-h-0 w-full flex-col overflow-hidden ${innerRounded}`}>
        {children}
      </div>
    </motion.div>
  )
}
