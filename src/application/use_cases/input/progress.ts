import CustomError from '../../../config/error'
import InputRepository from '../../../domain/repositories/input'

export default function progressInput(
    serialNumber: string,
  water: number,
  biogas: number,
  inputRepository: ReturnType<typeof InputRepository>,
) {
  if (water < 0) throw new CustomError('Water cannot be negative', 400)
  if (water > 1) throw new CustomError('Water cannot be greater than 1', 400)
  if (biogas < 0) throw new CustomError('Biogas cannot be negative', 400)
  if (biogas > 1) throw new CustomError('Biogas cannot be greater than 1', 400)

  return inputRepository.updateProduction(serialNumber,  water, biogas)
}
