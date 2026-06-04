'use client'
import { type ReactNode, useState } from 'react'
import { useDragControls } from 'framer-motion'
import { FocusTrap } from 'focus-trap-react'
import { type ButtonOrigin } from './WindowManager'
import { useIsMobile } from '@/lib/useIsMobile'
import { WindowChrome } from './WindowChrome'
import { WindowHeader } from './WindowHeader'
import { ResizeHandles } from './ResizeHandles'
import {
  getActiveStyle,
  getInnerRounded,
  getOuterClassName,
  getBodyClassName,
  getWindowVisibility,
} from './terminalStyles'

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
  const [isResizing, setIsResizing] = useState(false)
  const dragControls = useDragControls()
  const isMobile = useIsMobile()

  const isHome = id === 'home'
  const activeStyle = getActiveStyle(isMobile, isHome, isExpanded, isMinimized, size, position)
  const innerRounded = getInnerRounded(isMobile, isHome)
  const outerClassBase = getOuterClassName(isMobile, isHome)
  const outerClassName = isHome
    ? outerClassBase
    : `${outerClassBase} max-md:!w-screen max-md:!h-dvh max-md:!translate-x-0 max-md:!translate-y-0 max-md:!top-0 max-md:!left-0`
  const bodyClassName = getBodyClassName(isMobile, isHome, innerRounded)
  const { showHeader, showBody, showResizeHandles } = getWindowVisibility(
    isMobile,
    isHome,
    isExpanded,
    isMinimized,
    resizable
  )

  return (
    <FocusTrap
      active={!isMobile && !isMinimized}
      focusTrapOptions={{
        allowOutsideClick: true,
        clickOutsideDeactivates: false,
        escapeDeactivates: false,
        returnFocusOnDeactivate: true,
      }}
    >
      <WindowChrome
        id={id}
        title={title}
        isMobile={isMobile}
        isFocused={isFocused}
        isResizing={isResizing}
        zIndex={zIndex}
        position={position}
        size={size}
        origin={origin}
        activeStyle={activeStyle}
        outerClassName={outerClassName}
        innerRounded={innerRounded}
      >
        {showHeader && (
          <WindowHeader
            id={id}
            title={title}
            isHome={isHome}
            dragControls={dragControls}
            closeable={closeable}
            minimizable={minimizable}
            expandable={expandable}
          />
        )}
        {showBody && <div className={bodyClassName}>{children}</div>}
        {showResizeHandles && (
          <ResizeHandles
            id={id}
            size={size}
            position={position}
            onResizeStart={() => setIsResizing(true)}
            onResizeEnd={() => setIsResizing(false)}
          />
        )}
      </WindowChrome>
    </FocusTrap>
  )
}
