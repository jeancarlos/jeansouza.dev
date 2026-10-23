import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, fireEvent, render, screen, within } from '@testing-library/react'
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

function row(name: string) {
  return within(screen.getByText(name).closest('li') as HTMLElement)
}

describe('MoreLinksWindow', () => {
  it('lists each profile as a row: name, then the link or the copyable code', () => {
    render(<MoreLinksWindow />)
    expect(screen.getByRole('heading', { name: 'Mais links' })).toBeInTheDocument()
    expect(row('Instagram').getByRole('link', { name: 'jeansouza.dev' })).toHaveAttribute(
      'href',
      'https://www.instagram.com/jeansouza.dev/'
    )
    expect(row('Bluesky').getByRole('link', { name: 'jeansouza.dev' })).toHaveAttribute(
      'href',
      'https://bsky.app/profile/jeansouza.dev'
    )
    expect(row('Steam').getByRole('link', { name: 'jeanrnk' })).toHaveAttribute(
      'href',
      'https://steamcommunity.com/id/jeanrnk/'
    )
    expect(row('Switch ID').getByRole('button')).toHaveTextContent('1749 2384 1794')
    expect(row('Discord').getByRole('button', { name: 'Copiar Discord' })).toHaveTextContent(
      'jeanrnk#5682'
    )
    expect(row('Discord').queryByRole('link')).toBeNull()
    expect(screen.queryByRole('link', { name: 'Source for this website' })).toBeNull()
  })

  it('no longer lists Xbox', () => {
    render(<MoreLinksWindow />)
    expect(screen.queryByText(/xbox/i)).toBeNull()
  })

  it('copies the value and confirms it, then hides the confirmation after a moment', async () => {
    writeText.mockResolvedValue(undefined)
    render(<MoreLinksWindow />)
    await copy('Copiar PSN ID')
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
    await copy('Copiar PSN ID')
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
    await copy('Copiar PSN ID')
    unmount()
    expect(vi.getTimerCount()).toBe(0)
  })
})
