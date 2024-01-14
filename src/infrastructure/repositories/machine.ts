import { Types } from 'mongoose'
import CustomError from '../../config/error'
import Machine, { IMachine } from '../../domain/entities/machine'
import MachineModel from '../database/models/machine'
import UserModel from '../database/models/user'

export type IMachineRepositoryImpl = () => {
  findById: (id: string) => Promise<IMachine>
  deleteMachine: (id: string) => Promise<IMachine>
  updateMachine: (
    id: string,
    machine: ReturnType<typeof Machine>,
  ) => Promise<IMachine>
  createMachine: (
    userId: string,
    machine: ReturnType<typeof Machine>,
  ) => Promise<IMachine>
  viewsMachine: (id: string) => Promise<IMachine[]>
}

export default function machineRepositoryMongoDB() {
  const viewsMachine = async (id: string): Promise<IMachine[]> => {
    if (!Types.ObjectId.isValid(id)) {
      return Promise.reject(
        new CustomError(`${id} is not a valid machine id`, 400),
      )
    }

    return await UserModel.aggregate([
      { $match: { _id: new Types.ObjectId(id) } },
      {
        $lookup: {
          from: 'machines',
          localField: 'machines',
          foreignField: '_id',
          as: 'machines',
        },
      },
      { $unwind: '$machines' },
      {
        $project: {
          _id: 1,
          name: '$machines.name',
          serialNumber: '$machines.serialNumber',
          location: '$machines.location',
          createdAt: '$machines.createdAt',
        },
      },
    ])
  }

  const findById = (id: string): Promise<IMachine> => {
    if (!Types.ObjectId.isValid(id)) {
      return Promise.reject(
        new CustomError(`${id} is not a valid machine id`, 400),
      )
    }

    return MachineModel.findById(id)
      .select('-inputs')
      .then((machine: any) => {
        if (!machine) {
          return Promise.reject(
            new CustomError(`Machine with id ${id} not found`, 404),
          )
        }
        return machine as IMachine
      })
  }

  const deleteMachine = async (id: string): Promise<IMachine> => {
    if (!Types.ObjectId.isValid(id)) {
      return Promise.reject(
        new CustomError(`${id} is not a valid machine id`, 400),
      )
    }

    const machine = MachineModel.findByIdAndDelete(id).then((machine: any) => {
      if (!machine) {
        return Promise.reject(
          new CustomError(`Machine with id ${id} not found`, 404),
        )
      }
      return machine as IMachine
    })

    await UserModel.updateOne(
      { machines: new Types.ObjectId(id) },
      { $pull: { machines: new Types.ObjectId(id) } },
    ).then((user: any) => {
      if (!user) {
        return Promise.reject(
          new CustomError(`User with machine id ${id} not found`, 404),
        )
      }
      return user
    })

    return machine
  }
  const createMachine = async (
    userId: string,
    machine: ReturnType<typeof Machine>,
  ): Promise<IMachine> => {
    if (machine.getSerialNumber()) {
      const existingMachine = await MachineModel.findOne({
        serialNumber: machine.getSerialNumber(),
      })
      if (existingMachine) {
        return Promise.reject(
          new CustomError(
            `Machine with serialNumber ${machine.getSerialNumber()} already exists`,
            409,
          ),
        )
      }
    }

    const newMachine = await MachineModel.create({
      name: machine.getName(),
      serialNumber: machine.getSerialNumber(),
      location: machine.getLocation(),
      createdAt: machine.getCreatedAt(),
    }).then((machine: IMachine) => machine)

    await UserModel.aggregate([
      { $match: { _id: new Types.ObjectId(userId) } },
      {
        $set: {
          machines: {
            $concatArrays: ['$machines', [newMachine._id]],
          },
        },
      },
      {
        $merge: {
          into: 'users',
          whenMatched: 'merge',
          whenNotMatched: 'insert',
        },
      },
    ])

    return newMachine
  }

  const updateMachine = async (
    id: string,
    machine: ReturnType<typeof Machine>,
  ): Promise<IMachine> => {
    if (!Types.ObjectId.isValid(id)) {
      return Promise.reject(
        new CustomError(`${id} is not a valid machine id`, 400),
      )
    }

    return MachineModel.findByIdAndUpdate(
      id,
      {
        name: machine.getName(),
        serialNumber: machine.getSerialNumber(),
        location: machine.getLocation(),
        updatedAt: machine.getUpdatedAt(),
      },
      { new: true },
    )
      .select('-inputs')
      .then((updatedMachine: IMachine | null) => {
        if (updatedMachine) {
          return updatedMachine
        } else {
          throw new CustomError(`No machine found with id ${id}`, 404)
        }
      })
  }

  return {
    findById,
    deleteMachine,
    createMachine,
    updateMachine,
    viewsMachine,
  }
}
