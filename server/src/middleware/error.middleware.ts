import type { NextFunction, Request, Response } from 'express'
import { Error as MongooseError } from 'mongoose'
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken'
import { ApiError } from '../utils/ApiError.js'
import { sendError } from '../utils/response.js'
import { env } from '../config/env.js'

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
): void {
  // -------------------------------------------------------------------------
  // Operational errors (ApiError)
  // -------------------------------------------------------------------------
  if (err instanceof ApiError) {
    if (env.NODE_ENV !== 'test') {
      if (err.statusCode >= 500) {
        console.error(
          `[${req.method}] ${req.url} — ${err.statusCode}: ${err.message}`,
        )
      } else {
        console.warn(
          `[${req.method}] ${req.url} — ${err.statusCode}: ${err.message}`,
        )
      }
    }
    sendError(res, err.statusCode, err.message, (err as any).errors)
    return
  }

  // -------------------------------------------------------------------------
  // Malformed JSON body
  // -------------------------------------------------------------------------
  if (
    err instanceof SyntaxError &&
    'status' in err &&
    (err as { status?: number }).status === 400
  ) {
    if (env.NODE_ENV !== 'test') {
      console.warn(`[${req.method}] ${req.url} — 400: Invalid JSON`)
    }
    sendError(res, 400, 'Invalid JSON in request body.')
    return
  }

  // -------------------------------------------------------------------------
  // Mongoose validation error
  // -------------------------------------------------------------------------
  if (err instanceof MongooseError.ValidationError) {
    const errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }))
    if (env.NODE_ENV !== 'test') {
      console.warn(`[${req.method}] ${req.url} — 422: Mongoose validation`)
    }
    sendError(res, 422, 'Validation failed.', errors)
    return
  }

  // -------------------------------------------------------------------------
  // Mongoose duplicate key (unique constraint)
  // -------------------------------------------------------------------------
  if (
    typeof err === 'object' &&
    err !== null &&
    'code' in err &&
    (err as { code?: unknown }).code === 11000
  ) {
    if (env.NODE_ENV !== 'test') {
      console.warn(`[${req.method}] ${req.url} — 409: Duplicate key`)
    }
    sendError(res, 409, 'A record with this value already exists.')
    return
  }

  // -------------------------------------------------------------------------
  // Mongoose cast error (invalid ObjectId)
  // -------------------------------------------------------------------------
  if (err instanceof MongooseError.CastError) {
    if (env.NODE_ENV !== 'test') {
      console.warn(`[${req.method}] ${req.url} — 400: Cast error`)
    }
    sendError(res, 400, `Invalid value for field: ${err.path}`)
    return
  }

  // -------------------------------------------------------------------------
  // JWT errors
  // -------------------------------------------------------------------------
  if (err instanceof TokenExpiredError) {
    if (env.NODE_ENV !== 'test') {
      console.warn(`[${req.method}] ${req.url} — 401: Token expired`)
    }
    sendError(res, 401, 'Token has expired. Please log in again.')
    return
  }

  if (err instanceof JsonWebTokenError) {
    if (env.NODE_ENV !== 'test') {
      console.warn(`[${req.method}] ${req.url} — 401: JWT error`)
    }
    sendError(res, 401, 'Invalid token. Please log in again.')
    return
  }

  // -------------------------------------------------------------------------
  // Unknown / unhandled error
  // -------------------------------------------------------------------------
  const message =
    err instanceof Error ? err.message : 'An unexpected error occurred.'
  const stack =
    err instanceof Error && typeof err.stack === 'string'
      ? err.stack
      : undefined

  if (env.NODE_ENV !== 'test') {
    console.error(
      `[${req.method}] ${req.url} — 500: ${message}`,
      env.NODE_ENV === 'development' ? stack : '',
    )
  }

  sendError(
    res,
    500,
    env.NODE_ENV === 'production' ? 'Internal server error.' : message,
  )
}
