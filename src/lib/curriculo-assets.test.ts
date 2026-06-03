import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockExistsSync = vi.fn()

vi.mock('node:fs', () => ({
  default: { existsSync: mockExistsSync },
  existsSync: mockExistsSync,
}))

const { getCurriculoAssets } = await import('./curriculo-assets')

describe('getCurriculoAssets', () => {
  beforeEach(() => mockExistsSync.mockReset())

  it('returns 4 assets when all files exist', () => {
    mockExistsSync.mockReturnValue(true)
    const assets = getCurriculoAssets()
    expect(assets).toHaveLength(4)
    expect(assets.map(a => a.format)).toEqual(['pdf', 'docx', 'pdf', 'docx'])
    expect(assets.map(a => a.locale)).toEqual(['pt', 'pt', 'en', 'en'])
  })

  it('returns empty array when no files exist', () => {
    mockExistsSync.mockReturnValue(false)
    expect(getCurriculoAssets()).toHaveLength(0)
  })

  it('returns only existing files (partial)', () => {
    mockExistsSync
      .mockReturnValueOnce(true)
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(true)
      .mockReturnValueOnce(false)
    const assets = getCurriculoAssets()
    expect(assets).toHaveLength(2)
    expect(assets[0].locale).toBe('pt')
    expect(assets[1].locale).toBe('en')
    expect(assets[0].format).toBe('pdf')
    expect(assets[1].format).toBe('pdf')
  })

  it('builds correct url from filename', () => {
    mockExistsSync.mockReturnValueOnce(true).mockReturnValue(false)
    const [asset] = getCurriculoAssets()
    expect(asset.url).toBe('/curriculo/jean-souza-curriculo-pt.pdf')
  })
})
