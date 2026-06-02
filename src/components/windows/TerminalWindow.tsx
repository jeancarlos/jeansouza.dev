'use client'
import { type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { useWindowManager } from './WindowManager'

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
}

function TrafficDot({
  label,
  onClick,
  disabled,
}: {
  label: string
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
      <span className="block h-3 w-3 rounded-full bg-[#3e3353] transition-colors duration-150 group-hover:bg-transparent" />
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
      animate={activeStyle}
      style={{ ...activeStyle, zIndex, position: 'fixed' as const }}
      onClick={() => {
        focusWindow(id)
        history.pushState(null, '', url)
      }}
      className="flex flex-col overflow-hidden rounded-lg border border-[#b33a73]/40 shadow-2xl"
      role="dialog"
      aria-label={title}
    >
      {/* Header */}
      <div className="flex shrink-0 cursor-grab items-center gap-2 bg-gradient-to-r from-[#e84545] to-[#b33a73] px-3 py-2 select-none active:cursor-grabbing">
        <TrafficDot label="Close" onClick={() => closeWindow(id)} disabled={!closeable} />
        <TrafficDot label="Minimize" onClick={() => minimizeWindow(id)} />
        <TrafficDot label="Expand" onClick={() => expandWindow(id)} />
        <span className="ml-2 font-mono text-xs text-white/80">{title}</span>
      </div>

      {/* Body */}
      {!isMinimized && (
        <div className="flex-1 overflow-y-auto bg-[#3e3353] font-mono text-[#f2b8d4]">
          {children}
        </div>
      )}
    </motion.div>
  )
}
