import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/constants/queryKeys'
import { ticketsService } from '@/services/tickets.service'
import type { TicketQueryParams } from '@/types/data.types'
export function useTickets(p?: TicketQueryParams) {
  return useQuery({
    queryKey: queryKeys.tickets.list(p as Record<string, unknown>),
    queryFn: () => ticketsService.getTickets(p),
  })
}
export function useTicketById(id: string) {
  return useQuery({
    queryKey: queryKeys.tickets.detail(id),
    queryFn: () => ticketsService.getTicketById(id),
    enabled: Boolean(id),
  })
}
