// @ts-check
import { defineConfig, fontProviders } from 'astro/config'
import tailwind from '@tailwindcss/vite'

import react from '@astrojs/react';

// `trailingSlash: 'always'` plus `build.format: 'directory'` reproduce the URL
// shape Next's static export emits. `prefixDefaultLocale: true` is what keeps
// `/pt/` a real route instead of collapsing it into the root.
export default defineConfig({
  site: 'https://jeansouza.dev',
  trailingSlash: 'always',
  build: { format: 'directory' },
  i18n: {
    locales: ['pt', 'en'],
    defaultLocale: 'pt',
    routing: { prefixDefaultLocale: true, redirectToDefaultLocale: false },
  },
  integrations: [react()],
  // Self-hosted, matching what next/font/google produced: same families, same
  // weights, same CSS variable names, so globals.css needs no change.
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Poppins',
      cssVariable: '--font-poppins',
      weights: [500, 700],
      subsets: ['latin'],
      styles: ['normal'],
    },
    {
      provider: fontProviders.google(),
      name: 'Space Grotesk',
      cssVariable: '--font-space-grotesk',
      weights: [400, 500, 700],
      subsets: ['latin'],
      styles: ['normal'],
    },
    {
      provider: fontProviders.google(),
      name: 'JetBrains Mono',
      cssVariable: '--font-jetbrains-mono',
      weights: [400, 700],
      subsets: ['latin'],
      styles: ['normal'],
    },
  ],
  vite: { plugins: [tailwind()] },
})