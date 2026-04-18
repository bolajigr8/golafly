import mongoose, { Document, Model, Schema } from 'mongoose'
import bcrypt from 'bcryptjs'

const BCRYPT_SALT_ROUNDS = 12

export interface IUser extends Document {
  fullName: string
  email: string
  password: string
  createdAt: Date
  updatedAt: Date
  id: string

  comparePassword(candidatePassword: string): Promise<boolean>
}

interface IUserModel extends Model<IUser> {
  findByEmail(email: string): Promise<IUser | null>
}

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
    timestamps: true,
  },
)

userSchema.pre<IUser>('save', async function () {
  if (!this.isModified('password')) return

  this.password = await bcrypt.hash(this.password, BCRYPT_SALT_ROUNDS)
})

userSchema.methods.comparePassword = async function (
  candidatePassword: string,
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password as string)
}

userSchema.statics.findByEmail = function (
  email: string,
): Promise<IUser | null> {
  return this.findOne({ email: email.toLowerCase().trim() })
}

export const UserModel = mongoose.model<IUser, IUserModel>('User', userSchema)
