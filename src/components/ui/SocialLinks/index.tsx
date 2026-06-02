'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Tooltip } from '@/components/ui/Tooltip'
import { links, type LinkItem } from './constants'

interface SocialLinksProps {
  open: boolean
}

export function SocialLinks({ open }: SocialLinksProps) {
  const [showTooltip, setShowTooltip] = useState<boolean[]>(() => links.map(() => false))

  const handleClick = (index: number) =>
    setShowTooltip((values) => values.map((_, i) => (index === i ? !values[i] : false)))

  const handleClose = () => setShowTooltip((values) => values.map(() => false))

  const renderLink = (item: LinkItem, index: number) => {
    const key = item.name.replace(/\s/g, '')

    return (
      <li key={key} className="relative z-4 mx-1 mb-2">
        {item.content ? (
          <>
            <Button onClick={() => handleClick(index)}>
              <i className={`${item.icon} mr-1`} /> {item.name}
            </Button>
            <Tooltip component="span" show={showTooltip[index]} onMouseLeave={handleClose}>
              {item.content}
            </Tooltip>
          </>
        ) : (
          <Button href={item.url}>
            <i className={`${item.icon} mr-1`} /> {item.name}
          </Button>
        )}
      </li>
    )
  }

  return (
    <ul
      className={`relative z-2 m-0 flex origin-top transform list-none flex-wrap items-start justify-center p-0 transition-all duration-200 ease-in-out ${
        open ? 'max-h-[1000px] scale-100 opacity-100' : 'max-h-0 scale-75 opacity-0'
      }`}
    >
      {links.map(renderLink)}
    </ul>
  )
}
