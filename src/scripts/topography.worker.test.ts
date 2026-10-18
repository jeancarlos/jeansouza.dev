import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type * as Topography from '@/lib/topography'

interface FakeCtx {
  canvas: { width: number; height: number }
  setTransform: ReturnType<typeof vi.fn>
  clearRect: ReturnType<typeof vi.fn>
  stroke: ReturnType<typeof vi.fn>
  fill: ReturnType<typeof vi.fn>
  strokeStyle: string
  fillStyle: string
  lineWidth: number
  globalAlpha: number
  save: ReturnType<typeof vi.fn>
  restore: ReturnType<typeof vi.fn>
  translate: ReturnType<typeof vi.fn>
  scale: ReturnType<typeof vi.fn>
}

const makeCtx = (): FakeCtx => ({
  canvas: { width: 0, height: 0 },
  setTransform: vi.fn(),
  clearRect: vi.fn(),
  stroke: vi.fn(),
  fill: vi.fn(),
  strokeStyle: '',
  fillStyle: '',
  lineWidth: 0,
  globalAlpha: 0,
  save: vi.fn(),
  restore: vi.fn(),
  translate: vi.fn(),
  scale: vi.fn(),
})

class FakePath2D {
  rects = 0
  lines = 0
  moveTo() {
    this.lines++
  }
  lineTo() {}
  rect() {
    this.rects++
  }
}

type Handler = (e: { data: unknown }) => void

let ctx: FakeCtx
let rafCbs: ((t: number) => void)[]
let cancel: ReturnType<typeof vi.fn>

const send = (data: Record<string, unknown>) =>
  (self as unknown as { onmessage: Handler }).onmessage({ data })

const canvasMsg = (extra: Record<string, unknown> = {}) => ({
  canvas: { getContext: () => ctx },
  w: 320,
  h: 240,
  dpr: 2,
  color: '#abc',
  animate: false,
  pointer: null,
  ...extra,
})

const flush = (t: number) => {
  const cbs = rafCbs
  rafCbs = []
  cbs.forEach((cb) => cb(t))
}

async function load() {
  vi.resetModules()
  await import('./topography.worker')
}

beforeEach(() => {
  ctx = makeCtx()
  rafCbs = []
  cancel = vi.fn((id: number) => {
    rafCbs[id - 1] = () => undefined
  })
  vi.stubGlobal('Path2D', FakePath2D)
  vi.stubGlobal('requestAnimationFrame', (cb: (t: number) => void) => rafCbs.push(cb))
  vi.stubGlobal('cancelAnimationFrame', cancel)
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.useRealTimers()
})

