'use client'
import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Tooltip } from '@/components/ui/Tooltip'
import { links } from '@/components/ui/SocialLinks/constants'

const COPY_FEEDBACK_MS = 2000

// Show all links except GitHub (primary button in hero)
const extraLinks = links.filter((l) => l.name !== 'Source for this website')

export function MoreLinksWindow() {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) clearTimeout(timerRef.current)
    }
  }, [])

  const handleCopyContent = (content: string, index: number) => {
    void navigator.clipboard.writeText(content)
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
                  aria-label={`Copy ${link.name}`}
                >
                  <i className={`${link.icon} mr-1`} aria-hidden="true" />
                  {link.name}
                </Button>
                {copiedIndex === index && (
                  <Tooltip show={true} component="span">
                    Copied!
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
