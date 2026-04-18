import { Request, Response, NextFunction, RequestHandler } from 'express'
import { z, ZodTypeAny } from 'zod'

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

    req.body = result.data as unknown
    next()
  }
}
