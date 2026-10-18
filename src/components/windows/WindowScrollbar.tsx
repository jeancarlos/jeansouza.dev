import {
  useEffect,
  useRef,
  useState,
  type PointerEvent,
  type RefObject,
  type WheelEvent,
} from 'react'
import { useIsMobile } from '@/lib/useIsMobile'
import {
  TRACK_INSET,
  scrollByWheel,
  scrollTopForDrag,
  thumbGeometry,
  type ThumbGeometry,
} from '@/lib/scrollThumb'

interface Props {
  target: RefObject<HTMLElement | null>
}

interface Track extends ThumbGeometry {
  top: number
  height: number
}

function trackLength(el: HTMLElement): number {
  return el.clientHeight - 2 * TRACK_INSET
}

function measure(el: HTMLElement): Track | null {
  const height = trackLength(el)
  const geo = thumbGeometry(el, height)
  return geo && { ...geo, top: el.offsetTop + TRACK_INSET, height }
}

const LABEL_HIDE_MS = 2000

export function WindowScrollbar({ target }: Props) {
  const [track, setTrack] = useState<Track | null>(null)
  const [awake, setAwake] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const isMobile = useIsMobile()

  const wake = () => {
    setAwake(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setAwake(false), LABEL_HIDE_MS)
  }

  useEffect(() => () => clearTimeout(timer.current), [])

  useEffect(() => {
    const el = target.current
    if (!el) return
    const update = () => setTrack(measure(el))
    update()
    const onScroll = () => {
      update()
      wake()
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    const observer = new ResizeObserver(update)
    observer.observe(el)
    if (el.firstElementChild) observer.observe(el.firstElementChild)
    return () => {
      el.removeEventListener('scroll', onScroll)
      observer.disconnect()
    }
  }, [target])

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    const el = target.current
    if (!el || !e.isPrimary || e.button !== 0) return
    e.preventDefault()
    wake()
    e.currentTarget.setPointerCapture(e.pointerId)
    const { pointerId } = e
    const startY = e.clientY
    const startTop = el.scrollTop
    const handle = e.currentTarget
    const move = (ev: globalThis.PointerEvent) => {
      if (ev.pointerId !== pointerId) return
      wake()
      el.scrollTop = scrollTopForDrag(startTop, ev.clientY - startY, el, trackLength(el))
    }
    const end = (ev: globalThis.PointerEvent) => {
      if (ev.pointerId !== pointerId) return
      wake()
      handle.removeEventListener('pointermove', move)
      handle.removeEventListener('pointerup', end)
      handle.removeEventListener('pointercancel', end)
      handle.removeEventListener('lostpointercapture', end)
    }
    handle.addEventListener('pointermove', move)
    handle.addEventListener('pointerup', end)
    handle.addEventListener('pointercancel', end)
    handle.addEventListener('lostpointercapture', end)
  }

  const onWheel = (e: WheelEvent<HTMLDivElement>) => {
    if (target.current) scrollByWheel(target.current, e.deltaY, e.deltaMode)
  }

  if (!track) return null

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute right-0 z-30 w-0"
      style={{ top: track.top, height: track.height }}
    >
      <div
        data-scroll-thumb
        onPointerDown={onPointerDown}
        onWheel={onWheel}
        className="group pointer-events-auto absolute top-0 right-[-7px] flex w-[24px] cursor-grab touch-none active:cursor-grabbing md:right-[-6px] md:w-[14px]"
        style={{ transform: `translateY(${track.offset}px)`, height: track.size }}
      >
        <div className="scroll-thumb mr-[3px] ml-auto h-full w-[8px] transition-[scale] duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-active:[scale:1.8_1] motion-reduce:transition-none" />
        <span
          className={`font-reading text-brand-muted pointer-events-none absolute top-1/2 -translate-y-1/2 text-sm leading-5 transition-opacity duration-300 select-none motion-reduce:transition-none ${isMobile ? 'right-full mr-1' : 'left-full ml-1'} ${isMobile && !awake ? 'opacity-0' : 'opacity-100'}`}
        >
          {track.percent}%
        </span>
      </div>
    </div>
  )
}
