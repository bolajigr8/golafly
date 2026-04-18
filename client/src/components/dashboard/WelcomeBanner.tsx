'use client'

import { Ticket, Plane, Trophy } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuth } from '@/context/AuthContext'
import { getGreeting, getFirstName } from '@/lib/utils'

export function WelcomeBanner() {
  const { user, isLoading } = useAuth()
  const greeting = getGreeting()
  // Guard: user may be null during initial auth rehydration
  const firstName = user ? getFirstName(user.fullName) : ''

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className='relative overflow-hidden rounded-2xl p-6 sm:p-8 mb-8'
      style={{
        background:
          'linear-gradient(135deg, #001c10 0%, #002d1a 50%, #001c10 100%)',
      }}
    >
      {/* Diagonal gold stripe */}
      <div
        className='absolute inset-0 pointer-events-none'
        style={{
          background:
            'linear-gradient(135deg, transparent 40%, rgba(230,184,16,0.06) 40%, rgba(230,184,16,0.06) 60%, transparent 60%)',
        }}
      />
      {/* Dot grid */}
      <div
        className='absolute inset-0 pointer-events-none'
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(230,184,16,0.08) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />
      {/* Decorative trophy */}
      <Trophy
        size={140}
        className='hidden sm:block absolute -bottom-4 right-4 text-gold/10 pointer-events-none select-none'
      />

      {/* Content */}
      <div className='relative z-10'>
        {isLoading ? (
          // Skeleton while user loads
          <div className='space-y-2 animate-pulse'>
            <div className='h-4 w-24 bg-white/10 rounded' />
            <div className='h-8 w-48 bg-white/10 rounded' />
            <div className='h-4 w-64 bg-white/10 rounded' />
          </div>
        ) : (
          <>
            <p className='text-white/50 text-sm mb-1'>{greeting},</p>
            <h1
              className='text-2xl sm:text-3xl font-black text-white mb-3'
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {firstName}! <span className='text-gold'>⚽</span>
            </h1>
            <p className='text-white/65 text-sm max-w-sm mb-5'>
              Welcome to your Golafly Fan Hub. Your next matchday experience
              awaits.
            </p>
          </>
        )}

        <div className='flex flex-wrap gap-2'>
          {[
            { icon: Ticket, label: '3 Upcoming Matches' },
            { icon: Plane, label: '2 Travel Packages' },
          ].map(({ icon: Icon, label }) => (
            <div
              key={label}
              className='flex items-center gap-1.5 bg-white/10 border border-white/10 text-white text-xs font-medium px-3 py-1.5 rounded-full'
            >
              <Icon size={13} className='text-gold' />
              {label}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
