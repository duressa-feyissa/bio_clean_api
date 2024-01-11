import CustomError from '../../../config/error'
import { IUser } from '../../../domain/entities/user'
import userDbRepository from '../../../domain/repositories/user'
import authService from '../../../interfaces/services/auth'

interface LoginParams {
  phone: string
  password: string
}

export default function login(
  params: LoginParams,
  userRepository: ReturnType<typeof userDbRepository>,
  auth: ReturnType<typeof authService>,
) {
  const { phone, password } = params
  if (!phone || !password) {
    const error = new CustomError(
      'phone and password fields cannot be empty',
      400,
    )
    throw error
  }
  return userRepository.findByPhone(phone).then((user: IUser) => {
    if (!user) {
      const error = new CustomError('Invalid phone or password', 401)
      throw error
    }

    const isMatch = auth.compare(
      password,
      user.password === undefined ? '' : user.password,
    )

    if (!isMatch) {
      const error = new CustomError('Invalid phone or password', 401)

      throw error
    }
    const userIdString = user._id ? user._id.toString() : undefined

    const newUser: IUser = {
      _id: userIdString,
      phone: user.phone,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,

      createdAt: user.createdAt,
    }

    return auth.generateToken(newUser)
  })
}
