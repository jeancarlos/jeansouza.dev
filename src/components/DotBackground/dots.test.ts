import { describe, it, expect } from 'vitest'
import { bowOffset, gridSnap } from './dots'

describe('bowOffset', () => {
  it('returns near-zero offset at center (nx=0.5, ny=0.5)', () => {
    const offset = bowOffset(0.5, 0.5, 1.5, 20)
    expect(Math.abs(offset.x)).toBeLessThan(0.5)
    expect(Math.abs(offset.y)).toBeLessThan(0.5)
  })

  it('returns non-zero offset at corner (nx=0, ny=0)', () => {
    const offset = bowOffset(0, 0, 1.5, 20)
    expect(Math.abs(offset.x) + Math.abs(offset.y)).toBeGreaterThan(1)
  })

  it('returns symmetric offsets at mirrored corners', () => {
    const topLeft = bowOffset(0, 0, 1.5, 20)
    const bottomRight = bowOffset(1, 1, 1.5, 20)
    expect(Math.abs(topLeft.x)).toBeCloseTo(Math.abs(bottomRight.x), 5)
    expect(Math.abs(topLeft.y)).toBeCloseTo(Math.abs(bottomRight.y), 5)
  })
})

describe('gridSnap', () => {
  it('snaps to nearest grid cell', () => {
    expect(gridSnap(27, 25)).toBe(25)
    expect(gridSnap(13, 25)).toBe(25)
    expect(gridSnap(12, 25)).toBe(0)
  })

  it('snaps exactly on grid boundary', () => {
    expect(gridSnap(25, 25)).toBe(25)
    expect(gridSnap(50, 25)).toBe(50)
  })
})
