/**
 * middleware/validate.middleware.ts
 *
 * A factory function that generates Express middleware for request body
 * validation using Zod schemas. On failure it returns a structured 400
 * response with a flat array of per-field error objects — making it trivial
 * for frontend clients to map errors back to form fields.
 *
 * On success the raw `req.body` is replaced with the Zod-parsed output,
 * which means downstream handlers receive coerced, trimmed, and type-safe data.
 */

import { Request, Response, NextFunction, RequestHandler } from 'express'
import { z, ZodTypeAny } from 'zod'

/**
 * Creates Express middleware that validates `req.body` against the provided
 * Zod schema.
 *
 * @param schema - The Zod schema to validate against.
 * @returns An Express middleware function.
 *
 * @example
 * router.post('/register', validate(registerSchema), register)
 */
export const validate = <T extends ZodTypeAny>(schema: T): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body)

    if (!result.success) {
      const errors = result.error.issues.map((issue) => ({
        field: issue.path.join('.') || 'body',
        message: issue.message,
      }))

      res.status(400).json({
        success: false,
        message: 'Validation failed. Please check the highlighted fields.',
        errors,
      })

      return
    }

    // Replace raw body with the parsed (coerced + trimmed) output
    req.body = result.data as unknown
    next()
  }
}
