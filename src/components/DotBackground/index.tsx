'use client'
import { useEffect, useRef } from 'react'

const DOT_SPACING = 25
const DOT_RADIUS = 0.75
const DOT_COLOR = '#75688c'
const TWIST_RADIUS = 140
const MAX_TWIST = Math.PI * 0.5
const PARALLAX = 0.3
const LERP = 0.1

export function DotBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let targetX = -9999
    let targetY = -9999
    let mx = -9999
    let my = -9999
    let scrollY = window.scrollY
    let rafId: number

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const draw = () => {
      // Lerp mouse for smooth trailing
      mx += (targetX - mx) * LERP
      my += (targetY - my) * LERP

      const w = canvas.width
      const h = canvas.height

      ctx.clearRect(0, 0, w, h)
      ctx.fillStyle = DOT_COLOR

      // Parallax: shift grid up as user scrolls down
      const gridOffsetY = -(scrollY * PARALLAX) % DOT_SPACING

      for (let gx = 0; gx < w + DOT_SPACING; gx += DOT_SPACING) {
        for (let gy = gridOffsetY - DOT_SPACING; gy < h + DOT_SPACING; gy += DOT_SPACING) {
          const dx = gx - mx
          const dy = gy - my
          const dist = Math.sqrt(dx * dx + dy * dy)

          let px = gx
          let py = gy

          if (dist < TWIST_RADIUS && dist > 0) {
            // Quadratic falloff: stronger near cursor, gentle at edge
            const t = 1 - dist / TWIST_RADIUS
            const angle = t * t * MAX_TWIST
            const cos = Math.cos(angle)
            const sin = Math.sin(angle)
            px = mx + dx * cos - dy * sin
            py = my + dx * sin + dy * cos
          }

          ctx.beginPath()
          ctx.arc(px, py, DOT_RADIUS, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      rafId = requestAnimationFrame(draw)
    }

    const onMouseMove = (e: MouseEvent) => {
      targetX = e.clientX
      targetY = e.clientY
    }

    const onMouseLeave = () => {
      targetX = -9999
      targetY = -9999
    }

    const onScroll = () => {
      scrollY = window.scrollY
    }

    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('scroll', onScroll, { passive: true })
    document.addEventListener('mouseleave', onMouseLeave)

    rafId = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('scroll', onScroll)
      document.removeEventListener('mouseleave', onMouseLeave)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 -z-10 pointer-events-none"
    />
  )
}
