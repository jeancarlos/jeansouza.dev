import { type ReactNode, useLayoutEffect, useRef, useState } from 'react'
import type { Length } from '@/lib/windowUtils'
import { type ButtonOrigin } from './WindowManager'
import { useIsMobile } from '@/lib/useIsMobile'
import { WindowChrome } from './WindowChrome'
import { WindowHeader } from './WindowHeader'
import { ResizeHandles } from './ResizeHandles'
import { WindowScrollbar } from './WindowScrollbar'
import {
  getActiveStyle,
  getBodyClassName,
  getInnerRounded,
  getOuterClassName,
} from './terminalStyles'

interface Props {
  id: string
  title: string
  children: ReactNode
  position: { x: Length; y: Length }
  size: { width: Length; height: Length }
  maxHeight?: string
  isExpanded?: boolean
  isMinimized?: boolean
  zIndex: number
  isFocused?: boolean
  origin?: ButtonOrigin
}

/** The home window is the desktop itself: it cannot be closed, minimized, expanded or resized. */
export function TerminalWindow(props: Props) {
  const {
    id,
    title,
    children,
    position,
    size,
    maxHeight,
    isExpanded = false,
    isMinimized = false,
    zIndex,
    isFocused = true,
    origin,
  } = props
  const [isResizing, setIsResizing] = useState(false)
  const isMobile = useIsMobile()
  const isHome = id === 'home'
  const body = useRef<HTMLDivElement>(null)
  const [openedFrom] = useState(origin)

  useLayoutEffect(() => {
    if (!openedFrom) return
    const opener = document.activeElement
    const win = body.current?.closest('[role=dialog]')
    body.current?.focus({ preventScroll: true })
    return () => {
      const owns = !!win && win.contains(document.activeElement)
      if (owns && opener instanceof HTMLElement && opener.isConnected) {
        opener.focus({ preventScroll: true })
      }
    }
  }, [openedFrom])

  return (
    <WindowChrome
      id={id}
      title={title}
      isHome={isHome}
      isMobile={isMobile}
      isFocused={isFocused}
      isResizing={isResizing}
      zIndex={zIndex}
      maxHeight={maxHeight}
      origin={origin}
      activeStyle={getActiveStyle(isExpanded, isMinimized, size, position)}
      outerClassName={getOuterClassName(isHome)}
      innerRounded={getInnerRounded(isHome)}
      draggable={!isExpanded}
      overlay={!isMinimized && <WindowScrollbar target={body} />}
    >
      <WindowHeader id={id} title={title} isHome={isHome} isExpanded={isExpanded} />
      {!isMinimized && (
        <div
          ref={body}
          className={getBodyClassName(isHome)}
          tabIndex={0}
          role="region"
          aria-label={title}
        >
          {children}
        </div>
      )}
      {!isHome && !isExpanded && !isMinimized && (
        <ResizeHandles
          id={id}
          onResizeStart={() => setIsResizing(true)}
          onResizeEnd={() => setIsResizing(false)}
        />
      )}
    </WindowChrome>
  )
}
