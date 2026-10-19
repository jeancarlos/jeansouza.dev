import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { parse } from 'yaml'

const DIR = '.github/workflows'

const triggers = (name) => {
  const on = parse(readFileSync(join(DIR, name), 'utf8')).on
  return Array.isArray(on) ? Object.fromEntries(on.map((e) => [e, null])) : on
}

describe('workflow triggers', () => {
  for (const name of readdirSync(DIR).filter((f) => f.endsWith('.yml'))) {
    const on = triggers(name)
    if (!('pull_request' in on)) continue

    it(`${name} runs on pull requests into develop only`, () => {
      expect(on.pull_request?.branches).toEqual(['develop'])
    })
  }
})
