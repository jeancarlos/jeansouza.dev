export type CurriculoLocale = 'pt' | 'en'

export interface CurriculoAsset {
  locale: CurriculoLocale
  format: 'pdf' | 'docx'
  filename: string
  url: string
}

const CANDIDATES: Omit<CurriculoAsset, 'url'>[] = [
  { locale: 'pt', format: 'pdf', filename: 'jean-souza-curriculo-pt.pdf' },
  { locale: 'pt', format: 'docx', filename: 'jean-souza-curriculo-pt.docx' },
  { locale: 'en', format: 'pdf', filename: 'jean-souza-resume-en.pdf' },
  { locale: 'en', format: 'docx', filename: 'jean-souza-resume-en.docx' },
]

/** Returns all candidate curriculo assets with their public URLs.
 *  Availability checks (existsSync) must be done server-side via getCurriculoAssetsServer. */
export function getCurriculoAssets(): CurriculoAsset[] {
  return CANDIDATES.map((c) => ({ ...c, url: `/curriculo/${c.filename}` }))
}

/** Server-only: filters assets to those that actually exist on disk. */
export async function getCurriculoAssetsServer(): Promise<CurriculoAsset[]> {
  const { existsSync } = await import('node:fs')
  const { join } = await import('node:path')
  const BASE = join(process.cwd(), 'public', 'curriculo')
  return getCurriculoAssets().filter((c) => existsSync(join(BASE, c.filename)))
}
