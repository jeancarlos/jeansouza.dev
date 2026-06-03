'use client'
import { useTranslations } from 'next-intl'
import type { CurriculoAsset } from '@/lib/curriculo-assets'

interface Props {
  assets: CurriculoAsset[]
  locale: 'pt' | 'en'
}

export function Downloads({ assets, locale }: Props) {
  const t = useTranslations('resume.download')

  const filtered = assets.filter((a) => a.locale === locale)
  if (filtered.length === 0) return null

  return (
    <section className="border-surface mt-12 border-t pt-8">
      <p className="text-subtext mb-4 font-mono text-sm">{t('label')}</p>
      <div className="flex flex-wrap gap-3">
        {filtered.map((asset) => (
          <a
            key={asset.filename}
            href={asset.url}
            download
            className="border-surface bg-base/60 text-brand-text hover:border-brand-from hover:bg-surface border px-4 py-2 font-mono text-sm backdrop-blur-sm transition-colors"
          >
            ↓ {t(asset.format)}
          </a>
        ))}
      </div>
    </section>
  )
}
