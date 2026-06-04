'use client'
import type { ReactNode } from 'react'

export interface SwitchProps {
  on: boolean
  onToggle: () => void
  'aria-label': string
  children?: ReactNode
  size?: 'default' | 'sm'
}

export function Switch({
  on,
  onToggle,
  'aria-label': ariaLabel,
  children,
  size = 'default',
}: SwitchProps) {
  const isSmall = size === 'sm'
  const pillClass = isSmall ? 'h-6 w-12' : 'h-7 w-14'
  const translateOn = isSmall ? 'translate-x-6' : 'translate-x-7'
  const gradientDir = on ? 'bg-gradient-to-l' : 'bg-gradient-to-r'

  return (
    <button
      role="switch"
      aria-checked={on}
      onClick={onToggle}
      aria-label={ariaLabel}
      className={`relative inline-flex ${pillClass} cursor-pointer rounded-full ${gradientDir} from-brand-from to-brand-to focus-visible:outline-brand-from p-[2px] transition-all hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 active:scale-95`}
    >
      <span className="flex h-full w-full rounded-full bg-[var(--button-inner-bg)]">
        <span
          className={`flex aspect-square h-full items-center justify-center rounded-full ${gradientDir} from-brand-from to-brand-to text-[9px] font-bold text-white shadow-sm transition-transform duration-200 ${on ? translateOn : 'translate-x-0'}`}
        >
          {children}
        </span>
      </span>
    </button>
  )
}
