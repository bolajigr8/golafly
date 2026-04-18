'use client'

import { useCallback, Suspense } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { Ticket as TicketIcon } from 'lucide-react'
import { useTickets } from '@/hooks/useTickets'
import { TicketCard } from '@/components/tickets/TicketCard'
import { TicketSkeleton } from '@/components/tickets/TicketSkeleton'
import { TicketFilters } from '@/components/tickets/TicketFilters'
import { PageHeader } from '@/components/common/PageHeader'
import { Pagination } from '@/components/common/Pagination'
import { EmptyState } from '@/components/common/EmptyState'

const LIMIT = 9

function TicketsContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const page = Number(searchParams.get('page') ?? '1')
  const competition = searchParams.get('competition') ?? undefined
  const category =
    (searchParams.get('category') as
      | 'Standard'
      | 'Premium'
      | 'VIP'
      | undefined) ?? undefined
  const status =
    (searchParams.get('status') as
      | 'available'
      | 'selling_fast'
      | 'sold_out'
      | undefined) ?? undefined
  const sortBy = searchParams.get('sortBy') ?? 'date'
  const sortOrder = (searchParams.get('sortOrder') ?? 'asc') as 'asc' | 'desc'

  const { data, isLoading, isError, refetch } = useTickets({
    page,
    limit: LIMIT,
    competition,
    category,
    status,
    sortBy,
    sortOrder,
  })

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
      params.delete('page')
      router.replace(`${pathname}?${params.toString()}`)
    },
    [searchParams, router, pathname],
  )

  const clearAll = useCallback(
    () => router.replace(pathname),
    [router, pathname],
  )

  const handlePageChange = useCallback(
    (p: number) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set('page', String(p))
      router.replace(`${pathname}?${params.toString()}`)
    },
    [searchParams, router, pathname],
  )

  const hasActive = !!(competition || category || status)
  const items = data?.data.items ?? []
  const meta = data?.data.meta

  return (
    <div>
      <PageHeader
        title='Match Tickets'
        description='Secure your seat for the biggest matches worldwide'
        icon={TicketIcon}
      />

      <TicketFilters
        searchParams={searchParams}
        onFilterChange={updateParam}
        onClearAll={clearAll}
      />

      {isLoading && (
        <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6'>
          {Array.from({ length: LIMIT }).map((_, i) => (
            <TicketSkeleton key={i} />
          ))}
        </div>
      )}

      {isError && (
        <EmptyState
          title='Failed to load tickets'
          description='There was a problem fetching match tickets. Please try again.'
          icon={TicketIcon}
          action={{ label: 'Retry', onClick: () => void refetch() }}
        />
      )}

      {!isLoading && !isError && items.length === 0 && (
        <EmptyState
          title='No tickets found'
          description={
            hasActive
              ? 'Try adjusting your filters.'
              : 'No match tickets are available right now.'
          }
          icon={TicketIcon}
          action={
            hasActive
              ? { label: 'Clear filters', onClick: clearAll }
              : undefined
          }
        />
      )}

      {!isLoading && !isError && items.length > 0 && (
        <AnimatePresence mode='wait'>
          <motion.div
            key={`${competition ?? ''}-${category ?? ''}-${status ?? ''}-${sortBy}-${sortOrder}-${page}`}
            className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6'
          >
            {items.map((ticket, i) => (
              <motion.div
                key={ticket.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: {
                    delay: i * 0.06,
                    duration: 0.35,
                    ease: 'easeOut',
                  },
                }}
                exit={{
                  opacity: 0,
                  scale: 0.95,
                  transition: { duration: 0.2 },
                }}
              >
                <TicketCard ticket={ticket} variant='full' />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      )}

      {!isLoading && meta && meta.totalPages > 1 && (
        <div className='mt-8'>
          <Pagination meta={meta} onPageChange={handlePageChange} />
        </div>
      )}
    </div>
  )
}

export default function TicketsPage() {
  return (
    <Suspense
      fallback={
        <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6'>
          {Array.from({ length: LIMIT }).map((_, i) => (
            <TicketSkeleton key={i} />
          ))}
        </div>
      }
    >
      <TicketsContent />
    </Suspense>
  )
}
