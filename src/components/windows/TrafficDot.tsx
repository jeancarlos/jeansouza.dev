'use client'

interface TrafficDotProps {
  label: string
  symbol: string
  color: string
  onClick: () => void
  disabled?: boolean
}

export function TrafficDot({ label, symbol, color, onClick, disabled = false }: TrafficDotProps) {
  return (
    <button
      data-traffic-dot
      aria-label={label}
      disabled={disabled}
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
      className={`group relative inline-flex h-3 w-3 items-center justify-center rounded-full ring-1 ring-black/25 transition-transform active:scale-95 ${
        disabled ? 'pointer-events-none opacity-50' : ''
      }`}
      style={{ backgroundColor: color }}
    >
      <span className="pointer-events-none font-mono text-[8px] leading-none text-white opacity-0 transition-opacity duration-150 select-none group-hover:opacity-100">
        {symbol}
      </span>
    </button>
  )
}
