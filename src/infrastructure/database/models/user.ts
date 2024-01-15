import mongoose, { Schema } from 'mongoose'
import { IUser } from '../../../domain/entities/user'
const { String } = mongoose.Schema.Types

const userRoles: string[] = ['ADMIN', 'MASTER', 'USER']

const UserSchema: Schema<IUser> = new Schema({
  firstName: {
    type: String,
    trim: true,
    lowercase: true,
  },
  lastName: {
    type: String,
    trim: true,
    lowercase: true,
  },
  phone: {
    type: String,
    trim: true,
    required: [true, 'Email is required'],

    unique: true,
  },

  password: {
    type: String,
    trim: true,
  },
  role: {
    type: String,
    enum: userRoles,
    default: 'USER',
  },

  image: {
    type: String,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
})

UserSchema.index({ role: 1 })

const UserModel = mongoose.model<IUser>('User', UserSchema)

export default UserModel
