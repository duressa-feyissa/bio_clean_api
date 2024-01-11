import machineDBRepository from '../../../domain/repositories/machine'

export default function findById(
  id: string,
  machineRepository: ReturnType<typeof machineDBRepository>,
) {
  return machineRepository.findById(id)
}
