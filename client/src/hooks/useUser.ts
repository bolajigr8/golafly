import { useAuth } from '@/context/AuthContext'
import type { User } from '@/types/auth.types'
export function useUser(): User {
  const { user } = useAuth()
  if (!user) throw new Error('useUser: no authenticated user found')
  return user
}
