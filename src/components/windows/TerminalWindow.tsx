'use client'
import { type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { useWindowManager, type ButtonOrigin } from './WindowManager'

interface Props {
  id: string
  url: string
  title: string
  children: ReactNode
  position: { x: number; y: number }
  size: { width: number | string; height: number | string }
  isExpanded: boolean
  isMinimized: boolean
  zIndex: number
  closeable?: boolean
  isFocused?: boolean
  origin?: ButtonOrigin
}

function TrafficDot({
  label,
  symbol,
  onClick,
  disabled,
}: {
  label: string
  symbol: string
  onClick: () => void
  disabled?: boolean
}) {
  return (
    <button
      data-traffic-dot
      aria-label={label}
      disabled={disabled}
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
      className={`group relative inline-block rounded-full bg-gradient-to-r from-[#e84545] to-[#b33a73] p-px transition-transform active:scale-95 ${disabled ? 'pointer-events-none opacity-30' : ''}`}
    >
      <span className="flex h-3 w-3 items-center justify-center rounded-full bg-[#3e3353] font-mono text-[8px] leading-none text-[#f2b8d4] transition-colors duration-150 group-hover:bg-transparent group-hover:text-white">
        {symbol}
      </span>
    </button>
  )
}

export function TerminalWindow({
  id,
  url,
  title,
  children,
  position,
  size,
  isExpanded,
  isMinimized,
  zIndex,
  closeable = true,
  isFocused = true,
  origin: _origin,
}: Props) {
  const { closeWindow, focusWindow, expandWindow, minimizeWindow } = useWindowManager()

  const expandedStyle = {
    width: 'calc(100vw - 80px)' as string | number,
    height: 'calc(100vh - 80px)' as string | number,
    x: 40,
    y: 40,
  }

  const normalStyle = {
    width: size.width,
    height: isMinimized ? 44 : size.height,
    x: position.x,
    y: position.y,
  }

  const activeStyle = isExpanded ? expandedStyle : normalStyle

  return (
    <motion.div
      drag
      dragMomentum={false}
      dragConstraints={{ top: 0 }}
      animate={{
        ...activeStyle,
        filter: isFocused ? 'blur(0px)' : 'blur(2px)',
        opacity: isFocused ? 1 : 0.6,
      }}
      transition={{
        filter: { type: 'tween', duration: 0.25, ease: 'easeOut' },
        opacity: { type: 'tween', duration: 0.25, ease: 'easeOut' },
      }}
      style={{ ...activeStyle, zIndex, position: 'fixed' as const }}
      onPointerDown={() => focusWindow(id)}
      onClick={() => history.pushState(null, '', url)}
      className="rounded-2xl bg-gradient-to-r from-[#e84545] to-[#b33a73] p-[2px] shadow-2xl"
      role="dialog"
      aria-label={title}
    >
      <div className="flex h-full w-full flex-col overflow-hidden rounded-[14px]">
        {/* Header */}
        <div className="flex shrink-0 cursor-grab items-center gap-2 bg-gradient-to-r from-[#e84545] to-[#b33a73] px-3 py-2 select-none active:cursor-grabbing">
          <TrafficDot
            label="Close"
            symbol="×"
            onClick={() => closeWindow(id)}
            disabled={!closeable}
          />
          <TrafficDot label="Minimize" symbol="−" onClick={() => minimizeWindow(id)} />
          <TrafficDot label="Expand" symbol="+" onClick={() => expandWindow(id)} />
          <span className="ml-2 font-mono text-xs text-white/80">{title}</span>
        </div>

        {/* Body */}
        {!isMinimized && (
          <div className="flex-1 overflow-y-auto rounded-[14px] bg-[#11111b] font-mono text-[#f2b8d4]">
            {children}
          </div>
        )}
      </div>
    </motion.div>
  )
}
