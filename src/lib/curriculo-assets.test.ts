import { describe, it, expect, vi, beforeEach } from 'vitest'

const existsSyncMock = vi.hoisted(() => vi.fn())
const cwdMock = vi.hoisted(() => vi.fn(() => '/repo'))

vi.mock('node:fs', () => ({
  existsSync: existsSyncMock,
  default: { existsSync: existsSyncMock },
}))
vi.mock('node:path', () => {
  const join = (...parts: string[]) => parts.join('/')
  return { join, default: { join } }
})

import { getCurriculoAssets } from './curriculo-assets'

const FILES = [
  'jean-souza-curriculo-pt.pdf',
  'jean-souza-curriculo-pt.docx',
  'jean-souza-resume-en.pdf',
  'jean-souza-resume-en.docx',
]

beforeEach(() => {
  existsSyncMock.mockReset()
  vi.stubGlobal('process', { ...process, cwd: cwdMock })
})

describe('getCurriculoAssets', () => {
  it('returns 4 assets when all files exist', () => {
    existsSyncMock.mockReturnValue(true)
    const assets = getCurriculoAssets()
    expect(assets).toHaveLength(4)
    expect(assets.map(a => a.url)).toEqual(FILES.map(f => `/curriculo/${f}`))
  })

  it('returns empty when folder is missing', () => {
    existsSyncMock.mockReturnValue(false)
    expect(getCurriculoAssets()).toEqual([])
  })

  it('returns only the existing files when partial', () => {
    existsSyncMock.mockImplementation((p: string) =>
      p.endsWith('jean-souza-curriculo-pt.pdf')
    )
    const assets = getCurriculoAssets()
    expect(assets).toHaveLength(1)
    expect(assets[0]?.locale).toBe('pt')
    expect(assets[0]?.format).toBe('pdf')
  })
})
