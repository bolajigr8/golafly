/**
 * types/express.d.ts
 *
 * Augments the global Express `Request` interface with a `user` property.
 * This property is attached by the `verifyToken` middleware after a JWT is
 * successfully verified — making it available to any downstream controller
 * without needing to cast or assert types manually.
 *
 * The `export {}` at the bottom is required to turn this file into a module
 * (rather than a script) so that the `declare global` block is treated as an
 * augmentation of the existing Express types rather than a replacement.
 */

declare global {
  namespace Express {
    interface Request {
      user?: {
        /** MongoDB ObjectId string extracted from the verified JWT payload */
        id: string
        /** User's email address extracted from the verified JWT payload */
        email: string
      }
    }
  }
}

export {}
