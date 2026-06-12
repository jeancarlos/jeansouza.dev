'use client'
import type { ReactNode } from 'react'
import { TrafficDot } from '@/components/windows/TrafficDot'
import {
  getOuterClassName,
  getInnerRounded,
  getBodyClassName,
} from '@/components/windows/terminalStyles'

interface Props {
  title: string
  children: ReactNode
  maxWidth?: string
  onClose?: () => void
}

// Mirrors the class hierarchy of WindowChrome + WindowBody so border-radius
// and bg rendering match the real terminal windows exactly.
const outerBase = getOuterClassName(false, true)
const innerRounded = getInnerRounded(false, false)
const bodyClass = getBodyClassName(false, false, innerRounded)

export function TerminalCard({ title, children, maxWidth = 'max-w-md', onClose }: Props) {
  return (
    <div className={`w-full ${maxWidth} ${outerBase}`}>
      {/* mirrors WindowChrome inner div */}
      <div className={`flex min-h-0 w-full flex-col overflow-hidden ${innerRounded}`}>
        {/* mirrors WindowHeader desktop */}
        <div className="from-brand-from to-brand-to flex shrink-0 items-center gap-2 bg-gradient-to-r px-3 py-2.5 select-none">
          <TrafficDot
            label="Fechar"
            symbol="×"
            color="var(--color-traffic-close)"
            onClick={onClose}
            disabled={!onClose}
          />
          <TrafficDot label="" symbol="−" color="var(--color-traffic-minimize)" disabled />
          <TrafficDot label="" symbol="+" color="var(--color-traffic-expand)" disabled />
          <span className="ml-2 text-xs text-white/80">{title}</span>
        </div>
        {/* mirrors WindowBody */}
        <div className={`${bodyClass} p-6`}>{children}</div>
      </div>
    </div>
  )
}
