import { describe, expect, it } from 'vitest'
import { LABEL_HEIGHT, MIN_THUMB, THUMB_CAP, scrollTopForDrag, thumbGeometry } from './scrollThumb'

const at = (scrollTop: number) => ({ scrollTop, scrollHeight: 1000, clientHeight: 500 })

describe('thumbGeometry', () => {
  it('has no thumb when the content fits', () => {
    expect(thumbGeometry({ scrollTop: 0, scrollHeight: 500, clientHeight: 500 }, 500)).toBeNull()
  })

  it('has no thumb for an empty track', () => {
    expect(thumbGeometry(at(0), 0)).toBeNull()
  })

  it('sizes the thumb to the visible share of the content', () => {
    expect(thumbGeometry(at(0), 400)).toEqual({ size: 160, offset: 0, percent: 50 })
  })

  it('moves the thumb and the percent with the scroll position', () => {
    expect(thumbGeometry(at(100), 400)).toEqual({ size: 160, offset: 48, percent: 60 })
    expect(thumbGeometry(at(500), 400)).toEqual({ size: 160, offset: 240, percent: 100 })
  })

  it('clamps an overscrolled position', () => {
    expect(thumbGeometry(at(-50), 400)?.percent).toBe(50)
    expect(thumbGeometry(at(900), 400)?.percent).toBe(100)
  })

  it('never shrinks the thumb below the minimum or grows it past the track', () => {
    const long = { scrollTop: 0, scrollHeight: 100000, clientHeight: 500 }
    expect(thumbGeometry(long, 400)?.size).toBe(MIN_THUMB)
    expect(thumbGeometry(long, 20)?.size).toBe(20)
  })
})

describe('MIN_THUMB', () => {
  it('leaves the middle of the thumb at least as tall as the percent label', () => {
    expect(MIN_THUMB - 2 * THUMB_CAP).toBeGreaterThanOrEqual(LABEL_HEIGHT)
  })
})

describe('scrollTopForDrag', () => {
  it('maps thumb travel to scroll distance', () => {
    expect(scrollTopForDrag(0, 24, at(0), 400)).toBe(50)
  })

  it('clamps to the scrollable range', () => {
    expect(scrollTopForDrag(0, 9999, at(0), 400)).toBe(500)
    expect(scrollTopForDrag(100, -9999, at(100), 400)).toBe(0)
  })

  it('stays put when the thumb fills the track or nothing scrolls', () => {
    expect(scrollTopForDrag(7, 30, at(7), 20)).toBe(7)
    const fits = { scrollTop: 0, scrollHeight: 500, clientHeight: 500 }
    expect(scrollTopForDrag(0, 30, fits, 400)).toBe(0)
  })
})
