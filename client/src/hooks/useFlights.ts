import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/constants/queryKeys'
import { flightsService } from '@/services/flights.service'
import type { FlightQueryParams } from '@/types/data.types'
export function useFlights(p?: FlightQueryParams) {
  return useQuery({
    queryKey: queryKeys.flights.list(p as Record<string, unknown>),
    queryFn: () => flightsService.getFlights(p),
  })
}
export function useFlightById(id: string) {
  return useQuery({
    queryKey: queryKeys.flights.detail(id),
    queryFn: () => flightsService.getFlightById(id),
    enabled: Boolean(id),
  })
}
