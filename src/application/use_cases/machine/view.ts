import machineDBRepository from '../../../domain/repositories/machine'

export default function viewsMachine(
  id: string,
  serialNumbers: string[],
  machineRepository: ReturnType<typeof machineDBRepository>,
) {
  return machineRepository.viewsMachine(id, serialNumbers)
}
