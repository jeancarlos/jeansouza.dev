import { launch } from 'puppeteer'
import { mkdirSync, writeFileSync, readFileSync } from 'node:fs'
import { PNG } from 'pngjs'
import pixelmatch from 'pixelmatch'

const CHROME = '/home/jean/.cache/puppeteer/chrome/linux-148.0.7778.97/chrome-linux64/chrome'
const A = process.argv[2] // baseline origin (Next)
const B = process.argv[3] // candidate origin (Astro)
const OUT = process.argv[4] ?? '/tmp/visual'

const ROUTES = ['/pt/', '/en/', '/pt/blog/', '/pt/resume/', '/pt/more/']
const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
]

mkdirSync(OUT, { recursive: true })

async function shoot(browser, origin, route, vp, file) {
  const page = await browser.newPage()
  await page.setViewport({ width: vp.width, height: vp.height, deviceScaleFactor: 1 })
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
  await page.goto(origin + route, { waitUntil: 'networkidle0' })
  // Windows animate in; settle before capturing so the diff is not measuring
  // a frame of animation.
  await new Promise((r) => setTimeout(r, 6000))
  await page.screenshot({ path: file })
  await page.close()
}

const browser = await launch({ executablePath: CHROME, headless: true, args: ['--no-sandbox', '--disable-gpu'] })
const results = []

for (const route of ROUTES) {
  for (const vp of VIEWPORTS) {
    const slug = route.replace(/\//g, '_') + vp.name
    const fa = `${OUT}/next${slug}.png`
    const fb = `${OUT}/astro${slug}.png`
    await shoot(browser, A, route, vp, fa)
    await shoot(browser, B, route, vp, fb)

    const a = PNG.sync.read(readFileSync(fa))
    const b = PNG.sync.read(readFileSync(fb))
    if (a.width !== b.width || a.height !== b.height) {
      results.push({ route, vp: vp.name, pct: null, note: `size ${a.width}x${a.height} vs ${b.width}x${b.height}` })
      continue
    }
    const diff = new PNG({ width: a.width, height: a.height })
    const changed = pixelmatch(a.data, b.data, diff.data, a.width, a.height, { threshold: 0.1 })
    writeFileSync(`${OUT}/diff${slug}.png`, PNG.sync.write(diff))
    results.push({ route, vp: vp.name, pct: +((changed / (a.width * a.height)) * 100).toFixed(2) })
  }
}

await browser.close()
for (const r of results) {
  console.log(`${r.route.padEnd(14)} ${r.vp.padEnd(8)} ${r.pct == null ? r.note : r.pct + '% different'}`)
}
writeFileSync(`${OUT}/results.json`, JSON.stringify(results, null, 2))
