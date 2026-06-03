import type { Accomplishment, TimelineEntry } from './timeline'

export type ProfileLevel = 'specialist' | 'senior' | 'focused'

const SENIOR_FRONT_TAGS = new Set([
  'react', 'nextjs', 'typescript', 'redux', 'react-query', 'zod',
  'testing', 'jest', 'vitest', 'playwright', 'rtl', 'tdd', 'e2e',
  'coverage', 'wcag', 'accessibility', 'design-system',
  'micro-frontends', 'core-web-vitals', 'performance', 'ssr', 'ssg',
  'figma', 'hooks', 'context-api', 'state-management',
  'web-components', 'lit', 'storybook', 'vite', 'framer-motion',
  'tailwind', 'seo',
])

const FOCUSED_EXCLUDED = new Set(['devops', 'docker', 'aws', 'gcp', 'aws-cdk', 'terraform'])

const METRIC_RE = /\b(\d+(?:[.,]\d+)?)\s*(%|TB|GB|ms|min|horas?|anos?|containers?)(?=\W|$)/i

function tagSetFor(level: ProfileLevel): Set<string> {
  if (level === 'focused') {
    return new Set([...SENIOR_FRONT_TAGS].filter(t => !FOCUSED_EXCLUDED.has(t)))
  }
  return SENIOR_FRONT_TAGS
}

export function selectTopBullets(
  entry: TimelineEntry,
  level: ProfileLevel,
  n = 3,
): Accomplishment[] {
  const tagSet = tagSetFor(level)
  const scored = entry.accomplishments.map((acc, idx) => {
    const tagScore = acc.tags.filter(t => tagSet.has(t)).length
    const metricBonus =
      METRIC_RE.test(acc.pt) || METRIC_RE.test(acc.en) ? 0.5 : 0
    return { idx, score: tagScore + metricBonus }
  })
  scored.sort((a, b) => b.score - a.score || a.idx - b.idx)
  return scored.slice(0, n).map(s => entry.accomplishments[s.idx]!)
}

export function getBulletsForEntry(
  entry: TimelineEntry,
  level: ProfileLevel = 'senior',
): Accomplishment[] {
  if (entry.selectedSeniorFront && entry.selectedSeniorFront.length === 3) {
    return entry.selectedSeniorFront
  }
  return selectTopBullets(entry, level)
}
