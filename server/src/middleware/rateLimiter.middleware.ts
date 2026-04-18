import rateLimit from 'express-rate-limit'

const jsonHandler = (
  _req: import('express').Request,
  res: import('express').Response,
) => {
  res.status(429).json({
    success: false,
    message: 'Too many requests. Please try again later.',
    errors: [],
  })
}

/**
 * globalLimiter — applied to every request.
 * 200 requests per 15 minutes per IP.
 */
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  handler: jsonHandler,
})

/**
 * authLimiter — applied to /api/auth/register and /api/auth/login.
 * 5 requests per 15 minutes per IP to slow brute-force attempts.
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  handler: jsonHandler,
})

/**
 * apiLimiter — applied to authenticated data routes.
 * 100 requests per 15 minutes per IP.
 */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  handler: jsonHandler,
})

/**
 * strictAuthLimiter — reserved for sensitive operations such as
 * password reset and email verification.
 * 3 requests per hour per IP.
 */
export const strictAuthLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  handler: jsonHandler,
})
