'use client'
import { type ReactNode } from 'react'
import { Button } from '@/components/ui/Button'
import { useWindowManager } from './WindowManager'
import type { WindowConfig } from './WindowManager'
import { centeredPosition, getViewport, WINDOW_SAFE, TOPBAR_HEIGHT } from '@/lib/windowUtils'

function fullscreenSize(): { width: number; height: number } {
  const { vw, vh } = getViewport()
  return { width: vw - WINDOW_SAFE * 2, height: vh - WINDOW_SAFE * 2 }
}

interface WindowButtonProps {
  children: ReactNode
  'aria-label'?: string
  className?: string
  windowId: string
  windowUrl: string
  windowTitle: string
  windowContent: ReactNode
  windowSize?: { width: number; height: number }
  fullscreen?: boolean
  defaultSize?: WindowConfig['defaultSize']
  position?: { x: number; y: number }
  onOpen?: () => void
}

export function WindowButton({
  children,
  'aria-label': ariaLabel,
  className,
  windowId,
  windowUrl,
  windowTitle,
  windowContent,
  windowSize,
  fullscreen = false,
  defaultSize = 'medium',
  position,
  onOpen,
}: WindowButtonProps) {
  const { openWindow } = useWindowManager()

  const handleOpen = (e: React.MouseEvent): void => {
    const rect = e.currentTarget.getBoundingClientRect()
    const origin = { x: rect.left, y: rect.top, width: rect.width, height: rect.height }
    const size = fullscreen ? fullscreenSize() : (windowSize ?? { width: 600, height: 400 })
    const pos = position ?? centeredPosition(size.width, size.height, TOPBAR_HEIGHT)

    openWindow({
      id: windowId,
      url: windowUrl,
      title: windowTitle,
      content: windowContent,
      position: pos,
      size,
      defaultSize: fullscreen ? 'fullscreen' : defaultSize,
      isExpanded: fullscreen,
      isMinimized: false,
      origin,
    })

    onOpen?.()
  }

  return (
    <Button onClick={handleOpen} aria-label={ariaLabel} className={className}>
      {children}
    </Button>
  )
}
