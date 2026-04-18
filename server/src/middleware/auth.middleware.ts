import { Request, Response, NextFunction } from 'express'
import {
  extractTokenFromCookie,
  isTokenBlacklisted,
  verifyToken as verifyJwt,
} from '../services/token.service.js'
import { ApiError } from '../utils/ApiError.js'
import { asyncHandler } from '../utils/asyncHandler.js'

export const verifyToken = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    const token = extractTokenFromCookie(req)

    const blacklisted = await isTokenBlacklisted(token)
    if (blacklisted) {
      throw ApiError.unauthorized(
        'Your session is no longer valid. Please log in again.',
      )
    }

    const decoded = verifyJwt(token)

    req.user = { id: decoded.id, email: decoded.email }

    next()
  },
)
