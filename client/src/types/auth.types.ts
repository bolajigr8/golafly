export interface User {
  id: string
  fullName: string
  email: string
  createdAt: string
  updatedAt?: string
}
export interface AuthResponse {
  success: boolean
  message: string
  data: { user: User }
}
export interface ApiErrorResponse {
  success: false
  message: string
  errors?: { field: string; message: string }[]
}
export interface FieldError {
  field: string
  message: string
}
export interface StructuredError {
  message: string
  errors?: FieldError[]
  status: number
}
