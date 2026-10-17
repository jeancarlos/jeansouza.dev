import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, fireEvent, render, screen } from '@testing-library/react'
import { MoreLinksWindow } from './MoreLinksWindow'

class ResizeObserverStub {
  observe() {}
  disconnect() {}
}

const writeText = vi.fn()

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] })
  vi.stubGlobal('ResizeObserver', ResizeObserverStub)
  writeText.mockReset()
  Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true })
})

afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllGlobals()
})

async function copy(name: string) {
  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name }))
  })
}

describe('MoreLinksWindow', () => {
  it('links the profiles that have a url and offers the rest as copy buttons', () => {
    render(<MoreLinksWindow />)
    expect(screen.getByRole('heading', { name: 'Mais links' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Instagram' })).toHaveAttribute(
      'href',
      'https://www.instagram.com/jeansouza.dev/'
    )
    expect(screen.getByRole('button', { name: 'Copiar Discord' })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Discord' })).toBeNull()
    expect(screen.queryByRole('link', { name: 'Source for this website' })).toBeNull()
  })

  it('copies the value and confirms it, then hides the confirmation after a moment', async () => {
    writeText.mockResolvedValue(undefined)
    render(<MoreLinksWindow />)
    await copy('Copiar Steam')
    expect(writeText).toHaveBeenCalledWith('jeanrnk')
    expect(screen.getByRole('tooltip')).toHaveTextContent('Copiado! jeanrnk')
    act(() => {
      vi.advanceTimersByTime(1999)
    })
    expect(screen.getByRole('tooltip')).toBeInTheDocument()
    act(() => {
      vi.advanceTimersByTime(1)
    })
    expect(screen.queryByRole('tooltip')).toBeNull()
  })

  it('restarts the countdown when another value is copied', async () => {
    writeText.mockResolvedValue(undefined)
    render(<MoreLinksWindow />)
    await copy('Copiar Steam')
    act(() => {
      vi.advanceTimersByTime(1500)
    })
    await copy('Copiar Discord')
    act(() => {
      vi.advanceTimersByTime(1500)
    })
    expect(screen.getByRole('tooltip')).toHaveTextContent('Copiado! jeanrnk#5682')
    act(() => {
      vi.advanceTimersByTime(500)
    })
    expect(screen.queryByRole('tooltip')).toBeNull()
  })

  it('keeps the raw value on screen when the clipboard is blocked, until dismissed', async () => {
    writeText.mockRejectedValue(new Error('denied'))
    render(<MoreLinksWindow />)
    await copy('Copiar Discord')
    const tooltip = screen.getByRole('tooltip')
    expect(tooltip).toHaveTextContent(/^jeanrnk#5682$/)
    act(() => {
      vi.advanceTimersByTime(10000)
    })
    expect(screen.getByRole('tooltip')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('tooltip'))
    expect(screen.queryByRole('tooltip')).toBeNull()
  })

  it('drops a pending confirmation when the pointer leaves it', async () => {
    writeText.mockResolvedValue(undefined)
    render(<MoreLinksWindow />)
    await copy('Copiar PSN ID')
    fireEvent.mouseLeave(screen.getByRole('tooltip'))
    expect(screen.queryByRole('tooltip')).toBeNull()
  })

  it('clears the countdown on unmount', async () => {
    writeText.mockResolvedValue(undefined)
    const { unmount } = render(<MoreLinksWindow />)
    await copy('Copiar Steam')
    unmount()
    expect(vi.getTimerCount()).toBe(0)
  })
})
