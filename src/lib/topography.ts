const easeOut = (t: number) => 1 - (1 - Math.min(1, Math.max(0, t))) ** 3

export function introLook(progress: number) {
  const eased = easeOut(progress)
  return { alpha: eased, scale: 1 + 0.08 * (1 - eased), flat: 1 - eased }
}

export const CELL = 16
export const LEVELS = 24
const SCALE = 1 / 460

let seed = 1
const lattice = Float32Array.from({ length: 256 * 256 }, () => {
  seed = (seed * 16807) % 2147483647
  return seed / 2147483647
})

const hash = (x: number, y: number) => lattice[(x & 255) | ((y & 255) << 8)]

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

const DRIFT_X = [0.006, -0.004, 0.003]
const DRIFT_Y = [0.002, 0.007, -0.009]

export function elevation(x: number, y: number, t = 0): number {
  let sum = 0
  let amp = 0.5
  let freq = SCALE
  for (let o = 0; o < 3; o++) {
    sum += amp * valueNoise((x + DRIFT_X[o] * t) * freq, (y + DRIFT_Y[o] * t) * freq)
    amp /= 2
    freq *= 2
  }
  return sum / 0.875
}

const LEVEL_MIN = 0.15
const LEVEL_SPAN = 0.7

export const levelValue = (k: number) => LEVEL_MIN + (LEVEL_SPAN * (k + 0.5)) / LEVELS
const levelIndex = (value: number) => ((value - LEVEL_MIN) * LEVELS) / LEVEL_SPAN - 0.5

const crossAt = (v0: number, v1: number, t: number) =>
  v0 < t === v1 < t ? -1 : (t - v0) / (v1 - v0)

function edge(out: number[], f: number, x: number, y: number, dx: number, dy: number) {
  if (f >= 0) out.push(x + dx * f, y + dy * f)
}

function cellSegments(out: number[], v: number[], t: number, x: number, y: number) {
  edge(out, crossAt(v[0], v[1], t), x, y, CELL, 0)
  edge(out, crossAt(v[1], v[2], t), x + CELL, y, 0, CELL)
  edge(out, crossAt(v[3], v[2], t), x, y + CELL, CELL, 0)
  edge(out, crossAt(v[0], v[3], t), x, y, 0, CELL)
}

export interface Hill {
  x: number
  y: number
  height: number
}

export const HILL_RADIUS = 170

export function hillAt(hill: Hill | undefined, x: number, y: number): number {
  if (!hill || hill.height === 0) return 0
  const d2 = ((x - hill.x) ** 2 + (y - hill.y) ** 2) / HILL_RADIUS ** 2
  return d2 > 9 ? 0 : hill.height * Math.exp(-d2)
}

let grid = new Float32Array(0)

function sampleGrid(
  cols: number,
  rows: number,
  time: number,
  hill: Hill | undefined,
  flat: number
): Float32Array {
  if (grid.length !== cols * rows) grid = new Float32Array(cols * rows)
  for (let j = 0; j < rows; j++) {
    const y = j * CELL
    const level = flat > 0 ? LEVEL_MIN + (LEVEL_SPAN * y) / ((rows - 1) * CELL) : 0
    for (let i = 0; i < cols; i++) {
      const x = i * CELL
      const real = elevation(x, y, time) + hillAt(hill, x, y)
      grid[j * cols + i] = real + (level - real) * flat
    }
  }
  return grid
}

function crossingLevels(levels: number[][], v: number[], x: number, y: number) {
  const lo = Math.max(0, Math.floor(levelIndex(Math.min(v[0], v[1], v[2], v[3]))))
  const hi = Math.min(LEVELS - 1, Math.ceil(levelIndex(Math.max(v[0], v[1], v[2], v[3]))))
  for (let k = lo; k <= hi; k++) cellSegments(levels[k], v, levelValue(k), x, y)
}

export function contourSegments(w: number, h: number, time = 0, hill?: Hill, flat = 0): number[][] {
  const cols = Math.ceil(w / CELL) + 1
  const rows = Math.ceil(h / CELL) + 1
  const g = sampleGrid(cols, rows, time, hill, flat)
  const levels = Array.from({ length: LEVELS }, () => [] as number[])
  const v = [0, 0, 0, 0]
  for (let j = 0; j < rows - 1; j++)
    for (let i = 0; i < cols - 1; i++) {
      const at = j * cols + i
      v[0] = g[at]
      v[1] = g[at + 1]
      v[2] = g[at + cols + 1]
      v[3] = g[at + cols]
      crossingLevels(levels, v, i * CELL, j * CELL)
    }
  return levels
}
