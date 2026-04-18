/**
 * controllers/data.controller.ts
 */

import { Request, Response } from 'express'
import { z } from 'zod' // ← add this import
import { asyncHandler } from '../utils/asyncHandler.js'
import { sendSuccess } from '../utils/response.js'
import { ApiError } from '../utils/ApiError.js'
import {
  ticketQuerySchema,
  flightQuerySchema,
  hotelQuerySchema,
} from '../schemas/query.schema.js'
import {
  getTickets as svcGetTickets,
  getTicketById as svcGetTicketById,
  getFlights as svcGetFlights,
  getFlightById as svcGetFlightById,
  getHotels as svcGetHotels,
  getHotelById as svcGetHotelById,
  getFeaturedItems,
} from '../services/data.service.js'

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Parses a Zod schema against `req.query` and throws a structured 400
 * ApiError if validation fails.
 *
 * Schema is typed as `z.ZodType<T>` so Zod's own internal types flow
 * through — avoiding the mismatch introduced in Zod v4 where
 * `$ZodIssue.path` became `PropertyKey[]` instead of `(string | number)[]`.
 *
 * Symbol keys (technically valid PropertyKeys) are stripped from the path
 * when building the human-readable error message.
 */
const parseQuery = <T>(
  schema: z.ZodType<T>, // ← was a hand-written structural type; now uses Zod's own
  query: unknown,
): T => {
  const result = schema.safeParse(query)
  if (!result.success) {
    const message = result.error.issues
      .map((i) => {
        // Zod v4: path is PropertyKey[] — filter out symbols before joining
        const pathStr = i.path
          .filter((k): k is string | number => typeof k !== 'symbol')
          .join('.')
        return `${pathStr || 'query'}: ${i.message}`
      })
      .join('; ')
    throw ApiError.badRequest(`Invalid query parameters — ${message}`)
  }
  return result.data
}

// ── Tickets ───────────────────────────────────────────────────────────────────

export const getTickets = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const query = parseQuery(ticketQuerySchema, req.query)
    const result = svcGetTickets(query)
    sendSuccess(res, 200, 'Tickets retrieved successfully.', result)
  },
)

export const getTicketById = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params as { id: string }
    const ticket = svcGetTicketById(id)
    if (ticket === null) {
      throw ApiError.notFound(`Ticket with id '${id}' was not found.`)
    }
    sendSuccess(res, 200, 'Ticket retrieved successfully.', { ticket })
  },
)

// ── Flights ───────────────────────────────────────────────────────────────────

export const getFlights = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const query = parseQuery(flightQuerySchema, req.query)
    const result = svcGetFlights(query)
    sendSuccess(res, 200, 'Flights retrieved successfully.', result)
  },
)

export const getFlightById = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params as { id: string }
    const flight = svcGetFlightById(id)
    if (flight === null) {
      throw ApiError.notFound(`Flight with id '${id}' was not found.`)
    }
    sendSuccess(res, 200, 'Flight retrieved successfully.', { flight })
  },
)

// ── Hotels ────────────────────────────────────────────────────────────────────

export const getHotels = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const query = parseQuery(hotelQuerySchema, req.query)
    const result = svcGetHotels(query)
    sendSuccess(res, 200, 'Hotels retrieved successfully.', result)
  },
)

export const getHotelById = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params as { id: string }
    const hotel = svcGetHotelById(id)
    if (hotel === null) {
      throw ApiError.notFound(`Hotel with id '${id}' was not found.`)
    }
    sendSuccess(res, 200, 'Hotel retrieved successfully.', { hotel })
  },
)

// ── Dashboard ─────────────────────────────────────────────────────────────────

export const getDashboardOverview = asyncHandler(
  async (_req: Request, res: Response): Promise<void> => {
    const { tickets, flights, hotels } = getFeaturedItems()
    sendSuccess(res, 200, 'Dashboard overview retrieved successfully.', {
      tickets,
      flights,
      hotels,
    })
  },
)
