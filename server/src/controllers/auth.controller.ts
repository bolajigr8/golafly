/**
 * controllers/auth.controller.ts
 *
 * Thin HTTP-layer controllers for authentication routes. Each function:
 *   1. Extracts validated data from `req.body` (already type-safe after Zod middleware)
 *   2. Delegates to the corresponding service function
 *   3. Sets / clears the httpOnly JWT cookie
 *   4. Sends a standardised JSON response via `sendSuccess`
 *
 * No business logic lives here — keep it in auth.service.ts.
 */

import { Request, Response } from 'express'
import { asyncHandler } from '../utils/asyncHandler.js'
import { sendSuccess } from '../utils/response.js'
import { env } from '../config/env.js'
import {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
} from '../services/auth.service.js'
import {
  signToken,
  extractTokenFromCookie,
  verifyToken,
} from '../services/token.service.js'
import { RegisterInput, LoginInput } from '../schemas/auth.schema.js'
import { IUser } from '../models/User.js'

// ── Cookie configuration ───────────────────────────────────────────────────

/** 7 days expressed in milliseconds for the cookie `maxAge` option */
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000

/**
 * Options applied to the JWT cookie on every set/clear operation.
 * `secure: true` is enforced in production so the cookie is only transmitted
 * over HTTPS. `httpOnly: true` prevents client-side JavaScript from reading it.
 */
const cookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  maxAge: SEVEN_DAYS_MS,
  path: '/',
}

// ── Helpers ────────────────────────────────────────────────────────────────

/**
 * Strips the hashed password from a user document before sending it to the
 * client. We never expose the stored hash — even though it's bcrypt-hashed —
 * because there is no legitimate reason for the client to have it.
 *
 * @param user - The Mongoose IUser document.
 * @returns A plain object safe to include in API responses.
 */
const sanitizeUser = (
  user: IUser
): {
  id: string
  fullName: string
  email: string
  createdAt: Date
  updatedAt: Date
} => ({
  id: user.id as string,
  fullName: user.fullName,
  email: user.email,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
})

// ── Controllers ────────────────────────────────────────────────────────────

/**
 * POST /api/auth/register
 *
 * Creates a new user account, signs a JWT, sets the cookie, and returns the
 * sanitized user profile with a 201 status.
 */
export const register = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const input = req.body as RegisterInput

    const user = await registerUser(input)
    const token = signToken({ id: user.id as string, email: user.email })

    res.cookie('token', token, cookieOptions)

    sendSuccess(res, 201, 'Account created successfully.', {
      user: sanitizeUser(user),
    })
  }
)

/**
 * POST /api/auth/login
 *
 * Validates credentials, issues a new JWT cookie, and returns the sanitized
 * user profile.
 */
export const login = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const input = req.body as LoginInput

    const { user, token } = await loginUser(input)

    res.cookie('token', token, cookieOptions)

    sendSuccess(res, 200, 'Logged in successfully.', {
      user: sanitizeUser(user),
    })
  }
)

/**
 * POST /api/auth/logout
 *
 * Blacklists the current JWT (so it cannot be reused even before it expires),
 * clears the cookie, and responds with a success message.
 */
export const logout = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const token = extractTokenFromCookie(req)
    const decoded = verifyToken(token)

    // `exp` is a Unix timestamp in seconds — multiply by 1000 for JavaScript Date
    const expiresAt = new Date((decoded.exp ?? 0) * 1000)

    await logoutUser(token, expiresAt)

    res.clearCookie('token', { path: '/' })

    sendSuccess(res, 200, 'Logged out successfully.')
  }
)

/**
 * GET /api/auth/me
 *
 * Returns the profile of the currently authenticated user.
 * `req.user` is guaranteed to exist here because the `verifyToken` middleware
 * runs before this controller.
 */
export const getMe = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    // Non-null assertion is safe — verifyToken middleware guarantees req.user
    const userId = req.user!.id

    const user = await getCurrentUser(userId)

    sendSuccess(res, 200, 'User profile retrieved.', {
      user: sanitizeUser(user),
    })
  }
)
