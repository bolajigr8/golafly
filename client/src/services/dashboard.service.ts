import apiClient from '@/lib/axios'
import type { ApiResponse, DashboardOverview } from '@/types/data.types'
export const dashboardService = {
  getOverview: async () =>
    (
      await apiClient.get<ApiResponse<DashboardOverview>>(
        '/api/dashboard/overview',
      )
    ).data,
}
