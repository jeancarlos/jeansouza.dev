#!/usr/bin/env node
import { readFile, readdir } from 'node:fs/promises'
import { join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(fileURLToPath(import.meta.url), '..', '..')
const SCAN_DIRS = ['src']
const SELF = fileURLToPath(import.meta.url)
const SCAN_EXTS = new Set(['.ts', '.tsx', '.js', '.cjs', '.mjs'])
const SKIP = new Set(['node_modules', '.next', 'dist', '.claude', 'docs', 'coverage', 'public'])

const rules = [
  {
    id: 'eslint-disable',
    title: 'eslint-disable comment',
    pattern: /eslint-disable/i,
    severity: 'high',
    note: 'Refactor instead of suppressing the rule.',
  },
  {
    id: 'any-type',
    title: 'explicit any type',
    pattern: /:\s*any\b|\bas\s+any\b|<any>/i,
    severity: 'high',
    note: 'Use unknown, generics, or a specific type.',
  },
  {
    id: 'ts-ignore',
    title: '@ts-ignore / @ts-expect-error',
    pattern: /@ts-(ignore|expect-error|nocheck)\b/,
    severity: 'high',
    note: 'Fix the type error instead of suppressing it.',
  },
  {
    id: 'non-null-assertion',
    title: 'non-null assertion (!)',
    pattern: /\w!\.\w|\w!\[|\w\)\!\.|\w\)\!\[|!\s*[;),.\]]/,
    severity: 'medium',
    note: 'Verify the value is non-null or use a guard.',
  },
  {
    id: 'dangerously-set',
    title: 'dangerouslySetInnerHTML / innerHTML',
    pattern: /dangerouslySetInnerHTML|\.innerHTML\s*=/,
    severity: 'medium',
    note: 'Sanitize or use a typed component.',
  },
  {
    id: 'console',
    title: 'console statement',
    pattern: /\bconsole\.(log|info|debug|warn)\b/,
    severity: 'low',
    note: 'Remove or route through a proper logger.',
  },
  {
    id: 'todo',
    title: 'TODO/FIXME/HACK marker',
    pattern: /\b(TODO|FIXME|HACK|XXX)\b/,
    severity: 'medium',
    note: 'Resolve or convert to a tracked issue.',
  },
  {
    id: 'debugger',
    title: 'debugger statement',
    pattern: /^\s*debugger\s*;?$/m,
    severity: 'high',
    note: 'Remove the breakpoint before commit.',
  },
  {
    id: 'magic-color',
    title: 'hardcoded hex color in CSS context',
    pattern:
      /(?:background|color|fill|stroke|border)[^a-zA-Z0-9]*[:=][^a-zA-Z0-9]*['"]?#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\b|className=[^=]*\[#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})\b/,
    severity: 'low',
    note: 'Move to a CSS variable or design token.',
  },
  {
    id: 'inline-style',
    title: 'static inline style in JSX (should be className)',
    // Match `style={{ ... }}` whose values are all string/number literals
    // (no expressions, ternaries, template literals, or variable refs).
    // Dynamic styles (with variables or expressions) are intentional.
    pattern:
      /style=\{\{[^}]*\b(?:width|height|top|left|right|bottom|margin|padding|color|background|border)\w*\s*:\s*(?:"[^"]+"|'[^']+'|\d+(?:\.\d+)?)[^}]*\}\}/,
    severity: 'low',
    note: 'Static CSS values belong in className or CSS variables.',
  },
]

let findings = []

async function walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (SKIP.has(entry.name)) continue
    const full = join(dir, entry.name)
    if (entry.isDirectory()) {
      await walk(full)
    } else if (entry.isFile()) {
      const ext = full.slice(full.lastIndexOf('.'))
      if (SCAN_EXTS.has(ext)) await scan(full)
    }
  }
}

async function scan(path) {
  if (path === SELF) return
  const content = await readFile(path, 'utf8')
  const lines = content.split('\n')
  const rel = relative(ROOT, path)

  if (lines.length > 250) {
    findings.push({
      id: 'long-file',
      title: `file is ${lines.length} lines`,
      file: rel,
      line: 1,
      severity: 'low',
      note: 'Split into smaller modules.',
    })
  }

  lines.forEach((line, idx) => {
    for (const rule of rules) {
      if (rule.pattern.test(line)) {
        findings.push({
          id: rule.id,
          title: rule.title,
          file: rel,
          line: idx + 1,
          severity: rule.severity,
          note: rule.note,
        })
      }
    }
  })
}

await Promise.all(SCAN_DIRS.map((d) => walk(join(ROOT, d))))

const sevOrder = { critical: 0, high: 1, medium: 2, low: 3 }
findings.sort((a, b) => sevOrder[a.severity] - sevOrder[b.severity])

const counts = findings.reduce(
  (acc, f) => ({ ...acc, [f.severity]: (acc[f.severity] ?? 0) + 1 }),
  {}
)

console.log(`\nMaintainability scan: ${findings.length} findings`)
console.log(
  `  critical: ${counts.critical ?? 0}  high: ${counts.high ?? 0}  medium: ${counts.medium ?? 0}  low: ${counts.low ?? 0}\n`
)

if (findings.length > 0) {
  const grouped = new Map()
  for (const f of findings) {
    if (!grouped.has(f.id)) {
      const rule = rules.find((r) => r.id === f.id)
      grouped.set(f.id, {
        severity: rule?.severity ?? f.severity,
        title: rule?.title ?? f.title,
        items: [],
      })
    }
    grouped.get(f.id).items.push(f)
  }
  for (const [, info] of grouped) {
    console.log(`[${info.severity.toUpperCase()}] ${info.title} (${info.items.length})`)
    for (const it of info.items.slice(0, 8)) {
      console.log(`  ${it.file}:${it.line}`)
    }
    if (info.items.length > 8) console.log(`  ... and ${info.items.length - 8} more`)
    console.log()
  }
  process.exit(counts.critical || counts.high ? 1 : 0)
} else {
  console.log('Clean.\n')
  process.exit(0)
}
