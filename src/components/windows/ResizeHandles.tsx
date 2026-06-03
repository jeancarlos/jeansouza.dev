'use client'
import { ResizeHandle, RESIZE_DIRS } from './ResizeHandle'

interface ResizeHandlesProps {
  id: string
  size: { width: number | string; height: number | string }
  position: { x: number; y: number }
  onResizeStart: () => void
  onResizeEnd: () => void
}

export function ResizeHandles({
  id,
  size,
  position,
  onResizeStart,
  onResizeEnd,
}: ResizeHandlesProps) {
  return (
    <>
      {RESIZE_DIRS.map((dir) => (
        <ResizeHandle
          key={dir}
          direction={dir}
          windowId={id}
          size={size}
          position={position}
          onResizeStart={onResizeStart}
          onResizeEnd={onResizeEnd}
        />
      ))}
    </>
  )
}
