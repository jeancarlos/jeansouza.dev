import { useId, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react'
import { type DragControls } from 'framer-motion'
import { useTranslations } from '../../i18n/react'
import { useWindowManager } from './WindowManager'
import { TrafficDot } from './TrafficDot'
import { useKeyboardMove, type Placement } from './useKeyboardMove'

interface WindowHeaderProps {
  id: string
  title: string
  isHome: boolean
  isExpanded: boolean
  dragControls: DragControls
}

const PLACEMENTS: Placement[] = ['topLeft', 'center', 'topRight']

const HEADER_CLASS_MOBILE =
  'flex shrink-0 items-center gap-2 px-3 py-2.5 select-none bg-transparent md:hidden'
const HEADER_CLASS_DESKTOP =
  'hidden shrink-0 items-center px-2 py-1.5 select-none bg-gradient-to-r from-brand-from to-brand-to md:flex'

export function WindowHeader({ id, title, isHome, isExpanded, dragControls }: WindowHeaderProps) {
  const { closeWindow, minimizeWindow, expandWindow } = useWindowManager()
  const t = useTranslations('window')
  const move = useKeyboardMove(id, {
    moveMode: t('moveMode'),
    moved: t('moved'),
    cancelled: t('cancelled'),
  })
  const movable = !isHome && !isExpanded
  const [placing, setPlacing] = useState(false)
  const placeToggle = useRef<HTMLButtonElement>(null)
  const panelId = useId()

  const closePanel = () => {
    setPlacing(false)
    placeToggle.current?.focus()
  }

  const onPanelKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key !== 'Escape') return
    e.stopPropagation()
    closePanel()
  }

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
          disabled={isHome}
        />
        <TrafficDot
          label={t('minimize')}
          symbol="−"
          color="var(--color-traffic-minimize)"
          onClick={() => minimizeWindow(id)}
          disabled={isHome}
        />
        <TrafficDot
          label={t('expand')}
          symbol="+"
          color="var(--color-traffic-expand)"
          onClick={() => expandWindow(id)}
          disabled={isHome}
        />
        {movable ? (
          <button
            type="button"
            aria-label={t('move', { title })}
            aria-pressed={move.active}
            onClick={move.onClick}
            onKeyDown={move.onKeyDown}
            onBlur={move.onBlur}
            className={`ml-2 min-w-0 cursor-[inherit] truncate rounded font-mono text-xs text-white/80 ${move.active ? 'ring-2 ring-white' : ''}`}
          >
            {title}
          </button>
        ) : (
          <span className="ml-2 min-w-0 truncate font-mono text-xs text-white/80">{title}</span>
        )}
        {movable && (
          <button
            ref={placeToggle}
            type="button"
            aria-label={t('place')}
            aria-expanded={placing}
            aria-controls={panelId}
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => setPlacing((open) => !open)}
            className="ml-auto inline-flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center rounded font-mono text-xs text-white/80 hover:text-white"
          >
            ⌖
          </button>
        )}
        <span role="status" aria-atomic="true" className="sr-only">
          {move.status}
        </span>
      </div>
      {movable && placing && (
        <div
          id={panelId}
          role="group"
          aria-label={t('place')}
          className="border-surface bg-base text-text hidden shrink-0 flex-wrap gap-1 border-b px-2 py-1 md:flex"
        >
          {PLACEMENTS.map((where) => (
            <button
              key={where}
              type="button"
              onKeyDown={onPanelKeyDown}
              onClick={(e) => {
                move.place(e.currentTarget, where, t('placed'))
                closePanel()
              }}
              className="hover:bg-surface cursor-pointer rounded px-2 py-0.5 font-mono text-xs"
            >
              {t(where)}
            </button>
          ))}
        </div>
      )}
    </>
  )
}
