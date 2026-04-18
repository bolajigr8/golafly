/**
 * routes/auth.routes.ts
 *
 * Declares all /api/auth/* routes and assembles the correct middleware stack
 * for each one. The ordering within each stack matters:
 *
 *   Public routes  → rate limiter → Zod validation → controller
 *   Private routes → verifyToken middleware → controller
 *
 * Route-specific rate limiters (authLimiter) are applied individually rather
 * than globally so future routes with different threat profiles can have
 * independent limits.
 */

import { Router } from 'express'
import { authLimiter } from '../middleware/rateLimiter.middleware.js'
import { validate } from '../middleware/validate.middleware.js'
import { verifyToken } from '../middleware/auth.middleware.js'
import { registerSchema, loginSchema } from '../schemas/auth.schema.js'
import {
  register,
  login,
  logout,
  getMe,
} from '../controllers/auth.controller.js'

const router = Router()

/**
 * POST /api/auth/register
 * Rate-limited + validated. Creates a new user account and sets a JWT cookie.
 */
router.post('/register', authLimiter, validate(registerSchema), register)

/**
 * POST /api/auth/login
 * Rate-limited + validated. Authenticates credentials and sets a JWT cookie.
 */
router.post('/login', authLimiter, validate(loginSchema), login)

/**
 * POST /api/auth/logout
 * Requires a valid session. Blacklists the token and clears the cookie.
 */
router.post('/logout', verifyToken, logout)

/**
 * GET /api/auth/me
 * Requires a valid session. Returns the authenticated user's profile.
 */
router.get('/me', verifyToken, getMe)

export default router
