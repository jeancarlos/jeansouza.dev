import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { WindowManagerProvider, useWindowManager } from './WindowManager'

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
})
