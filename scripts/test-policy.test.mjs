import { execFileSync, spawnSync } from 'node:child_process'
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { missingTests } from './test-policy.mjs'

const change = (subject, files, body = '') => ({ subject, body, files })

describe('missingTests', () => {
  it('names a fix or feat with no test file and gives the way out', () => {
    const out = missingTests([
      change('fix: stop it', ['src/a.ts']),
      change('feat(x)!: new', ['src/b.ts']),
    ])
    expect(out).toHaveLength(2)
    expect(out[0]).toMatch(/No-Test/)
  })

  it('passes a fix that touches a test file', () => {
    expect(missingTests([change('fix: x', ['src/a.ts', 'src/a.test.tsx'])])).toEqual([])
  })

  it('needs no test for other commit types', () => {
    expect(
      missingTests([
        change('chore: x', ['src/a.ts']),
        change('docs: x', ['README.md']),
        change('ci: x', []),
      ])
    ).toEqual([])
  })

  it('exempts a No-Test line with a reason and not an empty one', () => {
    expect(missingTests([change('fix: x', ['src/a.ts'], 'No-Test: copy change')])).toEqual([])
    expect(missingTests([change('fix: x', ['src/a.ts'], 'No-Test:')])).toHaveLength(1)
  })
})

describe('cli', () => {
  const script = join(import.meta.dirname, 'test-policy.mjs')
  const git = (cwd, ...args) =>
    execFileSync(
      'git',
      ['-c', 'user.name=t', '-c', 'user.email=t@t', '-c', 'commit.gpgsign=false', ...args],
      {
        cwd,
        encoding: 'utf8',
      }
    )
  const commit = (dir, message, file) => {
    mkdirSync(join(dir, 'src'), { recursive: true })
    writeFileSync(join(dir, file), message)
    git(dir, 'add', '-A')
    git(dir, 'commit', '-q', '-m', message)
  }

  it('fails on an untested fix and passes once a test file is in it', () => {
    const dir = mkdtempSync(join(tmpdir(), 'repo-'))
    git(dir, 'init', '-q', '-b', 'main')
    commit(dir, 'chore: base', 'src/a.ts')
    const base = git(dir, 'rev-parse', 'HEAD').trim()
    commit(dir, 'fix: broken', 'src/a.ts')
    const failed = spawnSync(process.execPath, [script, base, 'HEAD'], {
      cwd: dir,
      encoding: 'utf8',
    })
    expect(failed.status).toBe(1)
    expect(failed.stderr).toContain('fix: broken')
    git(dir, 'reset', '-q', '--hard', base)
    commit(dir, 'fix: tested', 'src/a.test.ts')
    expect(spawnSync(process.execPath, [script, base, 'HEAD'], { cwd: dir }).status).toBe(0)
  }, 30000)
})
