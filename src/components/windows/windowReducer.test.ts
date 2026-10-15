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
