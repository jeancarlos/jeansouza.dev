import { describe, expect, it } from 'vitest'
import { SURFACES } from './surfaces'

describe('window surface semantics', () => {
  it('never uses role=application or alertdialog', () => {
    for (const [id, s] of Object.entries(SURFACES)) {
      expect(['dialog', 'region'], id).toContain(s.role)
    }
  })

  it('is never modal — the desktop behind stays operable', () => {
    for (const [id, s] of Object.entries(SURFACES)) {
      expect(s.modal, id).toBe(false)
    }
  })

  it('gives every surface an accessible name key', () => {
    for (const [id, s] of Object.entries(SURFACES)) {
      expect(s.labelKey, id).toMatch(/\S/)
    }
  })

  it('marks the long-content surfaces scrollable so they get a focusable body', () => {
    expect(SURFACES.post.scrollable).toBe(true)
    expect(SURFACES.resume.scrollable).toBe(true)
  })
})
