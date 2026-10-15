interface TrafficDotProps {
  label: string
  symbol: string
  color: string
  onClick?: () => void
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
        onClick?.()
      }}
      className={`group inline-flex h-6 w-6 items-center justify-center ${
        disabled ? 'pointer-events-none opacity-40' : 'cursor-pointer'
      }`}
    >
      <span
        aria-hidden="true"
        className="inline-flex h-3.5 w-3.5 items-center justify-center rounded-full text-[10px] leading-none font-bold text-white/60 ring-1 ring-white/40 transition-all duration-150 select-none group-hover:scale-110 group-hover:text-white group-active:scale-95"
        style={{ backgroundColor: color }}
      >
        {symbol}
      </span>
    </button>
  )
}
