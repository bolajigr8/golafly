import dns from 'node:dns/promises'
dns.setServers(['1.1.1.1', '1.0.0.1', '8.8.8.8', '8.8.4.4'])

import mongoose from 'mongoose'
import { env } from './env.js'

const MAX_RETRIES = 5

const RETRY_DELAY_MS = 5_000

/**
 * Attempts to connect to MongoDB with retry logic.
 * @param attempt - The current attempt number (1-indexed). Defaults to 1.
 */
export const connectDB = async (attempt = 1): Promise<void> => {
  try {
    console.log(`  Connecting to MongoDB… (attempt ${attempt}/${MAX_RETRIES})`)

    await mongoose.connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5_000,
    })

    console.log('  MongoDB connected successfully.')

    mongoose.connection.on('disconnected', () => {
      console.warn('   MongoDB disconnected. Attempting to reconnect…')
    })

    mongoose.connection.on('reconnected', () => {
      console.log('  MongoDB reconnected.')
    })

    mongoose.connection.on('error', (err: Error) => {
      console.error('  MongoDB runtime error:', err.message)
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error(
      `  MongoDB connection failed (attempt ${attempt}): ${message}`,
    )

    if (attempt >= MAX_RETRIES) {
      console.error(
        `\  Could not connect to MongoDB after ${MAX_RETRIES} attempts. Exiting.\n`,
      )
      process.exit(1)
    }

    console.log(`  Retrying in ${RETRY_DELAY_MS / 1000}s…\n`)
    await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS))
    await connectDB(attempt + 1)
  }
}

/**
 * Gracefully closes the Mongoose connection.
 * Called during SIGTERM / SIGINT shutdown sequences.
 */
export const disconnectDB = async (): Promise<void> => {
  await mongoose.connection.close()
  console.log('  MongoDB connection closed.')
}
