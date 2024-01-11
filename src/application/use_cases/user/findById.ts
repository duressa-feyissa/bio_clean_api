import userDbRepository from '../../../domain/repositories/user'

export default function findById(
  id: string,
  userRepository: ReturnType<typeof userDbRepository>,
) {
  return userRepository.findById(id)
}
