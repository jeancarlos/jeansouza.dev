'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Tooltip } from '@/components/ui/Tooltip'
import { links } from '@/components/ui/SocialLinks/constants'

// Show all links except GitHub (primary button in hero)
const extraLinks = links.filter((l) => l.name !== 'Source for this website')

export function MoreLinksWindow() {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const handleCopyContent = (content: string, index: number) => {
    void navigator.clipboard.writeText(content)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  return (
    <div className="space-y-2 p-4 text-sm text-[#f2b8d4]">
      <p className="mb-3 text-xs text-[#b33a73]">$ ls more/</p>
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
