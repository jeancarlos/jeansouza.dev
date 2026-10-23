import { useLayoutEffect, useRef, useState, type ElementType, type ReactNode } from 'react'
import styles from './Tooltip.module.css'

interface TooltipProps {
  children: ReactNode
  onDismiss?: () => void
  component?: ElementType
  show?: boolean
  className?: string
  align?: 'center' | 'end'
}

export function Tooltip({
  children,
  onDismiss,
  component: Component = 'div',
  show = false,
  className = '',
  align = 'center',
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

  const shiftX = align === 'end' ? 0 : -buttonMargin
  const transform = show
    ? `translate(${shiftX}px, 0) scale(1)`
    : `translate(${shiftX}px, 8px) scale(0)`
  const alignClass = align === 'end' ? styles.End : ''

  return (
    <Component
      ref={ref}
      onClick={onDismiss}
      onMouseLeave={onDismiss}
      className={`${styles.Tooltip} ${alignClass} ${className}`}
      role="tooltip"
      style={{ transform }}
    >
      {children}
    </Component>
  )
}
