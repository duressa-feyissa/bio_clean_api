import Input, { IInput } from '../entities/input'
import inputRepositoryMongoDB from '../../infrastructure/repositories/input'

export type IInputRepository = (
  repository: ReturnType<typeof inputRepositoryMongoDB>,
) => {
  findById: (id: string) => Promise<IInput>
  deleteInput: (id: string) => Promise<IInput>
  updateInput: (id: string, input: ReturnType<typeof Input>) => Promise<IInput>
  createInput: (
    machineId: string,
    input: ReturnType<typeof Input>,
  ) => Promise<IInput>
  viewsInput: (id: string) => Promise<IInput[]>
  updateProduction: (serialNumber:string, water: number, biogas: number) => Promise<IInput>
}

export default function inputRepository(
  repository: ReturnType<typeof inputRepositoryMongoDB>,
) {
  const findById = (id: string) => repository.findById(id)

  const deleteInput = (id: string) => repository.deleteInput(id)

  const createInput = (machineId: string, input: ReturnType<typeof Input>) =>
    repository.createInput(machineId, input)
  const viewsInput = (machineId: string) => repository.viewsInput(machineId)
  const updateInput = (id: string, input: ReturnType<typeof Input>) =>
    repository.updateInput(id, input)

  const updateProduction = (serialNumber:string, water: number, biogas: number) => {
    return repository.updateProduction(serialNumber,  water, biogas)
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
