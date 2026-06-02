'use client'
import { useEffect, useRef, useState } from 'react'

export function BlueprintGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const hoveredRef = useRef(false)
  const alphaRef = useRef(0)
  const rafRef = useRef<number>(0)
  const runningRef = useRef(false)
  const drawRef = useRef<() => void>(() => {})

  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    hoveredRef.current = hovered
  }, [hovered])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      // use the parent element's size, not viewport
      const parent = canvas.parentElement
      if (!parent) return
      canvas.width = parent.offsetWidth
      canvas.height = parent.offsetHeight
    }

    const draw = () => {
      const target = hoveredRef.current ? 0.08 : 0
      // lerp toward target
      alphaRef.current += (target - alphaRef.current) * 0.06

      const alpha = alphaRef.current

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // if settled at 0 and not hovered, stop the loop
      if (alphaRef.current < 0.001 && !hoveredRef.current) {
        runningRef.current = false
        return // don't reschedule
      }

      if (alpha > 0.001) {
        ctx.strokeStyle = `rgba(30, 102, 245, ${alpha})`
        ctx.lineWidth = 0.5

        const spacing = 25
        for (let x = 0; x <= canvas.width; x += spacing) {
          ctx.beginPath()
          ctx.moveTo(x, 0)
          ctx.lineTo(x, canvas.height)
          ctx.stroke()
        }
        for (let y = 0; y <= canvas.height; y += spacing) {
          ctx.beginPath()
          ctx.moveTo(0, y)
          ctx.lineTo(canvas.width, y)
          ctx.stroke()
        }
      }

      runningRef.current = true
      rafRef.current = requestAnimationFrame(draw)
    }

    drawRef.current = draw

    const resizeObserver = new ResizeObserver(resize)
    if (canvas.parentElement) resizeObserver.observe(canvas.parentElement)

    resize()
    runningRef.current = true
    rafRef.current = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(rafRef.current)
      resizeObserver.disconnect()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      onMouseEnter={() => {
        setHovered(true)
        if (!runningRef.current && canvasRef.current) {
          runningRef.current = true
          rafRef.current = requestAnimationFrame(drawRef.current)
        }
      }}
      onMouseLeave={() => setHovered(false)}
      className="pointer-events-auto absolute inset-0 h-full w-full"
      style={{ zIndex: 0 }}
    />
  )
}
