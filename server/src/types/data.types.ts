/**
 * types/data.types.ts
 *
 * Canonical TypeScript interfaces for the three core data entities: Ticket,
 * Flight, and Hotel, plus the shared pagination envelope types.
 *
 * These interfaces are the contract between the data layer and every consumer
 * (services, controllers, and eventually the frontend via a shared package).
 * Changes here must be reflected in the frontend types and in any future
 * Mongoose models created when replacing the mock data layer.
 *
 * Design note: string-literal union types (e.g. `status`) are preferred over
 * plain `string` so that TypeScript enforces valid values at compile time.
 */

// ── Ticket ────────────────────────────────────────────────────────────────────

export interface Ticket {
  id: string
  homeTeam: string
  awayTeam: string
  stadium: string
  city: string
  country: string
  /** ISO 8601 datetime string, e.g. "2026-04-20T15:00:00.000Z" */
  date: string
  /** Local kick-off time display string, e.g. "15:00" */
  kickoffTime: string
  competition: string
  category: 'Standard' | 'Premium' | 'VIP'
  section: string
  seat: string
  /** Price in USD */
  price: number
  currency: string
  availableSeats: number
  totalSeats: number
  status: 'available' | 'selling_fast' | 'sold_out'
  featured: boolean
}

// ── Flight ────────────────────────────────────────────────────────────────────

export interface FlightCity {
  city: string
  country: string
  airport: string
  /** IATA airport code, e.g. "LHR" */
  code: string
}

export interface Flight {
  id: string
  airline: string
  /** Two-letter IATA carrier code, e.g. "BA" */
  airlineCode: string
  flightNumber: string
  origin: FlightCity
  destination: FlightCity
  /** ISO 8601 datetime string */
  departure: string
  /** ISO 8601 datetime string */
  arrival: string
  /** Human-readable duration string, e.g. "5h 30m" */
  duration: string
  /** Number of stopovers (0 = direct) */
  stops: number
  class: 'Economy' | 'Business' | 'First'
  /** Price in USD */
  price: number
  currency: string
  seatsAvailable: number
  featured: boolean
}

// ── Hotel ─────────────────────────────────────────────────────────────────────

export interface Hotel {
  id: string
  name: string
  brand: string
  city: string
  country: string
  address: string
  /** e.g. "2.1 km from Emirates Stadium" */
  distanceToStadium: string
  /** 1–5 star rating */
  stars: number
  /** Guest review score, e.g. 4.7 */
  rating: number
  reviewCount: number
  amenities: string[]
  /** ISO 8601 datetime string for check-in */
  checkIn: string
  /** ISO 8601 datetime string for check-out */
  checkOut: string
  /** Length of stay in nights */
  nights: number
  /** Price per night in USD */
  pricePerNight: number
  currency: string
  roomType: string
  featured: boolean
}

// ── Pagination ────────────────────────────────────────────────────────────────

export interface PaginationMeta {
  /** Total matching items across all pages */
  total: number
  /** Current page number (1-indexed) */
  page: number
  /** Items per page */
  limit: number
  /** Total number of pages */
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export interface PaginatedResponse<T> {
  items: T[]
  meta: PaginationMeta
}
