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

const FRAME = 'rounded-2xl bg-gradient-to-r from-brand-from to-brand-to p-[2px] shadow-2xl'
const HOME_FRAME =
  '[--home-h:360px] md:[--home-h:256px] md:rounded-2xl md:bg-gradient-to-r md:from-brand-from md:to-brand-to md:p-[2px] md:shadow-2xl'
const MOBILE_FULLSCREEN =
  'max-md:!left-0 max-md:!top-0 max-md:!h-dvh max-md:!max-h-none max-md:!w-screen'

export function getOuterClassName(isHome: boolean): string {
  return isHome ? HOME_FRAME : `${FRAME} ${MOBILE_FULLSCREEN}`
}

export function getInnerRounded(isHome: boolean): string {
  return isHome ? 'md:rounded-[14px]' : 'rounded-[14px]'
}

export function getBodyClassName(isHome: boolean): string {
  return `flex-1 overflow-y-auto ${getInnerRounded(isHome)} font-mono text-brand-text ${isHome ? 'md:bg-crust' : 'bg-crust'}`
}

export function getAnimateStyle(style: WindowStyle, isMobile: boolean, isFocused: boolean) {
  const sharp = isMobile || isFocused
  return {
    width: style.width,
    height: style.height,
    filter: sharp ? 'blur(0px) saturate(1)' : 'blur(2px) saturate(0.4)',
    opacity: 1,
    scale: 1,
    x: 0,
    y: 0,
  }
}

/**
 * Server-rendered windows (placed in CSS) start visible. Windows opened from
 * a button grow out of it: x/y start at the button's offset from the window's
 * final place and settle at 0. Content-sized windows leave height out, since
 * framer cannot tween to auto.
 */
export function getInitialStyle(
  origin: ButtonOrigin | undefined,
  position: { x: Length; y: Length },
  style: WindowStyle,
  autoHeight: boolean
) {
  if (typeof position.x !== 'number' || typeof position.y !== 'number') return false
  if (!origin || typeof style.left !== 'number' || typeof style.top !== 'number') {
    return { opacity: 0, scale: 0.75 }
  }
  return {
    x: origin.x - style.left,
    y: origin.y - style.top,
    width: origin.width,
    ...(autoHeight ? {} : { height: origin.height }),
    opacity: 0,
  }
}

export function getTransition(instant: boolean) {
  if (instant) return { duration: 0 }
  return {
    opacity: { type: 'tween', duration: 0.2, ease: 'easeOut' },
    filter: { type: 'tween', duration: 0.25, ease: 'easeOut' },
    scale: { type: 'spring', stiffness: 400, damping: 22 },
    width: { type: 'tween', duration: 0.15, ease: 'easeOut' },
    height: { type: 'tween', duration: 0.15, ease: 'easeOut' },
    x: { type: 'tween', duration: 0.15, ease: 'easeOut' },
    y: { type: 'tween', duration: 0.15, ease: 'easeOut' },
  }
}
