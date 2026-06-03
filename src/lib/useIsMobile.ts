import { useMediaQuery } from '@/lib/use-media-query'

export const useIsMobile = () => useMediaQuery('(max-width: 768px)')
