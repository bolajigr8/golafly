/**
 * services/auth.service.ts
 *
 * Contains all business logic for authentication: registering new users,
 * validating credentials at login, blacklisting tokens on logout, and
 * fetching the currently authenticated user's profile.
 *
 * Controllers remain thin by delegating every meaningful operation here.
 * This layer has no knowledge of HTTP — it works purely with domain types.
 */

import { UserModel, IUser } from '../models/User.js'
import { blacklistToken } from './token.service.js'
import { signToken } from './token.service.js'
import { ApiError } from '../utils/ApiError.js'
import { RegisterInput, LoginInput } from '../schemas/auth.schema.js'

// ── Functions ─────────────────────────────────────────────────────────────────

/**
 * Registers a new user.
 * Throws a 409 Conflict error if the email is already in use.
 * Password hashing is handled automatically by the User model's pre-save hook.
 *
 * @param input - Validated registration data (fullName, email, password).
 * @returns The newly created Mongoose `IUser` document.
 */
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

/**
 * Validates login credentials and returns the user document with a signed JWT.
 * Uses intentionally vague error messages where appropriate to prevent
 * user-enumeration attacks (e.g., we reveal "user not found" only because it
 * mirrors common UX patterns — adjust to a generic message if security posture
 * demands it in the future).
 *
 * @param input - Validated login data (email, password).
 * @returns An object containing the authenticated `IUser` and a signed token.
 */
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

/**
 * Invalidates a JWT by adding it to the blacklist collection.
 * The TTL index on the BlacklistedToken model ensures the record is
 * automatically removed once the token's own expiry date is reached.
 *
 * @param token     - The raw JWT string to invalidate.
 * @param tokenExpiry - The token's `exp` claim as a `Date` object.
 */
export const logoutUser = async (
  token: string,
  tokenExpiry: Date,
): Promise<void> => {
  await blacklistToken(token, tokenExpiry)
}

/**
 * Fetches the full profile of the currently authenticated user.
 * Throws a 404 error if the user no longer exists in the database
 * (e.g., account was deleted after the token was issued).
 *
 * @param userId - The Mongoose `_id` string from the verified JWT payload.
 * @returns The matching `IUser` document.
 */
export const getCurrentUser = async (userId: string): Promise<IUser> => {
  const user = await UserModel.findById(userId)

  if (!user) {
    throw ApiError.notFound('User not found.')
  }

  return user
}
