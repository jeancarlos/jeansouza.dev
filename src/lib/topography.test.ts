import { describe, it, expect } from 'vitest'
import { LEVELS, chainSegments, contourSegments, elevation } from './topography'

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

describe('chainSegments', () => {
  it('joins segments sharing endpoints into one ordered polyline', () => {
    const segs = [1, 0, 2, 0, 0, 0, 1, 0, 2, 0, 3, 0]
    expect(chainSegments(segs)).toEqual([[0, 0, 1, 0, 2, 0, 3, 0]])
  })

  it('keeps disjoint segments apart', () => {
    expect(chainSegments([0, 0, 1, 0, 5, 5, 6, 5])).toHaveLength(2)
  })

  it('chains real contours into far fewer lines than segments', () => {
    const segs = contourSegments(800, 600).find((s) => s.length > 40) ?? []
    const lines = chainSegments(segs)
    const points = lines.reduce((n, l) => n + l.length / 2, 0)
    expect(lines.length).toBeLessThan(segs.length / 4 / 3)
    expect(points).toBe(segs.length / 4 + lines.length)
  })
})
