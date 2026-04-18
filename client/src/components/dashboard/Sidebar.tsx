'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Ticket, Plane, Building2, LogOut } from 'lucide-react'

import { useAuth } from '@/context/AuthContext'
import { getInitials, getFirstName } from '@/lib/utils'
import { ROUTES } from '@/constants/routes'
import { cn } from '@/lib/utils'
import { Logo } from '../common/Logo'
import { ThemeToggle } from '../common/ThemeToggle'

const navItems = [
  {
    label: 'Overview',
    icon: LayoutDashboard,
    href: ROUTES.DASHBOARD,
    exact: true,
  },
  { label: 'Tickets', icon: Ticket, href: ROUTES.TICKETS, exact: false },
  { label: 'Flights', icon: Plane, href: ROUTES.FLIGHTS, exact: false },
  { label: 'Hotels', icon: Building2, href: ROUTES.HOTELS, exact: false },
]

export function Sidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  const isActive = (href: string, exact: boolean) =>
    exact ? pathname === href : pathname.startsWith(href)

  return (
    <aside className='hidden lg:flex flex-col w-64 shrink-0 h-screen sticky top-0 bg-slate-50 dark:bg-brand'>
      {/* Logo */}
      <div className='flex items-center h-16 px-5 border-b border-slate-200 dark:border-white/8'>
        <Logo size='md' />
      </div>

      {/* Nav */}
      <nav className='flex-1 px-3 py-5 space-y-1 overflow-y-auto'>
        <p className='px-3 mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400 dark:text-white/25'>
          Menu
        </p>
        {navItems.map(({ label, icon: Icon, href, exact }) => {
          const active = isActive(href, exact)
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 border-l-2 pl-2.5',
                active
                  ? 'bg-gold/15 text-gold border-gold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border-transparent dark:text-white/70 dark:hover:text-white dark:hover:bg-white/8',
              )}
            >
              <Icon size={17} className='shrink-0' />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Bottom: theme + user */}
      <div className='px-3 py-4 border-t border-slate-200 dark:border-white/8 space-y-3'>
        <div className='flex items-center justify-between px-2'>
          <span className='text-[11px] text-slate-400 dark:text-white/30 uppercase tracking-widest'>
            Theme
          </span>
          <ThemeToggle variant='sidebar' />
        </div>

        {user && (
          <div className='p-3 rounded-xl bg-slate-100 border border-slate-200 dark:bg-white/5 dark:border-white/8'>
            <div className='flex items-center gap-2.5 mb-2.5'>
              <div className='flex items-center justify-center w-8 h-8 rounded-full bg-gold text-brand font-bold text-xs shrink-0'>
                {getInitials(user.fullName)}
              </div>
              <div className='min-w-0 flex-1'>
                <p className='text-sm font-semibold text-slate-900 dark:text-white truncate'>
                  {getFirstName(user.fullName)}
                </p>
                <p className='text-xs text-slate-500 dark:text-white/50 truncate'>
                  {user.email}
                </p>
              </div>
            </div>
            <button
              onClick={() => void logout()}
              className='w-full flex items-center justify-center gap-2 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-red-500 hover:bg-slate-200 dark:text-white/50 dark:hover:text-red-400 dark:hover:bg-white/5 transition-all duration-150'
            >
              <LogOut size={13} /> Sign out
            </button>
          </div>
        )}
      </div>
    </aside>
  )
}
