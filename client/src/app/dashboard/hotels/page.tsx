'use client'

import { useCallback, Suspense } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { Building2 } from 'lucide-react'
import { useHotels } from '@/hooks/useHotels'
import { HotelCard } from '@/components/hotels/HotelCard'
import { HotelSkeleton } from '@/components/hotels/HotelSkeleton'
import { HotelFilters } from '@/components/hotels/HotelFilters'
import { PageHeader } from '@/components/common/PageHeader'
import { Pagination } from '@/components/common/Pagination'
import { EmptyState } from '@/components/common/EmptyState'

const LIMIT = 6

function HotelsContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const page = Number(searchParams.get('page') ?? '1')
  const city = searchParams.get('city') ?? undefined
  const starsRaw = searchParams.get('stars')
  const stars = starsRaw !== null ? Number(starsRaw) : undefined
  const sortBy = searchParams.get('sortBy') ?? 'pricePerNight'
  const sortOrder = (searchParams.get('sortOrder') ?? 'asc') as 'asc' | 'desc'

  const { data, isLoading, isError, refetch } = useHotels({
    page,
    limit: LIMIT,
    city,
    stars,
    sortBy,
    sortOrder,
  })

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      value ? params.set(key, value) : params.delete(key)
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

  const hasActive = city ?? (starsRaw !== null ? true : false)
  const items = data?.data.items ?? []
  const meta = data?.data.meta

  return (
    <div>
      <PageHeader
        title='Hotels'
        description='Stay close to the action with stadium-side hotels'
        icon={Building2}
      />
      <HotelFilters
        searchParams={searchParams}
        onFilterChange={updateParam}
        onClearAll={clearAll}
      />

      {isLoading && (
        <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6'>
          {Array.from({ length: LIMIT }).map((_, i) => (
            <HotelSkeleton key={i} />
          ))}
        </div>
      )}

      {isError && (
        <EmptyState
          title='Failed to load hotels'
          description='There was a problem fetching hotels. Please try again.'
          icon={Building2}
          action={{ label: 'Retry', onClick: () => void refetch() }}
        />
      )}

      {!isLoading && !isError && items.length === 0 && (
        <EmptyState
          title='No hotels found'
          description={
            hasActive
              ? 'Try adjusting your filters to see more results.'
              : 'No hotels are available right now.'
          }
          icon={Building2}
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
            key={`${city ?? ''}-${starsRaw ?? ''}-${sortBy}-${sortOrder}-${page}`}
            className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6'
          >
            {items.map((hotel, i) => (
              <motion.div
                key={hotel.id}
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
                <HotelCard hotel={hotel} variant='full' />
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

export default function HotelsPage() {
  return (
    <Suspense
      fallback={
        <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6'>
          {Array.from({ length: 6 }).map((_, i) => (
            <HotelSkeleton key={i} />
          ))}
        </div>
      }
    >
      <HotelsContent />
    </Suspense>
  )
}
