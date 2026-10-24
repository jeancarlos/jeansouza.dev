// @ts-check
import { defineConfig, fontProviders } from 'astro/config'
import tailwind from '@tailwindcss/vite'

import react from '@astrojs/react'
import afterPaint from './src/directives/integration.mjs'

export default defineConfig({
  site: 'https://jeansouza.dev',
  trailingSlash: 'always',
  build: { format: 'directory', inlineStylesheets: 'always' },
  i18n: {
    locales: ['pt', 'en'],
    defaultLocale: 'pt',
    routing: { prefixDefaultLocale: true, redirectToDefaultLocale: false },
  },
  integrations: [react(), afterPaint()],
  fonts: [
    {
      provider: fontProviders.local(),
      name: 'Poppins',
      cssVariable: '--font-poppins',
      display: 'swap',
      options: {
        variants: [
          { src: ['./src/assets/fonts/poppins-500.woff2'], weight: 500, style: 'normal' },
          { src: ['./src/assets/fonts/poppins-700.woff2'], weight: 700, style: 'normal' },
        ],
      },
    },
    {
      provider: fontProviders.local(),
      name: 'Lexend',
      cssVariable: '--font-lexend',
      display: 'swap',
      options: {
        variants: [
          { src: ['./src/assets/fonts/lexend-400.woff2'], weight: 400, style: 'normal' },
          { src: ['./src/assets/fonts/lexend-700.woff2'], weight: 700, style: 'normal' },
        ],
      },
    },
    {
      provider: fontProviders.local(),
      name: 'JetBrains Mono',
      cssVariable: '--font-jetbrains-mono',
      display: 'swap',
      options: {
        variants: [
          {
            src: ['./src/assets/fonts/jetbrains-mono-latin.woff2'],
            weight: '100 800',
            style: 'normal',
          },
        ],
      },
    },
  ],
  vite: { plugins: [tailwind()] },
})
