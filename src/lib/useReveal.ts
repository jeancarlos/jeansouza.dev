import { useEffect, useRef, useState } from 'react'

export function useReveal<T extends Element>() {
  const ref = useRef<T>(null)
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const still =
      typeof matchMedia === 'function' ? matchMedia('(prefers-reduced-motion: reduce)') : null
    if (still?.matches) return
    let seen = false
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setHidden(false)
            io.disconnect()
          } else if (!seen) {
            setHidden(true)
          }
          seen = true
        }
      },
      { rootMargin: '-80px 0px 0px 0px' }
    )
    const reveal = () => {
      if (!still?.matches) return
      setHidden(false)
      io.disconnect()
    }
    io.observe(el)
    still?.addEventListener('change', reveal)
    return () => {
      io.disconnect()
      still?.removeEventListener('change', reveal)
    }
  }, [])

  return [ref, hidden] as const
}
