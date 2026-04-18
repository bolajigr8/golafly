/**
 * schemas/query.schema.ts
 *
 * Zod schemas for validating HTTP query-string parameters on all data routes.
 * Query strings arrive as raw strings, so Zod's `.coerce` is used to convert
 * numeric and boolean fields before validation runs.
 *
 * Each schema composes a shared `paginationSchema` base, then adds entity-
 * specific filters and sort options on top.
 *
 * Exported TypeScript types are inferred from the schemas so the service layer
 * is fully typed without any duplicate interface declarations.
 */

import { z } from 'zod'

// ── Shared: Pagination ────────────────────────────────────────────────────────

/**
 * Base pagination fields shared by every query schema.
 * `page` and `limit` are coerced from string to number automatically
 * because query-string values are always strings.
 */
const paginationSchema = z.object({
  page: z.coerce
    .number()
    .int('page must be an integer.')
    .min(1, 'page must be at least 1.')
    .default(1),

  limit: z.coerce
    .number()
    .int('limit must be an integer.')
    .min(1, 'limit must be at least 1.')
    .max(50, 'limit cannot exceed 50.')
    .default(6),
})

// ── Tickets ───────────────────────────────────────────────────────────────────

/**
 * Query schema for GET /api/tickets
 * All filter fields are optional — omitting them returns unfiltered results.
 */
export const ticketQuerySchema = paginationSchema.extend({
  /** Filter by competition name (case-insensitive partial match) */
  competition: z.string().trim().optional(),

  /** Filter by ticket availability status */
  status: z
    .enum(['available', 'selling_fast', 'sold_out'])
    .optional(),

  /** Filter by ticket tier */
  category: z.enum(['Standard', 'Premium', 'VIP']).optional(),

  /**
   * Filter to featured items only.
   * Coerced from the string "true" / "false" that arrives in the query string.
   */
  featured: z
    .union([z.literal('true'), z.literal('false')])
    .transform((v) => v === 'true')
    .optional(),

  /** Field to sort results by */
  sortBy: z
    .enum(['date', 'price', 'competition', 'availableSeats'])
    .default('date'),

  sortOrder: z.enum(['asc', 'desc']).default('asc'),
})

export type TicketQuery = z.infer<typeof ticketQuerySchema>

// ── Flights ───────────────────────────────────────────────────────────────────

/**
 * Query schema for GET /api/flights
 */
export const flightQuerySchema = paginationSchema.extend({
  /** Filter by IATA origin airport code (case-insensitive, e.g. "LOS") */
  origin: z.string().trim().toUpperCase().optional(),

  /** Filter by IATA destination airport code (case-insensitive, e.g. "LHR") */
  destination: z.string().trim().toUpperCase().optional(),

  /** Filter by cabin class */
  class: z.enum(['Economy', 'Business', 'First']).optional(),

  /**
   * Filter by number of stops.
   * Coerced from query string (e.g. "?stops=0" → 0).
   */
  stops: z.coerce
    .number()
    .int('stops must be an integer.')
    .min(0, 'stops cannot be negative.')
    .optional(),

  featured: z
    .union([z.literal('true'), z.literal('false')])
    .transform((v) => v === 'true')
    .optional(),

  sortBy: z
    .enum(['departure', 'price', 'duration', 'seatsAvailable'])
    .default('departure'),

  sortOrder: z.enum(['asc', 'desc']).default('asc'),
})

export type FlightQuery = z.infer<typeof flightQuerySchema>

// ── Hotels ────────────────────────────────────────────────────────────────────

/**
 * Query schema for GET /api/hotels
 */
export const hotelQuerySchema = paginationSchema.extend({
  /** Filter by city name (case-insensitive partial match) */
  city: z.string().trim().optional(),

  /**
   * Filter by star rating.
   * Coerced from query string. Valid range: 3–5.
   */
  stars: z.coerce
    .number()
    .int('stars must be an integer.')
    .min(3, 'stars must be between 3 and 5.')
    .max(5, 'stars must be between 3 and 5.')
    .optional(),

  featured: z
    .union([z.literal('true'), z.literal('false')])
    .transform((v) => v === 'true')
    .optional(),

  sortBy: z
    .enum(['pricePerNight', 'rating', 'stars', 'reviewCount'])
    .default('pricePerNight'),

  sortOrder: z.enum(['asc', 'desc']).default('asc'),
})

export type HotelQuery = z.infer<typeof hotelQuerySchema>
