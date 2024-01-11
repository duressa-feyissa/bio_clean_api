import machineDBRepository from '../../../domain/repositories/machine'

export default function viewsMachine(
  id: string,
  machineRepository: ReturnType<typeof machineDBRepository>,
) {
  return machineRepository.viewsMachine(id)
}
