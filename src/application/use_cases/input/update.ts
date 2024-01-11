import validateInputs from '../../../application/service/validator/inputs'
import CustomError from '../../../config/error'
import InputRepository from '../../../domain/repositories/input'
import Input, { IInput } from '../../../domain/entities/input'

export default function updateInput(
  id: string,
  input: IInput,
  inputRepository: ReturnType<typeof InputRepository>,
) {
  const { error } = validateInputs(input)

  if (error) throw new CustomError(error.details[0].message, 400)

  const inputParam = Input(input)

  return inputRepository.updateInput(id, inputParam)
}
