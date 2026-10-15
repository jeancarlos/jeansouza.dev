export const WINDOW_SAFE = 20
export const TOPBAR_HEIGHT = 75
export const MIN_WINDOW_WIDTH = 200
export const MIN_WINDOW_HEIGHT = 100

const DEFAULT_VIEWPORT = { vw: 1200, vh: 800 } as const

export function getViewport(): { vw: number; vh: number } {
  if (typeof window === 'undefined') return DEFAULT_VIEWPORT
  return { vw: window.innerWidth, vh: window.innerHeight }
}

/**
 * CSS max-height for content-sized windows: full viewport minus the topbar
 * offset and the safe margins above and below the window.
 */
export const WINDOW_MAX_HEIGHT = `calc(100dvh - ${TOPBAR_HEIGHT + WINDOW_SAFE * 2}px)`

/** Top-anchored position for content-sized (height: auto) windows. */
export function topAnchoredPosition(
  width: number,
  topOffset = 0,
  viewport?: { vw: number; vh: number }
): { x: number; y: number } {
  const { vw } = viewport ?? getViewport()
  return {
    x: Math.max(WINDOW_SAFE, (vw - width) / 2),
    y: topOffset + WINDOW_SAFE,
  }
}

export function centeredPosition(
  width: number,
  height: number,
  topOffset = 0,
  viewport?: { vw: number; vh: number }
): { x: number; y: number } {
  const { vw, vh } = viewport ?? getViewport()
  const usableHeight = vh - topOffset
  return {
    x: Math.max(WINDOW_SAFE, (vw - width) / 2),
    y: topOffset + Math.max(WINDOW_SAFE, (usableHeight - height) / 2),
  }
}

export type Length = number | string

const toCss = (l: Length): string => (typeof l === 'number' ? `${l}px` : l)

/**
 * The same placement as centeredPosition and topAnchoredPosition, written as
 * CSS so the server can render a window where the client will keep it without
 * knowing the viewport.
 */
export function cssCenteredPosition(width: Length, height: Length): { x: string; y: string } {
  return {
    x: `max(${WINDOW_SAFE}px, (100vw - ${toCss(width)}) / 2)`,
    y: `calc(${TOPBAR_HEIGHT}px + max(${WINDOW_SAFE}px, (100dvh - ${TOPBAR_HEIGHT}px - ${toCss(height)}) / 2))`,
  }
}

export function cssTopAnchoredPosition(width: Length, offset = 0): { x: string; y: string } {
  return {
    x: `calc(max(${WINDOW_SAFE}px, (100vw - ${toCss(width)}) / 2) + ${offset}px)`,
    y: `${TOPBAR_HEIGHT + WINDOW_SAFE + offset}px`,
  }
}

export function clampPosition(
  pos: { x: number; y: number },
  size: { width: number; height: number }
): { x: number; y: number } {
  const { vw, vh } = getViewport()
  return {
    x: Math.max(WINDOW_SAFE, Math.min(pos.x, vw - size.width - WINDOW_SAFE)),
    y: Math.max(WINDOW_SAFE, Math.min(pos.y, vh - size.height - WINDOW_SAFE)),
  }
}

export function isPlainClick(
  e: Pick<MouseEvent, 'button' | 'metaKey' | 'ctrlKey' | 'shiftKey' | 'altKey'>
): boolean {
  return e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey
}
