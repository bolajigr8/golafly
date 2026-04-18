import apiClient from '@/lib/axios'
import type {
  ApiResponse,
  PaginatedResponse,
  Ticket,
  TicketQueryParams,
} from '@/types/data.types'
export const ticketsService = {
  getTickets: async (p?: TicketQueryParams) =>
    (
      await apiClient.get<ApiResponse<PaginatedResponse<Ticket>>>(
        '/api/tickets',
        { params: p },
      )
    ).data,
  getTicketById: async (id: string) =>
    (await apiClient.get<ApiResponse<{ ticket: Ticket }>>(`/api/tickets/${id}`))
      .data,
}
