/**
 * services/token.service.ts
 *
 * Encapsulates all JWT-related operations: signing tokens, verifying them,
 * managing the blacklist (for logout invalidation), and extracting tokens
 * from incoming HTTP cookies.
 *
 * // TODO: Implement refresh token rotation when scaling to production
 */

import jwt, { JwtPayload } from 'jsonwebtoken'
import { Request } from 'express'
import { env } from '../config/env.js'
import { BlacklistedTokenModel } from '../models/BlacklistedToken.js'
import { ApiError } from '../utils/ApiError.js'

// ── Types ─────────────────────────────────────────────────────────────────────

/** The data encoded inside a Golafly JWT */
export interface TokenPayload {
  id: string
  email: string
}

/** A verified JWT payload — includes standard claims like `exp` and `iat` */
export interface VerifiedToken extends JwtPayload {
  id: string
  email: string
}

// ── Functions ─────────────────────────────────────────────────────────────────

/**
 * Signs a new JWT with the application secret and configured expiry.
 *
 * @param payload - The data to encode into the token.
 * @returns A signed JWT string.
 */
export const signToken = (payload: TokenPayload): string => {
  // Cast to the exact string-value type expected by jsonwebtoken.
  // We pass options inline so exactOptionalPropertyTypes doesn't
  // widen expiresIn to `number | StringValue | undefined`.
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as
      | `${number}${'s' | 'm' | 'h' | 'd' | 'w' | 'y'}`
      | number,
  })
}

/**
 * Verifies a JWT string and returns its decoded payload.
 * Throws an `ApiError(401)` if the token is invalid, malformed, or expired.
 *
 * @param token - The raw JWT string to verify.
 * @returns The decoded and verified token payload.
 */
export const verifyToken = (token: string): VerifiedToken => {
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET)

    if (typeof decoded === 'string') {
      throw ApiError.unauthorized('Invalid token payload.')
    }

    return decoded as VerifiedToken
  } catch (error) {
    if (error instanceof ApiError) throw error

    if (error instanceof jwt.TokenExpiredError) {
      throw ApiError.unauthorized(
        'Your session has expired. Please log in again.',
      )
    }

    throw ApiError.unauthorized('Invalid or malformed token.')
  }
}

/**
 * Saves a token to the blacklist collection so it can no longer be used
 * even if it has not yet expired by its `exp` claim.
 * MongoDB's TTL index will automatically delete the document once `expires` is
 * reached, keeping the collection lean.
 *
 * @param token     - The JWT string to blacklist.
 * @param expiresAt - The datetime at which MongoDB should delete this record.
 */
export const blacklistToken = async (
  token: string,
  expiresAt: Date,
): Promise<void> => {
  await BlacklistedTokenModel.create({ token, expires: expiresAt })
}

/**
 * Checks whether a given token is present in the blacklist collection.
 *
 * @param token - The JWT string to look up.
 * @returns `true` if the token is blacklisted, `false` otherwise.
 */
export const isTokenBlacklisted = async (token: string): Promise<boolean> => {
  const found = await BlacklistedTokenModel.findOne({ token })
  return found !== null
}

/**
 * Extracts the JWT from the `token` httpOnly cookie on an incoming request.
 * Throws an `ApiError(401)` if no cookie is present.
 *
 * @param req - The incoming Express request.
 * @returns The raw JWT string from the cookie.
 */
export const extractTokenFromCookie = (req: Request): string => {
  const token: string | undefined = req.cookies?.token as string | undefined

  if (!token) {
    throw ApiError.unauthorized('No authentication token found. Please log in.')
  }

  return token
}
