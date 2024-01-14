import { Types } from 'mongoose'
import CustomError from '../../config/error'
import Input, { IInput } from '../../domain/entities/input'
import InputModel from '../database/models/input'
import MachineModel from '../database/models/machine'

export type IInputRepositoryImpl = () => {
  findById: (id: string) => Promise<IInput>
  deleteInput: (id: string) => Promise<IInput>
  updateInput: (id: string, input: ReturnType<typeof Input>) => Promise<IInput>
  createInput: (
    machineId: string,
    input: ReturnType<typeof Input>,
  ) => Promise<IInput>
  viewsInput: (id: string) => Promise<IInput[]>
}

export default function inputRepositoryMongoDB() {
  const findById = (id: string): Promise<IInput> => {
    if (!Types.ObjectId.isValid(id)) {
      return Promise.reject(
        new CustomError(`${id} is not a valid input id`, 400),
      )
    }

    return InputModel.findById(id).then((input: any) => {
      if (!input) {
        return Promise.reject(
          new CustomError(`Input with id ${id} not found`, 404),
        )
      }

      return input
    })
  }

  const deleteInput = async (id: string): Promise<IInput> => {
    if (!Types.ObjectId.isValid(id)) {
      return Promise.reject(
        new CustomError(`${id} is not a valid input id`, 400),
      )
    }

    const deleteInput = InputModel.findByIdAndDelete(id).then((input: any) => {
      if (!input) {
        return Promise.reject(
          new CustomError(`Input with id ${id} not found`, 404),
        )
      }

      return input
    })

    await MachineModel.aggregate([
      { $match: { inputs: new Types.ObjectId(id) } },
      {
        $project: {
          inputs: {
            $filter: {
              input: '$inputs',
              as: 'input',
              cond: { $ne: ['$$input', new Types.ObjectId(id)] },
            },
          },
        },
      },
      { $out: 'machines' },
    ])

    return deleteInput
  }

  const updateInput = async (
    id: string,
    input: ReturnType<typeof Input>,
  ): Promise<IInput> => {
    if (!Types.ObjectId.isValid(id)) {
      return Promise.reject(
        new CustomError(`${id} is not a valid input id`, 400),
      )
    }

    const updatedInput = await InputModel.findByIdAndUpdate(
      id,
      {
        type: input.getType(),
        water: input.getWater(),
        methanol: input.getMethanol(),
        waste: input.getWaste(),
        updatedAt: new Date(),
      },
      {
        new: true,
      },
    ).then((input: any) => {
      if (!input) {
        return Promise.reject(
          new CustomError(`Input with id ${id} not found`, 404),
        )
      }

      return input
    })

    return updatedInput
  }

  const createInput = async (
    machine: string,
    input: ReturnType<typeof Input>,
  ): Promise<IInput> => {
    const existMachine = await MachineModel.findById(machine).then(
      (machine: any) => {
        if (!machine) {
          return Promise.reject(
            new CustomError(`Machine with id ${machine} not found`, 404),
          )
        }

        return machine
      },
    )

    if (!existMachine) {
      return Promise.reject(
        new CustomError(`Machine with id ${machine} not found`, 404),
      )
    }

    const newInput = await InputModel.create({
      type: input.getType(),
      water: input.getWater(),
      methanol: input.getMethanol(),
      waste: input.getWaste(),
      createdAt: new Date(),
    })

    await MachineModel.aggregate([
      { $match: { _id: new Types.ObjectId(machine) } },
      {
        $set: {
          inputs: {
            $concatArrays: ['$inputs', [newInput._id]],
          },
        },
      },
      {
        $merge: {
          into: 'machines',
          whenMatched: 'merge',
          whenNotMatched: 'insert',
        },
      },
    ])

    return newInput
  }

  const viewsInput = async (id: string): Promise<IInput[]> => {
    if (!Types.ObjectId.isValid(id)) {
      return Promise.reject(
        new CustomError(`${id} is not a valid machine id`, 400),
      )
    }

    const existMachine = await MachineModel.findById(id).then(
      (machine: any) => {
        if (!machine) {
          return Promise.reject(
            new CustomError(`Machine with id ${id} not found`, 404),
          )
        }

        return machine
      },
    )

    if (!existMachine) {
      return Promise.reject(
        new CustomError(`Machine with id ${id} not found`, 404),
      )
    }

    const inputs = await InputModel.find({
      _id: { $in: existMachine.inputs },
    }).sort({ updatedAt: -1 })

    return inputs
  }

  return {
    findById,
    deleteInput,
    updateInput,
    createInput,
    viewsInput,
  }
}
