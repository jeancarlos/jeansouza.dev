'use client'
import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useLayoutEffect,
  useRef,
  type ReactNode,
} from 'react'
import { WINDOW_SAFE, getViewport, clampPosition } from '@/lib/windowUtils'
import { windowsReducer } from './windowReducer'
import type { WindowConfig, WindowState } from './windowReducer'
export type { ButtonOrigin, WindowConfig, WindowState } from './windowReducer'

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
  const [windows, dispatch] = useReducer(windowsReducer, [])
  // Always-fresh ref — set in layout effect so callbacks never see stale state.
  // useLayoutEffect runs synchronously after commit and before any user-fired
  // event handler, preserving the "latest state in stable callback" guarantee
  // without mutating refs during render.
  const windowsRef = useRef(windows)
  useLayoutEffect(() => {
    windowsRef.current = windows
  })

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
      history.pushState({ _appWindow: newConfig.id }, '', newConfig.url)
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
