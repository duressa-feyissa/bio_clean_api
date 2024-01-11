import userDbRepository from '../../../domain/repositories/user'

export default  function removeUser(
  id: string,
  userRepository: ReturnType<typeof userDbRepository>,
) {
  return userRepository.deleteUser(id)
}
