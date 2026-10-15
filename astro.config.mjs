// @ts-check
import { defineConfig, fontProviders } from 'astro/config'
import tailwind from '@tailwindcss/vite'

import react from '@astrojs/react'

export default defineConfig({
  site: 'https://jeansouza.dev',
  trailingSlash: 'always',
  build: { format: 'directory', inlineStylesheets: 'always' },
  i18n: {
    locales: ['pt', 'en'],
    defaultLocale: 'pt',
    routing: { prefixDefaultLocale: true, redirectToDefaultLocale: false },
  },
  integrations: [react()],
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Poppins',
      cssVariable: '--font-poppins',
      weights: [500, 700],
      subsets: ['latin'],
      styles: ['normal'],
      display: 'optional',
    },
    {
      provider: fontProviders.google(),
      name: 'Space Grotesk',
      cssVariable: '--font-space-grotesk',
      weights: [400, 500, 700],
      subsets: ['latin'],
      styles: ['normal'],
      display: 'optional',
    },
    {
      provider: fontProviders.google(),
      name: 'JetBrains Mono',
      cssVariable: '--font-jetbrains-mono',
      weights: [400, 700],
      subsets: ['latin'],
      styles: ['normal'],
      display: 'optional',
    },
  ],
  vite: { plugins: [tailwind()] },
})
