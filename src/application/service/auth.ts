import { IUser } from '../../domain/entities/user'
import authService from '../../interfaces/services/auth'

export type IAuthServiceInterface = (
  service: ReturnType<typeof authService>,
) => {
  encryptPassword: (password: string) => string
  compare: (password: string, hashedPassword: string) => boolean
  verify: (token: string) => Object
  generateToken: (payload: IUser) => string
}

export default function authServiceInterface(
  service: ReturnType<typeof authService>,
) {
  const encryptPassword = (password: string) =>
    service.encryptPassword(password)

  const compare = (password: string, hashedPassword: string) =>
    service.compare(password, hashedPassword)

  const verify = (token: string) => service.verify(token)

  const generateToken = (payload: IUser) => service.generateToken(payload)

  return {
    encryptPassword,
    compare,
    verify,
    generateToken,
  }
}