describe('topography worker', () => {
  it('ignores updates before a canvas arrives', async () => {
    await load()
    send({ w: 10, h: 10 })
    expect(ctx.clearRect).not.toHaveBeenCalled()
  })

  it('sizes the canvas by dpr and paints one static frame', async () => {
    await load()
    send(canvasMsg())
    expect(ctx.canvas.width).toBe(640)
    expect(ctx.canvas.height).toBe(480)
    expect(ctx.setTransform).toHaveBeenCalledWith(2, 0, 0, 2, 0, 0)
    expect(ctx.clearRect).toHaveBeenCalledWith(0, 0, 320, 240)
    expect(ctx.strokeStyle).toBe('#abc')
    expect(ctx.fillStyle).toBe('#abc')
    expect(ctx.stroke).toHaveBeenCalledTimes(1)
    expect(ctx.fill.mock.calls.length).toBeGreaterThan(0)
    expect(ctx.fill.mock.calls.some(([p]) => (p as FakePath2D).rects > 0)).toBe(true)
    expect(ctx.globalAlpha).toBeGreaterThan(0.1)
    expect(ctx.globalAlpha).toBeLessThanOrEqual(0.55)
    expect(rafCbs).toHaveLength(0)
  })

  it('repaints without resizing when only the color changes while static', async () => {
    await load()
    send(canvasMsg())
    ctx.clearRect.mockClear()
    ctx.setTransform.mockClear()
    send({ color: '#fff' })
    expect(ctx.clearRect).toHaveBeenCalledTimes(1)
    expect(ctx.setTransform).not.toHaveBeenCalled()
    expect(ctx.fillStyle).toBe('#fff')
  })

  it('resizes and repaints when only the width changes', async () => {
    await load()
    send(canvasMsg())
    send({ w: 100 })
    expect(ctx.canvas.width).toBe(200)
    expect(ctx.clearRect).toHaveBeenLastCalledWith(0, 0, 100, 240)
  })

  it('starts the animation loop and keeps scheduling frames', async () => {
    await load()
    send(canvasMsg({ animate: true }))
    expect(cancel).toHaveBeenCalled()
    expect(rafCbs).toHaveLength(1)
    flush(1000)
    expect(ctx.clearRect).toHaveBeenCalledTimes(1)
    expect(rafCbs).toHaveLength(1)
    expect(ctx.globalAlpha).not.toBeCloseTo(0.55, 5)
  })

  it('throttles idle frames and paints once the interval elapsed', async () => {
    await load()
    send(canvasMsg({ animate: true }))
    flush(1000)
    flush(1005)
    expect(ctx.clearRect).toHaveBeenCalledTimes(1)
    flush(1040)
    expect(ctx.clearRect).toHaveBeenCalledTimes(2)
  })

  it('eases the hill toward the pointer, painting every frame while it moves', async () => {
    await load()
    send(canvasMsg({ animate: true }))
    flush(1000)
    send({ pointer: [100, 80] })
    expect(ctx.clearRect).toHaveBeenCalledTimes(1)
    flush(1010)
    flush(1020)
    flush(1030)
    expect(ctx.clearRect).toHaveBeenCalledTimes(4)
  })

  it('lets the hill settle and fall back to idle throttling after the pointer leaves', async () => {
    await load()
    send(canvasMsg({ animate: true }))
    flush(0)
    send({ pointer: [100, 80] })
    for (let t = 16; t <= 600; t += 16) flush(t)
    send({ pointer: null })
    for (let t = 616; t <= 20000; t += 100) flush(t)
    flush(20000)
    const before = ctx.clearRect.mock.calls.length
    flush(20005)
    flush(20010)
    expect(ctx.clearRect.mock.calls.length).toBe(before)
  })

  it('stops the loop, drops the pointer and paints statically when animation is turned off', async () => {
    await load()
    send(canvasMsg({ animate: true }))
    cancel.mockClear()
    ctx.clearRect.mockClear()
    send({ animate: false, pointer: [5, 5] })
    expect(cancel).toHaveBeenCalled()
    expect(rafCbs).toHaveLength(1)
    expect(ctx.clearRect).toHaveBeenCalledTimes(1)
  })

  it('does not restart when animate is resent unchanged', async () => {
    await load()
    send(canvasMsg({ animate: true }))
    cancel.mockClear()
    send({ animate: true, color: '#000' })
    expect(cancel).not.toHaveBeenCalled()
    expect(ctx.clearRect).not.toHaveBeenCalled()
  })

  it('falls back to timers when requestAnimationFrame is unavailable', async () => {
    vi.useFakeTimers()
    vi.stubGlobal('requestAnimationFrame', undefined)
    vi.stubGlobal('cancelAnimationFrame', undefined)
    const clear = vi.spyOn(globalThis, 'clearTimeout')
    await load()
    send(canvasMsg({ animate: true }))
    expect(clear).toHaveBeenCalled()
    expect(ctx.clearRect).not.toHaveBeenCalled()
    vi.advanceTimersByTime(32)
    expect(ctx.clearRect).toHaveBeenCalledTimes(1)
    vi.advanceTimersByTime(40)
    expect(ctx.clearRect.mock.calls.length).toBeGreaterThan(1)
  })
})

const lastScale = () => ctx.scale.mock.calls.at(-1)![0] as number

