import { execFileSync } from 'node:child_process'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const LOGGED = /^(feat|fix)(\(.+\))?!?:/
const EXEMPT = /^No-Test:\s*\S/m
const TEST_FILE = /\.test\.(ts|tsx|mjs)$/

export function missingTests(changes) {
  return changes
    .filter(
      (c) =>
        LOGGED.test(c.subject) && !EXEMPT.test(c.body) && !c.files.some((f) => TEST_FILE.test(f))
    )
    .map(
      (c) => `${c.subject}: no test file in the change (add a test, or a "No-Test: <reason>" line)`
    )
}

const git = (...args) => execFileSync('git', args, { encoding: 'utf8' })

export function readRange(base, head) {
  return git('rev-list', '--no-merges', `${base}..${head}`)
    .split('\n')
    .filter(Boolean)
    .map((sha) => ({
      subject: git('log', '-1', '--format=%s', sha).trim(),
      body: git('log', '-1', '--format=%b', sha),
      files: git('show', '--name-only', '--format=', sha).split('\n').filter(Boolean),
    }))
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [base, head] = process.argv.slice(2)
  const problems = missingTests(readRange(base, head))
  if (problems.length) {
    process.stderr.write(`${problems.join('\n')}\n`)
    process.exit(1)
  }
}
