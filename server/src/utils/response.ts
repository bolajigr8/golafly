/**
 * utils/response.ts
 *
 * Provides standardised helper functions for sending HTTP responses.
 * Centralising response shapes here ensures the API returns a consistent
 * JSON envelope (`success`, `message`, optional `data` / `errors`) regardless
 * of which controller sends the response — making client-side parsing trivial.
 */

import { Response } from 'express'

// ── Types ─────────────────────────────────────────────────────────────────────

/** Shape of a field-level validation error */
export interface FieldError {
  field: string
  message: string
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Sends a successful JSON response.
 *
 * @param res        - The Express `Response` object.
 * @param statusCode - The HTTP status code (e.g., 200, 201).
 * @param message    - A human-readable description of what happened.
 * @param data       - Optional payload to include under the `data` key.
 */
export const sendSuccess = <T>(
  res: Response,
  statusCode: number,
  message: string,
  data?: T
): void => {
  const body: { success: boolean; message: string; data?: T } = {
    success: true,
    message,
  }

  if (data !== undefined) {
    body.data = data
  }

  res.status(statusCode).json(body)
}

/**
 * Sends an error JSON response.
 *
 * @param res        - The Express `Response` object.
 * @param statusCode - The HTTP status code (e.g., 400, 401, 500).
 * @param message    - A user-friendly error description.
 * @param errors     - Optional array of field-level validation errors.
 */
export const sendError = (
  res: Response,
  statusCode: number,
  message: string,
  errors?: FieldError[]
): void => {
  const body: {
    success: boolean
    message: string
    errors?: FieldError[]
  } = {
    success: false,
    message,
  }

  if (errors !== undefined && errors.length > 0) {
    body.errors = errors
  }

  res.status(statusCode).json(body)
}
