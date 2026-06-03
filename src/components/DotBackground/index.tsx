'use client'
import { useEffect, useRef } from 'react'
import {
  initStar,
  projectStar,
  advanceStar,
  resetStar,
  TOTAL_DOTS,
  SPEED,
  type Star,
} from './starfield'

export function DotBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let rafId: number
    let w = 0
    let h = 0
    let stars: Star[] = []

    const resize = () => {
      w = canvas.width = window.innerWidth
      h = canvas.height = window.innerHeight
      stars = Array.from({ length: TOTAL_DOTS }, () => initStar(w, h))
    }

    const getDotColor = (alpha: number) => {
      const rgb =
        getComputedStyle(document.documentElement).getPropertyValue('--dot-color').trim() ||
        '242, 184, 212'
      return `rgba(${rgb}, ${alpha})`
    }

    const draw = () => {
      ctx.clearRect(0, 0, w, h)

      const dotColor = getDotColor(0.55)

      for (const star of stars) {
        advanceStar(star, SPEED)
        const { sx, sy, size } = projectStar(star, w, h)

        if (star.z <= 1 || sx < -50 || sx > w + 50 || sy < -50 || sy > h + 50) {
          resetStar(star, w, h)
          continue
        }

        ctx.fillStyle = dotColor
        ctx.beginPath()
        ctx.arc(sx, sy, Math.max(0.5, size), 0, Math.PI * 2)
        ctx.fill()
      }

      rafId = requestAnimationFrame(draw)
    }

    resize()
    window.addEventListener('resize', resize)
    rafId = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10"
    />
  )
}
