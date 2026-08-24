import path from 'node:path'
import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

const nextConfig: NextConfig = {
  output: 'export',
  // src/pages/ belongs to Astro during the migration. Restricting Next to .tsx
  // stops it claiming Astro's .ts endpoints as Pages Router routes; sitemap and
  // robots moved to Astro, so nothing of Next's is lost.
  pageExtensions: ['tsx'],
  trailingSlash: true,
  outputFileTracingRoot: path.join(__dirname),
  images: {
    unoptimized: true,
  },
  allowedDevOrigins: ['192.168.100.*'],
}

export default withNextIntl(nextConfig)
