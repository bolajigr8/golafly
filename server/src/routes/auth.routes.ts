import { Router } from 'express'
import { authLimiter } from '../middleware/rateLimiter.middleware.js'
import { validate } from '../middleware/validate.middleware.js'
import { verifyToken } from '../middleware/auth.middleware.js'
import { registerSchema, loginSchema } from '../schemas/auth.schema.js'
import {
  register,
  login,
  logout,
  getMe,
} from '../controllers/auth.controller.js'

const router = Router()

router.post('/register', authLimiter, validate(registerSchema), register)

router.post('/login', authLimiter, validate(loginSchema), login)

router.post('/logout', verifyToken, logout)

router.get('/me', verifyToken, getMe)

export default router
