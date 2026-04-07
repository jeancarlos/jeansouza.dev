'use client'
import { useEffect, useRef } from 'react'

const DOT_SPACING = 25
const DOT_RADIUS = 0.75
const DOT_COLOR = '#75688c'
const PARALLAX = 0.3

export function DotBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

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

      ctx.clearRect(0, 0, w, h)
      ctx.fillStyle = DOT_COLOR

      const gridOffsetY = -(scrollY * PARALLAX) % DOT_SPACING

      for (let gx = 0; gx < w + DOT_SPACING; gx += DOT_SPACING) {
        for (let gy = gridOffsetY - DOT_SPACING; gy < h + DOT_SPACING; gy += DOT_SPACING) {
          ctx.beginPath()
          ctx.arc(gx, gy, DOT_RADIUS, 0, Math.PI * 2)
          ctx.fill()
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
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 -z-10 pointer-events-none"
    />
  )
}
