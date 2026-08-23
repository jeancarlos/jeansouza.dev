import { useCallback, useRef, useState } from 'react'

export type Mode = 'idle' | 'move' | 'resize'

export interface Box {
  x: number
  y: number
  w: number
  h: number
}

const STEP = 10
const BIG_STEP = 50

/** Floors keep a window recoverable: resized to nothing is lost, same as off-screen. */
const MIN_W = 240
const MIN_H = 160

export function useWindowTransform(initial: Box) {
  const [box, setBox] = useState<Box>(initial)
  const [mode, setMode] = useState<Mode>('idle')
  const restore = useRef<Box>(initial)

  const enter = useCallback(
    (next: Mode) => {
      restore.current = box
      setMode(next)
    },
    [box],
  )

  const nudge = useCallback(
    (dx: number, dy: number, big: boolean) => {
      const d = big ? BIG_STEP : STEP
      setBox((b) => {
        if (mode === 'move') return { ...b, x: b.x + dx * d, y: b.y + dy * d }
        if (mode === 'resize')
          return {
            ...b,
            w: Math.max(MIN_W, b.w + dx * d),
            h: Math.max(MIN_H, b.h + dy * d),
          }
        return b
      })
    },
    [mode],
  )

  const commit = useCallback(() => setMode('idle'), [])

  const cancel = useCallback(() => {
    setBox(restore.current)
    setMode('idle')
  }, [])

  const preset = useCallback((next: Partial<Box>) => setBox((b) => ({ ...b, ...next })), [])

  return { box, mode, enter, nudge, commit, cancel, preset }
}
