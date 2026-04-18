'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'

import type { User } from '@/types/auth.types'
import { Sidebar } from './Sidebar'
import { MobileSidebar } from './MobileSidebar'
import { Header } from './Header'
import { ErrorBoundary } from '../common/ErrorBoundary'
import { WelcomeToast } from '../common/WelcomeToast'

interface DashboardShellProps {
  user: User
  children: React.ReactNode
}

export function DashboardShell({ user, children }: DashboardShellProps) {
  const { setUser } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    setUser(user)
  }, [user, setUser])

  return (
    <div className='flex h-screen overflow-hidden bg-page-light dark:bg-page-dark'>
      {/* Desktop sidebar */}
      <Sidebar />

      {/* Mobile sidebar */}
      <MobileSidebar
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      {/* Main area */}
      <div className='flex flex-1 flex-col min-w-0 overflow-auto'>
        <Header onMenuClick={() => setMobileMenuOpen(true)} />
        <main className='flex-1 p-4 sm:p-6 lg:p-8'>
          <ErrorBoundary>{children}</ErrorBoundary>
        </main>
      </div>

      {/* Welcome toast — renders outside the scroll container so it's always visible */}
      <WelcomeToast />
    </div>
  )
}
