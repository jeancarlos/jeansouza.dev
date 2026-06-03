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
            className="group relative inline-block rounded-full bg-gradient-to-r from-[#e84545] to-[#b33a73] p-[2px] shadow-sm transition-all duration-150 ease-out hover:brightness-110 hover:shadow-md active:scale-90"
          >
            <span className="block rounded-full bg-[#3e3353] px-3 py-1.5 text-sm text-[#f2b8d4] transition-colors duration-150 group-hover:bg-transparent group-hover:text-white">
              ↓ {t(asset.format)}
            </span>
          </a>
        ))}
      </div>
    </section>
  )
}
