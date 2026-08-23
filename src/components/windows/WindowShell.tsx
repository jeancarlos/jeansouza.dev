import { useId, useState, type ReactNode } from 'react'
import { SURFACES, type SurfaceId } from './surfaces'

interface Props {
  id: SurfaceId
  label: string
  initialOpen?: boolean
  children: ReactNode
}

/**
 * The framing around a window's content. The content itself is rendered by
 * Astro and arrives as `children`, so it exists in the HTML whether or not
 * this island ever hydrates.
 *
 * A closed window is hidden, never unmounted. That is what keeps the page
 * complete without JavaScript and keeps the landmarks visible to axe.
 */
export function WindowShell({ id, label, initialOpen = false, children }: Props) {
  const spec = SURFACES[id]
  const [open, setOpen] = useState(initialOpen)
  const titleId = useId()

  return (
    <section
      role={spec.role}
      aria-labelledby={titleId}
      hidden={!open}
      data-window={id}
      data-testid={`window-${id}`}
    >
      <h2 id={titleId}>{label}</h2>

      {/*
        A container that scrolls but cannot be focused is unreachable by
        keyboard — axe calls it scrollable-region-focusable, and it is a 2.1.1
        failure, not a stylistic note. A focusable group also needs a name.
      */}
      <div
        data-testid={`window-body-${id}`}
        role={spec.scrollable ? 'group' : undefined}
        aria-labelledby={spec.scrollable ? titleId : undefined}
        tabIndex={spec.scrollable ? 0 : undefined}
      >
        {children}
      </div>

      <button type="button" onClick={() => setOpen(false)}>
        {label} — fechar
      </button>
    </section>
  )
}
