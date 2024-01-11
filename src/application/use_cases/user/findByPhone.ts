import userDbRepository from '../../../domain/repositories/user'

export default function findByPhone(
  phone: string,
  userRepository: ReturnType<typeof userDbRepository>,
) {
  return userRepository.findByPhone(phone)
}
