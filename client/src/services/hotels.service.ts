import apiClient from '@/lib/axios'
import type {
  ApiResponse,
  PaginatedResponse,
  Hotel,
  HotelQueryParams,
} from '@/types/data.types'
export const hotelsService = {
  getHotels: async (p?: HotelQueryParams) =>
    (
      await apiClient.get<ApiResponse<PaginatedResponse<Hotel>>>(
        '/api/hotels',
        { params: p },
      )
    ).data,
  getHotelById: async (id: string) =>
    (await apiClient.get<ApiResponse<{ hotel: Hotel }>>(`/api/hotels/${id}`))
      .data,
}
