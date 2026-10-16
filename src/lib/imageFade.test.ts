import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { IMAGE_FADE_SCRIPT } from './imageFade'

function installedListener(): (e: { target: EventTarget }) => void {
  let listener: (e: { target: EventTarget }) => void = () => undefined
  const doc = { addEventListener: (_: string, fn: typeof listener) => (listener = fn) }
  // eslint-disable-next-line @typescript-eslint/no-implied-eval
  new Function('document', IMAGE_FADE_SCRIPT)(doc)
  return listener
}

describe('IMAGE_FADE_SCRIPT', () => {
  const onLoad = installedListener()

  it('marks a fading image as loaded once its load event fires', () => {
    const img = document.createElement('img')
    img.setAttribute('data-fade', '')
    onLoad({ target: img })
    expect(img.hasAttribute('data-loaded')).toBe(true)
  })

  it('leaves images without data-fade alone', () => {
    const img = document.createElement('img')
    onLoad({ target: img })
    expect(img.hasAttribute('data-loaded')).toBe(false)
  })
})

describe('image fade CSS', () => {
  const css = readFileSync('src/styles/motion.css', 'utf8')

  it('hides unloaded images only when scripting is on, so no-JS readers still see them', () => {
    expect(css).toMatch(
      /@media \(scripting: enabled\) \{[^@]*img\[data-fade\]:not\(\[data-loaded\]\)/
    )
  })

  it('does not animate the fade under reduced motion', () => {
    expect(css).toMatch(
      /@media \(prefers-reduced-motion: reduce\) \{\s*img\[data-fade\] \{\s*transition: none;/
    )
  })
})
