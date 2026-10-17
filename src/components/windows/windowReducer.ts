import type { ReactNode } from 'react'
import type { Length } from '@/lib/windowUtils'

export interface ButtonOrigin {
  x: number
  y: number
  width: number
  height: number
}

export interface WindowConfig {
  id: string
  url: string
  title: string
  pageTitle?: string
  content: ReactNode
  /** Pixels once placed on the client; CSS lengths while still server-rendered. */
  position: { x: Length; y: Length }
  size: { width: Length; height: Length }
  /** CSS max-height override for content-sized (height: auto) windows. */
  maxHeight?: string
  isExpanded?: boolean
  isMinimized?: boolean
  origin?: ButtonOrigin
}

export interface WindowState extends WindowConfig {
  zIndex: number
}

export type Action =
  | { type: 'OPEN'; window: WindowConfig }
  | { type: 'CLOSE'; id: string }
  | { type: 'FOCUS'; id: string }
  | { type: 'EXPAND'; id: string }
  | { type: 'MINIMIZE'; id: string }
  | { type: 'MOVE'; id: string; position: { x: number; y: number } }
  | {
      type: 'RESIZE'
      id: string
      size: { width: number; height: number }
      position: { x: number; y: number }
    }

const BASE_Z = 20
export const HOME_ID = 'home'
export const HOME_Z = BASE_Z

function maxZ(windows: WindowState[]): number {
  return windows.reduce((m, w) => Math.max(m, w.zIndex), BASE_Z)
}

function behindHome(windows: WindowState[]): WindowState[] {
  if (windows.every((w) => w.zIndex < HOME_Z)) return windows
  const order = [...windows].sort((a, b) => a.zIndex - b.zIndex)
  return windows.map((w) => ({ ...w, zIndex: HOME_Z - order.length + order.indexOf(w) }))
}

function update(
  windows: WindowState[],
  id: string,
  change: (w: WindowState) => Partial<WindowState>
): WindowState[] {
  return windows.map((w) => (w.id === id ? { ...w, ...change(w) } : w))
}

export function initWindows(windows: WindowConfig[]): WindowState[] {
  return windows.map((w, i) => ({ ...w, zIndex: BASE_Z + 1 + i }))
}

export function windowsReducer(state: WindowState[], action: Action): WindowState[] {
  switch (action.type) {
    case 'OPEN':
      return state.some((w) => w.id === action.window.id)
        ? update(state, action.window.id, () => ({ zIndex: maxZ(state) + 1 }))
        : [...state, { ...action.window, zIndex: maxZ(state) + 1 }]
    case 'CLOSE':
      return state.filter((w) => w.id !== action.id)
    case 'FOCUS':
      return action.id === HOME_ID
        ? behindHome(state)
        : update(state, action.id, () => ({ zIndex: maxZ(state) + 1 }))
    case 'EXPAND':
      return update(state, action.id, (w) => ({ isExpanded: !w.isExpanded, isMinimized: false }))
    case 'MINIMIZE':
      return update(state, action.id, (w) => ({ isMinimized: !w.isMinimized, isExpanded: false }))
    case 'MOVE':
      return update(state, action.id, () => ({ position: action.position }))
    case 'RESIZE':
      return update(state, action.id, () => ({ size: action.size, position: action.position }))
    default:
      return state
  }
}
