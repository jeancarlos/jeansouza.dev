import type { ReactNode } from 'react'

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
  content: ReactNode
  position: { x: number; y: number }
  size: { width: number | string; height: number | string }
  defaultSize: 'compact' | 'medium' | 'large' | 'fullscreen'
  isExpanded: boolean
  isMinimized: boolean
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

function maxZ(windows: WindowState[]): number {
  return windows.reduce((m, w) => Math.max(m, w.zIndex), BASE_Z)
}

export function reducer(state: WindowState[], action: Action): WindowState[] {
  switch (action.type) {
    case 'OPEN': {
      const exists = state.find((w) => w.id === action.window.id)
      if (exists) {
        return state.map((w) => (w.id === action.window.id ? { ...w, zIndex: maxZ(state) + 1 } : w))
      }
      return [...state, { ...action.window, zIndex: maxZ(state) + 1 }]
    }
    case 'CLOSE':
      return state.filter((w) => w.id !== action.id)
    case 'FOCUS':
      return state.map((w) => (w.id === action.id ? { ...w, zIndex: maxZ(state) + 1 } : w))
    case 'EXPAND':
      return state.map((w) =>
        w.id === action.id ? { ...w, isExpanded: !w.isExpanded, isMinimized: false } : w
      )
    case 'MINIMIZE':
      return state.map((w) =>
        w.id === action.id ? { ...w, isMinimized: !w.isMinimized, isExpanded: false } : w
      )
    case 'MOVE':
      return state.map((w) => (w.id === action.id ? { ...w, position: action.position } : w))
    case 'RESIZE':
      return state.map((w) =>
        w.id === action.id ? { ...w, size: action.size, position: action.position } : w
      )
    default:
      return state
  }
}
