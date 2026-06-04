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
        'bg-crust absolute top-[-18px] left-[-9px] h-[48px] w-[18px]',
        side === 'left'
          ? '@4xl:right-[-17px] @4xl:left-auto @4xl:rotate-180'
          : '@4xl:left-[-17px]'
      )}
    >
      <svg
        width="18"
        height="48"
        viewBox="0 0 4.762501 12.7"
        version="1.1"
        id="svg1"
        xmlns="http://www.w3.org/2000/svg">
        <defs
          id="defs1" />
        <g
          id="layer1"
          transform="translate(-7.9085903,-0.01571937)">
          <path
            stroke="#e84545"
            strokeWidth="0.533958"
            d="m 8.1755697,12.715719 v -2.245494 c 0,-7.8459563 4.2529153,-6.1561157 4.2284353,-3.9885875 C 12.379524,8.6491657 8.1755697,10.298362 8.1755697,2.6480152 V 0.01571937"
            id="path1" />
        </g>
      </svg>
    </span>
  )
}
