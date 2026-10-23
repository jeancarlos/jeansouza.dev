import { useEffect, useRef, useState } from 'react'
import { useTranslations } from '../../i18n/react'
import { Icon } from '@/components/ui/Icon'
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
      () => showBubble(index, `${t('copied')} ${content}`, true),
      // Clipboard blocked — keep the value on screen so it can be copied by
      // hand; stays open until clicked or the pointer leaves.
      () => showBubble(index, content, false)
    )
  }

  return (
    <div className="text-brand-text p-4 text-sm">
      <h1 className="sr-only">{t('title')}</h1>
      <p className="text-brand-muted mb-3 text-xs" aria-hidden="true">
        $ ls more/
      </p>
      <ul className="space-y-2">
        {extraLinks.map((link, index) => (
          <li key={link.name} className="relative flex items-baseline gap-2 whitespace-nowrap">
            <span>{link.name}</span>
            <span
              aria-hidden="true"
              className="border-brand-muted/40 min-w-4 flex-1 translate-y-[-0.2em] border-b border-dotted"
            />
            {link.url ? (
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-from hover:text-brand-to underline"
              >
                {link.label ?? link.url}
              </a>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => link.content && handleCopyContent(link.content, index)}
                  aria-label={t('copy', { name: link.name })}
                  className="hover:text-brand-from inline-flex cursor-pointer items-baseline gap-2"
                >
                  {link.content}
                  <Icon name="copy" />
                </button>
                {bubble?.index === index && (
                  <Tooltip show component="span" align="end" onDismiss={() => setBubble(null)}>
                    {bubble.text}
                  </Tooltip>
                )}
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
