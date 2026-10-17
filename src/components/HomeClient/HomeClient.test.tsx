import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { HomeClient } from './index'
import {
  WindowManagerProvider,
  useWindowManager,
  type WindowConfig,
} from '@/components/windows/WindowManager'

vi.mock('@/components/sections/Hero', () => ({
  Hero: (p: { isFocused: boolean; isPageHeading: boolean; locale: string }) => (
    <div
      data-testid="hero"
      data-focused={String(p.isFocused)}
      data-heading={String(p.isPageHeading)}
    >
      {p.locale}
    </div>
  ),
}))

vi.mock('@/components/windows/TerminalWindow', () => ({
  TerminalWindow: (p: {
    id: string
    title: string
    isFocused: boolean
    children: React.ReactNode
  }) => (
    <section data-testid={`win-${p.id}`} data-focused={String(p.isFocused)}>
      {p.title}
      {p.children}
    </section>
  ),
}))

const cfg = (id: string): WindowConfig => ({
  id,
  url: `/${id}`,
  title: `~/${id}`,
  content: <p>body-{id}</p>,
  position: { x: 0, y: 0 },
  size: { width: 400, height: 300 },
})

function Capture() {
  const { closeWindow } = useWindowManager()
  return <button onClick={() => closeWindow('a')}>close-a</button>
}

function setup(initial: WindowConfig[], isHomePage = true) {
  return render(
    <WindowManagerProvider initialWindows={initial}>
      <Capture />
      <HomeClient locale="en" posts={[]} isHomePage={isHomePage} />
    </WindowManagerProvider>
  )
}

describe('HomeClient', () => {
  it('focuses the hero when no window is open', () => {
    setup([])
    expect(screen.getByTestId('hero')).toHaveAttribute('data-focused', 'true')
    expect(screen.getByTestId('hero')).toHaveAttribute('data-heading', 'true')
    expect(screen.getByTestId('hero')).toHaveTextContent('en')
  })

  it('passes isPageHeading through', () => {
    setup([], false)
    expect(screen.getByTestId('hero')).toHaveAttribute('data-heading', 'false')
  })

  it('renders each window with its content and focuses only the top one', () => {
    setup([cfg('a'), cfg('b')])
    expect(screen.getByText('body-a')).toBeInTheDocument()
    expect(screen.getByTestId('win-a')).toHaveAttribute('data-focused', 'false')
    expect(screen.getByTestId('win-b')).toHaveAttribute('data-focused', 'true')
    expect(screen.getByTestId('hero')).toHaveAttribute('data-focused', 'false')
  })

  it('closes the top window on Escape', () => {
    setup([cfg('a'), cfg('b')])
    fireEvent.keyDown(window, { key: 'Escape' })
    expect(screen.queryByTestId('win-b')).not.toBeInTheDocument()
    expect(screen.getByTestId('win-a')).toBeInTheDocument()
  })

  it('ignores other keys', () => {
    setup([cfg('a')])
    fireEvent.keyDown(window, { key: 'Enter' })
    expect(screen.getByTestId('win-a')).toBeInTheDocument()
  })

  it('does not listen for keys without windows and stops after close', () => {
    setup([cfg('a')])
    fireEvent.click(screen.getByText('close-a'))
    fireEvent.keyDown(window, { key: 'Escape' })
    expect(screen.queryByTestId('win-a')).not.toBeInTheDocument()
    expect(screen.getByTestId('hero')).toHaveAttribute('data-focused', 'true')
  })
})
