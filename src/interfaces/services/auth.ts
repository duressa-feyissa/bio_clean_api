import bcrypt from 'bcryptjs'
import { sign as signBase, verify as verifyBase } from 'jsonwebtoken'
import env from '../../config/env'
import { IUser } from '../../domain/entities/user'

export type IAuthService = () => {
  encryptPassword: (password: string) => string
  compare: (password: string, hashedPassword: string) => boolean
  verify: (token: string) => Object
  generateToken: (payload: IUser) => string
}

export default function authService() {
  const encryptPassword = (password: string) => {
    const salt = bcrypt.genSaltSync(10)
    return bcrypt.hashSync(password, salt)
  }

  const compare = (password: string, hashedPassword: string) =>
    bcrypt.compareSync(password, hashedPassword)

  const verify = function verify(token: string) {
    return verifyBase(token, env.JWT) as Object
  }

  const generateToken = function sign(payload: IUser) {

    return signBase(payload, env.JWT, { expiresIn: '1y' })
  }

  return {
    encryptPassword,
    compare,
    verify,
    generateToken,
  }
}
