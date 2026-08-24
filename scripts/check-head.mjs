import { readFileSync } from 'node:fs'

const file = process.argv[2]
const html = readFileSync(file, 'utf8')

const required = [
  [/<link rel="canonical" href="https:\/\/jeansouza\.dev\/[^"]+"/, 'canonical'],
  [/<link rel="alternate" hreflang="pt-BR" href="https:\/\/jeansouza\.dev\/pt\//, 'hreflang pt-BR'],
  [/<link rel="alternate" hreflang="en-US" href="https:\/\/jeansouza\.dev\/en\//, 'hreflang en-US'],
  [/<link rel="alternate" hreflang="x-default"/, 'hreflang x-default'],
  [/<meta name="description" content="[^"]+"/, 'description'],
  [/<html lang="(pt-BR|en-US)"/, 'html lang'],
  [/<meta property="og:title" content="[^"]+"/, 'og:title'],
  [/<meta property="og:url" content="[^"]+"/, 'og:url'],
]

const missing = required.filter(([re]) => !re.test(html)).map(([, name]) => name)
console.log(missing.length ? `${file}: missing ${missing.join(', ')}` : 'ok')
process.exit(missing.length ? 1 : 0)
