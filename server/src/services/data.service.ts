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

export const paginate = <T>(
  items: T[],
  page: number,
  limit: number,
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

export const getTickets = (query: TicketQuery): PaginatedResponse<Ticket> => {
  let results = [...mockTickets]

  if (query.competition !== undefined) {
    const term = query.competition.toLowerCase()
    results = results.filter((t) => t.competition.toLowerCase().includes(term))
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

  const direction = query.sortOrder === 'desc' ? -1 : 1

  results.sort((a, b) => {
    switch (query.sortBy) {
      case 'date':
        return (
          direction * (new Date(a.date).getTime() - new Date(b.date).getTime())
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

export const getTicketById = (id: string): Ticket | null => {
  return mockTickets.find((t) => t.id === id) ?? null
}

export const getFlights = (query: FlightQuery): PaginatedResponse<Flight> => {
  let results = [...mockFlights]

  if (query.origin !== undefined) {
    const term = query.origin.toUpperCase()
    results = results.filter((f) => f.origin.code.toUpperCase() === term)
  }

  if (query.destination !== undefined) {
    const term = query.destination.toUpperCase()
    results = results.filter((f) => f.destination.code.toUpperCase() === term)
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
        return direction * a.duration.localeCompare(b.duration)
      case 'seatsAvailable':
        return direction * (a.seatsAvailable - b.seatsAvailable)
    }
  })

  return paginate(results, query.page, query.limit)
}

export const getFlightById = (id: string): Flight | null => {
  return mockFlights.find((f) => f.id === id) ?? null
}

export const getHotels = (query: HotelQuery): PaginatedResponse<Hotel> => {
  let results = [...mockHotels]

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

export const getHotelById = (id: string): Hotel | null => {
  return mockHotels.find((h) => h.id === id) ?? null
}

export const getFeaturedItems = (): {
  tickets: Ticket[]
  flights: Flight[]
  hotels: Hotel[]
} => ({
  tickets: mockTickets.filter((t) => t.featured),
  flights: mockFlights.filter((f) => f.featured),
  hotels: mockHotels.filter((h) => h.featured),
})
