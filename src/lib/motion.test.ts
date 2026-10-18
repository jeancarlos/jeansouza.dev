import { runInNewContext } from 'node:vm'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { MOTION_INIT_SCRIPT, MOTION_STORAGE_KEY } from './motion'

const run = () => runInNewContext(MOTION_INIT_SCRIPT, { document, localStorage })

afterEach(() => {
  localStorage.clear()
  delete document.documentElement.dataset.motion
  vi.restoreAllMocks()
})

describe('MOTION_INIT_SCRIPT', () => {
  it('marks the page paused before first paint when the reader paused it', () => {
    localStorage.setItem(MOTION_STORAGE_KEY, 'paused')
    run()
    expect(document.documentElement.dataset.motion).toBe('paused')
  })

  it('leaves the page playing otherwise, even when storage throws', () => {
    run()
    expect(document.documentElement.dataset.motion).toBeUndefined()
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('denied')
    })
    expect(() => run()).not.toThrow()
  })
})
