import {
  type MouseEvent,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useReducer,
  useRef,
  type ReactNode,
} from 'react'
import {
  MIN_WINDOW_HEIGHT,
  MIN_WINDOW_WIDTH,
  WINDOW_SAFE,
  clampPosition,
  getViewport,
  isPlainClick,
} from '@/lib/windowUtils'
import { HOME_ID, HOME_Z, initWindows, windowsReducer } from './windowReducer'
import type { ButtonOrigin, WindowConfig, WindowState } from './windowReducer'

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

const CASCADE = 50

interface AppHistoryState {
  _appWindow?: string
}

export function topWindow(windows: WindowState[]): WindowState | undefined {
  const top = windows.reduce<WindowState | undefined>(
    (a, b) => (a && a.zIndex > b.zIndex ? a : b),
    undefined
  )
  return top && top.zIndex > HOME_Z ? top : undefined
}

function cascadeFrom(config: WindowConfig, open: WindowState[]): WindowConfig {
  const top = topWindow(open)
  if (!top || config.size.height === 'auto') return config
  const { x, y } = top.position
  const { width, height } = config.size
  if (typeof x !== 'number' || typeof y !== 'number') return config
  if (typeof width !== 'number' || typeof height !== 'number') return config
  return {
    ...config,
    position: clampPosition({ x: x + CASCADE, y: y + CASCADE }, { width, height }),
  }
}

interface ProviderProps {
  /** Windows the page was rendered with, so the server can render them too. */
  initialWindows?: WindowConfig[]
  /** The windows a URL stands for; Back and Forward reopen and close windows to match it. */
  windowsForPath?: (pathname: string) => WindowConfig[]
  homeUrl?: string
  homeTitle?: string
  children: ReactNode
}

/**
 * Owns the windows and keeps the URL in step with them: opening a window
 * pushes its URL, closing the window that pushed the current entry goes Back
 * (any other close rewrites the current entry), and Back or Forward reconcile
 * the open windows with the URL they land on.
 */
export function WindowManagerProvider({
  initialWindows = [],
  windowsForPath,
  homeUrl = '/',
  homeTitle,
  children,
}: ProviderProps) {
  const [windows, dispatch] = useReducer(windowsReducer, initialWindows, initWindows)
  const windowsRef = useRef(windows)
  useLayoutEffect(() => {
    windowsRef.current = windows
  })

  useEffect(() => {
    const state = windows.length ? 'open' : 'none'
    if (document.documentElement.dataset.windows !== state)
      document.documentElement.dataset.windows = state
  }, [windows])

  useEffect(() => {
    if (homeTitle) document.title = topWindow(windows)?.pageTitle ?? homeTitle
  }, [windows, homeTitle])

  useEffect(() => {
    if (!windowsForPath) return
    const onPopstate = () => {
      const wanted = windowsForPath(location.pathname)
      const open = windowsRef.current
      for (const w of open) {
        if (!wanted.some((c) => c.id === w.id)) dispatch({ type: 'CLOSE', id: w.id })
      }
      for (const c of wanted) {
        if (!open.some((w) => w.id === c.id)) dispatch({ type: 'OPEN', window: c })
      }
    }
    window.addEventListener('popstate', onPopstate)
    return () => window.removeEventListener('popstate', onPopstate)
  }, [windowsForPath])

  const openWindow = useCallback((config: WindowConfig) => {
    const open = windowsRef.current
    const alreadyOpen = open.some((w) => w.id === config.id)
    dispatch({ type: 'OPEN', window: alreadyOpen ? config : cascadeFrom(config, open) })
    if (!alreadyOpen && location.pathname !== config.url) {
      history.pushState({ _appWindow: config.id } satisfies AppHistoryState, '', config.url)
    }
  }, [])

  const closeWindow = useCallback(
    (id: string) => {
      dispatch({ type: 'CLOSE', id })
      const closing = windowsRef.current.find((w) => w.id === id)
      const pushedHere = (history.state as AppHistoryState | null)?._appWindow === id
      if (pushedHere && location.pathname === closing?.url) {
        history.back()
        return
      }
      const top = topWindow(windowsRef.current.filter((w) => w.id !== id))
      history.replaceState(history.state, '', top?.url ?? homeUrl)
    },
    [homeUrl]
  )

  const focusWindow = useCallback(
    (id: string) => {
      dispatch({ type: 'FOCUS', id })
      const url = id === HOME_ID ? homeUrl : windowsRef.current.find((w) => w.id === id)?.url
      if (url && location.pathname !== url) history.replaceState(history.state, '', url)
    },
    [homeUrl]
  )
  const expandWindow = useCallback((id: string) => dispatch({ type: 'EXPAND', id }), [])
  const minimizeWindow = useCallback((id: string) => dispatch({ type: 'MINIMIZE', id }), [])
  const moveWindow = useCallback(
    (id: string, position: { x: number; y: number }) => dispatch({ type: 'MOVE', id, position }),
    []
  )

  const resizeWindow = useCallback(
    (id: string, size: { width: number; height: number }, position: { x: number; y: number }) => {
      const { vw, vh } = getViewport()
      const clamped = {
        width: Math.max(MIN_WINDOW_WIDTH, Math.min(size.width, vw - WINDOW_SAFE * 2)),
        height: Math.max(MIN_WINDOW_HEIGHT, Math.min(size.height, vh - WINDOW_SAFE * 2)),
      }
      dispatch({ type: 'RESIZE', id, size: clamped, position: clampPosition(position, clamped) })
    },
    []
  )

  const value = useMemo(
    () => ({
      windows,
      openWindow,
      closeWindow,
      focusWindow,
      expandWindow,
      minimizeWindow,
      moveWindow,
      resizeWindow,
    }),
    [
      windows,
      openWindow,
      closeWindow,
      focusWindow,
      expandWindow,
      minimizeWindow,
      moveWindow,
      resizeWindow,
    ]
  )

  return <WindowManagerContext.Provider value={value}>{children}</WindowManagerContext.Provider>
}

export function useWindowManager(): ContextValue {
  const ctx = useContext(WindowManagerContext)
  if (!ctx) throw new Error('useWindowManager must be used inside WindowManagerProvider')
  return ctx
}

/**
 * Click handler for a link that stands for a window: a plain click opens the
 * window, growing out of the link; a modified click is left to the browser.
 */
export function useWindowOpener() {
  const { openWindow } = useWindowManager()
  return (open: (origin: ButtonOrigin) => WindowConfig) => (e: MouseEvent<HTMLElement>) => {
    if (!isPlainClick(e)) return
    e.preventDefault()
    const r = e.currentTarget.getBoundingClientRect()
    openWindow(open({ x: r.left, y: r.top, width: r.width, height: r.height }))
  }
}
