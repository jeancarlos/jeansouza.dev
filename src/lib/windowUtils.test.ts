import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  TOPBAR_HEIGHT,
  WINDOW_SAFE,
  getViewport,
  centeredPosition,
  clampPosition,
  cssCenteredPosition,
  cssTopAnchoredPosition,
  isPlainClick,
  topAnchoredPosition,
} from './windowUtils'

describe('WINDOW_SAFE', () => {
  it('is 20', () => {
    expect(WINDOW_SAFE).toBe(20)
  })
})

describe('getViewport', () => {
  it('returns innerWidth/Height when window is defined', () => {
    vi.stubGlobal('innerWidth', 1440)
    vi.stubGlobal('innerHeight', 900)
    expect(getViewport()).toEqual({ vw: 1440, vh: 900 })
  })
})

describe('centeredPosition', () => {
  beforeEach(() => {
    vi.stubGlobal('innerWidth', 1200)
    vi.stubGlobal('innerHeight', 800)
  })
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('centers a 600x400 window in 1200x800 viewport', () => {
    const pos = centeredPosition(600, 400)
    expect(pos).toEqual({ x: 300, y: 200 })
  })

  it('clamps position so window stays within SAFE margin', () => {
    // 1200x800 viewport, 1100x700 window: center would be x=50, y=50
    // both are >= WINDOW_SAFE(20) so no clamping
    const pos = centeredPosition(1100, 700)
    expect(pos.x).toBeGreaterThanOrEqual(WINDOW_SAFE)
    expect(pos.y).toBeGreaterThanOrEqual(WINDOW_SAFE)
  })
})

describe('clampPosition', () => {
  beforeEach(() => {
    vi.stubGlobal('innerWidth', 1200)
    vi.stubGlobal('innerHeight', 800)
  })
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('returns position unchanged when already within bounds', () => {
    const pos = clampPosition({ x: 100, y: 100 }, { width: 400, height: 300 })
    expect(pos).toEqual({ x: 100, y: 100 })
  })

  it('clamps x when window would overflow right edge', () => {
    const pos = clampPosition({ x: 1000, y: 100 }, { width: 400, height: 300 })
    // max x = 1200 - 400 - 20 = 780
    expect(pos.x).toBe(780)
  })

  it('clamps y when window would overflow bottom edge', () => {
    const pos = clampPosition({ x: 100, y: 700 }, { width: 400, height: 300 })
    // max y = 800 - 300 - 20 = 480
    expect(pos.y).toBe(480)
  })

  it('clamps to WINDOW_SAFE minimum on left/top', () => {
    const pos = clampPosition({ x: -100, y: -50 }, { width: 400, height: 300 })
    expect(pos.x).toBe(WINDOW_SAFE)
    expect(pos.y).toBe(WINDOW_SAFE)
  })
})

describe('getViewport without a window', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('falls back to a desktop viewport on the server', () => {
    vi.stubGlobal('window', undefined)
    expect(getViewport()).toEqual({ vw: 1200, vh: 800 })
  })
})

describe('topAnchoredPosition', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('centers horizontally in the current viewport and sits below the offset', () => {
    vi.stubGlobal('innerWidth', 1000)
    expect(topAnchoredPosition(600, TOPBAR_HEIGHT)).toEqual({ x: 200, y: 95 })
  })

  it('defaults to no offset', () => {
    vi.stubGlobal('innerWidth', 1000)
    expect(topAnchoredPosition(600)).toEqual({ x: 200, y: WINDOW_SAFE })
  })

  it('uses a given viewport instead of the window', () => {
    expect(topAnchoredPosition(600, 0, { vw: 800, vh: 600 })).toEqual({ x: 100, y: 20 })
  })

  it('keeps the safe margin for a window wider than the viewport', () => {
    expect(topAnchoredPosition(900, 0, { vw: 800, vh: 600 }).x).toBe(WINDOW_SAFE)
  })
})

describe('centeredPosition with a viewport or offset', () => {
  it('centers in the space below the offset using the given viewport', () => {
    expect(centeredPosition(400, 200, 100, { vw: 1000, vh: 700 })).toEqual({ x: 300, y: 300 })
  })

  it('keeps the safe margins when the window is larger than the space', () => {
    expect(centeredPosition(2000, 2000, 75, { vw: 1000, vh: 700 })).toEqual({
      x: WINDOW_SAFE,
      y: 75 + WINDOW_SAFE,
    })
  })
})

describe('css positions', () => {
  it('writes the centered placement as css, converting numbers to pixels', () => {
    expect(cssCenteredPosition(320, 280)).toEqual({
      x: 'max(20px, (100vw - 320px) / 2)',
      y: 'calc(75px + max(20px, (100dvh - 75px - 280px) / 2))',
    })
  })

  it('passes css lengths through untouched', () => {
    expect(cssCenteredPosition('50vw', 'auto')).toEqual({
      x: 'max(20px, (100vw - 50vw) / 2)',
      y: 'calc(75px + max(20px, (100dvh - 75px - auto) / 2))',
    })
  })

  it('writes the top anchored placement as css with an optional cascade offset', () => {
    expect(cssTopAnchoredPosition(820)).toEqual({
      x: 'calc(max(20px, (100vw - 820px) / 2) + 0px)',
      y: '95px',
    })
    expect(cssTopAnchoredPosition('60vw', 50)).toEqual({
      x: 'calc(max(20px, (100vw - 60vw) / 2) + 50px)',
      y: '145px',
    })
  })
})

describe('isPlainClick', () => {
  const click = { button: 0, metaKey: false, ctrlKey: false, shiftKey: false, altKey: false }

  it('accepts a primary click without modifiers', () => {
    expect(isPlainClick(click)).toBe(true)
  })

  it.each([
    { button: 1 },
    { metaKey: true },
    { ctrlKey: true },
    { shiftKey: true },
    { altKey: true },
  ])('rejects %o so the browser can open the link its own way', (change) => {
    expect(isPlainClick({ ...click, ...change })).toBe(false)
  })
})
