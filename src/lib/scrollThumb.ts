export const THUMB_CAP = 16
export const THUMB_WIDTH = 8
export const LABEL_HEIGHT = 20
const THUMB_SCALE = 0.8
export const TRACK_INSET = 16
export const MIN_THUMB = 2 * THUMB_CAP + LABEL_HEIGHT

export interface ScrollMetrics {
  scrollTop: number
  scrollHeight: number
  clientHeight: number
}

export interface ThumbGeometry {
  size: number
  offset: number
  percent: number
}

export function thumbGeometry(m: ScrollMetrics, track: number): ThumbGeometry | null {
  const max = m.scrollHeight - m.clientHeight
  if (max <= 0 || track <= 0) return null
  const size = Math.min(
    track,
    Math.max(MIN_THUMB, (track * m.clientHeight * THUMB_SCALE) / m.scrollHeight)
  )
  const ratio = Math.min(1, Math.max(0, m.scrollTop / max))
  return {
    size,
    offset: Math.round((track - size) * ratio * 100) / 100,
    percent: Math.round(((ratio * max + m.clientHeight) / m.scrollHeight) * 100),
  }
}

export function scrollTopForDrag(
  startScrollTop: number,
  dy: number,
  m: ScrollMetrics,
  track: number
) {
  const max = m.scrollHeight - m.clientHeight
  const geo = thumbGeometry(m, track)
  if (!geo || track === geo.size) return startScrollTop
  const next = startScrollTop + (dy * max) / (track - geo.size)
  return Math.min(max, Math.max(0, next))
}

export function scrollByWheel(el: HTMLElement, deltaY: number, deltaMode: number) {
  el.scrollTop += deltaMode === 1 ? deltaY * 16 : deltaY
}
