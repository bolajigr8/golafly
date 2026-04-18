'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { getInitials, getFirstName } from '@/lib/utils'

const SESSION_KEY = 'welcome_shown'

export function WelcomeToast() {
  const { user, isLoading } = useAuth()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (isLoading || !user) return
    if (sessionStorage.getItem(SESSION_KEY)) return

    // Small delay so it doesn't fire during page paint
    const show = setTimeout(() => {
      setVisible(true)
      sessionStorage.setItem(SESSION_KEY, '1')
    }, 600)

    return () => clearTimeout(show)
  }, [user, isLoading])

  useEffect(() => {
    if (!visible) return
    const hide = setTimeout(() => setVisible(false), 4500)
    return () => clearTimeout(hide)
  }, [visible])

  if (!user) return null

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key='welcome-toast'
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          className='fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl bg-white dark:bg-surface-dark border border-slate-100 dark:border-white/10 min-w-[260px] max-w-xs'
        >
          {/* Avatar */}
          <div className='flex items-center justify-center w-10 h-10 rounded-full bg-brand text-gold font-bold text-sm shrink-0'>
            {getInitials(user.fullName)}
          </div>

          {/* Text */}
          <div className='flex-1 min-w-0'>
            <p className='text-xs text-slate-400 dark:text-slate-500 leading-none mb-0.5'>
              Welcome back
            </p>
            <p className='text-sm font-semibold text-slate-800 dark:text-white truncate'>
              {getFirstName(user.fullName)}
            </p>
          </div>

          {/* Dismiss */}
          <button
            onClick={() => setVisible(false)}
            className='shrink-0 flex items-center justify-center w-6 h-6 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 transition-all'
            aria-label='Dismiss'
          >
            <X size={13} />
          </button>

          {/* Progress bar */}
          <motion.span
            className='absolute bottom-0 left-0 h-[2.5px] rounded-b-2xl bg-brand/60'
            initial={{ width: '100%' }}
            animate={{ width: '0%' }}
            transition={{ duration: 4.5, ease: 'linear' }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
