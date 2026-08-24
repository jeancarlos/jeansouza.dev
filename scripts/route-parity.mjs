import { readdirSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

function urls(root) {
  const out = []
  const walk = (dir) => {
    for (const e of readdirSync(dir)) {
      const p = join(dir, e)
      if (statSync(p).isDirectory()) walk(p)
      else if (e === 'index.html') {
        const rel = relative(root, dir).replace(/\\/g, '/')
        out.push(rel === '' ? '/' : `/${rel}/`)
      }
    }
  }
  walk(root)
  return out.sort()
}

// Known, deliberate differences. Anything not listed here is a real break.
const EXPECTED_ONLY_IN_NEXT = new Set([
  '/_not-found/', // Next internal; Astro's equivalent is 404.html
  '/404/', // Next emits a directory too; Astro emits 404.html, which is what GitHub Pages serves
])
const EXPECTED_ONLY_IN_ASTRO = new Set([
  '/probe/', // migration scaffold, deleted at cutover
])

const next = urls('out')
const astro = urls('dist')

const missing = next.filter((u) => !astro.includes(u) && !EXPECTED_ONLY_IN_NEXT.has(u))
const extra = astro.filter((u) => !next.includes(u) && !EXPECTED_ONLY_IN_ASTRO.has(u))

if (missing.length) console.log('MISSING in dist:', missing)
if (extra.length) console.log('EXTRA in dist:', extra)
console.log(`next=${next.length} astro=${astro.length} shared=${next.filter((u) => astro.includes(u)).length}`)
process.exit(missing.length || extra.length ? 1 : 0)
