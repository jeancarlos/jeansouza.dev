import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const css = readFileSync('src/styles/base.css', 'utf8')
const touchBlock =
  /@media \(hover: none\) and \(pointer: coarse\) \{([\s\S]*?)\n {2}\}/.exec(css)?.[1] ?? ''

const textElements = /((?:[a-z0-9]+,\s*)+textarea) \{([^}]*)\}/.exec(touchBlock)

describe('touch devices', () => {
  it('turns off text selection and the long-press callout on the page', () => {
    const body = /body \{([^}]*)\}/.exec(touchBlock)?.[1] ?? ''
    expect(body).toContain('-webkit-user-select: none;')
    expect(body).toContain('user-select: none;')
    expect(body).toContain('-webkit-touch-callout: none;')
  })

  it('keeps text selectable on the elements that hold text', () => {
    const selectors = (textElements?.[1] ?? '').split(',').map((s) => s.trim())
    expect(selectors).toEqual(
      expect.arrayContaining(['p', 'h1', 'h6', 'li', 'blockquote', 'pre', 'code', 'td', 'input'])
    )
    expect(textElements?.[2]).toContain('-webkit-user-select: text;')
    expect(textElements?.[2]).toContain('user-select: text;')
  })

  it('does not make containers or spans selectable', () => {
    const selectors = (textElements?.[1] ?? '').split(',').map((s) => s.trim())
    expect(selectors).not.toContain('div')
    expect(selectors).not.toContain('span')
    expect(selectors).not.toContain('main')
  })

  it('leaves selection alone outside touch devices', () => {
    expect(css.replace(touchBlock, '')).not.toMatch(/user-select/)
  })
})
