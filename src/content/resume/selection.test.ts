import { describe, it, expect } from 'vitest'
import { selectTopBullets, getBulletsForEntry } from './selection'
import type { TimelineEntry } from './timeline'

const makeEntry = (
  accomplishments: { tags: string[]; pt: string; en: string }[]
): TimelineEntry => ({
  id: 'test',
  year: { pt: '2024', en: '2024' },
  role: { pt: 'Dev', en: 'Dev' },
  company: 'Test',
  accomplishments,
})

describe('selectTopBullets', () => {
  it('returns top N by tag score', () => {
    const entry = makeEntry([
      { tags: ['react', 'nextjs', 'typescript'], pt: 'A', en: 'A' },
      { tags: ['figma'], pt: 'B', en: 'B' },
      { tags: ['testing', 'coverage', 'jest', 'rtl'], pt: 'C', en: 'C' },
    ])
    const result = selectTopBullets(entry, 'senior', 2)
    expect(result[0].pt).toBe('C')
    expect(result[1].pt).toBe('A')
  })

  it('applies metric bonus for percentage values', () => {
    const entry = makeEntry([
      { tags: ['testing'], pt: 'Cobertura de 70%', en: '70% coverage' },
      { tags: ['testing', 'jest'], pt: 'Sem métrica', en: 'No metric' },
    ])
    const [first, second] = selectTopBullets(entry, 'senior', 2)
    expect(first.pt).toBe('Sem métrica')
    expect(second.pt).toBe('Cobertura de 70%')
  })

  it('breaks ties by original index (stable order)', () => {
    const entry = makeEntry([
      { tags: ['react'], pt: 'first', en: 'first' },
      { tags: ['nextjs'], pt: 'second', en: 'second' },
      { tags: ['typescript'], pt: 'third', en: 'third' },
    ])
    const result = selectTopBullets(entry, 'senior', 3)
    expect(result.map((r) => r.pt)).toEqual(['first', 'second', 'third'])
  })

  it('returns at most n results', () => {
    const entry = makeEntry([
      { tags: ['react'], pt: 'a', en: 'a' },
      { tags: ['nextjs'], pt: 'b', en: 'b' },
      { tags: ['typescript'], pt: 'c', en: 'c' },
      { tags: ['redux'], pt: 'd', en: 'd' },
    ])
    expect(selectTopBullets(entry, 'senior', 2)).toHaveLength(2)
  })

  it('recognizes anos metric regex', () => {
    const entry = makeEntry([
      { tags: [], pt: '5 anos liderando', en: '5 years leading' },
      { tags: [], pt: 'Sem número', en: 'No number' },
    ])
    const result = selectTopBullets(entry, 'senior', 1)
    expect(result[0].pt).toBe('5 anos liderando')
  })
})

describe('getBulletsForEntry', () => {
  it('uses selectedSeniorFront when it has exactly 3', () => {
    const entry = makeEntry([{ tags: ['react', 'nextjs'], pt: 'big score', en: 'big score' }])
    const selected = [
      { tags: [], pt: 'selected-1', en: 'selected-1' },
      { tags: [], pt: 'selected-2', en: 'selected-2' },
      { tags: [], pt: 'selected-3', en: 'selected-3' },
    ]
    entry.selectedSeniorFront = selected
    expect(getBulletsForEntry(entry)).toBe(selected)
  })

  it('falls back to deterministic when selectedSeniorFront is missing', () => {
    const entry = makeEntry([
      { tags: ['react'], pt: 'a', en: 'a' },
      { tags: ['nextjs'], pt: 'b', en: 'b' },
      { tags: ['typescript'], pt: 'c', en: 'c' },
    ])
    const result = getBulletsForEntry(entry)
    expect(result).toHaveLength(3)
    expect(result[0].pt).toBe('a')
  })

  it('falls back when selectedSeniorFront has fewer than 3', () => {
    const entry = makeEntry([{ tags: ['react'], pt: 'a', en: 'a' }])
    entry.selectedSeniorFront = [entry.accomplishments[0], entry.accomplishments[0]]
    const result = getBulletsForEntry(entry)
    expect(result).toHaveLength(1)
  })
})
