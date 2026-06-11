'use client'
import { useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/Button'
import { Tooltip } from '@/components/ui/Tooltip'
import { extraLinks } from '@/lib/profile-links'

const COPY_FEEDBACK_MS = 2000

export function MoreLinksWindow() {
  const t = useTranslations('more')
  const [bubble, setBubble] = useState<{ index: number; text: string } | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) clearTimeout(timerRef.current)
    }
  }, [])

  const showBubble = (index: number, text: string, autoHide: boolean) => {
    setBubble({ index, text })
    if (timerRef.current !== null) clearTimeout(timerRef.current)
    timerRef.current = null
    if (autoHide) {
      timerRef.current = setTimeout(() => {
        setBubble(null)
        timerRef.current = null
      }, COPY_FEEDBACK_MS)
    }
  }

  const handleCopyContent = (content: string, index: number) => {
    navigator.clipboard.writeText(content).then(
      () => showBubble(index, t('copied'), true),
      // Clipboard blocked — show the value itself so it can be copied by hand;
      // stays open until clicked or the pointer leaves.
      () => showBubble(index, content, false)
    )
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
                {bubble?.index === index && (
                  <Tooltip show={true} component="span" onDismiss={() => setBubble(null)}>
                    {bubble.text}
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
