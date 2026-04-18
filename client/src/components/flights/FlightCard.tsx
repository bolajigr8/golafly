'use client'

import React from 'react'
import { Plane, Users } from 'lucide-react'
import { cn, formatPrice, formatTime, formatDate } from '@/lib/utils'
import type { Flight } from '@/types/data.types'

interface FlightCardProps {
  flight: Flight
  variant?: 'full' | 'compact'
}

const classStyle: Record<Flight['class'], string> = {
  Economy: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300',
  Business: 'bg-gold/10 text-gold border border-gold/30',
  First: 'bg-brand text-white',
}

const stopsStyle = (stops: number) =>
  stops === 0
    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
    : stops === 1
      ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
      : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'

function FlightCardComponent({ flight, variant = 'full' }: FlightCardProps) {
  return (
    <div
      className={cn(
        'bg-white dark:bg-surface-dark rounded-2xl border border-slate-100 dark:border-white/8 overflow-hidden transition-all duration-200 hover:scale-[1.015] hover:shadow-lg',
        variant === 'compact' ? 'p-4' : 'p-5',
      )}
    >
      {/* Header */}
      <div className='flex items-start justify-between mb-4'>
        <div>
          <p className='text-sm font-bold text-slate-900 dark:text-white'>
            {flight.airline}
          </p>
          <p className='text-xs text-slate-400 mt-0.5'>{flight.flightNumber}</p>
        </div>
        <div className='flex items-center gap-2'>
          <span
            className={cn(
              'text-xs font-medium px-2.5 py-0.5 rounded-full',
              classStyle[flight.class],
            )}
          >
            {flight.class}
          </span>
          <p
            className='text-xl font-bold text-gold'
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {formatPrice(flight.price, flight.currency)}
          </p>
        </div>
      </div>

      {/* Flight path */}
      <div className='flex items-center gap-3 sm:gap-5 my-5'>
        {/* Origin */}
        <div className='text-center flex-1'>
          <div
            className={cn(
              'font-black text-slate-900 dark:text-white',
              variant === 'compact' ? 'text-xl' : 'text-2xl sm:text-3xl',
            )}
          >
            {flight.origin.code}
          </div>
          <div className='text-xs text-slate-500 dark:text-slate-400 mt-0.5'>
            {flight.origin.city}
          </div>
          <div className='text-sm font-semibold text-slate-700 dark:text-slate-300 mt-1'>
            {formatTime(flight.departure)}
          </div>
        </div>

        {/* Path line */}
        <div className='flex-1 flex flex-col items-center gap-1.5'>
          <div className='flex items-center w-full gap-1'>
            <div className='flex-1 border-t-2 border-dashed border-slate-200 dark:border-slate-600' />
            <Plane size={16} className='text-gold shrink-0' />
            <div className='flex-1 border-t-2 border-dashed border-slate-200 dark:border-slate-600' />
          </div>
          <span className='text-xs text-slate-400'>{flight.duration}</span>
          <span
            className={cn(
              'text-xs px-2 py-0.5 rounded-full font-medium',
              stopsStyle(flight.stops),
            )}
          >
            {flight.stops === 0
              ? 'Direct'
              : `${flight.stops} Stop${flight.stops > 1 ? 's' : ''}`}
          </span>
        </div>

        {/* Destination */}
        <div className='text-center flex-1'>
          <div
            className={cn(
              'font-black text-slate-900 dark:text-white',
              variant === 'compact' ? 'text-xl' : 'text-2xl sm:text-3xl',
            )}
          >
            {flight.destination.code}
          </div>
          <div className='text-xs text-slate-500 dark:text-slate-400 mt-0.5'>
            {flight.destination.city}
          </div>
          <div className='text-sm font-semibold text-slate-700 dark:text-slate-300 mt-1'>
            {formatTime(flight.arrival)}
          </div>
        </div>
      </div>

      {/* Full variant footer */}
      {variant === 'full' && (
        <div className='flex items-center justify-between pt-4 border-t border-slate-100 dark:border-white/8'>
          <div className='flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400'>
            <span>{formatDate(flight.departure)}</span>
            <span className='flex items-center gap-1'>
              <Users
                size={12}
                className={cn(
                  flight.seatsAvailable < 5 ? 'text-red-500' : 'text-gold',
                )}
              />
              <span
                className={cn(
                  flight.seatsAvailable < 5 && 'text-red-500 font-semibold',
                )}
              >
                {flight.seatsAvailable} seats
              </span>
            </span>
          </div>
          <button className='h-11 px-5 rounded-xl bg-gold text-brand font-semibold text-sm hover:bg-gold-light active:bg-gold-dark transition-colors w-full sm:w-auto mt-0 ml-3'>
            Book Flight →
          </button>
        </div>
      )}
    </div>
  )
}

export const FlightCard = React.memo(FlightCardComponent)
