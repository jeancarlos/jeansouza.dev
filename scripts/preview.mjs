// Static preview server for the production export (out/), mimicking how
// GitHub Pages serves it: directory indexes and the custom 404.html page.
// Usage: npm run preview [-- port]
import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { join, normalize, extname } from 'node:path'

const ROOT = join(import.meta.dirname, '..', 'out')
const PORT = Number(process.argv[2] ?? 3200)

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml',
  '.woff2': 'font/woff2',
  '.pdf': 'application/pdf',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
}

async function tryRead(path) {
  try {
    return await readFile(path)
  } catch {
    return null
  }
}

createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost')
  const safePath = normalize(decodeURIComponent(url.pathname)).replace(/^(\.\.[/\\])+/, '')

  const candidates = safePath.endsWith('/')
    ? [join(ROOT, safePath, 'index.html')]
    : [join(ROOT, safePath), join(ROOT, `${safePath}.html`), join(ROOT, safePath, 'index.html')]

  for (const candidate of candidates) {
    const body = await tryRead(candidate)
    if (body) {
      res.writeHead(200, {
        'content-type': TYPES[extname(candidate)] ?? 'application/octet-stream',
      })
      res.end(body)
      return
    }
  }

  const notFound = await tryRead(join(ROOT, '404.html'))
  res.writeHead(404, { 'content-type': 'text/html; charset=utf-8' })
  res.end(notFound ?? '404')
}).listen(PORT, () => {
  console.log(`preview: serving out/ at http://localhost:${PORT} (404 -> 404.html)`)
})
