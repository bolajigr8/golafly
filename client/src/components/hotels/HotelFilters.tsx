'use client'

import { useState } from 'react'
import { SlidersHorizontal, X, Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface HotelFiltersProps {
  searchParams: URLSearchParams
  onFilterChange: (key: string, value: string) => void
  onClearAll: () => void
}

const cities = [
  'All',
  'London',
  'Madrid',
  'Barcelona',
  'Munich',
  'Milan',
  'Paris',
  'Manchester',
  'Dortmund',
  'Turin',
  'Amsterdam',
]
const starOpts = [
  { label: 'All', value: '' },
  { label: '3★', value: '3' },
  { label: '4★', value: '4' },
  { label: '5★', value: '5' },
]
const sortOptions = [
  { value: 'pricePerNight-asc', label: 'Price (Low→High)' },
  { value: 'pricePerNight-desc', label: 'Price (High→Low)' },
  { value: 'rating-desc', label: 'Rating (Highest)' },
  { value: 'stars-desc', label: 'Stars (Highest)' },
]

const btnBase =
  'px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 border'
const btnActive = 'border-gold text-gold bg-gold/5'
const btnInactive =
  'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-gold/40 hover:text-gold'

interface FilterContentProps {
  city: string
  stars: string
  sort: string
  hasActive: boolean
  onFilterChange: (key: string, value: string) => void
  onClearAll: () => void
}

function FilterContent({
  city,
  stars,
  sort,
  hasActive,
  onFilterChange,
  onClearAll,
}: FilterContentProps) {
  return (
    <div className='space-y-4'>
      <div>
        <p className='text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2'>
          City
        </p>
        <div className='flex flex-wrap gap-1.5'>
          {cities.map((c) => (
            <button
              key={c}
              onClick={() => onFilterChange('city', c === 'All' ? '' : c)}
              className={cn(btnBase, city === c ? btnActive : btnInactive)}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className='text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2'>
          Star Rating
        </p>
        <div className='flex flex-wrap gap-1.5'>
          {starOpts.map(({ label, value }) => (
            <button
              key={label}
              onClick={() => onFilterChange('stars', value)}
              className={cn(
                btnBase,
                'flex items-center gap-1',
                stars === value ? btnActive : btnInactive,
              )}
            >
              {value && <Star size={10} className='fill-current' />}
              {label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className='text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2'>
          Sort By
        </p>
        <select
          value={sort}
          onChange={(e) => {
            const parts = e.target.value.split('-')
            const order = parts[parts.length - 1] ?? 'asc'
            const by = parts.slice(0, -1).join('-')
            onFilterChange('sortBy', by)
            onFilterChange('sortOrder', order)
          }}
          className='text-sm px-3 py-2 rounded-lg bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all'
        >
          {sortOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      {hasActive && (
        <button
          onClick={onClearAll}
          className='text-sm text-slate-400 hover:text-red-400 underline transition-colors'
        >
          Clear all filters
        </button>
      )}
    </div>
  )
}

export function HotelFilters({
  searchParams,
  onFilterChange,
  onClearAll,
}: HotelFiltersProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  const city = searchParams.get('city') ?? 'All'
  const stars = searchParams.get('stars') ?? ''
  const sortBy = searchParams.get('sortBy') ?? 'pricePerNight'
  const sortOrder = searchParams.get('sortOrder') ?? 'asc'
  const sort = `${sortBy}-${sortOrder}`
  const hasActive = !!(searchParams.get('city') || searchParams.get('stars'))

  const sharedProps: FilterContentProps = {
    city,
    stars,
    sort,
    hasActive,
    onFilterChange,
    onClearAll,
  }

  return (
    <>
      <div className='sm:hidden mb-4'>
        <button
          onClick={() => setMobileOpen(true)}
          className='flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-700 dark:text-slate-200 hover:border-gold/40 transition-all'
        >
          <SlidersHorizontal size={15} className='text-gold' />
          Filters
          {hasActive && (
            <span className='w-2 h-2 rounded-full bg-gold ml-0.5' />
          )}
        </button>
      </div>

      {mobileOpen && (
        <>
          <div
            className='fixed inset-0 z-40 bg-black/50 sm:hidden'
            onClick={() => setMobileOpen(false)}
          />
          <div className='fixed bottom-0 left-0 right-0 z-50 sm:hidden bg-white dark:bg-surface-dark rounded-t-2xl p-5 shadow-2xl border-t border-slate-100 dark:border-white/8 max-h-[80vh] overflow-y-auto'>
            <div className='flex items-center justify-between mb-5'>
              <h3
                className='font-bold text-slate-900 dark:text-white'
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Filters
              </h3>
              <button
                onClick={() => setMobileOpen(false)}
                className='w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-white/8'
              >
                <X size={16} className='text-slate-500' />
              </button>
            </div>
            <FilterContent {...sharedProps} />
            <button
              onClick={() => setMobileOpen(false)}
              className='w-full mt-5 h-11 bg-gold text-brand font-semibold rounded-xl hover:bg-gold-light transition-colors text-sm'
            >
              Apply Filters
            </button>
          </div>
        </>
      )}

      <div className='hidden sm:block bg-white dark:bg-surface-dark rounded-2xl border border-slate-100 dark:border-white/8 p-5 mb-6'>
        <FilterContent {...sharedProps} />
      </div>
    </>
  )
}
