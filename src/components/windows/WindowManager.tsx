'use client'
import { createContext, useContext, useReducer, useCallback, useRef, type ReactNode } from 'react'
import { WINDOW_SAFE, getViewport, clampPosition } from '@/lib/windowUtils'

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

type Action =
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
    case 'RESIZE':
      return state.map((w) =>
        w.id === action.id ? { ...w, size: action.size, position: action.position } : w
      )
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
  resizeWindow: (
    id: string,
    size: { width: number; height: number },
    position: { x: number; y: number }
  ) => void
}

const WindowManagerContext = createContext<ContextValue | null>(null)

export function WindowManagerProvider({ children }: { children: ReactNode }) {
  const [windows, dispatch] = useReducer(reducer, [])
  // Always-fresh ref — set synchronously in render so callbacks never see stale state
  const windowsRef = useRef(windows)
  // eslint-disable-next-line react-hooks/refs
  windowsRef.current = windows

  const openWindow = useCallback((config: WindowConfig) => {
    const current = windowsRef.current
    const alreadyOpen = current.some((w) => w.id === config.id)

    const CASCADE = 50
    const newConfig = (() => {
      if (alreadyOpen || current.length === 0) return config
      const top = current.reduce((a, b) => (a.zIndex > b.zIndex ? a : b))
      const w = typeof config.size.width === 'number' ? config.size.width : 600
      const h = typeof config.size.height === 'number' ? config.size.height : 400
      return {
        ...config,
        position: clampPosition(
          { x: top.position.x + CASCADE, y: top.position.y + CASCADE },
          { width: w, height: h }
        ),
      }
    })()

    dispatch({ type: 'OPEN', window: newConfig })
    if (
      !alreadyOpen &&
      typeof window !== 'undefined' &&
      window.location.pathname !== newConfig.url
    ) {
      history.pushState(null, '', newConfig.url)
    }
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

  const resizeWindow = useCallback(
    (id: string, size: { width: number; height: number }, position: { x: number; y: number }) => {
      if (typeof window === 'undefined') {
        dispatch({ type: 'RESIZE', id, size, position })
        return
      }
      const { vw, vh } = getViewport()
      const MIN_W = 200
      const MIN_H = 100
      const clampedSize = {
        width: Math.max(MIN_W, Math.min(size.width, vw - WINDOW_SAFE * 2)),
        height: Math.max(MIN_H, Math.min(size.height, vh - WINDOW_SAFE * 2)),
      }
      dispatch({
        type: 'RESIZE',
        id,
        size: clampedSize,
        position: clampPosition(position, clampedSize),
      })
    },
    []
  )

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
        resizeWindow,
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
