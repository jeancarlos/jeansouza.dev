export const WINDOW_SAFE = 20
export const TOPBAR_HEIGHT = 75

const DEFAULT_VIEWPORT = { vw: 1200, vh: 800 } as const

export function getViewport(): { vw: number; vh: number } {
  if (typeof window === 'undefined') return DEFAULT_VIEWPORT
  return { vw: window.innerWidth, vh: window.innerHeight }
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
    x: Math.max(WINDOW_SAFE, Math.min((vw - width) / 2, vw - width - WINDOW_SAFE)),
    y:
      topOffset +
      Math.max(
        WINDOW_SAFE,
        Math.min((usableHeight - height) / 2, usableHeight - height - WINDOW_SAFE)
      ),
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
