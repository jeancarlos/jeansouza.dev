'use client'
import { type PointerEvent } from 'react'
import { type DragControls } from 'framer-motion'
import { useWindowManager } from './WindowManager'
import { TrafficDot } from './TrafficDot'

interface WindowHeaderProps {
  id: string
  title: string
  isMobile: boolean
  dragControls: DragControls
  closeable: boolean
  minimizable: boolean
  expandable: boolean
}

const HEADER_CLASS_MOBILE =
  'flex shrink-0 items-center gap-2 px-3 py-2.5 select-none bg-transparent'
const HEADER_CLASS_DESKTOP =
  'flex shrink-0 items-center gap-2 px-3 py-2.5 select-none cursor-grab bg-gradient-to-r from-[#e84545] to-[#b33a73] active:cursor-grabbing'

export function WindowHeader({
  id,
  title,
  isMobile,
  dragControls,
  closeable,
  minimizable,
  expandable,
}: WindowHeaderProps) {
  const { closeWindow, minimizeWindow, expandWindow } = useWindowManager()

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (!isMobile) dragControls.start(e)
  }

  if (isMobile) {
    return (
      <div onPointerDown={onPointerDown} className={HEADER_CLASS_MOBILE}>
        <button
          onClick={() => closeWindow(id)}
          className="font-mono text-xs text-white/90 hover:text-white"
          aria-label="Go back"
        >
          {'< back'}
        </button>
        <span className="ml-3 font-mono text-xs text-white/80">{title}</span>
      </div>
    )
  }

  return (
    <div onPointerDown={onPointerDown} className={HEADER_CLASS_DESKTOP}>
      <TrafficDot
        label="Close"
        symbol="×"
        color="#ff5f56"
        onClick={() => closeWindow(id)}
        disabled={!closeable}
      />
      <TrafficDot
        label="Minimize"
        symbol="−"
        color="#eab308"
        onClick={() => minimizeWindow(id)}
        disabled={!minimizable}
      />
      <TrafficDot
        label="Expand"
        symbol="+"
        color="#22c55e"
        onClick={() => expandWindow(id)}
        disabled={!expandable}
      />
      <span className="ml-2 font-mono text-xs text-white/80">{title}</span>
    </div>
  )
}
