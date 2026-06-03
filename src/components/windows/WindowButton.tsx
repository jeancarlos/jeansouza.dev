'use client'
import { type ReactNode } from 'react'
import { Button } from '@/components/ui/Button'
import { useWindowManager } from './WindowManager'
import type { WindowConfig } from './WindowManager'

const SAFE = 20

function centeredPos(w: number, h: number): { x: number; y: number } {
  const vw = typeof window !== 'undefined' ? window.innerWidth : 1200
  const vh = typeof window !== 'undefined' ? window.innerHeight : 800
  return {
    x: Math.max(SAFE, Math.min((vw - w) / 2, vw - w - SAFE)),
    y: Math.max(SAFE, Math.min((vh - h) / 2, vh - h - SAFE)),
  }
}

function fullscreenSize(): { width: number; height: number } {
  const vw = typeof window !== 'undefined' ? window.innerWidth : 1200
  const vh = typeof window !== 'undefined' ? window.innerHeight : 800
  return { width: vw - SAFE * 2, height: vh - SAFE * 2 }
}

interface WindowButtonProps {
  // Button label
  children: ReactNode
  'aria-label'?: string
  className?: string
  // Window identity
  windowId: string
  windowUrl: string
  windowTitle: string
  windowContent: ReactNode
  // Layout — omit windowSize when fullscreen=true
  windowSize?: { width: number; height: number }
  fullscreen?: boolean
  defaultSize?: WindowConfig['defaultSize']
  // Position override (defaults to centered)
  position?: { x: number; y: number }
  // Callback after window opens
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

  const handleOpen = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const origin = { x: rect.left, y: rect.top, width: rect.width, height: rect.height }
    const size = fullscreen ? fullscreenSize() : (windowSize ?? { width: 600, height: 400 })
    const pos = position ?? centeredPos(size.width, size.height)

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
