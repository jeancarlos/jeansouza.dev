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

function readDotColor(): string {
  if (typeof window === 'undefined') return '242, 184, 212'
  const rgb = getComputedStyle(document.documentElement).getPropertyValue('--dot-color').trim()
  return rgb || '242, 184, 212'
}

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
    let dotColor = readDotColor()

    const resize = () => {
      w = canvas.width = window.innerWidth
      h = canvas.height = window.innerHeight
      stars = Array.from({ length: TOTAL_DOTS }, () => initStar(w, h))
    }

    const refreshColor = () => {
      dotColor = readDotColor()
    }

    const draw = () => {
      ctx.clearRect(0, 0, w, h)

      for (const star of stars) {
        advanceStar(star, SPEED)
        const { sx, sy, size } = projectStar(star, w, h)

        if (star.z <= 1 || sx < -50 || sx > w + 50 || sy < -50 || sy > h + 50) {
          resetStar(star, w, h)
          continue
        }

        ctx.fillStyle = `rgba(${dotColor}, 0.55)`
        ctx.beginPath()
        ctx.arc(sx, sy, Math.max(0.5, size), 0, Math.PI * 2)
        ctx.fill()
      }

      rafId = requestAnimationFrame(draw)
    }

    resize()
    refreshColor()
    window.addEventListener('resize', resize)

    const themeObserver = new MutationObserver(refreshColor)
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    })

    rafId = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', resize)
      themeObserver.disconnect()
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
