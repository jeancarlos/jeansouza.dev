'use client'
import type { ReactNode } from 'react'
import { Button } from '@/components/ui/Button'

export interface SwitchProps {
  on: boolean
  onToggle: () => void
  'aria-label': string
  children: ReactNode
  size?: 'default' | 'sm'
}

export function Switch({ on, onToggle, 'aria-label': ariaLabel, children, size }: SwitchProps) {
  return (
    <Button gradientDir={on ? 'l' : 'r'} onClick={onToggle} aria-label={ariaLabel} size={size}>
      {children}
    </Button>
  )
}
