/**
 * Marker centered on the timeline rail. Lives in the same fixed-width
 * grid column as the rail, so both share one coordinate system and stay
 * aligned at any viewport width.
 */
export function TimelineDot() {
  return (
    <span aria-hidden className="relative col-start-1 row-start-1 @4xl:col-start-2">
      <span className="border-brand-from bg-crust absolute top-0 left-1/2 size-3 -translate-x-1/2 rounded-full border-2" />
    </span>
  )
}
