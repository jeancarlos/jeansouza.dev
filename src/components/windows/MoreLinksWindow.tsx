'use client'
import { useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/Button'
import { Tooltip } from '@/components/ui/Tooltip'
import { extraLinks } from '@/lib/profile-links'

const COPY_FEEDBACK_MS = 2000

export function MoreLinksWindow() {
  const t = useTranslations('more')
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) clearTimeout(timerRef.current)
    }
  }, [])

  const handleCopyContent = (content: string, index: number) => {
    navigator.clipboard.writeText(content).catch(() => {
      // Clipboard permission denied — the bubble still shows the value copied.
    })
    setCopiedIndex(index)
    if (timerRef.current !== null) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      setCopiedIndex(null)
      timerRef.current = null
    }, COPY_FEEDBACK_MS)
  }

  return (
    <div className="text-brand-text space-y-2 p-4 text-sm">
      <p className="text-brand-to mb-3 text-xs">$ ls more/</p>
      <div className="flex flex-wrap gap-2">
        {extraLinks.map((link, index) => (
          <div key={link.name} className="relative">
            {link.url ? (
              <Button href={link.url}>
                <i className={`${link.icon} mr-1`} aria-hidden="true" />
                {link.name}
              </Button>
            ) : (
              <>
                <Button
                  onClick={() => link.content && handleCopyContent(link.content, index)}
                  aria-label={t('copy', { name: link.name })}
                >
                  <i className={`${link.icon} mr-1`} aria-hidden="true" />
                  {link.name}
                </Button>
                {copiedIndex === index && (
                  <Tooltip show={true} component="span">
                    {t('copied')}
                  </Tooltip>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
