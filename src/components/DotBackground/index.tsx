'use client'
import { useEffect, useRef } from 'react'
import { bowOffset } from './dots'

export type DotMode = 'bow' | 'grid' | 'lines'

interface DotBackgroundProps {
  mode?: DotMode
  color?: string
}

const SPACING = 25
const PARALLAX = 0.3

export function DotBackground({ mode = 'bow', color = '#a6e3a1' }: DotBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const modeRef = useRef(mode)
  const colorRef = useRef(color)

  // keep refs in sync without restarting the animation loop
  useEffect(() => {
    modeRef.current = mode
    colorRef.current = color
  }, [mode, color])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let scrollY = window.scrollY
    let rafId: number

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const draw = () => {
      const w = canvas.width
      const h = canvas.height
      const m = modeRef.current
      const c = colorRef.current

      ctx.clearRect(0, 0, w, h)
      ctx.fillStyle = c
      ctx.strokeStyle = c

      const offsetY = -(scrollY * PARALLAX) % SPACING

      for (let gx = 0; gx < w + SPACING; gx += SPACING) {
        for (let gy = offsetY - SPACING; gy < h + SPACING; gy += SPACING) {
          const nx = gx / w
          const ny = gy / h

          if (m === 'bow') {
            // Invert: push dots outward from center toward corners
            const { x, y } = bowOffset(nx, ny, 1.5, SPACING * 0.9)
            const px = gx + x
            const py = gy + y
            ctx.globalAlpha = 0.55
            ctx.beginPath()
            ctx.arc(px, py, 0.75, 0, Math.PI * 2)
            ctx.fill()
          } else if (m === 'grid') {
            ctx.globalAlpha = 0.4
            ctx.beginPath()
            ctx.arc(gx, gy, 0.75, 0, Math.PI * 2)
            ctx.fill()
          } else if (m === 'lines') {
            ctx.globalAlpha = 0.12
            ctx.lineWidth = 0.75
            ctx.beginPath()
            ctx.moveTo(gx - SPACING * 0.4, gy)
            ctx.lineTo(gx + SPACING * 0.4, gy)
            ctx.stroke()
          }

          ctx.globalAlpha = 1
        }
      }

      rafId = requestAnimationFrame(draw)
    }

    const onScroll = () => {
      scrollY = window.scrollY
    }

    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('scroll', onScroll, { passive: true })
    rafId = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', resize)
      window.removeEventListener('scroll', onScroll)
    }
  }, []) // intentionally empty — mode/color read via refs

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10"
    />
  )
}
