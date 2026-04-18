import express, {
  type NextFunction,
  type Request,
  type Response,
} from 'express'
import helmet from 'helmet'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import mongoose from 'mongoose'
import { v4 as uuidv4 } from 'uuid'

import { env } from './config/env.js'
import { globalLimiter } from './middleware/rateLimiter.middleware.js'
import { errorHandler } from './middleware/error.middleware.js'
import authRoutes from './routes/auth.routes.js'
import dataRoutes from './routes/data.routes.js'

export function createApp(): express.Application {
  const app = express()

  app.set('trust proxy', 1)
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", 'data:', 'https:'],
          connectSrc: ["'self'", env.CLIENT_URL],
        },
      },
      crossOriginEmbedderPolicy: false,
    }),
  )
  app.use(
    cors({
      origin: env.CLIENT_URL,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    }),
  )

  app.use((req: Request, res: Response, next: NextFunction): void => {
    const requestId = uuidv4()
    res.setHeader('X-Request-ID', requestId)
    next()
  })

  app.use(express.json({ limit: '10kb' }))
  app.use(express.urlencoded({ extended: true, limit: '10kb' }))
  app.use(cookieParser())

  app.use(globalLimiter)
  app.get('/api/health', (_req: Request, res: Response): void => {
    const dbState = mongoose.connection.readyState
    const dbStatus = dbState === 1 ? 'connected' : 'disconnected'

    res.status(200).json({
      status: 'ok',
      environment: env.NODE_ENV,
      timestamp: new Date().toISOString(),
      uptime: Math.floor(process.uptime()),
      database: dbStatus,
      version: process.env['npm_package_version'] ?? '1.0.0',
    })
  })

  app.use('/api/auth', authRoutes)
  app.use('/api', dataRoutes)

  app.use((_req: Request, res: Response): void => {
    res.status(404).json({
      success: false,
      message: 'Route not found.',
      errors: [],
    })
  })
  app.use(errorHandler)

  return app
}
