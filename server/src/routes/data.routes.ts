/**
 * routes/data.routes.ts
 *
 * All read-only data routes for tickets, flights, hotels, and the dashboard
 * overview. Every route requires:
 *   - verifyToken — the user must be authenticated
 *   - apiLimiter  — 100 requests per 15 minutes per IP
 *
 * Mounted in app.ts under '/api', so the effective paths are:
 *   GET /api/tickets
 *   GET /api/tickets/:id
 *   GET /api/flights
 *   GET /api/flights/:id
 *   GET /api/hotels
 *   GET /api/hotels/:id
 *   GET /api/dashboard/overview
 */

import { Router } from 'express'
import { verifyToken } from '../middleware/auth.middleware.js'
import { apiLimiter } from '../middleware/rateLimiter.middleware.js'
import {
  getTickets,
  getTicketById,
  getFlights,
  getFlightById,
  getHotels,
  getHotelById,
  getDashboardOverview,
} from '../controllers/data.controller.js'

const router = Router()

// Apply auth + rate limiter to every data route
router.use(verifyToken)
router.use(apiLimiter)

// ── Tickets ───────────────────────────────────────────────────────────────────
router.get('/tickets', getTickets)
router.get('/tickets/:id', getTicketById)

// ── Flights ───────────────────────────────────────────────────────────────────
router.get('/flights', getFlights)
router.get('/flights/:id', getFlightById)

// ── Hotels ────────────────────────────────────────────────────────────────────
router.get('/hotels', getHotels)
router.get('/hotels/:id', getHotelById)

// ── Dashboard ─────────────────────────────────────────────────────────────────
router.get('/dashboard/overview', getDashboardOverview)

export default router
