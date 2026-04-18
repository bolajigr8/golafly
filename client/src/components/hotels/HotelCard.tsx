'use client'

import React from 'react'
import { Star, MapPin } from 'lucide-react'
import { cn, formatPrice, formatDateShort } from '@/lib/utils'
import type { Hotel } from '@/types/data.types'

interface HotelCardProps {
  hotel: Hotel
  variant?: 'full' | 'compact'
}

function HotelCardComponent({ hotel, variant = 'full' }: HotelCardProps) {
  return (
    <div className='bg-white dark:bg-surface-dark rounded-2xl border border-slate-100 dark:border-white/8 overflow-hidden transition-all duration-200 hover:scale-[1.015] hover:shadow-lg'>
      {/* Image / gradient header — full only */}
      {variant === 'full' && (
        <div className='h-36 sm:h-44 bg-linear-to-br from-brand via-brand-light to-[#004d2a] relative overflow-hidden'>
          <div className='absolute inset-0 flex items-end p-4'>
            <span className='text-white/60 text-sm font-medium'>
              {hotel.city}, {hotel.country}
            </span>
          </div>
          {hotel.featured && (
            <div className='absolute top-3 left-3 bg-gold text-brand text-xs font-bold px-2.5 py-1 rounded-full'>
              Featured
            </div>
          )}
        </div>
      )}

      <div className={cn(variant === 'compact' ? 'p-4' : 'p-5')}>
        {/* Name + stars */}
        <div className='mb-3'>
          <h3
            className='font-bold text-slate-900 dark:text-white text-sm leading-tight line-clamp-1'
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {hotel.name}
          </h3>
          <p className='text-xs text-slate-400 mt-0.5'>by {hotel.brand}</p>
          <div className='flex items-center gap-0.5 mt-1.5'>
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={11}
                className={
                  i < hotel.stars
                    ? 'fill-gold text-gold'
                    : 'text-slate-300 dark:text-slate-600'
                }
                fill={i < hotel.stars ? 'currentColor' : 'none'}
              />
            ))}
          </div>
        </div>

        {/* Location */}
        <div className='space-y-1 text-xs text-slate-500 dark:text-slate-400 mb-3'>
          <div className='flex items-center gap-1.5'>
            <MapPin size={11} className='text-gold shrink-0' />
            <span className='truncate'>{hotel.address}</span>
          </div>
          <div className='flex items-center gap-1.5'>
            <div className='w-3 h-3 rounded-full bg-gold/20 flex items-center justify-center shrink-0'>
              <div className='w-1 h-1 rounded-full bg-gold' />
            </div>
            <span className='text-gold/80 font-medium'>
              {hotel.distanceToStadium}
            </span>
          </div>
        </div>

        {/* Rating */}
        <div className='flex items-center gap-1.5 mb-3'>
          <div className='flex items-center justify-center w-7 h-7 rounded-lg bg-brand text-white font-bold text-xs'>
            {hotel.rating.toFixed(1)}
          </div>
          <Star size={11} className='fill-gold text-gold' />
          <span className='text-xs text-slate-400'>
            ({hotel.reviewCount.toLocaleString()} reviews)
          </span>
        </div>

        {/* Amenities — full only */}
        {variant === 'full' && (
          <div className='flex flex-wrap gap-1.5 mb-3'>
            {hotel.amenities.slice(0, 4).map((a) => (
              <span
                key={a}
                className='text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              >
                {a}
              </span>
            ))}
            {hotel.amenities.length > 4 && (
              <span className='text-xs px-2 py-0.5 rounded-full bg-gold/10 text-gold'>
                +{hotel.amenities.length - 4} more
              </span>
            )}
          </div>
        )}

        {/* Dates — full only */}
        {variant === 'full' && (
          <div className='text-xs text-slate-400 mb-4 space-y-0.5'>
            <p>
              Check-in:{' '}
              <span className='text-slate-700 dark:text-slate-200 font-medium'>
                {formatDateShort(hotel.checkIn)}
              </span>
            </p>
            <p>
              Check-out:{' '}
              <span className='text-slate-700 dark:text-slate-200 font-medium'>
                {formatDateShort(hotel.checkOut)}
              </span>
            </p>
          </div>
        )}

        {/* Price + CTA */}
        <div className='flex items-center justify-between pt-3 border-t border-slate-100 dark:border-white/8'>
          <div>
            <div>
              <span
                className='text-xl font-bold text-gold'
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {formatPrice(hotel.pricePerNight, hotel.currency)}
              </span>
              <span className='text-slate-400 text-xs'>/night</span>
            </div>
            {variant === 'full' && (
              <div className='text-xs text-slate-400'>
                Total:{' '}
                {formatPrice(
                  hotel.pricePerNight * hotel.nights,
                  hotel.currency,
                )}
              </div>
            )}
          </div>
          <button className='h-11 px-4 rounded-xl bg-gold text-brand font-semibold text-sm hover:bg-gold-light active:bg-gold-dark transition-colors'>
            View Hotel
          </button>
        </div>
      </div>
    </div>
  )
}

export const HotelCard = React.memo(HotelCardComponent)
