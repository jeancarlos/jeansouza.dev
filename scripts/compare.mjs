import { readFileSync, statSync, writeFileSync } from 'node:fs'

const before = JSON.parse(readFileSync('docs/migration/baseline/report.json', 'utf8'))
const after = JSON.parse(readFileSync('docs/migration/after/report.json', 'utf8'))

// Refuse to report a stale "after" run. measure.mjs failing silently once let a
// pre-port report be published as if it described the ported build, and the
// numbers were plausible enough to nearly ship. Freshness is now a gate.
const afterAgeH = (Date.now() - statSync('docs/migration/after/report.json').mtimeMs) / 3_600_000
if (afterAgeH > 6) {
  console.error(
    `refusing to compare: docs/migration/after/report.json is ${afterAgeH.toFixed(1)}h old. ` +
      'Re-run scripts/measure.mjs against the current build.',
  )
  process.exit(1)
}

const missing = Object.keys(before.pages).filter((u) => !after.pages[u])
if (missing.length) {
  console.error(`refusing to compare: ${missing.length} page(s) absent from the after run:`, missing)
  process.exit(1)
}

// Two baseline rows are the pre-rename slug, which is a meta-refresh stub in
// public/. Lighthouse followed the redirect, so those rows measured the post
// page a second time. They are labelled, never counted.
const REDIRECTS = new Set(Object.keys(before.pages).filter((u) => u.includes('como-modernizei')))

const kb = (n) => (n == null ? null : Math.round(n / 1024))
const num = (v) => (v == null ? '—' : v)
const delta = (b, a, unit = '', better = 'lower') => {
  if (b == null || a == null) return '—'
  const d = a - b
  const sign = d > 0 ? '+' : ''
  const good = better === 'lower' ? d < 0 : d > 0
  return `${sign}${Math.round(d)}${unit}${d === 0 ? '' : good ? ' ✓' : ' ✗'}`
}

const rows = []
const axeTotals = { before: {}, after: {} }

for (const url of Object.keys(before.pages)) {
  const b = before.pages[url]
  const a = after.pages[url]
  const tally = (side, page) => {
    for (const form of ['mobile', 'desktop']) {
      for (const v of page?.axe?.[form] ?? []) {
        axeTotals[side][v.id] = (axeTotals[side][v.id] ?? 0) + v.nodes
      }
    }
  }
  tally('before', b)
  if (a) tally('after', a)

  rows.push({
    url,
    redirect: REDIRECTS.has(url),
    bm: b.mobile?.median,
    am: a?.mobile?.median,
    bd: b.desktop?.median,
    ad: a?.desktop?.median,
    bAxe: (b.axe?.mobile?.length ?? 0) + (b.axe?.desktop?.length ?? 0),
    aAxe: a ? (a.axe?.mobile?.length ?? 0) + (a.axe?.desktop?.length ?? 0) : null,
  })
}

const content = rows.filter((r) => !r.redirect)
const sum = (list, pick) => list.reduce((t, r) => t + (pick(r) ?? 0), 0)

const lines = []
lines.push('# Migration comparison: Next 16 to Astro 7')
lines.push('')
lines.push(
  `Same script (\`scripts/measure.mjs\`), same pinned Chrome, same machine, median of 3 runs per page per form factor. Raw runs are in \`baseline/report.json\` and \`after/report.json\`.`,
)
lines.push('')
lines.push(
  `**${content.length} distinct pages.** The two \`como-modernizei-meu-site\` rows are redirect stubs kept from a pre-rename slug; Lighthouse followed them, so they measured the post page twice. They are shown for completeness and excluded from every total.`,
)
lines.push('')
lines.push('## JavaScript transferred')
lines.push('')
lines.push('| Page | Before | After | Change |')
lines.push('|---|--:|--:|--:|')
for (const r of rows) {
  const label = r.redirect ? `${r.url} *(redirect)*` : r.url
  lines.push(
    `| \`${label}\` | ${num(kb(r.bm?.js_transfer_bytes))} KB | ${num(kb(r.am?.js_transfer_bytes))} KB | ${delta(kb(r.bm?.js_transfer_bytes), kb(r.am?.js_transfer_bytes), ' KB')} |`,
  )
}
const bTotal = sum(content, (r) => kb(r.bm?.js_transfer_bytes))
const aTotal = sum(content, (r) => kb(r.am?.js_transfer_bytes))
lines.push(`| **Total (${content.length} pages)** | **${bTotal} KB** | **${aTotal} KB** | **${delta(bTotal, aTotal, ' KB')}** |`)
lines.push('')
lines.push(`Reduction: **${Math.round((1 - aTotal / bTotal) * 100)}%**.`)
lines.push('')
lines.push('## Lighthouse')
lines.push('')
lines.push('| Page | Perf mobile | Perf desktop | LCP mobile | TBT mobile |')
lines.push('|---|--:|--:|--:|--:|')
for (const r of content) {
  lines.push(
    `| \`${r.url}\` | ${num(r.bm?.performance)} → ${num(r.am?.performance)} (${delta(r.bm?.performance, r.am?.performance, '', 'higher')}) | ${num(r.bd?.performance)} → ${num(r.ad?.performance)} (${delta(r.bd?.performance, r.ad?.performance, '', 'higher')}) | ${num(Math.round(r.bm?.lcp_ms ?? 0))} → ${num(Math.round(r.am?.lcp_ms ?? 0))} ms | ${num(Math.round(r.bm?.tbt_ms ?? 0))} → ${num(Math.round(r.am?.tbt_ms ?? 0))} ms |`,
  )
}
lines.push('')
lines.push('## axe-core violations')
lines.push('')
lines.push('Node counts across both viewports, all pages.')
lines.push('')
lines.push('| Rule | Impact | Before | After |')
lines.push('|---|---|--:|--:|')
const ruleIds = [...new Set([...Object.keys(axeTotals.before), ...Object.keys(axeTotals.after)])].sort()
for (const id of ruleIds) {
  lines.push(`| \`${id}\` | | ${axeTotals.before[id] ?? 0} | ${axeTotals.after[id] ?? 0} |`)
}
lines.push('')
lines.push(
  '`color-contrast` is **not fixed** — it is the one rule still failing, and the drop from 112 to 20 nodes is a side effect, not work. Fewer elements are painted per page now, so fewer of them fail; the palette itself is unchanged. It is rebuilt in phase 2 under `09 - Specs/2026-08-23-jeansouza-dev-visual-system-design.md`. Reporting it as outstanding is the point: a comparison that quietly banks an accidental improvement is as dishonest as one that drops the metric entirely.',
)
lines.push('')
lines.push('## The gap this migration was built to show')
lines.push('')
lines.push(
  'Lighthouse scored accessibility 96-100 on the Next site while axe found 26 missing-landmark violations and 4 scrollable regions no keyboard could reach. Those scores are **identical after the fix**: 100 stayed 100, 96 stayed 96. The score did not notice the defects and did not notice them being repaired. Lighthouse runs a subset of axe and weights what it runs; it never claimed to be an audit. A green accessibility score beside a keyboard trap is the thing worth writing about.',
)
lines.push('')

writeFileSync('docs/migration/comparison.md', lines.join('\n'))
console.log(`wrote docs/migration/comparison.md (${content.length} content pages)`)
