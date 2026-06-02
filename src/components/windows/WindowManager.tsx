'use client'
import { createContext, useContext, useReducer, useCallback, type ReactNode } from 'react'

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
}

export interface WindowState extends WindowConfig {
  zIndex: number
}

type Action =
  | { type: 'OPEN'; window: WindowConfig }
  | { type: 'CLOSE'; id: string }
  | { type: 'FOCUS'; id: string }
  | { type: 'EXPAND'; id: string }
  | { type: 'MINIMIZE'; id: string }
  | { type: 'MOVE'; id: string; position: { x: number; y: number } }

const BASE_Z = 20

function maxZ(windows: WindowState[]): number {
  return windows.reduce((m, w) => Math.max(m, w.zIndex), BASE_Z)
}

function reducer(state: WindowState[], action: Action): WindowState[] {
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
    default:
      return state
  }
}

interface ContextValue {
  windows: WindowState[]
  openWindow: (config: WindowConfig) => void
  closeWindow: (id: string) => void
  focusWindow: (id: string) => void
  expandWindow: (id: string) => void
  minimizeWindow: (id: string) => void
  moveWindow: (id: string, position: { x: number; y: number }) => void
}

const WindowManagerContext = createContext<ContextValue | null>(null)

export function WindowManagerProvider({ children }: { children: ReactNode }) {
  const [windows, dispatch] = useReducer(reducer, [])

  const openWindow = useCallback((config: WindowConfig) => {
    dispatch({ type: 'OPEN', window: config })
    history.pushState(null, '', config.url)
  }, [])

  const closeWindow = useCallback((id: string) => {
    dispatch({ type: 'CLOSE', id })
  }, [])

  const focusWindow = useCallback((id: string) => {
    dispatch({ type: 'FOCUS', id })
  }, [])

  const expandWindow = useCallback((id: string) => {
    dispatch({ type: 'EXPAND', id })
  }, [])

  const minimizeWindow = useCallback((id: string) => {
    dispatch({ type: 'MINIMIZE', id })
  }, [])

  const moveWindow = useCallback((id: string, position: { x: number; y: number }) => {
    dispatch({ type: 'MOVE', id, position })
  }, [])

  return (
    <WindowManagerContext.Provider
      value={{
        windows,
        openWindow,
        closeWindow,
        focusWindow,
        expandWindow,
        minimizeWindow,
        moveWindow,
      }}
    >
      {children}
    </WindowManagerContext.Provider>
  )
}

export function useWindowManager(): ContextValue {
  const ctx = useContext(WindowManagerContext)
  if (!ctx) throw new Error('useWindowManager must be used inside WindowManagerProvider')
  return ctx
}
