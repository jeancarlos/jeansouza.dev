import { describe, it, expect } from 'vitest'
import {
  CELL,
  HILL_RADIUS,
  introLook,
  LEVELS,
  contourSegments,
  elevation,
  hillAt,
  levelValue,
} from './topography'

describe('elevation', () => {
  it('is deterministic and stays in [0, 1]', () => {
    for (let i = 0; i < 200; i++) {
      const x = i * 37.3
      const y = i * 91.7
      expect(elevation(x, y)).toBe(elevation(x, y))
      expect(elevation(x, y)).toBeGreaterThanOrEqual(0)
      expect(elevation(x, y)).toBeLessThanOrEqual(1)
    }
  })
})

describe('contourSegments', () => {
  it('returns one segment list per level, each a whole number of segments', () => {
    const levels = contourSegments(800, 600)
    expect(levels).toHaveLength(LEVELS)
    for (const segs of levels) expect(segs.length % 4).toBe(0)
    expect(levels.some((segs) => segs.length > 0)).toBe(true)
  })
})

describe('contourSegments level culling', () => {
  it('matches testing every level in every cell', () => {
    const w = 300
    const h = 200
    const brute = Array.from({ length: LEVELS }, () => [] as number[])
    const cols = Math.ceil(w / CELL) + 1
    const rows = Math.ceil(h / CELL) + 1
    for (let j = 0; j < rows - 1; j++)
      for (let i = 0; i < cols - 1; i++) {
        const [x, y] = [i * CELL, j * CELL]
        const v = [
          Math.fround(elevation(x, y, 7)),
          Math.fround(elevation(x + CELL, y, 7)),
          Math.fround(elevation(x + CELL, y + CELL, 7)),
          Math.fround(elevation(x, y + CELL, 7)),
        ]
        brute.forEach((out, k) => {
          const t = levelValue(k)
          const edges: [number, number, number, number, number, number][] = [
            [v[0], v[1], x, y, CELL, 0],
            [v[1], v[2], x + CELL, y, 0, CELL],
            [v[3], v[2], x, y + CELL, CELL, 0],
            [v[0], v[3], x, y, 0, CELL],
          ]
          for (const [a, b, ex, ey, dx, dy] of edges)
            if (a < t !== b < t) {
              const f = (t - a) / (b - a)
              out.push(ex + dx * f, ey + dy * f)
            }
        })
      }
    expect(contourSegments(w, h, 7)).toEqual(brute)
  })
})

describe('hillAt', () => {
  it('peaks at the hill centre and fades with distance', () => {
    const hill = { x: 100, y: 100, height: 0.2 }
    expect(hillAt(hill, 100, 100)).toBeCloseTo(0.2)
    expect(hillAt(hill, 100 + HILL_RADIUS * 3, 100)).toBeLessThan(0.001)
    expect(hillAt(undefined, 100, 100)).toBe(0)
  })

  it('adds rings around the pointer', () => {
    const flat = contourSegments(400, 400, 0)
    const raised = contourSegments(400, 400, 0, { x: 200, y: 200, height: 0.2 })
    const count = (levels: number[][]) => levels.reduce((n, s) => n + s.length, 0)
    expect(count(raised)).toBeGreaterThan(count(flat))
  })
})

describe('introLook', () => {
  it('starts invisible, slightly large and straight, and ends as the full contours', () => {
    const start = introLook(0)
    expect(start).toMatchObject({ alpha: 0, flat: 1 })
    expect(start.scale).toBeGreaterThan(1)
    expect(introLook(1)).toEqual({ alpha: 1, scale: 1, flat: 0 })
  })

  it('fades in, scales down and deforms together, clamping out of range progress', () => {
    const a = introLook(0.3)
    const b = introLook(0.6)
    expect(b.alpha).toBeGreaterThan(a.alpha)
    expect(b.scale).toBeLessThan(a.scale)
    expect(b.flat).toBeLessThan(a.flat)
    expect(introLook(-1)).toEqual(introLook(0))
    expect(introLook(9)).toEqual(introLook(1))
  })
})

describe('contourSegments flat', () => {
  it('draws one straight horizontal line per level when fully flat', () => {
    const levels = contourSegments(320, 240, 0, undefined, 1)
    const populated = levels.filter((segs) => segs.length > 0)
    expect(populated.length).toBeGreaterThan(10)
    for (const segs of populated)
      for (let i = 0; i < segs.length; i += 4) expect(segs[i + 1]).toBeCloseTo(segs[i + 3], 5)
  })

  it('matches the unflattened contours at zero', () => {
    expect(contourSegments(320, 240, 0, undefined, 0)).toEqual(contourSegments(320, 240))
  })
})
