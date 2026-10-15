import { useMediaQuery } from '@/lib/use-media-query'

export const useIsMobile = () => useMediaQuery('(width < 48rem)')
