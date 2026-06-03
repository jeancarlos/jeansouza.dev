import { describe, it, expect } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { WindowManagerProvider, useWindowManager } from './WindowManager'
import type { WindowConfig } from './WindowManager'
import React from 'react'

const baseConfig: WindowConfig = {
  id: 'test',
  url: '/test',
  title: 'Test',
  content: null,
  position: { x: 100, y: 100 },
  size: { width: 400, height: 300 },
  defaultSize: 'medium',
  isExpanded: false,
  isMinimized: false,
}

function Probe({ onCapture }: { onCapture: (ctx: ReturnType<typeof useWindowManager>) => void }) {
  const ctx = useWindowManager()
  onCapture(ctx)
  return null
}

function TestConsumer() {
  const { windows, openWindow, closeWindow } = useWindowManager()
  return (
    <div>
      <span data-testid="count">{windows.length}</span>
      <button
        onClick={() =>
          openWindow({
            id: 'test-1',
            url: '/test',
            title: 'Test',
            content: <p>content</p>,
            position: { x: 0, y: 0 },
            size: { width: 400, height: 300 },
            defaultSize: 'medium',
            isExpanded: false,
            isMinimized: false,
          })
        }
      >
        open
      </button>
      <button onClick={() => closeWindow('test-1')}>close</button>
    </div>
  )
}

describe('WindowManager', () => {
  it('starts with zero windows', () => {
    render(
      <WindowManagerProvider>
        <TestConsumer />
      </WindowManagerProvider>
    )
    expect(screen.getByTestId('count').textContent).toBe('0')
  })

  it('opens a window', async () => {
    render(
      <WindowManagerProvider>
        <TestConsumer />
      </WindowManagerProvider>
    )
    await userEvent.click(screen.getByText('open'))
    expect(screen.getByTestId('count').textContent).toBe('1')
  })

  it('closes a window', async () => {
    render(
      <WindowManagerProvider>
        <TestConsumer />
      </WindowManagerProvider>
    )
    await userEvent.click(screen.getByText('open'))
    await userEvent.click(screen.getByText('close'))
    expect(screen.getByTestId('count').textContent).toBe('0')
  })

  it('does not open duplicate windows (focuses instead)', async () => {
    render(
      <WindowManagerProvider>
        <TestConsumer />
      </WindowManagerProvider>
    )
    await userEvent.click(screen.getByText('open'))
    await userEvent.click(screen.getByText('open'))
    expect(screen.getByTestId('count').textContent).toBe('1')
  })

  it('resizeWindow updates size and position', () => {
    let ctx!: ReturnType<typeof useWindowManager>
    render(
      <WindowManagerProvider>
        <Probe
          onCapture={(c) => {
            ctx = c
          }}
        />
      </WindowManagerProvider>
    )

    act(() => ctx.openWindow(baseConfig))
    act(() => ctx.resizeWindow('test', { width: 600, height: 500 }, { x: 50, y: 80 }))

    const win = ctx.windows.find((w) => w.id === 'test')!
    expect(win.size).toEqual({ width: 600, height: 500 })
    expect(win.position).toEqual({ x: 50, y: 80 })
  })

  it('openWindow stores origin when provided', () => {
    let ctx!: ReturnType<typeof useWindowManager>
    render(
      <WindowManagerProvider>
        <Probe
          onCapture={(c) => {
            ctx = c
          }}
        />
      </WindowManagerProvider>
    )

    const origin = { x: 10, y: 20, width: 80, height: 36 }
    act(() => ctx.openWindow({ ...baseConfig, origin }))

    const win = ctx.windows.find((w) => w.id === 'test')!
    expect(win.origin).toEqual(origin)
  })

  it('resizeWindow with nonexistent id leaves state unchanged', () => {
    let ctx!: ReturnType<typeof useWindowManager>
    render(
      <WindowManagerProvider>
        <Probe
          onCapture={(c) => {
            ctx = c
          }}
        />
      </WindowManagerProvider>
    )
    act(() => ctx.openWindow(baseConfig))
    const before = ctx.windows.length
    act(() => ctx.resizeWindow('nonexistent', { width: 999, height: 999 }, { x: 0, y: 0 }))
    expect(ctx.windows.length).toBe(before)
    expect(ctx.windows[0].size).toEqual({ width: 400, height: 300 })
  })
})
