import apiClient from '@/lib/axios'
import type { AuthResponse, User } from '@/types/auth.types'
import type {
  RegisterFormData,
  LoginFormData,
} from '@/validators/auth.validators'

export const authService = {
  register: async (data: RegisterFormData): Promise<AuthResponse> =>
    (await apiClient.post<AuthResponse>('/api/auth/register', data)).data,
  login: async (data: LoginFormData): Promise<AuthResponse> =>
    (await apiClient.post<AuthResponse>('/api/auth/login', data)).data,
  logout: async (): Promise<void> => {
    await apiClient.post('/api/auth/logout')
  },
  getMe: async (): Promise<User> =>
    (
      await apiClient.get<{
        success: boolean
        message: string
        data: { user: User }
      }>('/api/auth/me')
    ).data.data.user,
}
