import { launch } from 'puppeteer'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const axeSource = readFileSync(require.resolve('axe-core'), 'utf8')

const url = process.argv[2]
const only = process.argv.slice(3)

if (!url) {
  console.error('usage: node scripts/axe-page.mjs <url> [rule ...]')
  process.exit(2)
}

const browser = await launch({ headless: 'new', args: ['--no-sandbox', '--disable-gpu'] })
const page = await browser.newPage()
await page.setViewport({ width: 1440, height: 900 })
await page.goto(url, { waitUntil: 'networkidle0' })
await page.evaluate(axeSource)
const results = await page.evaluate(
  (rules) => window.axe.run(document, rules.length ? { runOnly: rules } : {}),
  only,
)
await browser.close()

const violations = results.violations.map((v) => ({ id: v.id, impact: v.impact, nodes: v.nodes.length }))
console.log(JSON.stringify(violations, null, 2))
process.exit(violations.length ? 1 : 0)
