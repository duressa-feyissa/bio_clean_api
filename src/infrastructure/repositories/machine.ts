import { Types } from 'mongoose'
import CustomError from '../../config/error'
import Machine, { IMachine } from '../../domain/entities/machine'
import MachineModel from '../database/models/machine'

import { IInput } from '@/domain/entities/input'
import OpenAI from 'openai'
import env from '../../config/env'
import InputModel from '../database/models/input'

const openai = new OpenAI()

openai.apiKey = env.OPENAI_API_KEY || ''

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
  viewsMachine: (id: string, serialNumbers: string[]) => Promise<IMachine[]>
  analysis: (id: string) => Promise<any>
}

export default function machineRepositoryMongoDB() {
  const viewsMachine = async (
    id: string,
    serialNumbers: string[],
  ): Promise<IMachine[]> => {
    if (!Types.ObjectId.isValid(id)) {
      return Promise.reject(
        new CustomError(`${id} is not a valid machine id`, 400),
      )
    }

    const findByUserId = await MachineModel.find({ userId: id })
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

    const findBySerialNumbers = await MachineModel.find({
      serialNumber: serialNumbers,
    })
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

    return [...findByUserId, ...findBySerialNumbers]
  }

  const findById = async (id: string): Promise<IMachine> => {
    if (!Types.ObjectId.isValid(id)) {
      return Promise.reject(
        new CustomError(`${id} is not a valid machine id`, 400),
      )
    }

    return await MachineModel.findById(id).then((machine: any) => {
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

    const machine = await MachineModel.findByIdAndDelete(id)
      .then((machine: any) => {
        if (!machine) {
          return Promise.reject(
            new CustomError(`Machine with id ${id} not found`, 404),
          )
        }
        return machine
      })
      .catch((error: any) => {
        return Promise.reject(error)
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

    return await MachineModel.create({
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

  const analysis = async (id: string): Promise<any> => {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new CustomError(`${id} is not a valid machine id`, 400)
      }

      const existingMachine = await MachineModel.findById(id)
      const existingInputs = await InputModel.find({ machineId: id })

      if (!existingMachine || !existingInputs.length) {
        throw new CustomError(`Machine with id ${id} not found`, 404)
      }

      let inputsInfo = ''

      existingInputs.forEach((input: IInput) => {
        inputsInfo += `Input with id: ${input._id} for machine: ${input.machineId} added at date: ${input.createdAt} [Water: ${input.water} liters, Waste: ${input.waste} kg of type: ${input.type}, Methanol: ${input.methanol} liters], Outputs: [Water filtered after cleaning: ${input.waterProduction} liters, Biogas produced: ${input.bioGasProduction} from ${input.waste} kg of waste, Methanol produced: ${input.methanol} liters]\n`
      })

      const completion = await openai.chat.completions.create({
    
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          {
            role: 'user',
            content:
              'Write analysis on the performance of this biocleaner machine.',
          },
          {
            role: 'user',
            content: `The machine ${existingMachine.name} is a ${existingMachine.serialNumber} located at ${existingMachine.location} and has ${existingInputs.length} inputs.`,
          },
          {
            role: 'user',
            content: `The inputs are: ${inputsInfo}`,
          },
          {
            role: 'assistant',
            content:
              'Analyse the overall performance of the bio cleaner machine based on the provided inputs. Consider the following details for each input: water amount, waste amount, type of waste, and methanol amount used for fermentation. Provide insights into the produced biogas and filtered water. Ensure that the values for biogas and water are between zero and one, and express them as percentages. Additionally, consider the waste type and its impact on the machine performance. Were there any challenges or notable occurrences during the operation of the machine? Highlight any trends or patterns in the machine performance. If there are any issues, provide recommendations for improvement. Provide a summary of the machine performance and the overall performance of the machine. What inputs were the most effective? What inputs were the least effective? What inputs were the most efficient? What inputs were the least efficient? What inputs were the most cost-effective? What inputs were the least cost-effective? Explain your reasoning. Answer in detail.',
          },
        ],
        model: 'gpt-3.5-turbo',
      })
      return completion.choices[0].message.content
    } catch (error) {
      return Promise.reject(new CustomError('Error with OpenAI', 500))
    }
  }

  return {
    findById,
    deleteMachine,
    createMachine,
    updateMachine,
    viewsMachine,
    analysis,
  }
}
