'use client'

import Link from 'next/link'
import { ArrowRight, Ticket, Plane, Hotel } from 'lucide-react'
import { WelcomeBanner } from '@/components/dashboard/WelcomeBanner'
import { TicketCard } from '@/components/tickets/TicketCard'
import { TicketSkeleton } from '@/components/tickets/TicketSkeleton'
import { FlightCard } from '@/components/flights/FlightCard'
import { FlightSkeleton } from '@/components/flights/FlightSkeleton'
import { HotelCard } from '@/components/hotels/HotelCard'
import { HotelSkeleton } from '@/components/hotels/HotelSkeleton'
import { useDashboardOverview } from '@/hooks/useDashboardOverview'
import { ROUTES } from '@/constants/routes'

function SectionHeader({
  icon: Icon,
  title,
  href,
  count,
}: {
  icon: React.ElementType
  title: string
  href: string
  count?: number
}) {
  return (
    <div className='flex items-center justify-between mb-4'>
      <div className='flex items-center gap-2.5'>
        <div className='flex items-center justify-center w-8 h-8 rounded-lg bg-brand/10 dark:bg-brand/30'>
          <Icon size={16} className='text-brand dark:text-gold' />
        </div>
        <div>
          <h2
            className='text-base font-bold text-foreground'
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {title}
          </h2>
          {count !== undefined && (
            <p className='text-[11px] text-muted-foreground'>
              {count} featured
            </p>
          )}
        </div>
      </div>
      <Link
        href={href}
        className='flex items-center gap-1 text-xs font-semibold text-gold hover:text-gold-dark transition-colors group'
      >
        View all{' '}
        <ArrowRight
          size={12}
          className='group-hover:translate-x-0.5 transition-transform'
        />
      </Link>
    </div>
  )
}

export function DashboardOverviewClient() {
  const { data, isLoading, isError } = useDashboardOverview()
  const tickets = data?.data.tickets ?? []
  const flights = data?.data.flights ?? []
  const hotels = data?.data.hotels ?? []

  return (
    <div className='space-y-8 animate-fade-in'>
      <WelcomeBanner />
      {isError && (
        <div className='rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive'>
          Failed to load overview data. Please refresh the page.
        </div>
      )}
      <section>
        <SectionHeader
          icon={Ticket}
          title='Featured Matches'
          href={ROUTES.TICKETS}
          count={tickets.length}
        />
        <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4'>
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => (
                <TicketSkeleton key={i} />
              ))
            : tickets
                .slice(0, 3)
                .map((t) => <TicketCard key={t.id} ticket={t} />)}
        </div>
      </section>
      <section>
        <SectionHeader
          icon={Plane}
          title='Top Flights'
          href={ROUTES.FLIGHTS}
          count={flights.length}
        />
        <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4'>
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => (
                <FlightSkeleton key={i} />
              ))
            : flights
                .slice(0, 3)
                .map((f) => <FlightCard key={f.id} flight={f} />)}
        </div>
      </section>
      <section>
        <SectionHeader
          icon={Hotel}
          title='Top Hotels'
          href={ROUTES.HOTELS}
          count={hotels.length}
        />
        <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4'>
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => <HotelSkeleton key={i} />)
            : hotels.slice(0, 3).map((h) => <HotelCard key={h.id} hotel={h} />)}
        </div>
      </section>
    </div>
  )
}
