import InputRepository from '../../../domain/repositories/input'

export default function findById(
  id: string,
  inputRepository: ReturnType<typeof InputRepository>,
) {
  return inputRepository.findById(id)
}
