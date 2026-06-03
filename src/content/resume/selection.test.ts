import { describe, it, expect } from 'vitest'
import { selectTopBullets, getBulletsForEntry } from './selection'
import type { TimelineEntry, Accomplishment } from './timeline'

function acc(tags: string[], pt: string, en: string): Accomplishment {
  return { tags, pt, en }
}

function entry(id: string, accs: Accomplishment[], selected?: Accomplishment[]): TimelineEntry {
  return {
    id,
    year: { pt: '2024', en: '2024' },
    role: { pt: 'Dev', en: 'Dev' },
    company: id,
    accomplishments: accs,
    selectedSeniorFront: selected,
  }
}

describe('selectTopBullets', () => {
  it('scores by senior-front-end tag overlap', () => {
    const e = entry('e1', [
      acc(['devops', 'docker', 'aws'], 'infra', 'infra'),
      acc(['react', 'typescript', 'nextjs', 'testing', 'playwright', 'e2e', 'coverage'], 'fe', 'fe'),
    ])
    const top = selectTopBullets(e, 'senior')
    expect(top[0]?.pt).toBe('fe')
  })

  it('adds metric bonus', () => {
    const e = entry('e1', [
      acc(['react'], 'no metric', 'no metric'),
      acc(['react'], '67% reduction', '67% reduction'),
    ])
    const top = selectTopBullets(e, 'senior')
    expect(top[0]?.pt).toBe('67% reduction')
  })

  it('returns at most 3 bullets', () => {
    const e = entry('e1', Array.from({ length: 10 }, (_, i) =>
      acc(['react', 'typescript'], `b${i}`, `b${i}`)
    ))
    expect(selectTopBullets(e, 'senior')).toHaveLength(3)
  })

  it('breaks ties by original index', () => {
    const e = entry('e1', [
      acc(['react'], 'a', 'a'),
      acc(['react'], 'b', 'b'),
      acc(['react'], 'c', 'c'),
    ])
    const top = selectTopBullets(e, 'senior')
    expect(top.map(x => x.pt)).toEqual(['a', 'b', 'c'])
  })

  it('filters out devops/back tags for focused level', () => {
    const e = entry('e1', [
      acc(['devops', 'docker', 'aws', 'aws-cdk', 'terraform'], 'infra only', 'infra only'),
      acc(['react', 'typescript'], 'fe', 'fe'),
    ])
    const top = selectTopBullets(e, 'focused')
    expect(top[0]?.pt).toBe('fe')
  })
})

describe('getBulletsForEntry', () => {
  it('returns selectedSeniorFront when present and length 3', () => {
    const cached = [acc(['devops'], 'cached', 'cached')]
    // length 1 — not 3 — should fall back
    const e = entry('e1', [acc(['react'], 'real', 'real')], cached)
    expect(getBulletsForEntry(e)).toHaveLength(1)
    expect(getBulletsForEntry(e)[0]?.pt).toBe('real')
  })

  it('uses selectedSeniorFront when exactly 3', () => {
    const cached = [
      acc(['react'], 'a', 'a'),
      acc(['react'], 'b', 'b'),
      acc(['react'], 'c', 'c'),
    ]
    const e = entry('e1', [acc(['devops'], 'real', 'real')], cached)
    expect(getBulletsForEntry(e)).toEqual(cached)
  })
})
