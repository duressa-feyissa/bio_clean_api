import Machine, { IMachine } from '../../domain/entities/machine'
import machineRepositoryMongoDB from '../../infrastructure/repositories/machine'

export type IMachineRepository = (
  repository: ReturnType<typeof machineRepositoryMongoDB>,
) => {
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
  viewsMachine: (id: string, serialNumbers: string[])  => Promise<IMachine[]>
}

export default function machineDBRepository(
  repository: ReturnType<typeof machineRepositoryMongoDB>,
) {
  const findById = (id: string) => repository.findById(id)

  const deleteMachine = (id: string) => repository.deleteMachine(id)

  const createMachine = (userId: string, machine: ReturnType<typeof Machine>) =>
    repository.createMachine(userId, machine)
  const viewsMachine = (id: string, serialNumbers: string[]) => repository.viewsMachine(id, serialNumbers)
  const updateMachine = (id: string, machine: ReturnType<typeof Machine>) =>
    repository.updateMachine(id, machine)

  return {
    findById,
    deleteMachine,
    updateMachine,
    createMachine,
    viewsMachine,
  }
}
