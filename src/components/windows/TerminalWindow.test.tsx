import { describe, it, expect, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { TerminalWindow } from './TerminalWindow'

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

describe('TerminalWindow focus', () => {
  it('moves focus into a window opened from a button and gives it back on close', () => {
    const opener = document.createElement('button')
    document.body.append(opener)
    opener.focus()
    const { unmount } = render(
      <TerminalWindow {...baseProps} origin={{ x: 0, y: 0, width: 80, height: 30 }}>
        <p>content</p>
      </TerminalWindow>
    )
    expect(screen.getByRole('region', { name: '~/test' })).toHaveFocus()
    unmount()
    expect(opener).toHaveFocus()
    opener.remove()
  })

  it('does not steal focus back when the reader already moved it elsewhere', () => {
    const opener = document.createElement('button')
    const elsewhere = document.createElement('button')
    document.body.append(opener, elsewhere)
    opener.focus()
    const { unmount } = render(
      <TerminalWindow {...baseProps} origin={{ x: 0, y: 0, width: 80, height: 30 }}>
        <p>content</p>
      </TerminalWindow>
    )
    elsewhere.focus()
    unmount()
    expect(elsewhere).toHaveFocus()
    opener.remove()
    elsewhere.remove()
  })

  it('leaves focus alone for a window the server rendered', () => {
    const opener = document.createElement('button')
    document.body.append(opener)
    opener.focus()
    render(
      <TerminalWindow {...baseProps}>
        <p>content</p>
      </TerminalWindow>
    )
    expect(opener).toHaveFocus()
    opener.remove()
  })
})

describe('TerminalWindow resizing', () => {
  const handles = (container: HTMLElement) => container.querySelectorAll('[data-resize-handle]')

  it('offers eight resize handles on a regular window', () => {
    const { container } = render(
      <TerminalWindow {...baseProps}>
        <p>x</p>
      </TerminalWindow>
    )
    expect(handles(container)).toHaveLength(8)
  })

  it.each([
    ['the home window', { id: 'home' }],
    ['an expanded window', { isExpanded: true }],
    ['a minimized window', { isMinimized: true }],
  ])('offers no resize handles on %s', (_name, extra) => {
    const { container } = render(
      <TerminalWindow {...baseProps} {...extra}>
        <p>x</p>
      </TerminalWindow>
    )
    expect(handles(container)).toHaveLength(0)
  })

  it('stops animating the frame while a handle is held and animates again on release', () => {
    HTMLElement.prototype.setPointerCapture = vi.fn()
    const { container } = render(
      <TerminalWindow {...baseProps}>
        <p>x</p>
      </TerminalWindow>
    )
    const dialog = screen.getByRole('dialog')
    const handle = handles(container)[0]
    expect(dialog.className).toContain('transition-[left,top,filter]')
    fireEvent.pointerDown(handle, { pointerId: 1, clientX: 0, clientY: 0 })
    expect(dialog.className).not.toContain('transition-[left,top,filter]')
    fireEvent.pointerUp(handle, { pointerId: 1 })
    expect(dialog.className).toContain('transition-[left,top,filter]')
  })
})
