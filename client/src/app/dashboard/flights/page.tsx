'use client'

import { useCallback, Suspense } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { Plane } from 'lucide-react'
import { useFlights } from '@/hooks/useFlights'
import { FlightCard } from '@/components/flights/FlightCard'
import { FlightSkeleton } from '@/components/flights/FlightSkeleton'
import { FlightFilters } from '@/components/flights/FlightFilters'
import { PageHeader } from '@/components/common/PageHeader'
import { Pagination } from '@/components/common/Pagination'
import { EmptyState } from '@/components/common/EmptyState'

const LIMIT = 6

function FlightsContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const page = Number(searchParams.get('page') ?? '1')
  const origin = searchParams.get('origin') ?? undefined
  const dest = searchParams.get('destination') ?? undefined
  const cls =
    (searchParams.get('class') as
      | 'Economy'
      | 'Business'
      | 'First'
      | undefined) ?? undefined
  const stopsRaw = searchParams.get('stops')
  const stops = stopsRaw !== null ? Number(stopsRaw) : undefined
  const sortBy = searchParams.get('sortBy') ?? 'departure'
  const sortOrder = (searchParams.get('sortOrder') ?? 'asc') as 'asc' | 'desc'

  const { data, isLoading, isError, refetch } = useFlights({
    page,
    limit: LIMIT,
    origin,
    destination: dest,
    class: cls,
    stops,
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

  const hasActive = !!(origin || dest || cls || stopsRaw !== null)
  const items = data?.data.items ?? []
  const meta = data?.data.meta

  return (
    <div>
      <PageHeader
        title='Flights'
        description='Find the best flights to match destinations across Europe'
        icon={Plane}
      />

      <FlightFilters
        searchParams={searchParams}
        onFilterChange={updateParam}
        onClearAll={clearAll}
      />

      {isLoading && (
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6'>
          {Array.from({ length: LIMIT }).map((_, i) => (
            <FlightSkeleton key={i} />
          ))}
        </div>
      )}

      {isError && (
        <EmptyState
          title='Failed to load flights'
          description='There was a problem fetching flights. Please try again.'
          icon={Plane}
          action={{ label: 'Retry', onClick: () => void refetch() }}
        />
      )}

      {!isLoading && !isError && items.length === 0 && (
        <EmptyState
          title='No flights found'
          description={
            hasActive
              ? 'Try adjusting your filters.'
              : 'No flights are available right now.'
          }
          icon={Plane}
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
            key={`${origin ?? ''}-${dest ?? ''}-${cls ?? ''}-${stopsRaw ?? ''}-${sortBy}-${sortOrder}-${page}`}
            className='grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6'
          >
            {items.map((flight, i) => (
              <motion.div
                key={flight.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: {
                    delay: i * 0.07,
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
                <FlightCard flight={flight} variant='full' />
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

export default function FlightsPage() {
  return (
    <Suspense
      fallback={
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6'>
          {Array.from({ length: LIMIT }).map((_, i) => (
            <FlightSkeleton key={i} />
          ))}
        </div>
      }
    >
      <FlightsContent />
    </Suspense>
  )
}
