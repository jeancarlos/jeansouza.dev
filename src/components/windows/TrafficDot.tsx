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
      className={`group relative inline-flex h-3.5 w-3.5 items-center justify-center rounded-full ring-1 ring-white/40 transition-all duration-150 hover:scale-110 active:scale-95 ${
        disabled ? 'pointer-events-none opacity-40' : 'cursor-pointer'
      }`}
      style={{ backgroundColor: color }}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none text-[10px] leading-none font-bold text-white opacity-60 transition-opacity duration-150 select-none group-hover:opacity-100"
      >
        {symbol}
      </span>
    </button>
  )
}
