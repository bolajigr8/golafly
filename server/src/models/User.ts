/**
 * models/User.ts
 *
 * Defines the Mongoose schema, model, and TypeScript interfaces for the User
 * document. Passwords are automatically hashed via a pre-save hook using bcrypt
 * with a cost factor of 12 — they are never stored in plain text.
 *
 * // TODO: Add emailVerified field when email verification is implemented
 */

import mongoose, { Document, Model, Schema } from 'mongoose'
import bcrypt from 'bcryptjs'

/** Bcrypt cost factor — 12 is a good balance of security and performance */
const BCRYPT_SALT_ROUNDS = 12

// ── TypeScript Interfaces ────────────────────────────────────────────────────

/**
 * Represents a raw User document as stored in MongoDB.
 * Extends Mongoose's Document so it carries all Mongoose methods.
 */
export interface IUser extends Document {
  fullName: string
  email: string
  password: string
  createdAt: Date
  updatedAt: Date
  id: string // Mongoose's default _id field, typed as string for convenience

  /** Compares a plain-text candidate password against the stored hash */
  comparePassword(candidatePassword: string): Promise<boolean>
}

/**
 * Extends the Mongoose Model type so that static methods are typed correctly
 * when calling `UserModel.findByEmail(…)`.
 */
interface IUserModel extends Model<IUser> {
  /** Finds a single user by their email address (case-insensitive via `lowercase: true`) */
  findByEmail(email: string): Promise<IUser | null>
}

// ── Schema ───────────────────────────────────────────────────────────────────

const userSchema = new Schema<IUser, IUserModel>(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required.'],
      trim: true,
      minlength: [2, 'Full name must be at least 2 characters.'],
      maxlength: [100, 'Full name must not exceed 100 characters.'],
    },
    email: {
      type: String,
      required: [true, 'Email address is required.'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required.'],
      minlength: [8, 'Password must be at least 8 characters.'],
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt
  },
)

// ── Pre-save Hook ─────────────────────────────────────────────────────────────

/**
 * Hashes the user's password before saving to the database.
 * Only runs when the password field has been modified, so updates to other
 * fields (e.g., fullName) do not re-hash an already-hashed password.
 */
userSchema.pre<IUser>('save', async function () {
  if (!this.isModified('password')) return

  this.password = await bcrypt.hash(this.password, BCRYPT_SALT_ROUNDS)
})

// ── Instance Methods ──────────────────────────────────────────────────────────

/**
 * Compares a plain-text candidate password against the stored bcrypt hash.
 * @param candidatePassword - The password provided by the user at login.
 * @returns `true` if the passwords match, `false` otherwise.
 */
userSchema.methods.comparePassword = async function (
  candidatePassword: string,
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password as string)
}

// ── Static Methods ─────────────────────────────────────────────────────────────

/**
 * Finds a user by their email address.
 * @param email - The email to search for (lowercased automatically by schema).
 */
userSchema.statics.findByEmail = function (
  email: string,
): Promise<IUser | null> {
  return this.findOne({ email: email.toLowerCase().trim() })
}

// ── Model ─────────────────────────────────────────────────────────────────────

export const UserModel = mongoose.model<IUser, IUserModel>('User', userSchema)
