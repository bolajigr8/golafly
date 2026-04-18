/**
 * services/data.service.ts
 *
 * Filtering, sorting, and pagination logic for all three data entities.
 * All functions are pure: they take typed query params and return typed results.
 *
 * Architecture note — DB swappability:
 *   The mock arrays are the only thing that ties this layer to in-memory data.
 *   To replace with a real database:
 *     1. Remove the `mockTickets / mockFlights / mockHotels` imports
 *     2. Replace each filter/sort/slice block with the equivalent Mongoose query
 *     3. Controllers remain completely unchanged
 */

import { mockTickets, mockFlights, mockHotels } from '../data/mock/index.js'
import type {
  Ticket,
  Flight,
  Hotel,
  PaginatedResponse,
  PaginationMeta,
} from '../types/data.types.js'
import type {
  TicketQuery,
  FlightQuery,
  HotelQuery,
} from '../schemas/query.schema.js'

// ── Shared: Pagination ────────────────────────────────────────────────────────

/**
 * Slices an already-filtered and sorted array into a single page and wraps
 * it with the pagination metadata expected by the frontend.
 *
 * @param items - The full filtered array (not yet sliced).
 * @param page  - 1-indexed current page number.
 * @param limit - Number of items per page.
 */
export const paginate = <T>(
  items: T[],
  page: number,
  limit: number
): PaginatedResponse<T> => {
  const total = items.length
  const totalPages = Math.ceil(total / limit)
  const safePage = Math.min(page, totalPages || 1)
  const startIndex = (safePage - 1) * limit
  const endIndex = startIndex + limit

  const meta: PaginationMeta = {
    total,
    page: safePage,
    limit,
    totalPages: totalPages || 1,
    hasNextPage: safePage < totalPages,
    hasPrevPage: safePage > 1,
  }

  return {
    items: items.slice(startIndex, endIndex),
    meta,
  }
}

// ── Tickets ───────────────────────────────────────────────────────────────────

/**
 * Returns a filtered, sorted, and paginated list of tickets.
 *
 * Filters applied (all optional, all combinable):
 *   - competition: case-insensitive partial match
 *   - status: exact match
 *   - category: exact match
 *   - featured: boolean exact match
 *
 * @param query - Validated query parameters from `ticketQuerySchema`.
 */
export const getTickets = (query: TicketQuery): PaginatedResponse<Ticket> => {
  let results = [...mockTickets]

  // ── Filter ─────────────────────────────────────────────────────────────────
  if (query.competition !== undefined) {
    const term = query.competition.toLowerCase()
    results = results.filter((t) =>
      t.competition.toLowerCase().includes(term)
    )
  }

  if (query.status !== undefined) {
    results = results.filter((t) => t.status === query.status)
  }

  if (query.category !== undefined) {
    results = results.filter((t) => t.category === query.category)
  }

  if (query.featured !== undefined) {
    results = results.filter((t) => t.featured === query.featured)
  }

  // ── Sort ───────────────────────────────────────────────────────────────────
  const direction = query.sortOrder === 'desc' ? -1 : 1

  results.sort((a, b) => {
    switch (query.sortBy) {
      case 'date':
        return (
          direction *
          (new Date(a.date).getTime() - new Date(b.date).getTime())
        )
      case 'price':
        return direction * (a.price - b.price)
      case 'competition':
        return direction * a.competition.localeCompare(b.competition)
      case 'availableSeats':
        return direction * (a.availableSeats - b.availableSeats)
    }
  })

  return paginate(results, query.page, query.limit)
}

/**
 * Finds a single ticket by its ID.
 *
 * @param id - The ticket's `id` field (e.g. "tkt-001").
 * @returns The matching Ticket, or `null` if not found.
 */
export const getTicketById = (id: string): Ticket | null => {
  return mockTickets.find((t) => t.id === id) ?? null
}

// ── Flights ───────────────────────────────────────────────────────────────────

/**
 * Returns a filtered, sorted, and paginated list of flights.
 *
 * Filters applied (all optional, all combinable):
 *   - origin: case-insensitive match against IATA code
 *   - destination: case-insensitive match against IATA code
 *   - class: exact match
 *   - stops: exact match
 *   - featured: boolean exact match
 *
 * @param query - Validated query parameters from `flightQuerySchema`.
 */
