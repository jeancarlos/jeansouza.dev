'use client'

export interface ButtonProps {
  children: React.ReactNode
  href?: string
  onClick?: (e: React.MouseEvent) => void
  className?: string
  disabled?: boolean
  'aria-label'?: string
  gradientDir?: 'r' | 'l'
}

export function Button({
  children,
  href,
  onClick,
  className = '',
  disabled,
  'aria-label': ariaLabel,
  gradientDir = 'r',
}: ButtonProps) {
  const inner = (
    <span className="block rounded-full bg-[#3e3353] px-3 py-1.5 text-sm text-[#f2b8d4] transition-colors duration-150 group-hover:bg-transparent group-hover:text-white">
      {children}
    </span>
  )

  const gradientClass = gradientDir === 'l' ? 'bg-gradient-to-l' : 'bg-gradient-to-r'
  const wrapperClass = `group relative inline-block rounded-full ${gradientClass} from-[#e84545] to-[#b33a73] p-[2px] shadow-sm transition-all duration-150 ease-out hover:brightness-110 hover:shadow-md active:scale-90 ${disabled ? 'opacity-40 pointer-events-none' : ''} ${className}`

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
