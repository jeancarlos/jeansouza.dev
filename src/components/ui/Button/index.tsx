'use client'

export interface ButtonProps {
  children: React.ReactNode
  href?: string
  onClick?: (e: React.MouseEvent) => void
  className?: string
  disabled?: boolean
  'aria-label'?: string
  gradientDir?: 'r' | 'l'
  size?: 'default' | 'sm'
}

export function Button({
  children,
  href,
  onClick,
  className = '',
  disabled,
  'aria-label': ariaLabel,
  gradientDir = 'r',
  size = 'default',
}: ButtonProps) {
  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1.5 text-sm'
  const disabledClass = disabled ? 'opacity-40 pointer-events-none' : ' cursor-pointer'

  const inner = (
    <span
      className={`bg-[var(--button-inner-bg)] block rounded-full ${sizeClass} text-[var(--button-text)] transition-colors duration-150 group-hover:bg-transparent group-hover:text-[var(--button-hover-text)]`}
    >
      {children}
    </span>
  )

  const gradientClass = gradientDir === 'l' ? 'bg-gradient-to-l' : 'bg-gradient-to-r'
  const wrapperClass = `group relative inline-block rounded-full ${disabledClass} ${gradientClass} from-brand-from to-brand-to p-[2px] shadow-sm transition-all duration-150 ease-out hover:brightness-110 hover:shadow-md active:scale-90 ${className}`

  if (href) {
    return (
      <a
        href={href}
        className={wrapperClass}
        aria-label={ariaLabel}
        rel="noopener noreferrer"
        target="_blank"
      >
        {inner}
      </a>
    )
  }

  return (
    <button onClick={onClick} className={wrapperClass} disabled={disabled} aria-label={ariaLabel}>
      {inner}
    </button>
  )
}
