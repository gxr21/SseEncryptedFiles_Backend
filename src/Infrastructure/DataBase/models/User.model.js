import mongoose from 'mongoose'
const UserSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    name: {
      type: String,
      required: true
    },
    username: {
      type: String,
      required: true,
      unique: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      default: 'user',
      enum: ['user', 'admin']
    },
    verified: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
)

export const User = mongoose.model('User', UserSchema)
