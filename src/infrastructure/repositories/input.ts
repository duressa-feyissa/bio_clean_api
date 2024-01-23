import axios from 'axios'
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
  updateProduction: (
    serialNumber: string,
    water: number,
    biogas: number,
  ) => Promise<IInput>
}

export default function inputRepositoryMongoDB() {
  const findById = async (id: string): Promise<IInput> => {
    if (!Types.ObjectId.isValid(id)) {
      return Promise.reject(
        new CustomError(`${id} is not a valid input id`, 400),
      )
    }

    const result = await axios.get(
      'https://api.thingspeak.com/channels/2410169/feeds.json?api_key=ALMYO1V08HKUUWVM&results=1',
    )
    const data = result.data.feeds[0]
    const water = data.field2
    const biogas = data.field1

    const input = await InputModel.findById(id)
      .then((input: any) => {
        if (!input) {
          return Promise.reject(
            new CustomError(`Input with id ${id} not found`, 404),
          )
        }

        return input
      })
      .catch((error: any) => {
        return Promise.reject(error)
      })

    input.waterProduction = Math.max(water, input.waterProduction || 0)
    input.bioGasProduction = Math.max(biogas, input.bioGasProduction || 0)
    input.currentBioGasProduction = biogas
    input.currentWaterProduction = water
    input.updatedAt = new Date()

    return input.save()
  }

  const deleteInput = async (id: string): Promise<IInput> => {
    if (!Types.ObjectId.isValid(id)) {
      return Promise.reject(
        new CustomError(`${id} is not a valid input id`, 400),
      )
    }

    const deleteInput = await InputModel.findByIdAndDelete(id).then(
      (input: any) => {
        if (!input) {
          return Promise.reject(
            new CustomError(`Input with id ${id} not found`, 404),
          )
        }

        return input
      },
    )

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

    const existInput = await InputModel.findById(id).then((input: any) => {
      if (!input) {
        return Promise.reject(
          new CustomError(`Input with id ${id} not found`, 404),
        )
      }

      return input
    })

    if (!existInput) {
      return Promise.reject(
        new CustomError(`Input with id ${id} not found`, 404),
      )
    }

    existInput.type = input.getType()
    existInput.water = input.getWater()
    existInput.methanol = input.getMethanol()
    existInput.waste = input.getWaste()
    existInput.updatedAt = new Date()

    return await existInput.save()
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
      machineId: machine,
      createdAt: new Date(),
    })

    return newInput
  }

  const viewsInput = async (id: string): Promise<IInput[]> => {
    if (!Types.ObjectId.isValid(id)) {
      return Promise.reject(
        new CustomError(`${id} is not a valid machine id`, 400),
      )
    }

    const inputs = await InputModel.find({ machineId: id })
      .sort({
        updatedAt: -1,
      })
      .then((inputs: any) => {
        if (!inputs) {
          return Promise.reject(
            new CustomError(`Input with id ${id} not found`, 404),
          )
        }

        return inputs
      })
      .catch((error: any) => {
        return Promise.reject(error)
      })

    return inputs
  }

  const updateProduction = async (
    serialNumber: string,
    water: number,
    biogas: number,
  ): Promise<IInput> => {
    const machine = await MachineModel.findOne({ serialNumber })

    if (!machine) {
      return Promise.reject(
        new CustomError(
          `Machine with serialNumber ${serialNumber} not found`,
          404,
        ),
      )
    }

    const existingMachine = await MachineModel.findOne({
      serialNumber,
    })
      .then((machine: any) => {
        if (!machine) {
          return Promise.reject(
            new CustomError(
              `Machine with serialNumber ${serialNumber} not found`,
              404,
            ),
          )
        }
        return machine
      })
      .catch((error: any) => {
        return Promise.reject(error)
      })

    if (!existingMachine) {
      return Promise.reject(
        new CustomError(
          `Machine with serialNumber ${serialNumber} not found`,
          404,
        ),
      )
    }

    const machineId = existingMachine._id

    const machineInput = await InputModel.findOne({
      machineId,
    }).sort({ updatedAt: -1 })

    if (!machineInput) {
      return Promise.reject(
        new CustomError(`Input with machineId ${machineId} not found`, 404),
      )
    }

    const updatedMachineInput = await InputModel.findByIdAndUpdate(
      machineInput._id,
      {
        type: machineInput.type,
        waste: machineInput.waste,
        water: machineInput.water,
        methanol: machineInput.methanol,
        createdAt: machineInput.createdAt,
        waterProduction: Math.max(water, machineInput.waterProduction || 0),
        bioGasProduction: Math.max(biogas, machineInput.bioGasProduction || 0),
        currentBioGasProduction: biogas,
        currentWaterProduction: water,
        updatedAt: new Date(),
      },
      {
        new: true,
      },
    ).then((input: any) => {
      if (!input) {
        return Promise.reject(
          new CustomError(`Input with id ${machineInput._id} not found`, 404),
        )
      }

      return input
    })

    return updatedMachineInput
  }

  return {
    findById,
    deleteInput,
    updateInput,
    createInput,
    viewsInput,
    updateProduction,
  }
}
