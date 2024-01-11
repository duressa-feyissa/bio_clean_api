import validateMachine from '../../../application/service/validator/machine'
import CustomError from '../../../config/error'
import machineDBRepository from '../../../domain/repositories/machine'
import Machine, { IMachine } from '../../../domain/entities/machine'

export default function updateMachine(
  id: string,
  machine: IMachine,
  machineRepository: ReturnType<typeof machineDBRepository>,
) {
  const { error } = validateMachine(machine)

  if (error) throw new CustomError(error.details[0].message, 400)

  const machineParam = Machine(machine)

  return machineRepository.updateMachine(id, machineParam)
}
