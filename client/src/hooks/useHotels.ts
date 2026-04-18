import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/constants/queryKeys'
import { hotelsService } from '@/services/hotels.service'
import type { HotelQueryParams } from '@/types/data.types'
export function useHotels(p?: HotelQueryParams) {
  return useQuery({
    queryKey: queryKeys.hotels.list(p as Record<string, unknown>),
    queryFn: () => hotelsService.getHotels(p),
  })
}
export function useHotelById(id: string) {
  return useQuery({
    queryKey: queryKeys.hotels.detail(id),
    queryFn: () => hotelsService.getHotelById(id),
    enabled: Boolean(id),
  })
}
