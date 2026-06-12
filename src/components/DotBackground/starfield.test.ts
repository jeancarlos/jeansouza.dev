import { describe, it, expect } from 'vitest'
import { initStar, projectStar, advanceStar, FOCAL_LENGTH, MAX_DEPTH } from './starfield'

describe('initStar', () => {
  it('creates star with valid depth range', () => {
    const star = initStar(800, 600)
    expect(star.z).toBeGreaterThan(0)
    expect(star.z).toBeLessThanOrEqual(MAX_DEPTH)
  })
})

describe('projectStar', () => {
  it('returns screen position for a centered star', () => {
    const star = { x: 0, y: 0, z: FOCAL_LENGTH }
    const result = projectStar(star, 800, 600)
    expect(result.sx).toBeCloseTo(800 / 2 + 80, 0)
    expect(result.sy).toBeCloseTo(600 / 2 - 40, 0)
  })

  it('returns larger size for closer stars', () => {
    const far = { x: 0, y: 0, z: 100 }
    const near = { x: 0, y: 0, z: 10 }
    const pFar = projectStar(far, 800, 600)
    const pNear = projectStar(near, 800, 600)
    expect(pNear.size).toBeGreaterThan(pFar.size)
  })
})

describe('advanceStar', () => {
  it('decreases z each frame', () => {
    const star = initStar(800, 600)
    const zBefore = star.z
    advanceStar(star, 0.8)
    expect(star.z).toBeLessThan(zBefore)
  })
})
