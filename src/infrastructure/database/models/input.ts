import mongoose, { Schema } from 'mongoose'
import { IInput } from '../../../domain/entities/input'

const InputSchema: Schema<IInput> = new Schema({
  type: {
    type: String,
    trim: true,
    lowercase: true,
  },
  water: {
    type: Number,
    trim: true,
    lowercase: true,
  },

  methanol: {
    type: Number,
    trim: true,
    lowercase: true,
  },

  waste: {
    type: Number,
    trim: true,
    lowercase: true,
  },
  waterProduction: {
    type: Number,
    trim: true,
    default: 0,
  },
  bioGasProduction: {
    type: Number,
    trim: true,
    default: 0,
  },
  currentBioGasProduction: {
    type: Number,
    trim: true,
    default: 0,
  },
  currentWaterProduction: {
    type: Number,
    trim: true,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

InputSchema.index({ name: 1 })

const InputModel = mongoose.model<IInput>('Input', InputSchema)

export default InputModel
