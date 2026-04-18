/**
 * schemas/auth.schema.ts
 *
 * Zod schemas that describe and validate the request bodies for all
 * authentication routes. Inferred TypeScript types are exported alongside
 * each schema so they can be used throughout the service and controller layers
 * without duplicating type definitions.
 */

import { z } from 'zod'

// ── Register Schema ───────────────────────────────────────────────────────────

/**
 * Validates the request body for POST /api/auth/register.
 *
 * Password rules:
 *   • Minimum 8 characters
 *   • At least one uppercase letter (A-Z)
 *   • At least one digit (0-9)
 *   • At least one special character
 */
export const registerSchema = z.object({
  fullName: z
    .string()
    .trim()
    .nonempty('Full name is required.')
    .min(2, 'Full name must be at least 2 characters.')
    .max(100, 'Full name must not exceed 100 characters.'),

  email: z
    .string()
    .trim()
    .nonempty('Email is required.')
    .email('Please provide a valid email address.'),

  password: z
    .string()
    .nonempty('Password is required.')
    .min(8, 'Password must be at least 8 characters.')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter.')
    .regex(/[0-9]/, 'Password must contain at least one number.')
    .regex(
      /[^A-Za-z0-9]/,
      'Password must contain at least one special character.',
    ),
})

/** TypeScript type inferred from registerSchema */
export type RegisterInput = z.infer<typeof registerSchema>

// ── Login Schema ──────────────────────────────────────────────────────────────

/**
 * Validates the request body for POST /api/auth/login.
 * Password is intentionally kept as a non-empty string with no complexity
 * rules — the complexity was enforced on registration.
 */
export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .nonempty('Email is required.')
    .email('Please provide a valid email address.'),

  password: z
    .string()
    .nonempty('Password is required.')
    .min(1, 'Password must not be empty.'),
})

/** TypeScript type inferred from loginSchema */
export type LoginInput = z.infer<typeof loginSchema>
