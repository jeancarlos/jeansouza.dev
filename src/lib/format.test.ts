import { describe, it, expect } from 'vitest'
import { DIRECTORY_PERMISSIONS } from './format'

describe('DIRECTORY_PERMISSIONS', () => {
  it('is the standard ls -l directory prefix', () => {
    expect(DIRECTORY_PERMISSIONS).toBe('drwxr-xr-x')
  })
})
