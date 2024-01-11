import CustomError from '../../../config/error'
import userDbRepository from '../../../domain/repositories/user'
import User, { IUser } from '../../../domain/entities/user'
import authService from '../../../interfaces/services/auth'
import validateUser from '../../service/validator/user'

export default function createUser(
  user: IUser,
  userRepository: ReturnType<typeof userDbRepository>,
  auth: ReturnType<typeof authService>,
) {
  const { error } = validateUser(user)
  if (error) throw new CustomError(error.details[0].message, 400)
  const { password } = user
  if (password) {
    user.password = auth.encryptPassword(password)
  }

  const userParam = User(user)
  return userRepository.createUser(userParam)
}
