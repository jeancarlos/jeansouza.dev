import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TerminalWindow } from './TerminalWindow'

vi.mock('framer-motion', () => ({
  motion: {
    div: ({
      children,
      style,
      className,
      onClick,
      ...rest
    }: React.HTMLAttributes<HTMLDivElement> & { style?: React.CSSProperties }) => (
      <div style={style} className={className} onClick={onClick}>
        {children}
      </div>
    ),
  },
}))

vi.mock('./WindowManager', () => ({
  useWindowManager: () => ({
    closeWindow: vi.fn(),
    focusWindow: vi.fn(),
    expandWindow: vi.fn(),
    minimizeWindow: vi.fn(),
  }),
}))

const baseProps = {
  id: 'win-1',
  url: '/test',
  title: '~/test',
  position: { x: 100, y: 100 },
  size: { width: 500, height: 400 },
  isExpanded: false,
  isMinimized: false,
  zIndex: 20,
  closeable: true,
}

describe('TerminalWindow', () => {
  it('renders title', () => {
    render(
      <TerminalWindow {...baseProps}>
        <p>content</p>
      </TerminalWindow>
    )
    expect(screen.getByText('~/test')).toBeInTheDocument()
  })

  it('renders content when not minimized', () => {
    render(
      <TerminalWindow {...baseProps}>
        <p>hello content</p>
      </TerminalWindow>
    )
    expect(screen.getByText('hello content')).toBeInTheDocument()
  })

  it('hides content when minimized', () => {
    render(
      <TerminalWindow {...baseProps} isMinimized={true}>
        <p>hidden</p>
      </TerminalWindow>
    )
    expect(screen.queryByText('hidden')).not.toBeInTheDocument()
  })

  it('renders 3 traffic light dots', () => {
    const { container } = render(
      <TerminalWindow {...baseProps}>
        <p>x</p>
      </TerminalWindow>
    )
    const dots = container.querySelectorAll('[data-traffic-dot]')
    expect(dots.length).toBe(3)
  })
})
