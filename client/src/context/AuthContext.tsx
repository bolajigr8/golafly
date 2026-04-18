'use client'
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { authService } from '@/services/auth.service'
import type { User } from '@/types/auth.types'

interface AuthContextValue {
  user: User | null
  isLoading: boolean
  setUser: (u: User | null) => void
  logout: () => Promise<void>
}
const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    authService
      .getMe()
      .then(setUserState)
      .catch(() => setUserState(null))
      .finally(() => setIsLoading(false))
  }, [])

  const logout = useCallback(async () => {
    try {
      await authService.logout()
    } catch {}
    setUserState(null)
    toast.success('Logged out successfully. See you next match! 👋')
    router.push('/login')
  }, [router])

  const setUser = useCallback((u: User | null) => setUserState(u), [])

  return (
    <AuthContext.Provider value={{ user, isLoading, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
