'use client'

import React from 'react'
import { MapPin, Clock, Users } from 'lucide-react'
import {
  cn,
  formatDate,
  formatPrice,
  getStatusColor,
  getStatusLabel,
} from '@/lib/utils'
import type { Ticket } from '@/types/data.types'

interface TicketCardProps {
  ticket: Ticket
  variant?: 'full' | 'compact'
}

const categoryClass: Record<Ticket['category'], string> = {
  Standard: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
  Premium: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  VIP: 'bg-gold/10 text-gold border border-gold/30',
}

function TicketCardComponent({ ticket, variant = 'full' }: TicketCardProps) {
  const isSoldOut = ticket.status === 'sold_out'

  return (
    <div
      className={cn(
        'relative flex flex-col h-full bg-white dark:bg-surface-dark rounded-2xl border border-slate-100 dark:border-white/8 overflow-hidden transition-all duration-200',
        !isSoldOut && 'hover:scale-[1.02] hover:shadow-lg',
        isSoldOut && 'opacity-60',
        variant === 'compact' ? 'p-4' : 'p-5',
      )}
    >
      {/* Sold out overlay */}
      {isSoldOut && (
        <div className='absolute inset-0 flex items-center justify-center pointer-events-none z-10'>
          <span className='text-4xl font-black text-red-500/25 -rotate-12 select-none'>
            SOLD OUT
          </span>
        </div>
      )}
      {/* ── Header ── */}
      <div className='flex items-start justify-between mb-3'>
        {ticket.competition ? (
          <span className='bg-gold/10 text-gold border border-gold/20 rounded-full px-2.5 py-0.5 text-xs font-medium'>
            {ticket.competition}
          </span>
        ) : (
          <span />
        )}
        <span
          className={cn(
            'text-xs font-semibold px-2.5 py-0.5 rounded-full',
            getStatusColor(ticket.status),
          )}
        >
          {getStatusLabel(ticket.status)}
        </span>
      </div>
      {/* ── Teams ── */}
      <div className='flex items-center justify-center gap-3 my-4'>
        <span
          className={cn(
            'font-bold text-slate-900 dark:text-white text-right flex-1',
            variant === 'compact' ? 'text-base' : 'text-lg sm:text-xl',
          )}
        >
          {ticket.homeTeam ?? '—'}
        </span>
        <span className='text-gold font-black text-base shrink-0'>VS</span>
        <span
          className={cn(
            'font-bold text-slate-900 dark:text-white flex-1',
            variant === 'compact' ? 'text-base' : 'text-lg sm:text-xl',
          )}
        >
          {ticket.awayTeam ?? '—'}
        </span>
      </div>
      {/* ── Meta ── grows to fill space, pushing stub down ── */}
      <div className='flex-1 space-y-1.5 text-xs text-slate-500 dark:text-slate-400 mb-4'>
        {(ticket.stadium || ticket.city) && (
          <div className='flex items-center gap-1.5'>
            <MapPin size={12} className='text-gold shrink-0' />
            <span className='truncate'>
              {[ticket.stadium, ticket.city].filter(Boolean).join(', ')}
            </span>
          </div>
        )}
        {(ticket.date || ticket.kickoffTime) && (
          <div className='flex items-center gap-3'>
            {ticket.date && (
              <span className='flex items-center gap-1.5'>
                <Clock size={12} className='text-gold shrink-0' />
                {formatDate(ticket.date)}
              </span>
            )}
            {ticket.kickoffTime && (
              <span className='font-medium text-slate-700 dark:text-slate-200'>
                {ticket.kickoffTime}
              </span>
            )}
          </div>
        )}
      </div>
      {/* ── Full variant only: perforation + stub ── always pinned to bottom ── */}
      {variant === 'full' && (
        <>
          {/* <div className='relative my-4 mx-2'>
            <div className='border-t-2 border-dashed border-slate-200 dark:border-slate-700' />
            <div className='absolute -left-6 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-page-light dark:bg-page-dark' />
            <div className='absolute -right-6 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-page-light dark:bg-page-dark' />
          </div> */}

          <div>
            <div className='flex items-start justify-between gap-2 mb-3'>
              <div className='space-y-1'>
                {ticket.section && (
                  <p className='text-xs text-slate-400'>{ticket.section}</p>
                )}
                {ticket.seat && (
                  <div className='flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400'>
                    <Users size={11} className='text-gold' />
                    <span>{ticket.seat}</span>
                  </div>
                )}
              </div>
              <div className='text-right'>
                {ticket.price != null && (
                  <p
                    className='text-lg font-bold text-slate-900 dark:text-white'
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    {formatPrice(ticket.price, ticket.currency)}
                  </p>
                )}
                {ticket.availableSeats != null && (
                  <p className='text-xs text-slate-400'>
                    {ticket.availableSeats} seats left
                  </p>
                )}
              </div>
            </div>

            <div className='flex items-center justify-between gap-2'>
              {ticket.category && (
                <span
                  className={cn(
                    'text-xs font-medium px-2.5 py-1 rounded-full',
                    categoryClass[ticket.category],
                  )}
                >
                  {ticket.category}
                </span>
              )}
              <button
                disabled={isSoldOut}
                className={cn(
                  'h-11 px-5 rounded-xl text-sm font-semibold transition-colors',
                  isSoldOut
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                    : 'bg-gold text-brand hover:bg-gold-light active:bg-gold-dark w-full sm:w-auto',
                  !ticket.category && 'ml-auto',
                )}
              >
                {isSoldOut ? 'Sold Out' : 'Book Now →'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export const TicketCard = React.memo(TicketCardComponent)
