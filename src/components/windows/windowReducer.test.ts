import { describe, it, expect } from 'vitest'
import { HOME_ID, HOME_Z, initWindows, windowsReducer, type WindowConfig } from './windowReducer'
import { topWindow } from './WindowManager'

const config = (id: string): WindowConfig => ({
  id,
  url: `/${id}/`,
  title: id,
  pageTitle: id,
  content: null,
  size: { width: 100, height: 100 },
  position: { x: 0, y: 0 },
})

describe('focusing the home window', () => {
  const open = initWindows([config('a'), config('b')])

  it('sends every window behind home, keeping their order', () => {
    const next = windowsReducer(open, { type: 'FOCUS', id: HOME_ID })
    const [a, b] = next
    expect(a.zIndex).toBeLessThan(b.zIndex)
    expect(b.zIndex).toBeLessThan(HOME_Z)
    expect(topWindow(next)).toBeUndefined()
  })

  it('lets a window focused afterwards come back above home', () => {
    const behind = windowsReducer(open, { type: 'FOCUS', id: HOME_ID })
    const next = windowsReducer(behind, { type: 'FOCUS', id: 'a' })
    expect(topWindow(next)?.id).toBe('a')
    expect(next[0].zIndex).toBeGreaterThan(HOME_Z)
  })

  it('leaves the state alone when home is already in front', () => {
    const behind = windowsReducer(open, { type: 'FOCUS', id: HOME_ID })
    expect(windowsReducer(behind, { type: 'FOCUS', id: HOME_ID })).toBe(behind)
  })
})

describe('windowsReducer', () => {
  const open = initWindows([config('a'), config('b')])
  const byId = (state: typeof open, id: string) => state.find((w) => w.id === id)

  it('brings a window opened again to the front instead of adding a copy', () => {
    const next = windowsReducer(open, { type: 'OPEN', window: config('a') })
    expect(next).toHaveLength(2)
    expect(topWindow(next)?.id).toBe('a')
    expect(byId(next, 'b')).toBe(byId(open, 'b'))
  })

  it('toggles expanded and minimized, each clearing the other, on that window only', () => {
    const expanded = windowsReducer(open, { type: 'EXPAND', id: 'a' })
    expect(byId(expanded, 'a')).toMatchObject({ isExpanded: true, isMinimized: false })
    expect(byId(expanded, 'b')).toBe(byId(open, 'b'))
    const minimized = windowsReducer(expanded, { type: 'MINIMIZE', id: 'a' })
    expect(byId(minimized, 'a')).toMatchObject({ isExpanded: false, isMinimized: true })
    expect(byId(windowsReducer(minimized, { type: 'MINIMIZE', id: 'a' }), 'a')?.isMinimized).toBe(
      false
    )
  })

  it('moves and resizes only the window named', () => {
    const moved = windowsReducer(open, { type: 'MOVE', id: 'b', position: { x: 5, y: 6 } })
    expect(byId(moved, 'b')?.position).toEqual({ x: 5, y: 6 })
    expect(byId(moved, 'a')).toBe(byId(open, 'a'))
    const size = { width: 300, height: 200 }
    const resized = windowsReducer(open, {
      type: 'RESIZE',
      id: 'a',
      size,
      position: { x: 1, y: 2 },
    })
    expect(byId(resized, 'a')).toMatchObject({ size, position: { x: 1, y: 2 } })
    expect(byId(resized, 'b')).toBe(byId(open, 'b'))
  })

  it('keeps the stacking order when the windows go behind home', () => {
    const raised = windowsReducer(open, { type: 'FOCUS', id: 'a' })
    const [a, b] = windowsReducer(raised, { type: 'FOCUS', id: HOME_ID })
    expect(b.zIndex).toBeLessThan(a.zIndex)
    expect(a.zIndex).toBeLessThan(HOME_Z)
  })
})
