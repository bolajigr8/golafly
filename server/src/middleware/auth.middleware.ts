/**
 * middleware/auth.middleware.ts
 *
 * Protects routes that require an authenticated user. Extracts the JWT from
 * the `token` httpOnly cookie, confirms the token has not been blacklisted
 * (i.e., the user hasn't logged out), verifies the signature, and attaches
 * the decoded payload to `req.user` for downstream controllers.
 */

import { Request, Response, NextFunction } from 'express'
import {
  extractTokenFromCookie,
  isTokenBlacklisted,
  verifyToken as verifyJwt,
} from '../services/token.service.js'
import { ApiError } from '../utils/ApiError.js'
import { asyncHandler } from '../utils/asyncHandler.js'

/**
 * Express middleware that enforces JWT authentication.
 *
 * Execution order:
 *  1. Extract JWT from `req.cookies.token` — 401 if absent.
 *  2. Check the BlacklistedToken collection — 401 if found (user logged out).
 *  3. Verify JWT signature and expiry — 401 if invalid or expired.
 *  4. Attach `{ id, email }` to `req.user` and call `next()`.
 */
export const verifyToken = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    // Step 1 — extract token from cookie
    const token = extractTokenFromCookie(req)

    // Step 2 — reject if token was previously invalidated on logout
    const blacklisted = await isTokenBlacklisted(token)
    if (blacklisted) {
      throw ApiError.unauthorized('Your session is no longer valid. Please log in again.')
    }

    // Step 3 — verify signature and expiry
    const decoded = verifyJwt(token)

    // Step 4 — attach user identity to the request for downstream use
    req.user = { id: decoded.id, email: decoded.email }

    next()
  }
)
