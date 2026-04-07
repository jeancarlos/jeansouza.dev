'use client'
import { useState } from 'react'
import styles from './Button.module.css'

export interface ButtonProps {
  children: React.ReactNode
  href?: string
  onClick?: () => void
  className?: string
}

function hoverClass(hover: boolean | undefined): string {
  if (hover === undefined) return ''
  return hover ? styles.hoverIn : styles.hoverOut
}

export function Button({ children, href, onClick, className = '' }: ButtonProps) {
  const url = href || '#'
  const [hoverState, setHoverState] = useState<boolean | undefined>()
  const rel = href ? 'noopener noreferrer' : ''

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onClick) {
      onClick()
      e.preventDefault()
    }
  }

  return (
    <a
      className={`${styles.Button} ${hoverClass(hoverState)} ${className}`}
      rel={rel}
      href={url}
      onClick={handleClick}
      onFocus={() => setHoverState(true)}
      onBlur={() => setHoverState(false)}
      onMouseEnter={() => setHoverState(true)}
      onMouseLeave={() => setHoverState(false)}
    >
      {children}
    </a>
  )
}
