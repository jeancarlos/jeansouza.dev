export const FOCAL_LENGTH = 300
export const MAX_DEPTH = 800
const MIN_DEPTH = 20
const BASE_RADIUS = 1.5
export const SPEED = 0.8
export const TOTAL_DOTS = 180

export interface Star {
  x: number
  y: number
  z: number
}

export interface Projected {
  sx: number
  sy: number
  size: number
}

export function initStar(w: number, h: number): Star {
  return {
    x: (Math.random() - 0.5) * w * 1.5,
    y: (Math.random() - 0.5) * h * 1.5,
    z: Math.random() * (MAX_DEPTH - MIN_DEPTH) + MIN_DEPTH,
  }
}

export function projectStar(star: Star, w: number, h: number): Projected {
  const vanishX = w / 2 + 80
  const vanishY = h / 2 - 40
  return {
    sx: (star.x / star.z) * FOCAL_LENGTH + vanishX,
    sy: (star.y / star.z) * FOCAL_LENGTH + vanishY,
    size: (BASE_RADIUS / star.z) * FOCAL_LENGTH,
  }
}

export function advanceStar(star: Star, speed: number): void {
  star.z -= speed
}

export function resetStar(star: Star, w: number, h: number): void {
  star.x = (Math.random() - 0.5) * w * 1.5
  star.y = (Math.random() - 0.5) * h * 1.5
  star.z = MAX_DEPTH
}
