'use client'

import { usePathname } from 'next/navigation'
import { Menu, Bell } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { getInitials, getFirstName } from '@/lib/utils'
import { ThemeToggle } from '../common/ThemeToggle'

interface HeaderProps {
  onMenuClick: () => void
}

function getBreadcrumb(pathname: string): string {
  if (pathname === '/dashboard') return 'Overview'
  if (pathname.startsWith('/dashboard/tickets')) return 'Match Tickets'
  if (pathname.startsWith('/dashboard/flights')) return 'Flights'
  if (pathname.startsWith('/dashboard/hotels')) return 'Hotels'
  return 'Dashboard'
}

export function Header({ onMenuClick }: HeaderProps) {
  const pathname = usePathname()
  const { user } = useAuth()
  const breadcrumb = getBreadcrumb(pathname)

  return (
    <header className='sticky top-0 z-30 flex items-center h-16 px-4 sm:px-6 bg-white dark:bg-surface-dark border-b border-slate-100 dark:border-white/5 shadow-sm shrink-0'>
      {/* Left */}
      <div className='flex items-center gap-3 flex-1'>
        {/* Hamburger — mobile only */}
        <button
          onClick={onMenuClick}
          className='lg:hidden flex items-center justify-center w-9 h-9 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/8 transition-all'
          aria-label='Open navigation menu'
        >
          <Menu size={20} />
        </button>

        {/* Breadcrumb + Welcome */}
        <div className='flex flex-col justify-center'>
          <h2
            className='text-sm sm:text-base font-semibold text-slate-900 dark:text-white leading-tight'
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {breadcrumb}
          </h2>
        </div>
      </div>

      {/* Right */}
      <div className='flex items-center gap-1.5'>
        {/* Theme toggle */}
        <ThemeToggle />

        {/* Bell */}
        <button
          className='relative flex items-center justify-center w-9 h-9 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/8 transition-all'
          aria-label='Notifications'
        >
          <Bell size={17} />
          <span className='absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-gold border-2 border-white dark:border-surface-dark' />
        </button>

        {/* User chip — desktop */}
        {user && (
          <div className='hidden sm:flex items-center gap-2 ml-2 pl-2 border-l border-slate-100 dark:border-white/10'>
            <div className='flex items-center justify-center w-7 h-7 rounded-full bg-brand text-gold font-bold text-xs'>
              {getInitials(user.fullName)}
            </div>
            <span className='text-sm font-medium text-slate-700 dark:text-slate-200'>
              {getFirstName(user.fullName)}
            </span>
          </div>
        )}
      </div>
    </header>
  )
}
