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

router.use(verifyToken)
router.use(apiLimiter)

router.get('/tickets', getTickets)
router.get('/tickets/:id', getTicketById)

router.get('/flights', getFlights)
router.get('/flights/:id', getFlightById)

router.get('/hotels', getHotels)
router.get('/hotels/:id', getHotelById)

router.get('/dashboard/overview', getDashboardOverview)

export default router
