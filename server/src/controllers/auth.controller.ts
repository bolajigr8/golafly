import { Request, Response } from 'express'
import { asyncHandler } from '../utils/asyncHandler.js'
import { sendSuccess } from '../utils/response.js'
import { env } from '../config/env.js'
import {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
} from '../services/auth.service.js'
import {
  signToken,
  extractTokenFromCookie,
  verifyToken,
} from '../services/token.service.js'
import { RegisterInput, LoginInput } from '../schemas/auth.schema.js'
import { IUser } from '../models/User.js'

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000

const cookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  maxAge: SEVEN_DAYS_MS,
  path: '/',
}

const sanitizeUser = (
  user: IUser,
): {
  id: string
  fullName: string
  email: string
  createdAt: Date
  updatedAt: Date
} => ({
  id: user.id as string,
  fullName: user.fullName,
  email: user.email,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
})

export const register = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const input = req.body as RegisterInput

    const user = await registerUser(input)
    const token = signToken({ id: user.id as string, email: user.email })

    res.cookie('token', token, cookieOptions)

    sendSuccess(res, 201, 'Account created successfully.', {
      user: sanitizeUser(user),
    })
  },
)

export const login = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const input = req.body as LoginInput

    const { user, token } = await loginUser(input)

    res.cookie('token', token, cookieOptions)

    sendSuccess(res, 200, 'Logged in successfully.', {
      user: sanitizeUser(user),
    })
  },
)

export const logout = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const token = extractTokenFromCookie(req)
    const decoded = verifyToken(token)

    const expiresAt = new Date((decoded.exp ?? 0) * 1000)

    await logoutUser(token, expiresAt)

    res.clearCookie('token', { path: '/' })

    sendSuccess(res, 200, 'Logged out successfully.')
  },
)

export const getMe = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const userId = req.user!.id

    const user = await getCurrentUser(userId)

    sendSuccess(res, 200, 'User profile retrieved.', {
      user: sanitizeUser(user),
    })
  },
)
