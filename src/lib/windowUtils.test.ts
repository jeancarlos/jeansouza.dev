import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { WINDOW_SAFE, getViewport, centeredPosition, clampPosition } from './windowUtils'

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
