'use client'
import { type PointerEvent } from 'react'
import { type DragControls } from 'framer-motion'
import { useWindowManager } from './WindowManager'
import { TrafficDot } from './TrafficDot'

interface WindowHeaderProps {
  id: string
  title: string
  isHome: boolean
  dragControls: DragControls
  closeable: boolean
  minimizable: boolean
  expandable: boolean
}

const HEADER_CLASS_MOBILE =
  'flex shrink-0 items-center gap-2 px-3 py-2.5 select-none bg-transparent md:hidden'
const HEADER_CLASS_DESKTOP =
  'hidden shrink-0 items-center gap-2 px-3 py-2.5 select-none cursor-grab bg-gradient-to-r from-brand-from to-brand-to active:cursor-grabbing md:flex'

export function WindowHeader({
  id,
  title,
  isHome,
  dragControls,
  closeable,
  minimizable,
  expandable,
}: WindowHeaderProps) {
  const { closeWindow, minimizeWindow, expandWindow } = useWindowManager()

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    dragControls.start(e)
  }

  return (
    <>
      {/* Mobile header: back button + title — hidden on md+, hidden for home window */}
      {!isHome && (
        <div className={HEADER_CLASS_MOBILE}>
          <button
            onClick={() => closeWindow(id)}
            className="font-mono text-xs text-white/90 hover:text-white"
            aria-label="Go back"
          >
            {'< back'}
          </button>
          <span className="ml-3 font-mono text-xs text-white/80">{title}</span>
        </div>
      )}
      {/* Desktop header: traffic dots + title — hidden below md */}
      <div onPointerDown={onPointerDown} className={HEADER_CLASS_DESKTOP}>
        <TrafficDot
          label="Close"
          symbol="×"
          color="var(--color-traffic-close)"
          onClick={() => closeWindow(id)}
          disabled={!closeable}
        />
        <TrafficDot
          label="Minimize"
          symbol="−"
          color="var(--color-traffic-minimize)"
          onClick={() => minimizeWindow(id)}
          disabled={!minimizable}
        />
        <TrafficDot
          label="Expand"
          symbol="+"
          color="var(--color-traffic-expand)"
          onClick={() => expandWindow(id)}
          disabled={!expandable}
        />
        <span className="ml-2 font-mono text-xs text-white/80">{title}</span>
      </div>
    </>
  )
}
