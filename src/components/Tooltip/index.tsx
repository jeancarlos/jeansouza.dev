'use client'
import { useRef, useEffect, useState, Fragment, type ElementType } from 'react'
import styles from './Tooltip.module.css'

interface TooltipProps {
  children: React.ReactNode
  onMouseLeave?: () => void
  component?: ElementType
  show?: boolean
  className?: string
}

export function Tooltip({
  children,
  onMouseLeave,
  component: Component = 'div',
  show = false,
  className = '',
}: TooltipProps) {
  const btRef = useRef<HTMLElement>(null)
  const [buttonMargin, setButtonMargin] = useState(0)

  const transform = show
    ? `scale(1) translate(-${buttonMargin}px, 0)`
    : `scale(0) translate(-${buttonMargin}px, 40px)`

  useEffect(() => {
    if (btRef.current) {
      setButtonMargin(btRef.current.offsetWidth / 2)
    }
  }, [])

  return (
    <Fragment>
      <Component
        ref={btRef}
        onClick={onMouseLeave}
        onMouseLeave={onMouseLeave}
        className={`${styles.Tooltip} ${className}`}
        role="tooltip"
        style={{ transform }}
      >
        {children}
      </Component>
    </Fragment>
  )
}
