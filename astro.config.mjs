// @ts-check
import { defineConfig } from 'astro/config'
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
  vite: { plugins: [tailwind()] },
})