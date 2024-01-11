import machineDBRepository from '../../../domain/repositories/machine'

export default function removeMachine(
  id: string,
  machineRepository: ReturnType<typeof machineDBRepository>,
) {
  return machineRepository.deleteMachine(id)
}
