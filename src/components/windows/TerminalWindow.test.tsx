import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TerminalWindow } from './TerminalWindow'

vi.mock('framer-motion', () => ({
  motion: {
    div: ({
      children,
      style,
      className,
    }: React.HTMLAttributes<HTMLDivElement> & { style?: React.CSSProperties }) => (
      <div style={style} className={className}>
        {children}
      </div>
    ),
  },
  useDragControls: () => ({ start: vi.fn() }),
  useMotionValue: () => ({ jump: vi.fn() }),
}))

vi.mock('./WindowManager', () => ({
  useWindowManager: () => ({
    closeWindow: vi.fn(),
    focusWindow: vi.fn(),
    expandWindow: vi.fn(),
    minimizeWindow: vi.fn(),
    moveWindow: vi.fn(),
    resizeWindow: vi.fn(),
  }),
}))

const baseProps = {
  id: 'win-1',
  title: '~/test',
  position: { x: 100, y: 100 },
  size: { width: 500, height: 400 },
  isExpanded: false,
  isMinimized: false,
  zIndex: 20,
}

describe('TerminalWindow', () => {
  it('renders title', () => {
    render(
      <TerminalWindow {...baseProps}>
        <p>content</p>
      </TerminalWindow>
    )
    expect(screen.getAllByText('~/test').length).toBeGreaterThan(0)
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

  it('enables every dot on a regular window', () => {
    const { container } = render(
      <TerminalWindow {...baseProps}>
        <p>x</p>
      </TerminalWindow>
    )
    for (const dot of container.querySelectorAll('[data-traffic-dot]')) {
      expect(dot).not.toHaveAttribute('disabled')
    }
  })

  it('disables every dot on the home window, which is the desktop itself', () => {
    const { container } = render(
      <TerminalWindow {...baseProps} id="home">
        <p>x</p>
      </TerminalWindow>
    )
    for (const dot of container.querySelectorAll('[data-traffic-dot]')) {
      expect(dot).toHaveAttribute('disabled')
    }
  })
})
