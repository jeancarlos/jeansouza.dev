'use client'
import { useLayoutEffect, useRef, useState, type ElementType, type ReactNode } from 'react'
import styles from './Tooltip.module.css'

interface TooltipProps {
  children: ReactNode
  onDismiss?: () => void
  component?: ElementType
  show?: boolean
  className?: string
}

export function Tooltip({
  children,
  onDismiss,
  component: Component = 'div',
  show = false,
  className = '',
}: TooltipProps) {
  const ref = useRef<HTMLElement>(null)
  const [buttonMargin, setButtonMargin] = useState(0)

  useLayoutEffect(() => {
    if (!ref.current) return
    const el = ref.current
    setButtonMargin(el.offsetWidth / 2)
    const observer = new ResizeObserver(() => {
      setButtonMargin(el.offsetWidth / 2)
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const transform = show
    ? `translate(-${buttonMargin}px, 0) scale(1)`
    : `translate(-${buttonMargin}px, 8px) scale(0)`

  return (
    <Component
      ref={ref}
      onClick={onDismiss}
      onMouseLeave={onDismiss}
      className={`${styles.Tooltip} ${className}`}
      role="tooltip"
      style={{ transform }}
    >
      {children}
    </Component>
  )
}
