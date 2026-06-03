import { existsSync } from 'node:fs'
import { join } from 'node:path'

export type CurriculoLocale = 'pt' | 'en'
export type CurriculoFormat = 'pdf' | 'docx'

export interface CurriculoAsset {
  locale: CurriculoLocale
  format: CurriculoFormat
  filename: string
  url: string
}

// `process.cwd()` resolves to the repo root in:
//   - next build (Vercel)
//   - next dev
//   - vitest (configured in vitest.config.ts)
// This module is only imported by server components (ResumeWindow), never the client.
const BASE = join(process.cwd(), 'public', 'curriculo')

const CANDIDATES: Omit<CurriculoAsset, 'url'>[] = [
  { locale: 'pt', format: 'pdf',  filename: 'jean-souza-curriculo-pt.pdf' },
  { locale: 'pt', format: 'docx', filename: 'jean-souza-curriculo-pt.docx' },
  { locale: 'en', format: 'pdf',  filename: 'jean-souza-resume-en.pdf' },
  { locale: 'en', format: 'docx', filename: 'jean-souza-resume-en.docx' },
]

export function getCurriculoAssets(): CurriculoAsset[] {
  return CANDIDATES
    .filter(c => existsSync(join(BASE, c.filename)))
    .map(c => ({ ...c, url: `/curriculo/${c.filename}` }))
}
