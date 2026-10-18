import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { extname, isAbsolute, join, relative, resolve, sep } from 'node:path'
import { createRequire } from 'node:module'
import { chromium } from 'playwright-core'

const DIST = 'dist'
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.woff2': 'font/woff2',
  '.json': 'application/json',
  '.xml': 'application/xml',
}
const VIEWPORTS = [
  { width: 1440, height: 900 },
  { width: 390, height: 844 },
]
const SCHEMES = ['light', 'dark']

const { url: urls } = JSON.parse(await readFile('lighthouserc.json', 'utf8')).ci.collect
const axeSource = await readFile(
  createRequire(import.meta.url).resolve('axe-core/axe.min.js'),
  'utf8'
)

const ROOT = resolve(DIST)

async function resolveFile(pathname) {
  const path = resolve(ROOT, '.' + decodeURIComponent(pathname))
  const rel = relative(ROOT, path)
  if (rel === '..' || rel.startsWith('..' + sep) || isAbsolute(rel)) return null
  for (const candidate of [path, join(path, 'index.html')]) {
    const info = await stat(candidate).catch(() => null)
    if (info?.isFile()) return candidate
  }
  return null
}

const server = createServer((req, res) => {
  serve(req.url ?? '/').then(
    ({ status, file, body }) => {
      res.writeHead(status, { 'content-type': TYPES[extname(file)] ?? 'application/octet-stream' })
      res.end(body)
    },
    () => {
      res.writeHead(400)
      res.end()
    }
  )
})

async function serve(url) {
  const found = await resolveFile(new URL(url, 'http://x').pathname)
  const file = found ?? join(ROOT, '404.html')
  return { status: found ? 200 : 404, file, body: await readFile(file) }
}
await new Promise((ok) => server.listen(0, '127.0.0.1', ok))
const base = `http://127.0.0.1:${server.address().port}`

const browser = await chromium.launch({ channel: 'chrome' })
let failures = 0
let audits = 0

async function audit(page, url, label) {
  await page.waitForFunction(() => !document.querySelector('astro-island[ssr]'), null, {
    timeout: 15000,
  })
  await page.addScriptTag({ content: axeSource })
  const violations = await page.evaluate(async () => (await window.axe.run()).violations)
  audits++
  for (const v of violations) {
    failures += v.nodes.length
    console.log(`${url} ${label}  ${v.id} (${v.impact}): ${v.nodes.length} node(s)`)
    for (const n of v.nodes.slice(0, 3)) console.log(`    ${n.target.join(' ')}`)
  }
}

const HOVERED = ['[data-locale-switch]', '[data-motion-toggle]', '[data-theme-toggle]']
const otherLocale = (url) => (url.startsWith('/pt') ? 'en-US' : 'pt-BR')

async function open(page, url) {
  const response = await page.goto(base + url, { waitUntil: 'networkidle' })
  if (!response?.ok()) throw new Error(`${url}: HTTP ${response?.status()}`)
}

for (const scheme of SCHEMES) {
  for (const viewport of VIEWPORTS) {
    const tag = `${scheme} ${viewport.width}px`
    const page = await browser.newPage({ viewport, colorScheme: scheme })
    for (const url of urls) {
      await open(page, url)
      await audit(page, url, tag)
    }
    await page.close()

    const states = await browser.newPage({ viewport, colorScheme: scheme })
    const home = urls[0]
    await open(states, home)
    await states.click('[data-motion-toggle]')
    await audit(states, home, `${tag} paused`)
    for (const selector of HOVERED) {
      await states.hover(selector)
      await states.waitForTimeout(450)
      await audit(states, home, `${tag} tooltip ${selector}`)
    }
    await states.close()

    let shown = 0
    for (const url of urls) {
      const reader = await browser.newPage({
        viewport,
        colorScheme: scheme,
        locale: otherLocale(url),
      })
      await open(reader, url)
      shown += await reader.waitForSelector('div[lang] a[hreflang]', { timeout: 1500 }).then(
        () => 1,
        () => 0
      )
      await audit(reader, url, `${tag} language notice`)
      await reader.close()
    }
    if (!shown) throw new Error(`${tag}: the language notice never appeared`)
  }
}
await browser.close()
server.close()

console.log(
  failures
    ? `axe: ${failures} violation node(s)`
    : `axe: 0 violations in ${audits} audits (${urls.length} pages x 2 themes x 2 viewports, plus paused, tooltip and language notice states)`
)
process.exit(failures ? 1 : 0)
