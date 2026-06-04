import type { ReactNode } from 'react'

interface TerminalProps {
  children: ReactNode
  className?: string
}

export function Terminal({ children, className = '' }: TerminalProps) {
  return (
    <div className={`bg-surface border-overlay rounded-lg border font-mono ${className}`}>
      <div className="border-overlay flex gap-2 border-b px-4 py-3">
        <span className="terminal-dot bg-pastel-red h-3 w-3 rounded-full" aria-hidden="true" />
        <span className="terminal-dot bg-pastel-yellow h-3 w-3 rounded-full" aria-hidden="true" />
        <span className="terminal-dot bg-pastel-green h-3 w-3 rounded-full" aria-hidden="true" />
      </div>
      <div className="p-6">{children}</div>
    </div>
  )
}