export const getFlights = (query: FlightQuery): PaginatedResponse<Flight> => {
  let results = [...mockFlights]

  // ── Filter ─────────────────────────────────────────────────────────────────
  if (query.origin !== undefined) {
    const term = query.origin.toUpperCase()
    results = results.filter((f) => f.origin.code.toUpperCase() === term)
  }

  if (query.destination !== undefined) {
    const term = query.destination.toUpperCase()
    results = results.filter(
      (f) => f.destination.code.toUpperCase() === term
    )
  }

  if (query.class !== undefined) {
    results = results.filter((f) => f.class === query.class)
  }

  if (query.stops !== undefined) {
    results = results.filter((f) => f.stops === query.stops)
  }

  if (query.featured !== undefined) {
    results = results.filter((f) => f.featured === query.featured)
  }

  // ── Sort ───────────────────────────────────────────────────────────────────
  const direction = query.sortOrder === 'desc' ? -1 : 1

  results.sort((a, b) => {
    switch (query.sortBy) {
      case 'departure':
        return (
          direction *
          (new Date(a.departure).getTime() - new Date(b.departure).getTime())
        )
      case 'price':
        return direction * (a.price - b.price)
      case 'duration':
        // Sort alphabetically on the duration string — good enough for display
        return direction * a.duration.localeCompare(b.duration)
      case 'seatsAvailable':
        return direction * (a.seatsAvailable - b.seatsAvailable)
    }
  })

  return paginate(results, query.page, query.limit)
}

/**
 * Finds a single flight by its ID.
 *
 * @param id - The flight's `id` field (e.g. "flt-001").
 * @returns The matching Flight, or `null` if not found.
 */
export const getFlightById = (id: string): Flight | null => {
  return mockFlights.find((f) => f.id === id) ?? null
}

// ── Hotels ────────────────────────────────────────────────────────────────────

/**
 * Returns a filtered, sorted, and paginated list of hotels.
 *
 * Filters applied (all optional, all combinable):
 *   - city: case-insensitive partial match
 *   - stars: exact integer match
 *   - featured: boolean exact match
 *
 * @param query - Validated query parameters from `hotelQuerySchema`.
 */
export const getHotels = (query: HotelQuery): PaginatedResponse<Hotel> => {
  let results = [...mockHotels]

  // ── Filter ─────────────────────────────────────────────────────────────────
  if (query.city !== undefined) {
    const term = query.city.toLowerCase()
    results = results.filter((h) => h.city.toLowerCase().includes(term))
  }

  if (query.stars !== undefined) {
    results = results.filter((h) => h.stars === query.stars)
  }

  if (query.featured !== undefined) {
    results = results.filter((h) => h.featured === query.featured)
  }

  // ── Sort ───────────────────────────────────────────────────────────────────
  const direction = query.sortOrder === 'desc' ? -1 : 1

  results.sort((a, b) => {
    switch (query.sortBy) {
      case 'pricePerNight':
        return direction * (a.pricePerNight - b.pricePerNight)
      case 'rating':
        return direction * (a.rating - b.rating)
      case 'stars':
        return direction * (a.stars - b.stars)
      case 'reviewCount':
        return direction * (a.reviewCount - b.reviewCount)
    }
  })

  return paginate(results, query.page, query.limit)
}

/**
 * Finds a single hotel by its ID.
 *
 * @param id - The hotel's `id` field (e.g. "htl-001").
 * @returns The matching Hotel, or `null` if not found.
 */
export const getHotelById = (id: string): Hotel | null => {
  return mockHotels.find((h) => h.id === id) ?? null
}

// ── Dashboard ─────────────────────────────────────────────────────────────────

/**
 * Returns all featured items from every entity — used for the dashboard
 * overview. No pagination is applied here because the number of featured
 * items is intentionally small and controlled by the fixture data.
 */
export const getFeaturedItems = (): {
  tickets: Ticket[]
  flights: Flight[]
  hotels: Hotel[]
} => ({
  tickets: mockTickets.filter((t) => t.featured),
  flights: mockFlights.filter((f) => f.featured),
  hotels: mockHotels.filter((h) => h.featured),
})
