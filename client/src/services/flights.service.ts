import apiClient from '@/lib/axios'
import type {
  ApiResponse,
  PaginatedResponse,
  Flight,
  FlightQueryParams,
} from '@/types/data.types'
export const flightsService = {
  getFlights: async (p?: FlightQueryParams) =>
    (
      await apiClient.get<ApiResponse<PaginatedResponse<Flight>>>(
        '/api/flights',
        { params: p },
      )
    ).data,
  getFlightById: async (id: string) =>
    (await apiClient.get<ApiResponse<{ flight: Flight }>>(`/api/flights/${id}`))
      .data,
}
