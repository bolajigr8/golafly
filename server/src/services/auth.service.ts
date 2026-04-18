import { UserModel, IUser } from '../models/User.js'
import { blacklistToken } from './token.service.js'
import { signToken } from './token.service.js'
import { ApiError } from '../utils/ApiError.js'
import { RegisterInput, LoginInput } from '../schemas/auth.schema.js'

export const registerUser = async (input: RegisterInput): Promise<IUser> => {
  const existing = await UserModel.findByEmail(input.email)

  if (existing) {
    throw ApiError.conflict(
      'An account with this email address already exists.',
    )
  }

  const user = await UserModel.create({
    fullName: input.fullName,
    email: input.email,
    password: input.password, // hashed by pre-save hook
  })

  return user
}

export const loginUser = async (
  input: LoginInput,
): Promise<{ user: IUser; token: string }> => {
  const user = await UserModel.findByEmail(input.email)

  if (!user) {
    throw ApiError.notFound('No account found with that email address.')
  }

  const isPasswordValid = await user.comparePassword(input.password)

  if (!isPasswordValid) {
    throw ApiError.unauthorized('Incorrect password. Please try again.')
  }

  const token = signToken({ id: user.id as string, email: user.email })

  return { user, token }
}

export const logoutUser = async (
  token: string,
  tokenExpiry: Date,
): Promise<void> => {
  await blacklistToken(token, tokenExpiry)
}

export const getCurrentUser = async (userId: string): Promise<IUser> => {
  const user = await UserModel.findById(userId)

  if (!user) {
    throw ApiError.notFound('User not found.')
  }

  return user
}
