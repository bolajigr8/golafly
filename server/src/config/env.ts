import { z } from 'zod'
import dotenv from 'dotenv'

dotenv.config()

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),

  PORT: z.coerce.number().default(5000),

  MONGODB_URI: z.string({
    message: 'MONGODB_URI is required. Add it to your .env file.',
  }),

  JWT_SECRET: z
    .string({
      message: 'JWT_SECRET is required. Add it to your .env file.',
    })
    .min(32, 'JWT_SECRET must be at least 32 characters long for security.'),

  JWT_EXPIRES_IN: z.string().default('7d'),

  CLIENT_URL: z.string().url().default('http://localhost:3000'),
})

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