describe('topography worker intro', () => {
  it('fades the lines in while they scale down, then stops the loop', async () => {
    await load()
    send(canvasMsg({ intro: 2800 }))
    flush(0)
    expect(ctx.scale).toHaveBeenCalledTimes(1)
    for (let t = 100; t <= 3000; t += 100) flush(t)
    const frames = ctx.scale.mock.calls.length
    flush(3100)
    expect(ctx.scale).toHaveBeenCalledTimes(frames)
    expect(rafCbs).toHaveLength(0)
  })

  it('paints the final frame without the scale once the intro is done', async () => {
    await load()
    send(canvasMsg({ intro: 200 }))
    flush(0)
    flush(100)
    flush(200)
    flush(300)
    ctx.scale.mockClear()
    const paints = ctx.clearRect.mock.calls.length
    expect(rafCbs).toHaveLength(0)
    expect(ctx.clearRect.mock.calls.length).toBe(paints)
    expect(ctx.scale).not.toHaveBeenCalled()
  })

  it('fades the dotted lines in with the rest', async () => {
    await load()
    send(canvasMsg({ intro: 2800 }))
    flush(0)
    expect(ctx.globalAlpha).toBe(0)
  })

  it('plays no intro when none was asked for', async () => {
    await load()
    send(canvasMsg())
    expect(ctx.scale).not.toHaveBeenCalled()
  })

  it('ignores an intro sent after the canvas', async () => {
    await load()
    send(canvasMsg({ animate: true }))
    flush(0)
    ctx.scale.mockClear()
    send({ intro: 2800 })
    flush(16)
    expect(ctx.scale).not.toHaveBeenCalled()
  })

  it('freezes a running intro on pause and carries it on when unpaused', async () => {
    await load()
    send(canvasMsg({ animate: true, intro: 2800 }))
    flush(0)
    flush(100)
    flush(200)
    send({ animate: false })
    const frozen = lastScale()
    const paints = ctx.clearRect.mock.calls.length
    flush(900)
    expect(ctx.clearRect.mock.calls.length).toBe(paints)
    send({ animate: true })
    flush(1000)
    flush(1100)
    expect(lastScale()).toBeLessThan(frozen)
  })

  it('ends a running intro at once when asked, for example under reduced motion', async () => {
    await load()
    send(canvasMsg({ animate: true, intro: 2800 }))
    flush(0)
    flush(100)
    ctx.scale.mockClear()
    send({ animate: false, intro: 0 })
    expect(ctx.scale).not.toHaveBeenCalled()
    expect(rafCbs.filter(Boolean).length).toBeGreaterThanOrEqual(0)
    flush(500)
    expect(ctx.scale).not.toHaveBeenCalled()
  })

  it('plays the quick intro of a paused start without animating the lines', async () => {
    await load()
    send(canvasMsg({ animate: false, intro: 200 }))
    flush(0)
    flush(100)
    flush(200)
    expect(ctx.scale).toHaveBeenCalled()
    flush(300)
    expect(rafCbs).toHaveLength(0)
  })

  it('does not repaint when only an unchanged animate flag arrives while paused', async () => {
    await load()
    send(canvasMsg())
    ctx.clearRect.mockClear()
    send({ animate: false })
    expect(ctx.clearRect).not.toHaveBeenCalled()
  })
})

describe('topography worker clock', () => {
  const loadSpying = async () => {
    const times: number[] = []
    vi.resetModules()
    vi.doMock('@/lib/topography', async () => {
      const real = await vi.importActual<typeof Topography>('@/lib/topography')
      return {
        ...real,
        contourSegments: (...args: Parameters<typeof Topography.contourSegments>) => {
          times.push(args[2] ?? 0)
          return real.contourSegments(...args)
        },
      }
    })
    await import('./topography.worker')
    return times
  }

  afterEach(() => {
    vi.doUnmock('@/lib/topography')
  })

  it('carries on from where the lines froze, without lurching on resume', async () => {
    const times = await loadSpying()
    send(canvasMsg({ animate: true }))
    flush(1000)
    flush(1016)
    flush(1032)
    const frozen = times.at(-1)!
    send({ animate: false })
    expect(times.at(-1)).toBe(frozen)
    send({ animate: true })
    flush(9000)
    expect(times.at(-1)).toBe(frozen)
    flush(9016)
    flush(9032)
    expect(times.at(-1)).toBe(frozen + 32)
  })

  it('does not move the lines during a paused intro', async () => {
    const times = await loadSpying()
    send(canvasMsg({ animate: false, intro: 200 }))
    flush(0)
    flush(100)
    flush(200)
    expect(times.length).toBeGreaterThan(1)
    expect(new Set(times)).toEqual(new Set([0]))
  })
})
