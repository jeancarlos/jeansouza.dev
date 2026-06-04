import type { ButtonOrigin } from './WindowManager'

export interface WindowStyle {
  width: number | string
  height: number | string
  x: number
  y: number
}

export const EXPANDED_STYLE: WindowStyle = {
  width: 'calc(100vw - 80px)',
  height: 'calc(100vh - 80px)',
  x: 40,
  y: 40,
}

export const MOBILE_STYLE: WindowStyle = {
  width: '100vw',
  height: '100dvh',
  x: 0,
  y: 0,
}

export function getActiveStyle(
  isMobile: boolean,
  isHome: boolean,
  isExpanded: boolean,
  isMinimized: boolean,
  size: { width: number | string; height: number | string },
  position: { x: number; y: number }
): WindowStyle {
  if (isMobile && !isHome) return MOBILE_STYLE
  if (isExpanded) return EXPANDED_STYLE
  return {
    width: size.width,
    height: isMinimized ? 44 : size.height,
    x: position.x,
    y: position.y,
  }
}

export function getInnerRounded(isMobile: boolean, isHome: boolean): string {
  if (isMobile && isHome) return ''
  if (isMobile) return 'rounded-[42px]'
  return 'rounded-[14px]'
}

export function getOuterClassName(isMobile: boolean, isHome: boolean): string {
  if (isMobile && isHome) return ''
  const base = isMobile ? '' : 'rounded-2xl'
  return `${base} bg-gradient-to-r from-brand-from to-brand-to p-[2px] shadow-2xl`
}

export function getBodyClassName(isMobile: boolean, isHome: boolean, innerRounded: string): string {
  const bg = isMobile && isHome ? 'bg-transparent' : 'bg-crust'
  return `flex-1 overflow-y-auto ${innerRounded} font-mono text-brand-text ${bg}`
}

export interface AnimateStyle {
  width: number | string
  height: number | string
  x: number
  y: number
  filter: string
  opacity: number
  scale: number
}

export function getAnimateStyle(
  activeStyle: WindowStyle,
  isMobile: boolean,
  isFocused: boolean
): AnimateStyle {
  return {
    ...activeStyle,
    filter: isMobile || isFocused ? 'blur(0px)' : 'blur(2px)',
    opacity: isMobile || isFocused ? 1 : 0.6,
    scale: 1,
  }
}

export function getTransition(isResizing: boolean) {
  if (isResizing) return { duration: 0 }
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

export interface WindowVisibility {
  showHeader: boolean
  showBody: boolean
  showResizeHandles: boolean
}

export function getWindowVisibility(
  isMobile: boolean,
  isHome: boolean,
  isExpanded: boolean,
  isMinimized: boolean,
  resizable: boolean
): WindowVisibility {
  return {
    showHeader: !(isMobile && isHome),
    showBody: !isMinimized,
    showResizeHandles: !isMobile && resizable && !isExpanded && !isMinimized,
  }
}

export type { ButtonOrigin }
