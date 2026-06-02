import type { ReactNode } from 'react'

interface TerminalProps {
  children: ReactNode
  className?: string
}

export function Terminal({ children, className = '' }: TerminalProps) {
  return (
    <div className={`bg-surface border-overlay rounded-lg border font-mono ${className}`}>
      <div className="border-overlay flex gap-2 border-b px-4 py-3">
        <span className="terminal-dot h-3 w-3 rounded-full bg-[#f38ba8]" aria-hidden="true" />
        <span className="terminal-dot h-3 w-3 rounded-full bg-[#f9e2af]" aria-hidden="true" />
        <span className="terminal-dot h-3 w-3 rounded-full bg-[#a6e3a1]" aria-hidden="true" />
      </div>
      <div className="p-6">{children}</div>
    </div>
  )
}
