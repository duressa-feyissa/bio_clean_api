import { Types } from 'mongoose'
import CustomError from '../../config/error'
import Machine, { IMachine } from '../../domain/entities/machine'
import MachineModel from '../database/models/machine'

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

    return MachineModel.find({ userId: id })
      .sort({ createdAt: -1 })
      .then((machines: any) => {
        if (!machines) {
          return Promise.reject(
            new CustomError(`Machine with id ${id} not found`, 404),
          )
        }
        return machines as IMachine[]
      })
      .catch((error: any) => {
        return Promise.reject(error)
      })
  }

  const findById = (id: string): Promise<IMachine> => {
    if (!Types.ObjectId.isValid(id)) {
      return Promise.reject(
        new CustomError(`${id} is not a valid machine id`, 400),
      )
    }

    return MachineModel.findById(id).then((machine: any) => {
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
      return machine
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

    return MachineModel.create({
      name: machine.getName(),
      serialNumber: machine.getSerialNumber(),
      location: machine.getLocation(),
      userId,
    })
      .then((machine: IMachine) => {
        return machine
      })
      .catch((error: any) => {
        return Promise.reject(error)
      })
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

    const existingMachine = await MachineModel.findOne({
      serialNumber: machine.getSerialNumber(),
    })

    if (
      existingMachine == null ||
      (existingMachine && existingMachine._id != id)
    ) {
      return Promise.reject(
        new CustomError(
          `Machine with serialNumber ${machine.getSerialNumber()} already exists`,
          409,
        ),
      )
    }

    existingMachine.name = machine.getName()
    existingMachine.serialNumber = machine.getSerialNumber()
    existingMachine.location = machine.getLocation()
    existingMachine.userId = machine.getUserId()
    existingMachine.updatedAt = new Date()
    await existingMachine.save()
    return existingMachine
  }

  return {
    findById,
    deleteMachine,
    createMachine,
    updateMachine,
    viewsMachine,
  }
}
