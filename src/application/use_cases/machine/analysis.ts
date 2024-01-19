import machineDBRepository from '../../../domain/repositories/machine'

export default function analysis(
  id: string,
  machineRepository: ReturnType<typeof machineDBRepository>,
) {
  return machineRepository.analysis(id)
}
