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

export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  handler: jsonHandler,
})

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  handler: jsonHandler,
})

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  handler: jsonHandler,
})

export const strictAuthLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  handler: jsonHandler,
})
