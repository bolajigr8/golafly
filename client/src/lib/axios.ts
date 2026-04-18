import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios'
import type { FieldError } from '@/types/auth.types'

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000',
  withCredentials: true,
  timeout: 10_000,
})

// Auth endpoints that should never trigger a redirect on 401
// (they handle their own errors in the UI)
const NO_REDIRECT_ENDPOINTS = [
  '/api/auth/me',
  '/api/auth/login',
  '/api/auth/register',
]

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    config.headers['Accept'] = 'application/json'
    config.headers['Content-Type'] = 'application/json'
    return config
  },
  (err) => Promise.reject(err),
)

apiClient.interceptors.response.use(
  (res) => res,
  (error: AxiosError<{ message?: string; errors?: FieldError[] }>) => {
    if (!error.response)
      return Promise.reject({
        message: 'Network error. Please check your connection.',
        status: 0,
      })

    const { status, data, config } = error.response

    const isNoRedirectEndpoint = NO_REDIRECT_ENDPOINTS.some((ep) =>
      config?.url?.includes(ep),
    )

    if (
      status === 401 &&
      !isNoRedirectEndpoint &&
      typeof window !== 'undefined'
    )
      window.location.href = '/login'

    return Promise.reject({
      message: data?.message ?? 'An unexpected error occurred.',
      errors: data?.errors,
      status,
    })
  },
)

export default apiClient
