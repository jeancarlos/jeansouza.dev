// Baseline/after measurement for the jeansouza.dev migration.
// Deps (not in the site repo): lighthouse, puppeteer, axe-core.
// Usage: node measure.mjs --base http://127.0.0.1:4321 --dist ../../jeansouza.dev/out --out ./baseline --runs 3
import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync } from 'node:fs'
import { join, relative, dirname } from 'node:path'
import { createRequire } from 'node:module'
import puppeteer from 'puppeteer'
import lighthouse from 'lighthouse'
import * as chromeLauncher from 'chrome-launcher'
import desktopConfig from 'lighthouse/core/config/desktop-config.js'

const require = createRequire(import.meta.url)
const axeSource = readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8')
const arg = (n, d) => { const i = process.argv.indexOf(`--${n}`); return i > -1 ? process.argv[i + 1] : d }
const BASE = arg('base', 'http://127.0.0.1:4321')
const DIST = arg('dist', '../../jeansouza.dev/out')
const OUT = arg('out', './baseline')
const RUNS = Number(arg('runs', 3))
const CHROME = '/home/jean/.cache/puppeteer/chrome/linux-148.0.7778.97/chrome-linux64/chrome'

const median = (xs) => { const s = xs.filter((x) => x != null).sort((a, b) => a - b); return s.length ? s[(s.length - 1) >> 1] : null }

function routes(dir, root = dir) {
  const out = []
  for (const e of readdirSync(dir)) {
    const p = join(dir, e)
    if (statSync(p).isDirectory()) out.push(...routes(p, root))
    else if (e === 'index.html') {
      const r = '/' + relative(root, dirname(p)).replace(/\\/g, '/')
      if (!r.includes('404') && !r.includes('_not-found')) out.push(r === '/.' ? '/' : r.endsWith('/') ? r : r + '/')
    }
  }
  return out.sort()
}

async function lh(url, port, mobile, attempt = 0) {
  let r
  try {
    r = await lighthouse(url, { port, output: 'json', logLevel: 'error' }, mobile ? undefined : desktopConfig)
  } catch (e) {
    if (attempt < 2) { console.error(`  retry ${url} ${mobile ? 'm' : 'd'}: ${e.message}`); return lh(url, port, mobile, attempt + 1) }
    console.error(`  FAILED ${url} ${mobile ? 'm' : 'd'}: ${e.message}`)
    return null
  }
  const a = r.lhr.audits, c = r.lhr.categories
  const script = (a['resource-summary']?.details?.items || []).find((i) => i.resourceType === 'script')
  return {
    performance: Math.round(c.performance.score * 100),
    accessibility: Math.round(c.accessibility.score * 100),
    bestPractices: Math.round(c['best-practices'].score * 100),
    seo: Math.round(c.seo.score * 100),
    lcp_ms: a['largest-contentful-paint']?.numericValue ?? null,
    tbt_ms: a['total-blocking-time']?.numericValue ?? null,
    cls: a['cumulative-layout-shift']?.numericValue ?? null,
    js_transfer_bytes: script?.transferSize ?? 0,
    js_requests: script?.requestCount ?? 0,
  }
}

async function axeRun(browser, url, viewport) {
  const page = await browser.newPage()
  await page.setViewport(viewport)
  await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 })
  await page.evaluate(axeSource)
  const res = await page.evaluate(async () => await window.axe.run(document, { resultTypes: ['violations'] }))
  await page.close()
  return res.violations.map((v) => ({ id: v.id, impact: v.impact, nodes: v.nodes.length, help: v.help }))
}

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ['--no-sandbox'] })
const paths = routes(DIST)
console.error(`measuring ${paths.length} pages, ${RUNS} runs each`)
const report = { base: BASE, generated_by: 'measure.mjs', runs: RUNS, pages: {} }

for (const p of paths) {
  const url = BASE + p
  const entry = { mobile: {}, desktop: {}, axe: {} }
  const chrome = await chromeLauncher.launch({ chromePath: CHROME, chromeFlags: ['--headless=new', '--no-sandbox', '--disable-gpu'] })
  const port = chrome.port
  for (const mobile of [true, false]) {
    const raw = []
    for (let i = 0; i < RUNS; i++) raw.push(await lh(url, port, mobile))
    const ok = raw.filter(Boolean)
    if (!ok.length) { entry[mobile ? 'mobile' : 'desktop'] = { median: null, runs: raw, error: 'all runs failed' }; continue }
    const keys = Object.keys(ok[0])
    const med = Object.fromEntries(keys.map((k) => [k, median(raw.filter(Boolean).map((r) => r[k]))]))
    entry[mobile ? 'mobile' : 'desktop'] = { median: med, runs: raw }
  }
  await chrome.kill()
  entry.axe.mobile = await axeRun(browser, url, { width: 390, height: 844, isMobile: true })
  entry.axe.desktop = await axeRun(browser, url, { width: 1440, height: 900 })
  report.pages[p] = entry
  const m = entry.mobile.median || {}
  console.error(`${p.padEnd(24)} perf=${m.performance ?? 'FAIL'} a11y=${m.accessibility ?? '-'} js=${m.js_transfer_bytes != null ? (m.js_transfer_bytes / 1024).toFixed(1) : '-'}KB axe=${entry.axe.mobile.length + entry.axe.desktop.length}`)
}

await browser.close()
mkdirSync(OUT, { recursive: true })
writeFileSync(join(OUT, 'report.json'), JSON.stringify(report, null, 2))

const rows = Object.entries(report.pages).filter(([, e]) => e.mobile.median && e.desktop.median).map(([p, e]) => ({
  page: p, perf_m: e.mobile.median.performance, perf_d: e.desktop.median.performance,
  a11y: e.mobile.median.accessibility, lcp_m: Math.round(e.mobile.median.lcp_ms),
  tbt_m: Math.round(e.mobile.median.tbt_ms), cls_m: e.mobile.median.cls?.toFixed(3),
  js_kb: (e.mobile.median.js_transfer_bytes / 1024).toFixed(1),
  axe: e.axe.mobile.length + e.axe.desktop.length,
}))
const total_js = rows.reduce((a, r) => a + Number(r.js_kb), 0)
writeFileSync(join(OUT, 'summary.md'), [
  `# ${OUT.includes('after') ? 'After' : 'Baseline'} — ${new Date().toISOString().slice(0, 10)}`,
  '', `Lighthouse ${RUNS} runs per page per form factor, median reported. axe-core violations at 390x844 and 1440x900.`, '',
  '| page | perf (m) | perf (d) | a11y | LCP ms | TBT ms | CLS | JS KB | axe |',
  '| --- | --- | --- | --- | --- | --- | --- | --- | --- |',
  ...rows.map((r) => `| ${r.page} | ${r.perf_m} | ${r.perf_d} | ${r.a11y} | ${r.lcp_m} | ${r.tbt_m} | ${r.cls_m} | ${r.js_kb} | ${r.axe} |`),
  '', `Total JS transferred across pages: ${total_js.toFixed(1)} KB`,
].join('\n'))
console.error(`\nwrote ${OUT}/report.json and ${OUT}/summary.md`)
