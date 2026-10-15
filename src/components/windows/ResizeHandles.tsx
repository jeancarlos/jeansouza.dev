import { ResizeHandle, RESIZE_DIRS } from './ResizeHandle'

interface ResizeHandlesProps {
  id: string
  onResizeStart: () => void
  onResizeEnd: () => void
}

export function ResizeHandles({ id, onResizeStart, onResizeEnd }: ResizeHandlesProps) {
  return (
    <>
      {RESIZE_DIRS.map((dir) => (
        <ResizeHandle
          key={dir}
          direction={dir}
          windowId={id}
          onResizeStart={onResizeStart}
          onResizeEnd={onResizeEnd}
        />
      ))}
    </>
  )
}
