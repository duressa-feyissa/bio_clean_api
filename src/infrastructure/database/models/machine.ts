import mongoose, { Schema } from 'mongoose'
import { IMachine } from '../../../domain/entities/machine'
const { String } = mongoose.Schema.Types

const MachineSchema: Schema<IMachine> = new Schema({
  name: {
    type: String,
    trim: true,
    lowercase: true,
  },
  serialNumber: {
    type: String,
    trim: true,
    lowercase: true,
  },
  location: {
    type: String,
    trim: true,
    lowercase: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
})

MachineSchema.index({ name: 1 })

const MachineModel = mongoose.model<IMachine>('Machine', MachineSchema)

export default MachineModel
