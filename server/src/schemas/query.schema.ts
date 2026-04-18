import { z } from 'zod'

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

export const ticketQuerySchema = paginationSchema.extend({
  competition: z.string().trim().optional(),

  status: z.enum(['available', 'selling_fast', 'sold_out']).optional(),

  category: z.enum(['Standard', 'Premium', 'VIP']).optional(),

  featured: z
    .union([z.literal('true'), z.literal('false')])
    .transform((v) => v === 'true')
    .optional(),

  sortBy: z
    .enum(['date', 'price', 'competition', 'availableSeats'])
    .default('date'),

  sortOrder: z.enum(['asc', 'desc']).default('asc'),
})

export type TicketQuery = z.infer<typeof ticketQuerySchema>

export const flightQuerySchema = paginationSchema.extend({
  origin: z.string().trim().toUpperCase().optional(),

  destination: z.string().trim().toUpperCase().optional(),

  class: z.enum(['Economy', 'Business', 'First']).optional(),

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

export const hotelQuerySchema = paginationSchema.extend({
  city: z.string().trim().optional(),

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
