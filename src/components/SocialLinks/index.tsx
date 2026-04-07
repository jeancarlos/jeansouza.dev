'use client'
import { useEffect, useState } from 'react'
import { Button } from '@/components/Button'
import { Tooltip } from '@/components/Tooltip'
import styles from './SocialLinks.module.css'
import { links, type LinkItem } from './constants'

interface SocialLinksProps {
  open: boolean
}

export function SocialLinks({ open }: SocialLinksProps) {
  const [showTooltip, setShowTooltip] = useState<boolean[]>([])

  useEffect(() => {
    setShowTooltip(links.map(() => false))
  }, [])

  const handleClick = (index: number) =>
    setShowTooltip((values) => values.map((_, i) => (index === i ? !values[i] : false)))

  const handleClose = () =>
    setShowTooltip((values) => values.map(() => false))

  const renderLink = (item: LinkItem, index: number) => {
    const key = item.name.replace(/\s/g, '')

    return (
      <li key={key} className={styles.item}>
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
    <ul className={`${styles.SocialLinks} ${open ? styles.open : ''}`}>
      {links.map(renderLink)}
    </ul>
  )
}
