import { contourSegments, type Hill } from '@/lib/topography'

export interface TopographyState {
  w: number
  h: number
  dpr: number
  color: string
  animate: boolean
  pointer: [number, number] | null
}

type Message = Partial<TopographyState> & { canvas?: OffscreenCanvas }

const state: TopographyState = {
  w: 0,
  h: 0,
  dpr: 1,
  color: '',
  animate: false,
  pointer: null,
}
const HILL_HEIGHT = 0.22
const hill: Hill = { x: 0, y: 0, height: 0 }
let ctx: OffscreenCanvasRenderingContext2D | null = null
let frame = 0

const nextFrame: (cb: (t: number) => void) => number =
  typeof requestAnimationFrame === 'function'
    ? (cb) => requestAnimationFrame(cb)
    : (cb) => Number(setTimeout(() => cb(performance.now()), 16))
const cancelFrame = (id: number) =>
  typeof cancelAnimationFrame === 'function' ? cancelAnimationFrame(id) : clearTimeout(id)

const isDotted = (k: number) => k % 4 === 2

const DOT_GAP = 5
const DOT = 1.5

function addLines(path: Path2D, segs: number[]) {
  for (let i = 0; i < segs.length; i += 4) {
    path.moveTo(segs[i], segs[i + 1])
    path.lineTo(segs[i + 2], segs[i + 3])
  }
}

function dotPath(segs: number[]): Path2D {
  const path = new Path2D()
  for (let i = 0; i < segs.length; i += 4) {
    const dx = segs[i + 2] - segs[i]
    const dy = segs[i + 3] - segs[i + 1]
    const n = Math.max(1, Math.round(Math.hypot(dx, dy) / DOT_GAP))
    for (let d = 0; d < n; d++) {
      const f = (d + 0.5) / n
      path.rect(segs[i] + dx * f - DOT / 2, segs[i + 1] + dy * f - DOT / 2, DOT, DOT)
    }
  }
  return path
}

function paint(time: number) {
  if (!ctx) return
  const flicker = state.animate ? time : 0
  const levels = contourSegments(state.w, state.h, time, hill)
  const lines = new Path2D()
  levels.forEach((segs, k) => isDotted(k) || addLines(lines, segs))
  ctx.clearRect(0, 0, state.w, state.h)
  ctx.strokeStyle = ctx.fillStyle = state.color
  ctx.lineWidth = 1
  ctx.globalAlpha = 0.24
  ctx.stroke(lines)
  levels.forEach((segs, k) => {
    if (!ctx || !isDotted(k)) return
    ctx.globalAlpha = 0.55 * (flicker === 0 ? 1 : 0.6 + 0.4 * Math.sin(flicker / 1600 + k * 2.3))
    ctx.fill(dotPath(segs))
  })
}

const SETTLE_MS = 1000
let lastTick = 0

function followPointer(dt: number) {
  const ease = 1 - Math.exp((-3 * dt) / SETTLE_MS)
  const p = state.pointer
  if (p) {
    const k = hill.height < 0.005 ? 1 : ease
    hill.x += (p[0] - hill.x) * k
    hill.y += (p[1] - hill.y) * k
  }
  hill.height += ((p ? HILL_HEIGHT : 0) - hill.height) * ease
  if (hill.height < 0.001) hill.height = 0
}

const tick = (t: number) => {
  followPointer(Math.min(t - lastTick, 100))
  lastTick = t
  paint(t)
  frame = nextFrame(tick)
}

function resize(c: OffscreenCanvasRenderingContext2D) {
  c.canvas.width = state.w * state.dpr
  c.canvas.height = state.h * state.dpr
  c.setTransform(state.dpr, 0, 0, state.dpr, 0, 0)
}

function restart() {
  cancelFrame(frame)
  if (state.animate) frame = nextFrame(tick)
  else paint(lastTick)
}

function receive(fresh: boolean, update: Partial<TopographyState>) {
  const sized = fresh || update.w !== undefined
  const toggled = update.animate !== undefined && update.animate !== state.animate
  const pointerOnly = !fresh && Object.keys(update).every((k) => k === 'pointer')
  Object.assign(state, update)
  if (!state.animate) state.pointer = null
  return { sized, toggled, pointerOnly }
}

self.onmessage = ({ data }: MessageEvent<Message>) => {
  const { canvas, ...update } = data
  if (canvas) ctx = canvas.getContext('2d')
  const { sized, toggled, pointerOnly } = receive(canvas !== undefined, update)
  if (!ctx || pointerOnly) return
  if (sized) resize(ctx)
  if (toggled || canvas) restart()
  else if (sized || !state.animate) paint(lastTick)
}
