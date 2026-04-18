/**
 * models/BlacklistedToken.ts
 *
 * Stores JWT tokens that have been explicitly invalidated (e.g., on logout).
 *
 * How the TTL mechanism works:
 * ─────────────────────────────────────────────────────────────────────────────
 * MongoDB's TTL (Time-To-Live) index on the `expires` field instructs the
 * MongoDB background process to automatically delete any document whose
 * `expires` value is in the past. The `expireAfterSeconds: 0` setting means
 * "delete the document exactly when `expires` is reached" (no additional delay).
 *
 * When blacklisting a token we set `expires` to the token's own `exp` claim
 * (converted to a Date). This means the blacklist entry is automatically
 * purged at the exact moment the token would have expired anyway — keeping
 * the collection lean with zero manual clean-up required.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import mongoose, { Document, Schema } from 'mongoose'

// ── TypeScript Interface ──────────────────────────────────────────────────────

/** Represents a blacklisted JWT token document in MongoDB */
export interface IBlacklistedToken extends Document {
  /** The raw JWT string */
  token: string
  /** The datetime at which MongoDB will automatically delete this document */
  expires: Date
}

// ── Schema ───────────────────────────────────────────────────────────────────

const blacklistedTokenSchema = new Schema<IBlacklistedToken>({
  token: {
    type: String,
    required: [true, 'Token is required.'],
    unique: true,
    index: true,
  },
  expires: {
    type: Date,
    required: [true, 'Expiry date is required.'],
  },
})

/**
 * TTL index — MongoDB automatically removes documents when `expires` is reached.
 * `expireAfterSeconds: 0` means "delete exactly at the `expires` timestamp".
 */
blacklistedTokenSchema.index({ expires: 1 }, { expireAfterSeconds: 0 })

// ── Model ─────────────────────────────────────────────────────────────────────

export const BlacklistedTokenModel = mongoose.model<IBlacklistedToken>(
  'BlacklistedToken',
  blacklistedTokenSchema
)
