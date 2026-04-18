/**
 * server.ts
 *
 * Application entry point. Responsible for three things only:
 *   1. Connecting to MongoDB (fails fast if unavailable — see config/database.ts)
 *   2. Starting the HTTP server on the configured port
 *   3. Handling graceful shutdown on SIGTERM (Render stop) and SIGINT (Ctrl+C)
 *
 * All Express configuration lives in app.ts — this file stays intentionally
 * minimal so the startup sequence is easy to read and reason about.
 */

import http from 'http'
import { createApp } from './app.js'
import { connectDB, disconnectDB } from './config/database.js'
import { env } from './config/env.js'

/** Maximum milliseconds to wait for in-flight requests during shutdown */
const SHUTDOWN_TIMEOUT_MS = 10_000

/**
 * Starts the server:
 *  1. Connects to MongoDB with retry logic
 *  2. Creates the Express app
 *  3. Binds the HTTP server to the configured port
 *  4. Registers SIGTERM / SIGINT handlers for graceful shutdown
 */
const startServer = async (): Promise<void> => {
  // Step 1 — database must be ready before we accept any traffic
  await connectDB()

  // Step 2 — create the fully configured Express application
  const app = createApp()

  // Step 3 — create the HTTP server and start listening
  const server = http.createServer(app)

  server.listen(env.PORT, () => {
    console.log(`\n🚀  Golafly API is running`)
    console.log(`   Port        : ${env.PORT}`)
    console.log(`   Environment : ${env.NODE_ENV}`)
    console.log(`   Health      : http://localhost:${env.PORT}/api/health\n`)
  })

  // ── Step 4 — Graceful shutdown ─────────────────────────────────────────────

  /**
   * Attempts to shut down gracefully:
   *  - Stops accepting new connections
   *  - Waits for in-flight requests to finish
   *  - Closes the MongoDB connection
   *  - Exits with code 0
   *
   * If the process takes longer than SHUTDOWN_TIMEOUT_MS we force-exit with
   * code 1 to avoid hanging indefinitely inside a container orchestrator.
   */
  const shutdown = (signal: string): void => {
    console.log(`\n⚡  ${signal} received — shutting down gracefully…`)

    server.close(async () => {
      console.log('🔒  HTTP server closed. No longer accepting connections.')

      try {
        await disconnectDB()
      } catch (err) {
        console.error('❌  Error while closing MongoDB connection:', err)
      }

      console.log('👋  Shutdown complete. Goodbye.\n')
      process.exit(0)
    })

    // Force-exit safety net
    setTimeout(() => {
      console.error(
        `❌  Graceful shutdown exceeded ${SHUTDOWN_TIMEOUT_MS}ms — forcing exit.`
      )
      process.exit(1)
    }, SHUTDOWN_TIMEOUT_MS).unref() // `.unref()` so this timer doesn't delay normal exits
  }

  process.on('SIGTERM', () => shutdown('SIGTERM'))
  process.on('SIGINT', () => shutdown('SIGINT'))
}

// Kick everything off — crash loudly if startup fails
startServer().catch((err: unknown) => {
  const message = err instanceof Error ? err.message : String(err)
  console.error(`\n❌  Fatal startup error: ${message}\n`)
  process.exit(1)
})
