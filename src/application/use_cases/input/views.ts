import InputRepository from '../../../domain/repositories/input'

export default function viewInput(
  id: string,
  inputRepository: ReturnType<typeof InputRepository>,
) {
  return inputRepository.viewsInput(id)
}
