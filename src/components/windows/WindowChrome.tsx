import { useRef, useState, type ReactNode } from 'react'
import { flushSync } from 'react-dom'
import { motion, useMotionValue, type DragControls } from 'framer-motion'
import { useWindowManager, type ButtonOrigin } from './WindowManager'
import { TOPBAR_HEIGHT, WINDOW_MAX_HEIGHT, clampPosition, type Length } from '@/lib/windowUtils'
import { getAnimateStyle, getInitialStyle, getTransition, type WindowStyle } from './terminalStyles'

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
  position: { x: Length; y: Length }
  activeStyle: WindowStyle
  outerClassName: string
  innerRounded: string
  draggable: boolean
  dragControls: DragControls
  children: ReactNode
}

/**
 * Placement lives in left/top, as pixels or as the CSS the server rendered;
 * x/y only carry the offsets of a running drag or of the open animation. A
 * drag is folded back into left/top when it ends, so x/y return to zero.
 */
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
  position,
  activeStyle,
  outerClassName,
  innerRounded,
  draggable,
  dragControls,
  children,
}: WindowChromeProps) {
  const { focusWindow, moveWindow } = useWindowManager()
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const [isDragging, setIsDragging] = useState(false)
  const autoHeight = activeStyle.height === 'auto'
  const [initial] = useState(() => getInitialStyle(origin, position, activeStyle, autoHeight))
  const instant = isResizing || isDragging

  const onDragEnd = () => {
    const el = ref.current
    if (el && !isHome) {
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
      x.jump(0)
      y.jump(0)
    }
    requestAnimationFrame(() => setIsDragging(false))
  }

  return (
    <motion.div
      ref={ref}
      drag={draggable && !isMobile}
      dragListener={false}
      dragControls={dragControls}
      dragMomentum={false}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={onDragEnd}
      initial={initial}
      animate={getAnimateStyle(activeStyle, isMobile, isFocused)}
      exit={{ opacity: 0, scale: 0.9, filter: 'blur(4px)' }}
      transition={getTransition(instant)}
      style={{
        x,
        y,
        left: activeStyle.left,
        top: activeStyle.top,
        zIndex,
        position: 'fixed',
        ...(autoHeight && { maxHeight: maxHeight ?? WINDOW_MAX_HEIGHT }),
      }}
      onPointerDown={() => focusWindow(id)}
      className={`${outerClassName} flex ${initial === false ? 'window-in' : ''} ${instant ? '' : 'transition-[left,top] duration-150 ease-out'}`}
      role="dialog"
      aria-label={title}
    >
      <div className={`flex min-h-0 w-full flex-col overflow-hidden ${innerRounded}`}>
        {children}
      </div>
    </motion.div>
  )
}
