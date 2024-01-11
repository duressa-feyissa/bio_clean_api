import InputRepository from '../../../domain/repositories/input'

export default function removeInput(
  id: string,
  inputRepository: ReturnType<typeof InputRepository>,
) {
  return inputRepository.deleteInput(id)
}
