import { useId, useState, type KeyboardEvent, type ReactNode } from 'react'
import { SURFACES, type SurfaceId } from './surfaces'
import { useWindowTransform, type Box } from './useWindowTransform'
import { WindowControls } from './WindowControls'
import { WindowStatus } from './WindowStatus'

export interface WindowStrings {
  close: string
  move: string
  resize: string
  center: string
  topLeft: string
  rightHalf: string
  resetSize: string
  fitViewport: string
  moveMode: string
  resizeMode: string
  moved: string
  resized: string
  cancelled: string
}

interface Props {
  id: SurfaceId
  label: string
  strings: WindowStrings
  initialOpen?: boolean
  initialBox?: Box
  children: ReactNode
}

const DEFAULT_BOX: Box = { x: 0, y: 0, w: 640, h: 480 }

const ARROWS: Record<string, [number, number]> = {
  ArrowLeft: [-1, 0],
  ArrowRight: [1, 0],
  ArrowUp: [0, -1],
  ArrowDown: [0, 1],
}

/**
 * The framing around a window's content. The content itself is rendered by
 * Astro and arrives as `children`, so it exists in the HTML whether or not
 * this island ever hydrates.
 *
 * A closed window is hidden, never unmounted. That is what keeps the page
 * complete without JavaScript and keeps the landmarks visible to axe.
 */
export function WindowShell({
  id,
  label,
  strings,
  initialOpen = false,
  initialBox = DEFAULT_BOX,
  children,
}: Props) {
  const spec = SURFACES[id]
  const [open, setOpen] = useState(initialOpen)
  const titleId = useId()
  const { box, mode, enter, nudge, commit, cancel, preset } = useWindowTransform(initialBox)
  const [status, setStatus] = useState('')

  // Announce on mode entry, commit and cancel only. A live region that fires on
  // every arrow press — or on pointer drag — is worse than no live region.
  function enterMode(next: 'move' | 'resize') {
    enter(next)
    setStatus(next === 'move' ? strings.moveMode : strings.resizeMode)
  }

  function onKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (mode === 'idle') return

    const arrow = ARROWS[event.key]
    if (arrow) {
      event.preventDefault()
      nudge(arrow[0], arrow[1], event.shiftKey)
      return
    }
    if (event.key === 'Enter') {
      event.preventDefault()
      setStatus(`${label}: ${mode === 'move' ? strings.moved : strings.resized}`)
      commit()
      return
    }
    if (event.key === 'Escape') {
      event.preventDefault()
      setStatus(strings.cancelled)
      cancel()
    }
    // Tab is deliberately untouched. A move mode that swallows Tab is a
    // keyboard trap (2.1.2), and no amount of usefulness excuses one.
  }

  return (
    <section
      role={spec.role}
      aria-labelledby={titleId}
      hidden={!open}
      data-window={id}
      data-testid={`window-${id}`}
      data-mode={mode}
      onKeyDown={onKeyDown}
      style={{ left: `${box.x}px`, top: `${box.y}px`, width: `${box.w}px`, height: `${box.h}px` }}
    >
      <h2 id={titleId}>{label}</h2>

      <WindowStatus message={status} />

      <WindowControls
        strings={strings}
        onMove={() => enterMode('move')}
        onResize={() => enterMode('resize')}
        onPreset={preset}
        onClose={() => setOpen(false)}
      />

      {/*
        A container that scrolls but cannot be focused is unreachable by
        keyboard — axe calls it scrollable-region-focusable, and it is a 2.1.1
        failure, not a stylistic note. A focusable group also needs a name.
      */}
      <div
        data-testid={`window-body-${id}`}
        role={spec.scrollable ? 'group' : undefined}
        aria-labelledby={spec.scrollable ? titleId : undefined}
        tabIndex={spec.scrollable ? 0 : undefined}
      >
        {children}
      </div>
    </section>
  )
}
