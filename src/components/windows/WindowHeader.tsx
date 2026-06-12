'use client'
import { type PointerEvent } from 'react'
import { type DragControls } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { useWindowManager } from './WindowManager'
import { TrafficDot } from './TrafficDot'

interface WindowHeaderProps {
  id: string
  title: string
  isHome: boolean
  isExpanded: boolean
  dragControls: DragControls
  closeable: boolean
  minimizable: boolean
  expandable: boolean
}

const HEADER_CLASS_MOBILE =
  'flex shrink-0 items-center gap-2 px-3 py-2.5 select-none bg-transparent md:hidden'
const HEADER_CLASS_DESKTOP =
  'hidden shrink-0 items-center gap-2 px-3 py-2.5 select-none bg-gradient-to-r from-brand-from to-brand-to md:flex'

export function WindowHeader({
  id,
  title,
  isHome,
  isExpanded,
  dragControls,
  closeable,
  minimizable,
  expandable,
}: WindowHeaderProps) {
  const { closeWindow, minimizeWindow, expandWindow } = useWindowManager()
  const t = useTranslations('window')

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    // dragControls.start bypasses the motion.div drag prop, so the expanded
    // (fullscreen) state has to be gated here as well.
    if (isExpanded) return
    dragControls.start(e)
  }

  return (
    <>
      {/* Mobile header: back button + title — hidden on md+, hidden for home window */}
      {!isHome && (
        <div className={HEADER_CLASS_MOBILE}>
          <button
            onClick={() => history.back()}
            className="shrink-0 cursor-pointer font-mono text-xs whitespace-nowrap text-white/90 hover:text-white"
            aria-label={t('backAria')}
          >
            {t('back')}
          </button>
          <span className="ml-3 min-w-0 truncate font-mono text-xs text-white/80">{title}</span>
        </div>
      )}
      {/* Desktop header: traffic dots + title — hidden below md */}
      <div
        onPointerDown={onPointerDown}
        className={`${HEADER_CLASS_DESKTOP} ${isExpanded ? '' : 'cursor-grab active:cursor-grabbing'}`}
      >
        <TrafficDot
          label={t('close')}
          symbol="×"
          color="var(--color-traffic-close)"
          onClick={() => closeWindow(id)}
          disabled={!closeable}
        />
        <TrafficDot
          label={t('minimize')}
          symbol="−"
          color="var(--color-traffic-minimize)"
          onClick={() => minimizeWindow(id)}
          disabled={!minimizable}
        />
        <TrafficDot
          label={t('expand')}
          symbol="+"
          color="var(--color-traffic-expand)"
          onClick={() => expandWindow(id)}
          disabled={!expandable}
        />
        <span className="ml-2 min-w-0 truncate font-mono text-xs text-white/80">{title}</span>
      </div>
    </>
  )
}
