'use client'

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { Sun, Moon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ThemeToggleProps {
  className?: string
  variant?: 'default' | 'sidebar'
}

export function ThemeToggle({
  className,
  variant = 'default',
}: ThemeToggleProps) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Prevent hydration mismatch — render placeholder until mounted
  if (!mounted) {
    return (
      <div
        className={cn(
          'w-9 h-9 rounded-lg',
          variant === 'sidebar' ? 'bg-white/10' : 'bg-muted',
          className,
        )}
      />
    )
  }

  const isDark = theme === 'dark'

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className={cn(
        'relative flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2',
        variant === 'sidebar'
          ? 'text-white/60 hover:text-white hover:bg-white/10'
          : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/8',
        className,
      )}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {/* Moon icon — visible in dark mode */}
      <span
        className={cn(
          'absolute transition-all duration-300',
          isDark
            ? 'opacity-100 rotate-0 scale-100'
            : 'opacity-0 rotate-90 scale-50',
        )}
      >
        <Moon size={16} />
      </span>

      {/* Sun icon — visible in light mode */}
      <span
        className={cn(
          'absolute transition-all duration-300',
          !isDark
            ? 'opacity-100 rotate-0 scale-100'
            : 'opacity-0 -rotate-90 scale-50',
        )}
      >
        <Sun size={16} />
      </span>
    </button>
  )
}
