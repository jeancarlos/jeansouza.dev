export function bowOffset(
  nx: number,
  ny: number,
  strength: number,
  radius: number
): { x: number; y: number } {
  const dx = nx - 0.5
  const dy = ny - 0.5
  const dist = Math.sqrt(dx * dx + dy * dy)
  // normalize by max possible distance (corner = 0.7071)
  const normalized = dist / 0.7071
  const factor = Math.pow(normalized, strength) * radius
  if (dist === 0) return { x: 0, y: 0 }
  return {
    x: (dx / dist) * dist * factor,
    y: (dy / dist) * dist * factor,
  }
}

export function gridSnap(value: number, spacing: number): number {
  return Math.round(value / spacing) * spacing
}
