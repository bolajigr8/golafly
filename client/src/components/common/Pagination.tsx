'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { PaginationMeta } from '@/types/data.types'

interface PaginationProps {
  meta: PaginationMeta
  onPageChange: (page: number) => void
}

function getPageNumbers(current: number, total: number): (number | '...')[] {
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1)
  if (current <= 3) return [1, 2, 3, 4, '...', total]
  if (current >= total - 2)
    return [1, '...', total - 3, total - 2, total - 1, total]
  return [1, '...', current - 1, current, current + 1, '...', total]
}

export function Pagination({ meta, onPageChange }: PaginationProps) {
  const { page, totalPages, total, limit } = meta

  if (totalPages <= 1) return null

  const pages = getPageNumbers(page, totalPages)
  const from = (page - 1) * limit + 1
  const to = Math.min(page * limit, total)

  const handleChange = (p: number) => {
    onPageChange(p)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className='flex flex-col sm:flex-row items-center justify-between gap-3'>
      <p className='text-xs text-slate-500 dark:text-slate-400 order-2 sm:order-1'>
        Showing{' '}
        <span className='font-semibold text-slate-700 dark:text-slate-200'>
          {from}–{to}
        </span>{' '}
        of{' '}
        <span className='font-semibold text-slate-700 dark:text-slate-200'>
          {total}
        </span>{' '}
        results
      </p>

      <div className='flex items-center gap-1 order-1 sm:order-2'>
        {/* Previous */}
        <button
          onClick={() => page > 1 && handleChange(page - 1)}
          disabled={page <= 1}
          className={cn(
            'flex items-center justify-center w-9 h-9 rounded-lg border text-sm transition-all',
            page <= 1
              ? 'opacity-40 cursor-not-allowed border-slate-200 dark:border-slate-700 text-slate-400'
              : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-gold/50 hover:text-gold',
          )}
          aria-label='Previous page'
        >
          <ChevronLeft size={15} />
        </button>

        {/* Page numbers — hidden on mobile, show only on sm+ */}
        <div className='hidden sm:flex items-center gap-1'>
          {pages.map((p, i) =>
            p === '...' ? (
              <span
                key={`e-${i}`}
                className='flex items-center justify-center w-9 h-9 text-slate-400 text-sm'
              >
                ···
              </span>
            ) : (
              <button
                key={p}
                onClick={() => handleChange(p as number)}
                className={cn(
                  'flex items-center justify-center w-9 h-9 rounded-lg border text-sm font-medium transition-all',
                  p === page
                    ? 'bg-gold text-brand border-gold font-bold'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-gold/50 hover:text-gold',
                )}
                aria-current={p === page ? 'page' : undefined}
              >
                {p}
              </button>
            ),
          )}
        </div>

        {/* Mobile: just "Page X of Y" */}
        <span className='sm:hidden text-sm font-medium text-slate-700 dark:text-slate-200 px-3'>
          {page} / {totalPages}
        </span>

        {/* Next */}
        <button
          onClick={() => page < totalPages && handleChange(page + 1)}
          disabled={page >= totalPages}
          className={cn(
            'flex items-center justify-center w-9 h-9 rounded-lg border text-sm transition-all',
            page >= totalPages
              ? 'opacity-40 cursor-not-allowed border-slate-200 dark:border-slate-700 text-slate-400'
              : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-gold/50 hover:text-gold',
          )}
          aria-label='Next page'
        >
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  )
}
