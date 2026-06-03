import { useTranslations } from 'next-intl'
import type { CurriculoAsset } from '@/lib/curriculo-assets'

interface Props {
  assets: CurriculoAsset[]
  locale: 'pt' | 'en'
}

export function Downloads({ assets, locale }: Props) {
  const t = useTranslations('resume.download')

  const filtered = assets.filter(a => a.locale === locale)
  if (filtered.length === 0) return null

  return (
    <section className="mt-12 border-t border-latte-surface1 pt-8">
      <p className="mb-4 font-mono text-sm text-latte-subtext">{t('label')}</p>
      <div className="flex flex-wrap gap-3">
        {filtered.map(asset => (
          <a
            key={asset.filename}
            href={asset.url}
            download
            className="border border-latte-surface1 bg-latte-base/70 px-4 py-2 font-mono text-sm
                       text-latte-blue transition-colors hover:border-latte-blue hover:bg-latte-base
                       backdrop-blur-sm"
          >
            ↓ {t(asset.format)}
          </a>
        ))}
      </div>
    </section>
  )
}
