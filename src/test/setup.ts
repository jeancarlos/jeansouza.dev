import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Global matchMedia mock — required by useMediaQuery / useIsMobile
// and any component that calls them. The jsdom environment does not
// implement matchMedia at runtime, even though the DOM type declares it.
const w = window as unknown as { matchMedia?: typeof window.matchMedia }
if (typeof w.matchMedia !== 'function') {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  })
}
