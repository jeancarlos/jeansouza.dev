import { type ReactNode, useState } from 'react'
import { useDragControls } from 'framer-motion'
import { FocusTrap } from 'focus-trap-react'
import type { Length } from '@/lib/windowUtils'
import { type ButtonOrigin } from './WindowManager'
import { useIsMobile } from '@/lib/useIsMobile'
import { WindowChrome } from './WindowChrome'
import { WindowHeader } from './WindowHeader'
import { ResizeHandles } from './ResizeHandles'
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
export function TerminalWindow({
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
}: Props) {
  const [isResizing, setIsResizing] = useState(false)
  const dragControls = useDragControls()
  const isMobile = useIsMobile()
  const isHome = id === 'home'

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
        isHome={isHome}
        isMobile={isMobile}
        isFocused={isFocused}
        isResizing={isResizing}
        zIndex={zIndex}
        maxHeight={maxHeight}
        origin={origin}
        position={position}
        activeStyle={getActiveStyle(isExpanded, isMinimized, size, position)}
        outerClassName={getOuterClassName(isHome)}
        innerRounded={getInnerRounded(isHome)}
        draggable={!isExpanded}
        dragControls={dragControls}
      >
        <WindowHeader
          id={id}
          title={title}
          isHome={isHome}
          isExpanded={isExpanded}
          dragControls={dragControls}
        />
        {!isMinimized && (
          <div className={getBodyClassName(isHome)} tabIndex={0} role="region" aria-label={title}>
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
    </FocusTrap>
  )
}
