/**
 * controllers/data.controller.ts
 *
 * Thin HTTP-layer controllers for the data routes. Each controller:
 *   1. Parses and validates query params / route params with Zod
 *   2. Delegates to the data service
 *   3. Sends a standardised JSON response via sendSuccess
 *   4. Delegates error handling to the global error middleware via asyncHandler
 *
 * No business or filtering logic lives here — keep that in data.service.ts.
 */

import { Request, Response } from 'express'
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
 * ApiError if validation fails, so the global error handler formats it
 * identically to body validation errors.
 */
const parseQuery = <T>(
  schema: { safeParse: (input: unknown) => { success: true; data: T } | { success: false; error: { issues: { path: (string | number)[]; message: string }[] } } },
  query: unknown
): T => {
  const result = schema.safeParse(query)
  if (!result.success) {
    const message = result.error.issues
      .map((i) => `${i.path.join('.') || 'query'}: ${i.message}`)
      .join('; ')
    throw ApiError.badRequest(`Invalid query parameters — ${message}`)
  }
  return result.data
}

// ── Tickets ───────────────────────────────────────────────────────────────────

/**
 * GET /api/tickets
 * Returns a filtered, sorted, and paginated list of match tickets.
 */
export const getTickets = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const query = parseQuery(ticketQuerySchema, req.query)
    const result = svcGetTickets(query)

    sendSuccess(res, 200, 'Tickets retrieved successfully.', result)
  }
)

/**
 * GET /api/tickets/:id
 * Returns a single ticket by its ID, or 404 if not found.
 */
export const getTicketById = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params as { id: string }
    const ticket = svcGetTicketById(id)

    if (ticket === null) {
      throw ApiError.notFound(`Ticket with id '${id}' was not found.`)
    }

    sendSuccess(res, 200, 'Ticket retrieved successfully.', { ticket })
  }
)

// ── Flights ───────────────────────────────────────────────────────────────────

/**
 * GET /api/flights
 * Returns a filtered, sorted, and paginated list of flights.
 */
export const getFlights = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const query = parseQuery(flightQuerySchema, req.query)
    const result = svcGetFlights(query)

    sendSuccess(res, 200, 'Flights retrieved successfully.', result)
  }
)

/**
 * GET /api/flights/:id
 * Returns a single flight by its ID, or 404 if not found.
 */
export const getFlightById = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params as { id: string }
    const flight = svcGetFlightById(id)

    if (flight === null) {
      throw ApiError.notFound(`Flight with id '${id}' was not found.`)
    }

    sendSuccess(res, 200, 'Flight retrieved successfully.', { flight })
  }
)

// ── Hotels ────────────────────────────────────────────────────────────────────

/**
 * GET /api/hotels
 * Returns a filtered, sorted, and paginated list of hotels.
 */
export const getHotels = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const query = parseQuery(hotelQuerySchema, req.query)
    const result = svcGetHotels(query)

    sendSuccess(res, 200, 'Hotels retrieved successfully.', result)
  }
)

/**
 * GET /api/hotels/:id
 * Returns a single hotel by its ID, or 404 if not found.
 */
export const getHotelById = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params as { id: string }
    const hotel = svcGetHotelById(id)

    if (hotel === null) {
      throw ApiError.notFound(`Hotel with id '${id}' was not found.`)
    }

    sendSuccess(res, 200, 'Hotel retrieved successfully.', { hotel })
  }
)

// ── Dashboard ─────────────────────────────────────────────────────────────────

/**
 * GET /api/dashboard/overview
 * Returns all featured tickets, flights, and hotels for the home dashboard.
 * No pagination — featured items are curated and intentionally few.
 */
export const getDashboardOverview = asyncHandler(
  async (_req: Request, res: Response): Promise<void> => {
    const { tickets, flights, hotels } = getFeaturedItems()

    sendSuccess(res, 200, 'Dashboard overview retrieved successfully.', {
      tickets,
      flights,
      hotels,
    })
  }
)
