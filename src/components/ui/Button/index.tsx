'use client'

export interface ButtonProps {
  children: React.ReactNode
  href?: string
  onClick?: (e: React.MouseEvent) => void
  className?: string
  disabled?: boolean
  'aria-label'?: string
}

export function Button({
  children,
  href,
  onClick,
  className = '',
  disabled,
  'aria-label': ariaLabel,
}: ButtonProps) {
  const inner = (
    <span className="block rounded-full bg-[#3e3353] px-3 py-1.5 text-sm text-[#f2b8d4] transition-colors duration-150 group-hover:bg-transparent group-hover:text-white">
      {children}
    </span>
  )

  const wrapperClass = `group relative inline-block rounded-full bg-gradient-to-r from-[#e84545] to-[#b33a73] p-px shadow-sm transition-transform active:scale-95 ${disabled ? 'opacity-40 pointer-events-none' : ''} ${className}`

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
