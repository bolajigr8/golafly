/**
 * config/env.ts
 *
 * Validates and exports all environment variables at application startup.
 * Uses Zod to enforce types and provide clear error messages if anything is missing.
 * Import `env` from this module instead of accessing `process.env` directly anywhere
 * in the codebase — this ensures type-safety and a single source of truth.
 */

import { z } from 'zod'
import dotenv from 'dotenv'

dotenv.config()

const envSchema = z.object({
  /** Application environment */
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),

  /** HTTP server port (coerced from string to number) */
  PORT: z.coerce.number().default(5000),

  /** MongoDB Atlas connection string */
  MONGODB_URI: z.string({
    message: 'MONGODB_URI is required. Add it to your .env file.',
  }),

  /** Secret used to sign JWTs — must be at least 32 characters */
  JWT_SECRET: z
    .string({
      message: 'JWT_SECRET is required. Add it to your .env file.',
    })
    .min(32, 'JWT_SECRET must be at least 32 characters long for security.'),

  /** Duration string passed directly to jsonwebtoken (e.g. "7d", "1h") */
  JWT_EXPIRES_IN: z.string().default('7d'),

  /** Allowed CORS origin — the frontend URL */
  CLIENT_URL: z.string().url().default('http://localhost:3000'),
})

/**
 * Parses and validates all environment variables.
 * Crashes the process with a human-readable error if validation fails.
 */
const parseEnv = (): z.infer<typeof envSchema> => {
  const result = envSchema.safeParse(process.env)

  if (!result.success) {
    console.error('\n  Invalid environment variables:\n')
    result.error.issues.forEach((issue) => {
      console.error(`   • ${issue.path.join('.')}: ${issue.message}`)
    })
    console.error('\nPlease fix the above variables in your .env file.\n')
    process.exit(1)
  }

  return result.data
}

export const env = parseEnv()
