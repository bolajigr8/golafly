import http from 'http'
import { createApp } from './app.js'
import { connectDB, disconnectDB } from './config/database.js'
import { env } from './config/env.js'

const SHUTDOWN_TIMEOUT_MS = 10_000

const startServer = async (): Promise<void> => {
  await connectDB()

  const app = createApp()

  const server = http.createServer(app)

  server.listen(env.PORT, () => {
    console.log(`\n  Golafly API is running`)
    console.log(`   Port        : ${env.PORT}`)
    console.log(`   Environment : ${env.NODE_ENV}`)
    console.log(`   Health      : http://localhost:${env.PORT}/api/health\n`)
  })

  const shutdown = (signal: string): void => {
    console.log(`\n  ${signal} received — shutting down gracefully…`)

    server.close(async () => {
      console.log('  HTTP server closed. No longer accepting connections.')

      try {
        await disconnectDB()
      } catch (err) {
        console.error('  Error while closing MongoDB connection:', err)
      }

      console.log('  Shutdown complete. Goodbye.\n')
      process.exit(0)
    })

    // Force-exit safety net
    setTimeout(() => {
      console.error(
        `  Graceful shutdown exceeded ${SHUTDOWN_TIMEOUT_MS}ms — forcing exit.`,
      )
      process.exit(1)
    }, SHUTDOWN_TIMEOUT_MS).unref() // `.unref()` so this timer doesn't delay normal exits
  }

  process.on('SIGTERM', () => shutdown('SIGTERM'))
  process.on('SIGINT', () => shutdown('SIGINT'))
}

// Kick everything off and crash loudly if startup fails
startServer().catch((err: unknown) => {
  const message = err instanceof Error ? err.message : String(err)
  console.error(`\n  Fatal startup error: ${message}\n`)
  process.exit(1)
})
