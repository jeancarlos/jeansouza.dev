import { describe, it, expect } from 'vitest'
import { toFileSlug, DIRECTORY_PERMISSIONS } from './format'

describe('toFileSlug', () => {
  it('lowercases the input', () => {
    expect(toFileSlug('Hello World')).toBe('hello-world')
  })

  it('replaces spaces with dashes', () => {
    expect(toFileSlug('multi word title')).toBe('multi-word-title')
  })

  it('strips non-alphanumeric characters', () => {
    expect(toFileSlug('React & TypeScript!')).toBe('react-typescript')
  })

  it('preserves dashes between words', () => {
    expect(toFileSlug('pre-existing-dashes')).toBe('pre-existing-dashes')
  })

  it('collapses consecutive non-alphanumeric characters into one dash', () => {
    expect(toFileSlug('hello   world')).toBe('hello-world')
    expect(toFileSlug('a&b&c')).toBe('a-b-c')
  })

  it('strips leading and trailing dashes', () => {
    expect(toFileSlug('!!!hello!!!')).toBe('hello')
  })

  it('handles empty string', () => {
    expect(toFileSlug('')).toBe('')
  })
})

describe('DIRECTORY_PERMISSIONS', () => {
  it('is the standard ls -l directory prefix', () => {
    expect(DIRECTORY_PERMISSIONS).toBe('drwxr-xr-x')
  })
})
