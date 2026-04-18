import { z } from 'zod'

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

export type RegisterInput = z.infer<typeof registerSchema>

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

export type LoginInput = z.infer<typeof loginSchema>
