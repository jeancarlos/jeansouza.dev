// src/components/windows/TerminalWindow.test.tsx
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
}))

vi.mock('next-intl', () => ({
  useTranslations: (namespace: string) => {
    const messages: Record<string, Record<string, string>> = {
      window: {
        back: '< back',
        backAria: 'Go back',
        close: 'Close',
        minimize: 'Minimize',
        expand: 'Expand',
      },
    }
    const ns = messages[namespace] ?? {}
    return (key: string) => ns[key]
  },
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

  it('minimize dot is disabled when minimizable=false', () => {
    const { container } = render(
      <TerminalWindow {...baseProps} minimizable={false}>
        <p>x</p>
      </TerminalWindow>
    )
    const dots = container.querySelectorAll('[data-traffic-dot]')
    // dots: [close, minimize, expand] — minimize is index 1
    expect(dots[1]).toHaveAttribute('disabled')
  })

  it('expand dot is disabled when expandable=false', () => {
    const { container } = render(
      <TerminalWindow {...baseProps} expandable={false}>
        <p>x</p>
      </TerminalWindow>
    )
    const dots = container.querySelectorAll('[data-traffic-dot]')
    // dots: [close, minimize, expand] — expand is index 2
    expect(dots[2]).toHaveAttribute('disabled')
  })
})
