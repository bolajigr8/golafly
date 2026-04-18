import jwt, { JwtPayload } from 'jsonwebtoken'
import { Request } from 'express'
import { env } from '../config/env.js'
import { BlacklistedTokenModel } from '../models/BlacklistedToken.js'
import { ApiError } from '../utils/ApiError.js'

export interface TokenPayload {
  id: string
  email: string
}

export interface VerifiedToken extends JwtPayload {
  id: string
  email: string
}

export const signToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as
      | `${number}${'s' | 'm' | 'h' | 'd' | 'w' | 'y'}`
      | number,
  })
}

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

export const blacklistToken = async (
  token: string,
  expiresAt: Date,
): Promise<void> => {
  await BlacklistedTokenModel.create({ token, expires: expiresAt })
}

export const isTokenBlacklisted = async (token: string): Promise<boolean> => {
  const found = await BlacklistedTokenModel.findOne({ token })
  return found !== null
}

export const extractTokenFromCookie = (req: Request): string => {
  const token: string | undefined = req.cookies?.token as string | undefined

  if (!token) {
    throw ApiError.unauthorized('No authentication token found. Please log in.')
  }

  return token
}
