'use client'

import { useState } from 'react'
import { SlidersHorizontal, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TicketFiltersProps {
  searchParams: URLSearchParams
  onFilterChange: (key: string, value: string) => void
  onClearAll: () => void
}

const competitions = [
  'All',
  'Premier League',
  'La Liga',
  'UEFA Champions League',
  'Serie A',
  'Bundesliga',
  'Eredivisie',
]
const categories = ['All', 'Standard', 'Premium', 'VIP']
const statuses = ['All', 'available', 'selling_fast']
const sortOptions = [
  { value: 'date-asc', label: 'Date (Earliest)' },
  { value: 'price-asc', label: 'Price (Low→High)' },
  { value: 'price-desc', label: 'Price (High→Low)' },
  { value: 'availableSeats-desc', label: 'Seats Available' },
]

const btnBase =
  'px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 border'
const btnActive = 'border-gold text-gold bg-gold/5'
const btnInactive =
  'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-gold/40 hover:text-gold'

// ── Extracted outside — avoids React unmounting on every render ──────────────
interface FilterContentProps {
  competition: string
  category: string
  status: string
  sort: string
  hasActive: boolean
  onFilterChange: (key: string, value: string) => void
  onClearAll: () => void
}

function FilterContent({
  competition,
  category,
  status,
  sort,
  hasActive,
  onFilterChange,
  onClearAll,
}: FilterContentProps) {
  return (
    <div className='space-y-4'>
      {/* Competition */}
      <div>
        <p className='text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2'>
          Competition
        </p>
        <div className='flex flex-wrap gap-1.5'>
          {competitions.map((c) => (
            <button
              key={c}
              onClick={() =>
                onFilterChange('competition', c === 'All' ? '' : c)
              }
              className={cn(
                btnBase,
                competition === c ? btnActive : btnInactive,
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Category */}
      <div>
        <p className='text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2'>
          Category
        </p>
        <div className='flex flex-wrap gap-1.5'>
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => onFilterChange('category', c === 'All' ? '' : c)}
              className={cn(btnBase, category === c ? btnActive : btnInactive)}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Status */}
      <div>
        <p className='text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2'>
          Availability
        </p>
        <div className='flex flex-wrap gap-1.5'>
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => onFilterChange('status', s === 'All' ? '' : s)}
              className={cn(btnBase, status === s ? btnActive : btnInactive)}
            >
              {s === 'selling_fast'
                ? 'Selling Fast'
                : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Sort */}
      <div>
        <p className='text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2'>
          Sort By
        </p>
        <select
          value={sort}
          onChange={(e) => {
            const parts = e.target.value.split('-')
            const by = parts.slice(0, -1).join('-') // handles 'availableSeats-desc'
            const order = parts[parts.length - 1] ?? 'asc'
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

// ── Main export ──────────────────────────────────────────────────────────────
export function TicketFilters({
  searchParams,
  onFilterChange,
  onClearAll,
}: TicketFiltersProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  const competition = searchParams.get('competition') ?? 'All'
  const category = searchParams.get('category') ?? 'All'
  const status = searchParams.get('status') ?? 'All'
  const sortBy = searchParams.get('sortBy') ?? 'date'
  const sortOrder = searchParams.get('sortOrder') ?? 'asc'
  const sort = `${sortBy}-${sortOrder}`
  const hasActive = !!(
    searchParams.get('competition') ||
    searchParams.get('category') ||
    searchParams.get('status')
  )

  const sharedProps: FilterContentProps = {
    competition,
    category,
    status,
    sort,
    hasActive,
    onFilterChange,
    onClearAll,
  }

  return (
    <>
      {/* Mobile toggle */}
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

      {/* Mobile bottom sheet */}
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

      {/* Desktop */}
      <div className='hidden sm:block bg-white dark:bg-surface-dark rounded-2xl border border-slate-100 dark:border-white/8 p-5 mb-6'>
        <FilterContent {...sharedProps} />
      </div>
    </>
  )
}
