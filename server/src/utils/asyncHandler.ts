/**
 * utils/asyncHandler.ts
 *
 * A higher-order function that wraps async Express route handlers (controllers)
 * and automatically forwards any rejected promises or thrown errors to Express's
 * `next` function — which then triggers the global error handler middleware.
 *
 * Without this utility every controller would need its own try/catch block,
 * leading to significant boilerplate and the risk of forgetting `next(error)`.
 */

import { Request, Response, NextFunction, RequestHandler } from 'express'

/** The shape of an async Express request handler */
type AsyncRequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>

/**
 * Wraps an async controller function so that any error it throws (or any
 * promise it rejects) is automatically caught and passed to `next(error)`.
 *
 * @param fn - The async controller/middleware function to wrap.
 * @returns A standard Express `RequestHandler` compatible with `app.use` /
 *          `router.get` etc.
 *
 * @example
 * router.get('/me', asyncHandler(async (req, res) => {
 *   const user = await getUser(req.user.id)
 *   res.json(user)
 * }))
 */
export const asyncHandler = (fn: AsyncRequestHandler): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    fn(req, res, next).catch(next)
  }
}
