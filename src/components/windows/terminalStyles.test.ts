import { describe, expect, it } from 'vitest'
import {
  getActiveStyle,
  getBodyClassName,
  getInnerRounded,
  getOpenKeyframes,
  getOuterClassName,
} from './terminalStyles'

const size = { width: 500, height: 400 }
const position = { x: 30, y: 40 }

describe('getActiveStyle', () => {
  it('covers the whole viewport when expanded, even if minimized', () => {
    const expected = { left: 0, top: 0, width: '100vw', height: '100dvh' }
    expect(getActiveStyle(true, false, size, position)).toEqual(expected)
    expect(getActiveStyle(true, true, size, position)).toEqual(expected)
  })

  it('uses the stored placement for a normal window', () => {
    expect(getActiveStyle(false, false, size, position)).toEqual({
      left: 30,
      top: 40,
      width: 500,
      height: 400,
    })
  })

  it('collapses a minimized window to its bar height', () => {
    expect(getActiveStyle(false, true, size, position)).toEqual({
      left: 30,
      top: 40,
      width: 500,
      height: 44,
    })
  })
})

describe('class names', () => {
  it('makes a normal window fullscreen on mobile and the home window not', () => {
    expect(getOuterClassName(false)).toContain('max-md:!w-screen')
    expect(getOuterClassName(true)).not.toContain('max-md:!w-screen')
    expect(getOuterClassName(true)).toContain('--home-h')
  })

  it('rounds the home window only from md up', () => {
    expect(getInnerRounded(true)).toBe('md:rounded-[14px]')
    expect(getInnerRounded(false)).toBe('rounded-[14px]')
  })

  it('gives the body the crust background, from md up for home', () => {
    expect(getBodyClassName(false)).toContain(' bg-crust')
    expect(getBodyClassName(false)).not.toContain('md:bg-crust')
    expect(getBodyClassName(true)).toContain('md:bg-crust')
  })
})

describe('native scrollbar', () => {
  it('is hidden on the window body in both engines', () => {
    const cls = getBodyClassName(false)
    expect(cls).toContain('[scrollbar-width:none]')
    expect(cls).toContain('[&::-webkit-scrollbar]:hidden')
  })
})

describe('getOpenKeyframes', () => {
  const dims = { left: 100, top: 50, width: 400, height: 200 }
  const box = dims as DOMRect

  it('grows the window out of the button that opened it', () => {
    const frames = getOpenKeyframes({ x: 20, y: 10, width: 80, height: 20 }, box)
    expect(frames).toEqual([
      {
        transform: 'translate(-80px, -40px) scale(0.2, 0.1)',
        transformOrigin: '0 0',
        opacity: 0,
      },
      { transform: 'none', transformOrigin: '0 0', opacity: 1 },
    ])
  })

  it('skips the animation without an origin', () => {
    expect(getOpenKeyframes(undefined, box)).toBeNull()
  })

  it('skips the animation for a window with no size yet', () => {
    const origin = { x: 0, y: 0, width: 10, height: 10 }
    expect(getOpenKeyframes(origin, { ...dims, width: 0 } as DOMRect)).toBeNull()
    expect(getOpenKeyframes(origin, { ...dims, height: 0 } as DOMRect)).toBeNull()
  })
})
