import { joinClassNames } from '@/lib/utils'

interface TimelineDotProps {
  side: 'left' | 'right'
}

/**
 * Decorative SVG connector that curves toward the card.
 * On desktop (`@4xl`), the "left" side card is to the left of the rail,
 * so we mirror horizontally to keep the curve pointing at the card.
 */
export function TimelineDot({ side }: TimelineDotProps) {
  return (
    <span
      aria-hidden
      className={joinClassNames(
        'absolute top-0',
        // Mobile: always right of the rail, pointing right
        'left-[-21px]',
        // Desktop alternating layout
        side === 'left'
          ? '@4xl:right-[-21px] @4xl:left-auto @4xl:[transform:scaleX(-1)]'
          : '@4xl:left-[-21px]'
      )}
    >
      <svg
        width="18"
        height="47"
        viewBox="0 0 4.7871715 12.38686"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-brand-from"
      >
        <path
          d="M 4.5225882,0 V 2.1901275 c 0,7.6525011 -4.2825462,6.0043265 -4.2578957,3.8902424 C 0.28073845,3.9663059 4.5225882,2.3463853 4.5225882,9.8194826 v 2.567407"
          stroke="currentColor"
          strokeWidth="0.529167"
          strokeLinejoin="bevel"
        />
      </svg>
    </span>
  )
}
