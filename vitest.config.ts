import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    exclude: ['**/node_modules/**', '**/.worktrees/**'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['**/*.test.*', 'src/test/**', 'src/content.config.ts'],
      thresholds: { statements: 90, branches: 90, functions: 90, lines: 90 },
    },
  },
  resolve: {
    alias: [
      { find: 'astro:content', replacement: path.resolve(__dirname, './src/test/astroContent.ts') },
      { find: 'astro:assets', replacement: path.resolve(__dirname, './src/test/astroAssets.ts') },
      { find: '@', replacement: path.resolve(__dirname, './src') },
    ],
  },
})
