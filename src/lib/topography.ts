export const CELL = 14
export const LEVELS = 14
const SCALE = 1 / 460

function hash(x: number, y: number): number {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453
  return s - Math.floor(s)
}

const smooth = (t: number) => t * t * (3 - 2 * t)

function valueNoise(x: number, y: number): number {
  const xi = Math.floor(x)
  const yi = Math.floor(y)
  const u = smooth(x - xi)
  const v = smooth(y - yi)
  const a = hash(xi, yi)
  const b = hash(xi + 1, yi)
  const c = hash(xi, yi + 1)
  const d = hash(xi + 1, yi + 1)
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v
}

export function elevation(x: number, y: number): number {
  let sum = 0
  let amp = 0.5
  let freq = SCALE
  for (let i = 0; i < 3; i++) {
    sum += amp * valueNoise(x * freq, y * freq)
    amp /= 2
    freq *= 2
  }
  return sum / 0.875
}

export const levelValue = (k: number) => 0.15 + (0.7 * (k + 0.5)) / LEVELS

function cross(out: number[], v0: number, v1: number, t: number, p0: number[], p1: number[]) {
  if (v0 < t === v1 < t) return
  const f = (t - v0) / (v1 - v0)
  out.push(p0[0] + (p1[0] - p0[0]) * f, p0[1] + (p1[1] - p0[1]) * f)
}

function cellSegments(out: number[], v: number[], t: number, x: number, y: number) {
  const tl = [x, y]
  const tr = [x + CELL, y]
  const br = [x + CELL, y + CELL]
  const bl = [x, y + CELL]
  cross(out, v[0], v[1], t, tl, tr)
  cross(out, v[1], v[2], t, tr, br)
  cross(out, v[3], v[2], t, bl, br)
  cross(out, v[0], v[3], t, tl, bl)
}

function sampleGrid(cols: number, rows: number): Float32Array {
  const grid = new Float32Array(cols * rows)
  for (let j = 0; j < rows; j++)
    for (let i = 0; i < cols; i++) grid[j * cols + i] = elevation(i * CELL, j * CELL)
  return grid
}

export function contourSegments(w: number, h: number): number[][] {
  const cols = Math.ceil(w / CELL) + 1
  const rows = Math.ceil(h / CELL) + 1
  const grid = sampleGrid(cols, rows)
  const levels = Array.from({ length: LEVELS }, () => [] as number[])
  for (let j = 0; j < rows - 1; j++)
    for (let i = 0; i < cols - 1; i++) {
      const at = j * cols + i
      const v = [grid[at], grid[at + 1], grid[at + cols + 1], grid[at + cols]]
      levels.forEach((out, k) => cellSegments(out, v, levelValue(k), i * CELL, j * CELL))
    }
  return levels
}

const key = (x: number, y: number) => `${x},${y}`

function linkEnds(segs: number[]): Map<string, number[]> {
  const ends = new Map<string, number[]>()
  for (let s = 0; s < segs.length / 4; s++)
    for (const e of [0, 2]) {
      const k = key(segs[s * 4 + e], segs[s * 4 + e + 1])
      ends.set(k, [...(ends.get(k) ?? []), s])
    }
  return ends
}

export function chainSegments(segs: number[]): number[][] {
  const ends = linkEnds(segs)
  const used = new Uint8Array(segs.length / 4)
  const walk = (line: number[], x: number, y: number) => {
    for (;;) {
      const next = (ends.get(key(x, y)) ?? []).find((s) => !used[s])
      if (next === undefined) return
      used[next] = 1
      const o = segs[next * 4] === x && segs[next * 4 + 1] === y ? 2 : 0
      x = segs[next * 4 + o]
      y = segs[next * 4 + o + 1]
      line.push(x, y)
    }
  }
  const lines: number[][] = []
  for (let s = 0; s < used.length; s++) {
    if (used[s]) continue
    used[s] = 1
    const tail = [segs[s * 4 + 2], segs[s * 4 + 3]]
    walk(tail, tail[0], tail[1])
    const head = [segs[s * 4], segs[s * 4 + 1]]
    walk(head, head[0], head[1])
    const back: number[] = []
    for (let i = head.length - 2; i >= 0; i -= 2) back.push(head[i], head[i + 1])
    lines.push([...back, ...tail])
  }
  return lines
}
