'use client'
import { useEffect, useRef } from 'react'
import { useBackground, type SectionConfig } from '@/components/layout/SectionBackground'

type Props = SectionConfig & {
  id: string
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

export function Section({ id, bg, mode, dotColor, children, className, style }: Props) {
  const { register } = useBackground()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return
    return register(id, { bg, mode, dotColor }, ref.current)
  }, [id, bg, mode, dotColor, register])

  return (
    <section ref={ref} id={id} className={className} style={style}>
      {children}
    </section>
  )
}
