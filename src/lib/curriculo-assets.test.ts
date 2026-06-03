import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockExistsSync = vi.fn()

vi.mock('node:fs', () => ({
  default: { existsSync: mockExistsSync },
  existsSync: mockExistsSync,
}))

const { getCurriculoAssets, getCurriculoAssetsServer } = await import('./curriculo-assets')

describe('getCurriculoAssets', () => {
  it('returns all 4 candidates with correct urls', () => {
    const assets = getCurriculoAssets()
    expect(assets).toHaveLength(4)
    expect(assets.map((a) => a.format)).toEqual(['pdf', 'docx', 'pdf', 'docx'])
    expect(assets.map((a) => a.locale)).toEqual(['pt', 'pt', 'en', 'en'])
  })

  it('builds correct url from filename', () => {
    const [asset] = getCurriculoAssets()
    expect(asset.url).toBe('/curriculo/jean-souza-curriculo-pt.pdf')
  })
})

describe('getCurriculoAssetsServer', () => {
  beforeEach(() => mockExistsSync.mockReset())

  it('returns 4 assets when all files exist', async () => {
    mockExistsSync.mockReturnValue(true)
    const assets = await getCurriculoAssetsServer()
    expect(assets).toHaveLength(4)
    expect(assets.map((a) => a.format)).toEqual(['pdf', 'docx', 'pdf', 'docx'])
    expect(assets.map((a) => a.locale)).toEqual(['pt', 'pt', 'en', 'en'])
  })

  it('returns empty array when no files exist', async () => {
    mockExistsSync.mockReturnValue(false)
    expect(await getCurriculoAssetsServer()).toHaveLength(0)
  })

  it('returns only existing files (partial)', async () => {
    mockExistsSync
      .mockReturnValueOnce(true)
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(true)
      .mockReturnValueOnce(false)
    const assets = await getCurriculoAssetsServer()
    expect(assets).toHaveLength(2)
    expect(assets[0].locale).toBe('pt')
    expect(assets[1].locale).toBe('en')
    expect(assets[0].format).toBe('pdf')
    expect(assets[1].format).toBe('pdf')
  })

  it('builds correct url from filename', async () => {
    mockExistsSync.mockReturnValueOnce(true).mockReturnValue(false)
    const [asset] = await getCurriculoAssetsServer()
    expect(asset.url).toBe('/curriculo/jean-souza-curriculo-pt.pdf')
  })
})
