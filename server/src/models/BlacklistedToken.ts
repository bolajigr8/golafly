import mongoose, { Document, Schema } from 'mongoose'

export interface IBlacklistedToken extends Document {
  token: string
  expires: Date
}

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

blacklistedTokenSchema.index({ expires: 1 }, { expireAfterSeconds: 0 })

export const BlacklistedTokenModel = mongoose.model<IBlacklistedToken>(
  'BlacklistedToken',
  blacklistedTokenSchema,
)
