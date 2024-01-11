import { NextFunction, Response } from 'express'
import { IAuthServiceInterface } from '../../application/service/auth'
import login from '../../application/use_cases/auth/user'
import { IUserRepository } from '../../domain/repositories/user'
import { IUserRepositoryImpl } from '../../infrastructure/repositories/user'
import { IAuthService } from '../services/auth'

export default function AuthController(
  userRepository: IUserRepository,
  userDbRepositoryImpl: IUserRepositoryImpl,
  authService: IAuthService,
  authServiceInterface: IAuthServiceInterface,
) {
  const dbRepository = userRepository(userDbRepositoryImpl())
  const auth = authServiceInterface(authService())

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const loginUser = (req: any, res: Response, next: NextFunction) => {
    const { phone, password } = req.body
    login({ phone, password }, dbRepository, auth)
      .then((token: string) => res.json({ token }))
      .catch((error: any) => next(error))
  }

  return {
    loginUser,
  }
}
