import { joinClassNames } from '@/lib/utils'

export type ConnectorStyle = 'solid' | 'dotted' | 'none'

interface TimelineDotProps {
  /** Connector from the top of the row down to the dot. */
  above: ConnectorStyle
  /** Connector from the dot down to the bottom of the row. */
  below: ConnectorStyle
}

function connectorClass(style: ConnectorStyle) {
  if (style === 'none') return 'hidden'
  return style === 'dotted' ? 'border-dotted' : 'border-solid'
}

/**
 * Marker centered on the timeline rail. Dot and connectors live in the same
 * fixed-width grid column on every row, so the segments stack into one
 * continuous line at any viewport width. Dotted segments mark the start of
 * the career.
 */
export function TimelineDot({ above, below }: TimelineDotProps) {
  return (
    <span aria-hidden className="relative col-start-1 row-start-1 @4xl:col-start-2">
      <span
        className={joinClassNames(
          'border-brand-from absolute top-0 left-1/2 h-1.5 w-0 -translate-x-1/2 border-l-2',
          connectorClass(above)
        )}
      />
      <span className="border-brand-from bg-crust absolute top-0 left-1/2 z-10 size-3 -translate-x-1/2 rounded-full border-2" />
      <span
        className={joinClassNames(
          'border-brand-from absolute top-1.5 bottom-0 left-1/2 w-0 -translate-x-1/2 border-l-2',
          connectorClass(below)
        )}
      />
    </span>
  )
}
