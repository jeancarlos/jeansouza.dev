import type { Length } from '@/lib/windowUtils'
import type { ButtonOrigin } from './WindowManager'

export interface WindowStyle {
  left: Length
  top: Length
  width: Length
  height: Length
}

const MINIMIZED_HEIGHT = 44

const EXPANDED_STYLE: WindowStyle = {
  left: 0,
  top: 0,
  width: '100vw',
  height: '100dvh',
}

export function getActiveStyle(
  isExpanded: boolean,
  isMinimized: boolean,
  size: { width: Length; height: Length },
  position: { x: Length; y: Length }
): WindowStyle {
  if (isExpanded) return EXPANDED_STYLE
  return {
    left: position.x,
    top: position.y,
    width: size.width,
    height: isMinimized ? MINIMIZED_HEIGHT : size.height,
  }
}

const FRAME = 'rounded-2xl bg-gradient-to-r from-bar-from to-brand-to p-[2px] shadow-2xl'
const HOME_FRAME =
  '[--home-h:360px] md:[--home-h:256px] md:rounded-2xl md:bg-gradient-to-r md:from-bar-from md:to-brand-to md:p-[2px] md:shadow-2xl'
const MOBILE_FULLSCREEN =
  'max-md:!left-0 max-md:!top-0 max-md:!h-dvh max-md:!max-h-none max-md:!w-screen'

export function getOuterClassName(isHome: boolean): string {
  return isHome ? HOME_FRAME : `${FRAME} ${MOBILE_FULLSCREEN}`
}

export function getInnerRounded(isHome: boolean): string {
  return isHome ? 'md:rounded-[14px]' : 'rounded-[14px]'
}

export function getBodyClassName(isHome: boolean): string {
  return `flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${getInnerRounded(isHome)} font-mono text-brand-text ${isHome ? 'md:bg-crust' : 'bg-crust'}`
}

export function getOpenKeyframes(
  origin: ButtonOrigin | undefined,
  box: DOMRect
): Keyframe[] | null {
  if (!origin || box.width === 0 || box.height === 0) return null
  const from = `translate(${origin.x - box.left}px, ${origin.y - box.top}px) scale(${origin.width / box.width}, ${origin.height / box.height})`
  return [
    { transform: from, transformOrigin: '0 0', opacity: 0 },
    { transform: 'none', transformOrigin: '0 0', opacity: 1 },
  ]
}
